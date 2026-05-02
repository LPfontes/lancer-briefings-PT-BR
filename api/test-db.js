export default function handler(req, res) {
  res.json({
    message: "Verificação de Variáveis de Ambiente",
    hasUrl: !!(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL),
    hasKey: !!(process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY),
    envDetected: Object.keys(process.env).filter(key => key.includes('SUPABASE')),
    nodeVersion: process.version
  })
}
