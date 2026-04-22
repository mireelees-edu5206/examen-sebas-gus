import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Activity, AlertCircle, Calculator, BarChart3, Info } from 'lucide-react'

/**
 * Componente de Gráfica de Barras simple
 */
function BarChart({ data, color = 'cyan', maxValue }: { data: { label: string; value: number; color?: string }[]; color?: string; maxValue?: number }) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1)
  
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs w-20 truncate" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
          <div className="flex-1 rounded-full h-5 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color === 'bg-indigo-500' ? 'var(--neon-cyan)' : item.color === 'bg-violet-500' ? 'var(--neon-purple)' : item.color === 'bg-violet-400' ? 'var(--neon-pink)' : `var(--neon-${color})`, boxShadow: `0 0 8px currentColor` }}
            >
              <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium" style={{ color: '#070b14' }}>
                {item.value > 0 && item.value}
              </span>
            </div>
          </div>
          <span className="text-xs font-medium w-8" style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * Componente de Línea de Tiempo
 */
function TimelineChart({ historial, prediccion }: { historial: any[]; prediccion: any[] }) {
  const allPoints = [...historial.map(h => ({ ...h, type: 'hist' })), ...prediccion.map(p => ({ ...p, type: 'pred' }))]
  const maxVal = Math.max(...allPoints.map(p => p.total || p.valorPredicho), 1)
  
  return (
    <div className="relative h-40 rounded-lg p-4" style={{ background: 'rgba(0,255,247,0.03)', border: '1px solid rgba(0,255,247,0.1)' }}>
      <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
        <polyline fill="none" stroke="#00fff7" strokeWidth="0.5"
          points={historial.map((h, i) => `${(i / (allPoints.length - 1)) * 100},${50 - (h.total / maxVal) * 45}`).join(' ')} />
        <polyline fill="none" stroke="#ff2dff" strokeWidth="0.5" strokeDasharray="2,2"
          points={prediccion.map((p, i) => `${((historial.length + i) / (allPoints.length - 1)) * 100},${50 - (p.valorPredicho / maxVal) * 45}`).join(' ')} />
        {historial.map((h, i) => (
          <circle key={`h-${i}`} cx={(i / (allPoints.length - 1)) * 100} cy={50 - (h.total / maxVal) * 45} r="1.5" fill="#00fff7" />
        ))}
        {prediccion.map((p, i) => (
          <circle key={`p-${i}`} cx={((historial.length + i) / (allPoints.length - 1)) * 100} cy={50 - (p.valorPredicho / maxVal) * 45} r="1.5" fill="#ff2dff" />
        ))}
      </svg>
      <div className="absolute bottom-1 left-0 right-0 flex justify-between text-xs px-4" style={{ color: 'var(--text-secondary)' }}>
        <span>Histórico</span>
        <span>Predicción</span>
      </div>
    </div>
  )
}

/**
 * Página de Análisis Avanzado con Transformada de Laplace
 * Muestra predicciones y análisis de comportamiento con explicaciones matemáticas
 */
function Analisis() {
  const [prediccionData, setPrediccionData] = useState<any>(null)
  const [distribucionData, setDistribucionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAnalisis()
  }, [])

  const loadAnalisis = async () => {
    try {
      setLoading(true)
      const [predResp, distResp] = await Promise.all([
        fetch('/api/recursos/analisis/prediccion').then(r => r.json()),
        fetch('/api/recursos/analisis/distribucion').then(r => r.json())
      ])
      
      if (predResp.success) setPrediccionData(predResp.data)
      if (distResp.success) setDistribucionData(distResp.data)
    } catch (err) {
      setError('Error al cargar análisis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="p-2 rounded-lg bg-neon-orange" style={{ border: '1px solid rgba(255,107,0,0.3)' }}>
          <Calculator className="h-6 w-6" style={{ color: 'var(--neon-orange)' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold gradient-text">Análisis con Laplace</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Transformadas y predicciones sobre los datos</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16">
          <div className="spinner-neon h-10 w-10 mx-auto"></div>
          <p className="mt-4 text-sm neon-pulse" style={{ color: 'var(--neon-orange)' }}>Calculando transformadas...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.3)' }}>
          <p className="text-sm" style={{ color: '#ff6b6b' }}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          {/* Resumen de consultas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="neon-card rounded-xl p-4 transition-all" style={{ borderColor: 'rgba(255,107,0,0.2)' }}>
              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-2" style={{ background: 'rgba(255,107,0,0.15)', color: 'var(--neon-orange)' }}>CONSULTA 6</span>
              <h3 className="font-medium text-sm mb-1" style={{ color: '#e8edf5' }}>Recursos sin Categoría</h3>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>LEFT JOIN para encontrar recursos huérfanos</p>
              <a href="http://localhost:3000/recursos/sin-categoria" target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: 'var(--neon-orange)' }}>Ver endpoint &rarr;</a>
            </div>
            <div className="neon-card rounded-xl p-4 transition-all" style={{ borderColor: 'rgba(0,255,247,0.2)' }}>
              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-2" style={{ background: 'rgba(0,255,247,0.15)', color: 'var(--neon-cyan)' }}>CONSULTA 7</span>
              <h3 className="font-medium text-sm mb-1" style={{ color: '#e8edf5' }}>Predicción de Crecimiento</h3>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>L{'{'}f{'}'}(s) = Σ f(n)e^(-sn)</p>
              <a href="http://localhost:3000/recursos/analisis/prediccion" target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: 'var(--neon-cyan)' }}>Ver endpoint &rarr;</a>
            </div>
            <div className="neon-card rounded-xl p-4 transition-all" style={{ borderColor: 'rgba(255,45,255,0.2)' }}>
              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-2" style={{ background: 'rgba(255,45,255,0.15)', color: 'var(--neon-pink)' }}>CONSULTA 8</span>
              <h3 className="font-medium text-sm mb-1" style={{ color: '#e8edf5' }}>Análisis de Señal</h3>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>F(s) = a·e^(-sn)·e^(iθ)</p>
              <a href="http://localhost:3000/recursos/analisis/distribucion" target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: 'var(--neon-pink)' }}>Ver endpoint &rarr;</a>
            </div>
          </div>

          {/* Dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CONSULTA 7 */}
            <div className="neon-card rounded-xl p-6" style={{ borderColor: 'rgba(0,255,247,0.15)' }}>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5" style={{ color: 'var(--neon-cyan)' }} />
                <div>
                  <h2 className="text-base font-semibold neon-text-cyan">Predicción de Crecimiento</h2>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Transformada de Laplace Discreta</p>
                </div>
              </div>

              <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(0,255,247,0.06)', border: '1px solid rgba(0,255,247,0.15)' }}>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--neon-cyan)' }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Predice el crecimiento futuro usando la <strong style={{ color: 'var(--neon-cyan)' }}>Transformada de Laplace discreta</strong>. 
                    Convierte datos históricos al dominio de frecuencia y proyecta valores futuros.
                  </p>
                </div>
              </div>

              {prediccionData?.formula && (
                <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(57,255,20,0.15)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Fórmula:</p>
                  <p className="text-sm font-mono text-center neon-text-green">{prediccionData.formula}</p>
                  <div className="mt-2 text-xs" style={{ color: '#4a5568' }}>
                    <p>L{'{'}f{'}'}(s) = Transformada de f | f(n) = Recursos/semana | s = 0.1</p>
                  </div>
                </div>
              )}

              {prediccionData?.historial && prediccionData?.prediccion && (
                <div className="mb-4">
                  <h3 className="text-xs font-medium mb-2 flex items-center gap-1 neon-text-cyan">
                    <BarChart3 className="h-3.5 w-3.5" /> Evolución Temporal
                  </h3>
                  <TimelineChart historial={prediccionData.historial} prediccion={prediccionData.prediccion} />
                  <div className="flex gap-4 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--neon-cyan)', boxShadow: '0 0 6px var(--neon-cyan)' }}></span> Histórico</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--neon-pink)', boxShadow: '0 0 6px var(--neon-pink)' }}></span> Predicción</span>
                  </div>
                </div>
              )}

              {prediccionData?.historial && (
                <div className="mb-4">
                  <h3 className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Histórico por Semana</h3>
                  <BarChart data={prediccionData.historial.map((h: any) => ({ label: `S${h.semana}`, value: h.total, color: 'bg-indigo-500' }))} />
                </div>
              )}

              {prediccionData?.prediccion && (
                <div className="mb-4">
                  <h3 className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Predicción (4 semanas)</h3>
                  <BarChart data={prediccionData.prediccion.map((p: any) => ({ label: `S${p.semana}`, value: p.valorPredicho, color: 'bg-violet-500' }))} />
                </div>
              )}

              {prediccionData?.tendencia && (
                <div className="p-3 rounded-lg text-sm" style={{
                  background: prediccionData.tendencia === 'creciente' ? 'rgba(57,255,20,0.08)' : prediccionData.tendencia === 'decreciente' ? 'rgba(255,60,60,0.08)' : 'rgba(255,230,0,0.08)',
                  border: `1px solid ${prediccionData.tendencia === 'creciente' ? 'rgba(57,255,20,0.3)' : prediccionData.tendencia === 'decreciente' ? 'rgba(255,60,60,0.3)' : 'rgba(255,230,0,0.3)'}`,
                  color: prediccionData.tendencia === 'creciente' ? 'var(--neon-green)' : prediccionData.tendencia === 'decreciente' ? '#ff6b6b' : 'var(--neon-yellow)'
                }}>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <p className="font-semibold text-sm">Tendencia: {prediccionData.tendencia.toUpperCase()}</p>
                  </div>
                  <p className="text-xs mt-1 opacity-70">Basado en la pendiente de la transformada inversa</p>
                </div>
              )}
            </div>

            {/* CONSULTA 8 */}
            <div className="neon-card rounded-xl p-6" style={{ borderColor: 'rgba(255,45,255,0.15)' }}>
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-5 w-5" style={{ color: 'var(--neon-pink)' }} />
                <div>
                  <h2 className="text-base font-semibold neon-text-pink">Análisis de Señal</h2>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Transformada de Laplace compleja</p>
                </div>
              </div>

              <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(255,45,255,0.06)', border: '1px solid rgba(255,45,255,0.15)' }}>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--neon-pink)' }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Analiza la distribución como <strong style={{ color: 'var(--neon-pink)' }}>señal compleja</strong> aplicando
                    la Transformada de Laplace para identificar patrones de concentración y desequilibrios.
                  </p>
                </div>
              </div>

              {distribucionData?.formula && (
                <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(57,255,20,0.15)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Fórmula:</p>
                  <p className="text-sm font-mono text-center neon-text-green">{distribucionData.formula}</p>
                  <div className="mt-2 text-xs" style={{ color: '#4a5568' }}>
                    <p>F(s) = Transformada compleja | aₙ = Magnitud | θₙ = Fase angular</p>
                  </div>
                </div>
              )}

              {distribucionData?.señalOriginal && (
                <div className="mb-4">
                  <h3 className="text-xs font-medium mb-2 flex items-center gap-1 neon-text-pink">
                    <BarChart3 className="h-3.5 w-3.5" /> Distribución por Categoría
                  </h3>
                  <BarChart data={distribucionData.señalOriginal.map((s: any) => ({ label: s.categoria.slice(0, 8), value: s.magnitud, color: s.magnitud > 2 ? 'bg-violet-500' : 'bg-violet-400' }))} />
                </div>
              )}

              {distribucionData?.transformadaLaplace && (
                <div className="mb-4">
                  <h3 className="text-xs font-medium mb-2 neon-text-purple">Plano Complejo F(s)</h3>
                  <div className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(184,41,255,0.15)' }}>
                    <div className="relative h-48">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                      <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                      <span className="absolute right-2 top-1/2 text-xs" style={{ color: '#4a5568' }}>Re</span>
                      <span className="absolute left-1/2 top-2 text-xs" style={{ color: '#4a5568' }}>Im</span>
                      {distribucionData.transformadaLaplace.slice(0, 6).map((t: any, i: number) => {
                        const scale = 20
                        const x = 50 + (t.real * scale)
                        const y = 50 - (t.imaginario * scale)
                        const magnitude = Math.sqrt(t.real * t.real + t.imaginario * t.imaginario) * scale
                        const neonCols = ['#00fff7', '#ff2dff', '#39ff14', '#ff6b00', '#b829ff', '#ffe600']
                        const c = neonCols[i % neonCols.length]
                        return (
                          <div key={i}>
                            <div className="absolute origin-left" style={{ left: '50%', top: '50%', width: `${Math.min(magnitude, 40)}%`, height: '2px', background: c, transform: `rotate(${Math.atan2(-t.imaginario, t.real) * 180 / Math.PI}deg)`, opacity: 0.6, boxShadow: `0 0 4px ${c}` }} />
                            <div className="absolute w-2.5 h-2.5 rounded-full" style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%`, transform: 'translate(-50%, -50%)', background: c, boxShadow: `0 0 8px ${c}` }} title={`${t.categoria}: ${t.real.toFixed(2)} ${t.imaginario >= 0 ? '+' : ''}${t.imaginario.toFixed(2)}i`} />
                            <span className="absolute text-[10px] font-medium" style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%`, transform: 'translate(8px, -8px)', color: c }}>{t.categoria.slice(0, 3)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Magnitud = peso, ángulo = fase relativa</p>
                </div>
              )}

              {/* Tabla */}
              <div className="mb-4">
                <h3 className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Valores de la Transformada</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0,255,247,0.1)' }}>
                        <th className="px-2 py-1.5 text-left font-medium" style={{ color: 'var(--text-secondary)' }}>Categoría</th>
                        <th className="px-2 py-1.5 text-right font-medium neon-text-cyan">Real</th>
                        <th className="px-2 py-1.5 text-right font-medium neon-text-pink">Imag.</th>
                        <th className="px-2 py-1.5 text-right font-medium neon-text-green">|Magnitud|</th>
                      </tr>
                    </thead>
                    <tbody>
                      {distribucionData?.transformadaLaplace?.slice(0, 5).map((t: any, i: number) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td className="px-2 py-1.5" style={{ color: '#e8edf5' }}>{t.categoria}</td>
                          <td className="px-2 py-1.5 text-right font-mono" style={{ color: 'var(--neon-cyan)' }}>{t.real.toFixed(3)}</td>
                          <td className="px-2 py-1.5 text-right font-mono" style={{ color: 'var(--neon-pink)' }}>{t.imaginario.toFixed(3)}i</td>
                          <td className="px-2 py-1.5 text-right font-mono font-bold" style={{ color: 'var(--neon-green)' }}>{t.magnitud.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Estimación */}
              {distribucionData?.estimacionComportamiento && (
                <div className="p-3 rounded-lg text-sm" style={{
                  background: distribucionData.estimacionComportamiento.equilibrio > 0.6 ? 'rgba(57,255,20,0.08)' : distribucionData.estimacionComportamiento.equilibrio > 0.3 ? 'rgba(255,230,0,0.08)' : 'rgba(255,60,60,0.08)',
                  border: `1px solid ${distribucionData.estimacionComportamiento.equilibrio > 0.6 ? 'rgba(57,255,20,0.3)' : distribucionData.estimacionComportamiento.equilibrio > 0.3 ? 'rgba(255,230,0,0.3)' : 'rgba(255,60,60,0.3)'}`,
                  color: distribucionData.estimacionComportamiento.equilibrio > 0.6 ? 'var(--neon-green)' : distribucionData.estimacionComportamiento.equilibrio > 0.3 ? 'var(--neon-yellow)' : '#ff6b6b'
                }}>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Análisis del Comportamiento
                  </h4>
                  <p className="text-xs mb-1">
                    <span className="font-medium">Dominante:</span>{' '}
                    <span className="font-semibold neon-text-purple">{distribucionData.estimacionComportamiento.categoriaDominante}</span>
                  </p>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium">Equilibrio:</span>
                    <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full" style={{
                        width: `${distribucionData.estimacionComportamiento.equilibrio * 100}%`,
                        background: distribucionData.estimacionComportamiento.equilibrio > 0.6 ? 'var(--neon-green)' : distribucionData.estimacionComportamiento.equilibrio > 0.3 ? 'var(--neon-yellow)' : '#ff6b6b',
                        boxShadow: '0 0 6px currentColor'
                      }} />
                    </div>
                    <span className="text-xs font-mono">{(distribucionData.estimacionComportamiento.equilibrio * 100).toFixed(1)}%</span>
                  </div>
                  <div className="space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {distribucionData.estimacionComportamiento.recomendaciones.map((r: string, i: number) => (
                      <p key={i} className="text-xs flex items-start gap-1">
                        <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--neon-orange)' }} />{r}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fundamento matemático */}
          <div className="neon-card rounded-xl p-5">
            <h4 className="font-semibold text-sm mb-3 gradient-text">Fundamento Matemático</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-xs mb-1 neon-text-cyan">Consulta 7 — Laplace Discreta:</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Convierte una serie temporal f(n) en el dominio complejo s para analizar 
                  el crecimiento de recursos. La inversa proyecta valores futuros.
                </p>
              </div>
              <div>
                <p className="font-mono text-xs mb-1 neon-text-pink">Consulta 8 — Laplace Compleja:</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Representa la distribución de categorías como una señal compleja con magnitud 
                  y fase, revelando patrones de dominancia y desequilibrio.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analisis
