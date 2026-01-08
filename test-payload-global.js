#!/usr/bin/env node

/**
 * Test Script: Verify Payload Global Data
 * Verifica que los datos guardados en Payload Global (home) se puedan recuperar
 */

const API_BASE = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
const slug = 'home'

async function testPayloadGlobal() {
  console.log('='.repeat(60))
  console.log('VERIFICACION: Payload Global Data')
  console.log('='.repeat(60))
  console.log('')

  const url = `${API_BASE}/api/globals/${slug}`
  console.log(`📍 URL: ${url}`)
  console.log('')

  try {
    console.log('🔄 Haciendo request...')
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    console.log(`✓ Status: ${response.status}`)
    console.log('')

    if (!response.ok) {
      console.error('❌ Error HTTP:', response.status)
      const text = await response.text()
      console.error('Response:', text)
      return
    }

    const data = await response.json()
    
    console.log('✓ Datos recibidos:')
    console.log('')
    console.log('ID:', data.id || 'N/A')
    console.log('Tipo:', data?.hero ? 'HERO EXISTS' : 'NO HERO')
    console.log('')

    if (data?.hero) {
      console.log('📋 HERO DATA:')
      console.log('  pretitulo:', data.hero.pretitulo || 'EMPTY')
      console.log('  titulo:', data.hero.titulo || 'EMPTY')
      console.log('  subtitulo:', data.hero.subtitulo || 'EMPTY')
      console.log('  parrafo:', data.hero.parrafo ? data.hero.parrafo.substring(0, 50) + '...' : 'EMPTY')
      console.log('  texto_boton_1:', data.hero.texto_boton_1 || 'EMPTY')
      console.log('  url_boton_1:', data.hero.url_boton_1 || 'EMPTY')
      console.log('  texto_boton_2:', data.hero.texto_boton_2 || 'EMPTY')
      console.log('  url_boton_2:', data.hero.url_boton_2 || 'EMPTY')
      console.log('')

      if (data.hero.pretitulo && data.hero.titulo && data.hero.pretitulo !== 'Ingenieria que trasciende') {
        console.log('✅ DATO PERSONALIZADO ENCONTRADO!')
        console.log('El problema NO es con Payload. Es con getPayloadContent.ts')
      } else if (data.hero.pretitulo === 'Ingenieria que trasciende') {
        console.log('⚠️  FALLBACK DETECTADO')
        console.log('Los campos no tienen valores personalizados')
      }
    } else {
      console.log('❌ NO HAY SECCION HERO')
      console.log('Estructura del documento:', Object.keys(data))
    }

    console.log('')
    console.log('📦 Documento completo:')
    console.log(JSON.stringify(data, null, 2).substring(0, 1000) + '...')

  } catch (error: any) {
    console.error('❌ ERROR:', error.message)
    console.error('')
    console.error('Verifica que:')
    console.error('1. El servidor esté corriendo en http://localhost:3000')
    console.error('2. Payload Admin esté inicializado')
    console.error('3. Los datos estén guardados en /admin/globals/home')
  }

  console.log('')
  console.log('='.repeat(60))
}

testPayloadGlobal().catch(console.error)
