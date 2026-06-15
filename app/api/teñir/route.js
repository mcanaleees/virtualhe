import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mimeType = file.type

    // Call Hugging Face Space API
    const hfResponse = await fetch(
      'https://mcanaleees-virtualhe.hf.space/run/predict',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [`data:${mimeType};base64,${base64}`]
        })
      }
    )

    const hfData = await hfResponse.json()
    const resultImage = hfData.data?.[0]?.url || hfData.data?.[0]

    if (!resultImage) throw new Error('No se obtuvo resultado')

    // If result is URL, fetch and convert to base64
    if (typeof resultImage === 'string' && resultImage.startsWith('http')) {
      const imgRes = await fetch(resultImage)
      const imgBytes = await imgRes.arrayBuffer()
      const imgBase64 = Buffer.from(imgBytes).toString('base64')
      return NextResponse.json({ success: true, result: imgBase64 })
    }

    // If already base64
    const cleanBase64 = resultImage.replace(/^data:image\/\w+;base64,/, '')
    return NextResponse.json({ success: true, result: cleanBase64 })

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message })
  }
}
