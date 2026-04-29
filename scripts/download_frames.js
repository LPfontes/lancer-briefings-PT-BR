const fs = require('fs');
const path = require('path');
const https = require('https');

// Path to frames.json
const framesJsonPath = path.join(__dirname, '..', 'node_modules', 'lancer-data-pt-br', 'lib', 'frames.json');
const outputDir = path.join(__dirname, '..', 'public', 'frames');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read frames.json
const frames = JSON.parse(fs.readFileSync(framesJsonPath, 'utf8'));

console.log(`Encontrados ${frames.length} frames. Iniciando download...`);

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        };
        https.get(url, options, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Falha ao baixar ${url}: Status ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function run() {
    let successCount = 0;
    let failCount = 0;

    for (const frame of frames) {
        const url = `https://d2c79xe1p61csc.cloudfront.net/frames/${frame.id}.png`;
        const dest = path.join(outputDir, `${frame.id}.png`);

        try {
            if (fs.existsSync(dest)) {
                console.log(`[SKIP] ${frame.name} já existe.`);
                successCount++;
                continue;
            }

            process.stdout.write(`[DOWN] Baixando ${frame.name} (${frame.id})... `);
            await downloadImage(url, dest);
            process.stdout.write(`OK\n`);
            successCount++;
        } catch (err) {
            process.stdout.write(`ERRO: ${err.message}\n`);
            failCount++;
        }
    }

    console.log(`\nDownload concluído!`);
    console.log(`Sucessos: ${successCount}`);
    console.log(`Falhas: ${failCount}`);
}

run();
