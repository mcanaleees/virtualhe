'use client'
import { useState } from 'react'

export default function Home() {
  const [imagen, setImagen] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [procesando, setProcesando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const fileRef = useState(null)

  async function procesarImagen(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => setImagen(ev.target.result)
    reader.readAsDataURL(file)

    setProcesando(true)
    setResultado(null)
    setMensaje('⏳ Aplicando tinción H&E virtual...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/teñir', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.result) {
        setResultado(`data:image/png;base64,${data.result}`)
        setMensaje('✅ Tinción H&E virtual aplicada')
      }
    } catch (err) {
      setMensaje('❌ Error al procesar la imagen')
    }
    setProcesando(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8f0fe 0%, #f0f4ff 50%, #e8f4fd 100%)', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '8px 40px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 8px rgba(31,78,121,0.08)' }}>
        <img src="/logo.svg" alt="VirtualHE" style={{ height: '110px', width: 'auto' }} />
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Descripción */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(31,78,121,0.06)' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '18px', color: '#1F4E79' }}>¿Qué es VirtualHE?</h2>
          <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: '1.7' }}>
            VirtualHE aplica tinción de Hematoxilina y Eosina (H&E) de forma virtual a imágenes de tejido histológico. 
            Sube una imagen de tejido sin teñir y obtén en segundos cómo se vería con tinción H&E real.
          </p>
        </div>

        {/* Panel principal */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Subir imagen */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(31,78,121,0.06)' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', color: '#1F4E79' }}>📤 Imagen Original</h2>

            <label style={{ display: 'block', border: '2px dashed #93c5fd', borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: '#f0f7ff', marginBottom: '16px' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#dbeafe' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.background = '#f0f7ff' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔬</div>
              <p style={{ margin: 0, color: '#3b82f6', fontSize: '14px', fontWeight: '500' }}>Clic para subir imagen de tejido</p>
              <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '12px' }}>PNG, JPG, TIFF</p>
              <input type="file" accept="image/*" onChange={procesarImagen} style={{ display: 'none' }} />
            </label>

            {imagen && (
              <img src={imagen} alt="Original" style={{ width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            )}

            {!imagen && (
              <div style={{ background: '#f8fafc', borderRadius: '8px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px' }}>
                No hay imagen seleccionada
              </div>
            )}
          </div>

          {/* Resultado */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(31,78,121,0.06)' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', color: '#1F4E79' }}>🎨 Tinción H&E Virtual</h2>

            {procesando && (
              <div style={{ background: '#f0f7ff', borderRadius: '8px', padding: '40px', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>⏳</div>
                <p style={{ margin: 0, color: '#3b82f6', fontSize: '14px' }}>Aplicando tinción H&E virtual...</p>
              </div>
            )}

            {resultado && !procesando && (
              <>
                <img src={resultado} alt="Resultado H&E" style={{ width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '12px' }} />
                <a href={resultado} download="tincion_HE_virtual.png"
                  style={{ display: 'block', width: '100%', padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #1F4E79, #2E75B6)', color: 'white', fontSize: '14px', fontWeight: '600', textAlign: 'center', textDecoration: 'none' }}>
                  ⬇️ Descargar resultado
                </a>
              </>
            )}

            {!resultado && !procesando && (
              <div style={{ background: '#f8fafc', borderRadius: '8px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px' }}>
                El resultado aparecerá aquí
              </div>
            )}
          </div>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div style={{ marginTop: '20px', padding: '12px 20px', borderRadius: '10px', background: mensaje.includes('❌') ? '#fef2f2' : mensaje.includes('⏳') ? '#f0f7ff' : '#f0fdf4', border: `1px solid ${mensaje.includes('❌') ? '#fecaca' : mensaje.includes('⏳') ? '#bfdbfe' : '#bbf7d0'}`, color: mensaje.includes('❌') ? '#dc2626' : mensaje.includes('⏳') ? '#3b82f6' : '#16a34a', fontSize: '14px', fontWeight: '500' }}>
            {mensaje}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', marginTop: '40px', background: 'white' }}>
        VirtualHE · Desarrollado por Milton Canales © 2026
      </div>
    </main>
  )
}
