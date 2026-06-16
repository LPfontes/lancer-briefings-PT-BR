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

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;

console.log("=== TESTANDO CONEXÃO COM SUPABASE ===");
console.log(`URL: ${supabaseUrl}`);
console.log(`Chave: ${supabaseKey ? supabaseKey.substring(0, 15) + '...' : 'NENHUMA'}`);

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: SUPABASE_URL ou SUPABASE_PUBLISHABLE_KEY não encontrados no arquivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  try {
    console.log("\nTentando buscar registros da tabela 'pilots'...");
    const { data, error } = await supabase
      .from('pilots')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log("\n✅ Conexão estabelecida com sucesso!");
    console.log(`Retornou ${data.length} registro(s).`);
    console.log("Dados recebidos:", data);
  } catch (err) {
    console.error("\n❌ Falha na conexão ou consulta:");
    console.error(err.message || err);
    
    // Se a tabela não existir
    if (err.message && err.message.includes('relation "pilots" does not exist')) {
      console.log("\nDica: A conexão com o banco funcionou, mas a tabela 'pilots' ainda não existe no seu banco de dados.");
      console.log("Crie a tabela 'pilots' no painel SQL do Supabase executando o seguinte script:");
      console.log(`
CREATE TABLE pilots (
  id text PRIMARY KEY,
  callsign text,
  name text,
  level integer,
  "lastSaved" timestamp with time zone,
  data jsonb
);
      `);
    }
  }
}

runTest();
