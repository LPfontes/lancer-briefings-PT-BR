import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Parse manual do arquivo .env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: SUPABASE_URL ou SUPABASE_PUBLISHABLE_KEY não encontrados no arquivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const email = process.argv[2] || 'admin@lancer.com';
const password = process.argv[3] || 'lancer123';

console.log("=== CRIANDO USUÁRIO ADMINISTRADOR NO SUPABASE ===");
console.log(`URL: ${supabaseUrl}`);
console.log(`E-mail: ${email}`);
console.log(`Senha: ${password}`);

async function run() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    console.log("\n✅ Usuário registrado com sucesso!");
    console.log("ID do Usuário:", data.user ? data.user.id : 'N/A');
    console.log("\nNota: Se a confirmação de e-mail estiver ativada nas configurações do seu projeto Supabase, você precisará confirmar o cadastro no link recebido ou desativar a confirmação de e-mail no painel (Supabase Dashboard > Authentication > Providers > Email > Confirm email -> desativar).");
  } catch (err) {
    console.error("\n❌ Falha ao registrar usuário:");
    console.error(err.message || err);
  }
}

run();
