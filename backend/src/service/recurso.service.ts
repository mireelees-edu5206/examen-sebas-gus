import { AppDataSource } from '../data-source';
import { Recurso } from '../entity/Recurso';
import { Categoria } from '../entity/Categoria';
import { Like, In } from 'typeorm';

const recursoRepository = AppDataSource.getRepository(Recurso);
const categoriaRepository = AppDataSource.getRepository(Categoria);

export class RecursoService {
  
  async findAll(page: number = 1, limit: number = 50): Promise<{ recursos: Recurso[]; total: number; pages: number }> {
    const [recursos, total] = await recursoRepository.findAndCount({
      relations: ['categorias'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' }
    });
    
    return {
      recursos,
      total,
      pages: Math.ceil(total / limit)
    };
  }

  async findById(id: number): Promise<Recurso | null> {
    return await recursoRepository.findOne({
      where: { id },
      relations: ['categorias']
    });
  }

  async create(data: Partial<Recurso> & { categoriaIds?: number[] }): Promise<Recurso> {
    const recurso = recursoRepository.create({
      titulo: data.titulo,
      autor: data.autor
    });

    if (data.categoriaIds && data.categoriaIds.length > 0) {
      const categorias = await categoriaRepository.findBy({
        id: In(data.categoriaIds)
      });
      recurso.categorias = categorias;
    }

    return await recursoRepository.save(recurso);
  }

  async update(id: number, data: Partial<Recurso> & { categoriaIds?: number[] }): Promise<Recurso | null> {
    const recurso = await this.findById(id);
    if (!recurso) return null;

    if (data.titulo) recurso.titulo = data.titulo;
    if (data.autor) recurso.autor = data.autor;

    if (data.categoriaIds !== undefined) {
      if (data.categoriaIds.length > 0) {
        const categorias = await categoriaRepository.findBy({
          id: In(data.categoriaIds)
        });
        recurso.categorias = categorias;
      } else {
        recurso.categorias = [];
      }
    }

    return await recursoRepository.save(recurso);
  }

  async delete(id: number): Promise<boolean> {
    const recurso = await recursoRepository.findOne({
      where: { id },
      relations: ['categorias']
    });
    
    if (!recurso) return false;
    
    recurso.categorias = [];
    await recursoRepository.save(recurso);
    
    const result = await recursoRepository.delete(id);
    return result.affected !== 0;
  }

  async deleteAll(): Promise<{ recursosEliminados: number; relacionesEliminadas: number; categoriasEliminadas: number }> {
    const totalRecursos = await recursoRepository.count();
    const totalCategorias = await categoriaRepository.count();
    
    const relResult = await AppDataSource.query('DELETE FROM recurso_categoria');
    const relacionesEliminadas = parseInt(relResult?.[1]) || 0;
    
    await AppDataSource.query('DELETE FROM recursos');
    
    await AppDataSource.query('DELETE FROM categorias');
    
    return {
      recursosEliminados: totalRecursos,
      relacionesEliminadas,
      categoriasEliminadas: totalCategorias
    };
  }

  async findByAutor(autor: string): Promise<Recurso[]> {
    return await recursoRepository.find({
      where: { autor: Like(`%${autor}%`) },
      relations: ['categorias']
    });
  }

  async findByCategoria(categoriaId: number): Promise<Recurso[]> {
    return await recursoRepository.find({
      where: {
        categorias: { id: categoriaId }
      },
      relations: ['categorias']
    });
  }

  async countByCategoria(): Promise<{ categoria: string; count: number }[]> {
    const result = await recursoRepository
      .createQueryBuilder('recurso')
      .innerJoin('recurso.categorias', 'categoria')
      .select('categoria.nombre', 'categoria')
      .addSelect('COUNT(recurso.id)', 'count')
      .groupBy('categoria.nombre')
      .getRawMany();

    return result.map((item: { categoria: string; count: string }) => ({
      categoria: item.categoria,
      count: parseInt(item.count, 10)
    }));
  }

  async findSinCategoria(): Promise<Recurso[]> {
    return await recursoRepository
      .createQueryBuilder('recurso')
      .leftJoinAndSelect('recurso.categorias', 'categoria')
      .where('categoria.id IS NULL')
      .getMany();
  }

  async predecirCrecimiento(): Promise<{
    historial: { semana: number; total: number }[];
    prediccion: { semana: number; valorPredicho: number; intervaloConfianza: [number, number] }[];
    tendencia: 'creciente' | 'estable' | 'decreciente';
    formula: string;
  }> {
    const recursos = await recursoRepository.find({
      order: { id: 'ASC' }
    });

    if (recursos.length === 0) {
      return {
        historial: [],
        prediccion: [],
        tendencia: 'estable',
        formula: 'No hay datos suficientes'
      };
    }

    const totalRecursos = recursos.length;
    const semanasHistorial = Math.min(8, Math.ceil(totalRecursos / 3));
    const historial: { semana: number; total: number }[] = [];

    for (let i = 0; i < semanasHistorial; i++) {
      const recursosHastaSemana = Math.floor((totalRecursos / semanasHistorial) * (i + 1));
      historial.push({
        semana: i + 1,
        total: recursosHastaSemana
      });
    }

    const s = 0.1;
    const prediccion: { semana: number; valorPredicho: number; intervaloConfianza: [number, number] }[] = [];
    const transformadaLaplace = historial.reduce((sum, punto, index) => {
      return sum + punto.total * Math.exp(-s * index);
    }, 0);

    const ultimoValor = historial[historial.length - 1]?.total || 0;
    const tasaCrecimiento = ultimoValor > 0 ? (transformadaLaplace / ultimoValor) * 0.15 : 0.05;

    for (let i = 1; i <= 4; i++) {
      const semanaFutura = semanasHistorial + i;
      const valorBase = ultimoValor * (1 + tasaCrecimiento * i);
      const variacion = valorBase * 0.1;
      
      prediccion.push({
        semana: semanaFutura,
        valorPredicho: Math.round(valorBase),
        intervaloConfianza: [
          Math.round(valorBase - variacion),
          Math.round(valorBase + variacion)
        ]
      });
    }

    const pendiente = prediccion.length > 0 
      ? (prediccion[prediccion.length - 1].valorPredicho - ultimoValor) / 4
      : 0;
    
    const tendencia = pendiente > 0.5 ? 'creciente' : pendiente < -0.5 ? 'decreciente' : 'estable';

    return {
      historial,
      prediccion,
      tendencia,
      formula: `L{f}(s=${s}) = Σ f(n)e^(-sn) = ${transformadaLaplace.toFixed(2)}`
    };
  }

  async analizarDistribucionCategorias(): Promise<{
    señalOriginal: { categoria: string; magnitud: number; fase: number }[];
    transformadaLaplace: { categoria: string; real: number; imaginario: number; magnitud: number }[];
    estimacionComportamiento: {
      categoriaDominante: string;
      equilibrio: number;
      recomendaciones: string[];
    };
    formula: string;
  }> {
    const estadisticas = await this.countByCategoria();
    const totalRecursos = estadisticas.reduce((sum, e) => sum + e.count, 0);

    if (estadisticas.length === 0 || totalRecursos === 0) {
      return {
        señalOriginal: [],
        transformadaLaplace: [],
        estimacionComportamiento: {
          categoriaDominante: 'Ninguna',
          equilibrio: 0,
          recomendaciones: ['Crear categorías iniciales']
        },
        formula: 's(t) = Σ a_n·δ(t-n) donde a_n = recursos en categoría n'
      };
    }

    const señalOriginal = estadisticas.map((stat, index) => ({
      categoria: stat.categoria,
      magnitud: stat.count,
      fase: (index / estadisticas.length) * 2 * Math.PI
    }));

    const s = 0.5;
    const transformadaLaplace = señalOriginal.map((punto, index) => {
      const real = punto.magnitud * Math.cos(punto.fase) * Math.exp(-s * index);
      const imaginario = punto.magnitud * Math.sin(punto.fase) * Math.exp(-s * index);
      
      return {
        categoria: punto.categoria,
        real: parseFloat(real.toFixed(3)),
        imaginario: parseFloat(imaginario.toFixed(3)),
        magnitud: parseFloat(Math.sqrt(real * real + imaginario * imaginario).toFixed(3))
      };
    });

    const dominante = transformadaLaplace.reduce((max, actual) => 
      actual.magnitud > max.magnitud ? actual : max
    , transformadaLaplace[0]);

    const proporciones = estadisticas.map(e => e.count / totalRecursos);
    const entropia = -proporciones.reduce((sum, p) => 
      sum + (p > 0 ? p * Math.log(p) : 0), 0
    );
    const entropiaMaxima = Math.log(estadisticas.length);
    const equilibrio = entropiaMaxima > 0 ? parseFloat((entropia / entropiaMaxima).toFixed(3)) : 0;

    const recomendaciones: string[] = [];
    if (equilibrio < 0.3) {
      recomendaciones.push(`La categoría "${dominante?.categoria}" domina. Considera crear más recursos en otras categorías.`);
    }
    if (equilibrio > 0.7) {
      recomendaciones.push('Excelente distribución de recursos. El sistema está equilibrado.');
    }
    if (estadisticas.some(e => e.count === 0)) {
      recomendaciones.push('Hay categorías vacías. Considera poblarlas con recursos relevantes.');
    }
    recomendaciones.push(`Tasa de diversidad: ${(equilibrio * 100).toFixed(1)}%`);

    return {
      señalOriginal,
      transformadaLaplace,
      estimacionComportamiento: {
        categoriaDominante: dominante?.categoria || 'Ninguna',
        equilibrio,
        recomendaciones
      },
      formula: `F(s) = Σ a_n·e^(-sn)·e^(iθ_n) donde s=${s}, a_n=magnitud, θ_n=fase`
    };
  }
}