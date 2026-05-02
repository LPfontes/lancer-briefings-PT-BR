import { createClient } from '@supabase/supabase-js'

// Estas variáveis devem ser configuradas no painel da Vercel
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null

export default async function handler(req, res) {
  // Configuração de CORS para permitir requisições do frontend
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase não configurado. Adicione as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.' })
  }

  try {
    if (req.method === 'POST') {
      const pilotData = req.body
      const { data, error } = await supabase
        .from('pilots')
        .upsert([pilotData])
        .select()
      
      if (error) throw error
      return res.status(200).json(data)
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('pilots')
        .select('*')
        .order('lastSaved', { ascending: false })
      
      if (error) throw error
      return res.status(200).json(data)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      const { error } = await supabase
        .from('pilots')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return res.status(200).json({ message: 'Piloto deletado' })
    }

    return res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
