require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function test() {
  console.log('URL :', process.env.SUPABASE_URL)
  console.log('Clé (20 premiers cars) :', process.env.SUPABASE_SERVICE_KEY?.slice(0, 20))

  // Lit une image locale — mets le chemin d'une image qui existe sur ton PC
  const buffer = fs.readFileSync('./test_vin.jpg')

  const { data, error } = await supabase.storage
    .from('bouteilles')
    .upload('test/photo.jpg', buffer, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (error) {
    console.log('❌ Erreur :', error)
  } else {
    console.log('✅ Upload réussi :', data)
  }
}

test()