import fs from 'fs';
import path from 'path';
import pg from 'pg';

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

const connectionString = env.DATABASE_URL;

if (!connectionString) {
  console.error("Erro: DATABASE_URL não encontrada no arquivo .env");
  process.exit(1);
}

const { Client } = pg;
const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log("=== CONFIRMANDO USUÁRIO ADMINISTRADOR NO BANCO DE DADOS ===");
console.log(`DB URL: ${connectionString.split('@')[1]}`);

async function run() {
  try {
    await client.connect();
    console.log("Conectado ao banco de dados PostgreSQL.");

    const res = await client.query(
      `UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'admin@lancer.com' RETURNING id, email, email_confirmed_at`
    );

    if (res.rowCount === 0) {
      console.log("\n⚠️ Nenhum usuário encontrado com o e-mail 'admin@lancer.com'. Certifique-se de que rodou o script create-admin.js primeiro.");
    } else {
      console.log("\n✅ Usuário confirmado com sucesso!");
      console.log("Detalhes:", res.rows[0]);
    }
  } catch (err) {
    console.error("\n❌ Erro ao executar a consulta:", err.message || err);
  } finally {
    await client.end();
  }
}

run();
