[![Netlify Status](https://api.netlify.com/api/v1/badges/55d0e9f5-8e0d-422e-a3d0-38a79ecf2413/deploy-status)](https://app.netlify.com/sites/lancer-briefings/deploys)

# Lancer Briefings & Pilot Creator (PT-BR)

Uma plataforma tática para mestres e jogadores de LANCER, focada em imersão e utilidade. Este projeto combina um **Gerenciador de Briefings de Missão** com um **Criador de Pilotos Moderno**, totalmente localizado em português.

**[Demonstração Original](https://lancer.kuenaimaku.com/)** - Exemplo do criador original do gerenciador de missões.

---

## 🚀 Funcionalidades Principais

### 1. Briefing de Missão Tático
- Interface inspirada em terminais militares para apresentar objetivos, mapas e relógios de missão.
- Suporte a múltiplas facções (IPSN, SSC, HORUS, HA) com estéticas personalizadas.
- Integração de áudio e vídeo para maior imersão durante as sessões.

### 2. Lancer Pilot Creator (NOVO)
- **Criação de Piloto**: Gestão completa de talentos, licenças e atributos.
- **Modais de Alta Fidelidade**: Interface moderna para seleção de talentos e equipamentos (Armaduras, Armas e Utilitários).
- **Regras Integradas**: Verificação automática de níveis, pontos de sistema (SP) e limites de carga.
- **Exportação/Visualização**: Resumo detalhado do piloto pronto para combate.

### 3. Localização PT-BR Completa
- Banco de dados de talentos, equipamentos e sistemas traduzido para o português brasileiro.
- Tags táticas inteligentes para facilitar a leitura de mecânicas de jogo.

---

## 🛠️ Requisitos e Instalação

### Requisitos
- **Node.js** (v16 ou superior recomendado)
- **Editor de Texto** (VS Code recomendado com extensões Volar/Vue)

### Instalação
1. Clone o repositório.
2. No terminal, execute:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Scripts Disponíveis
- `npm run dev`: Ambiente de desenvolvimento com Hot Reload.
- `npm run build`: Gera a versão otimizada para produção na pasta `/dist`.
- `npm run format`: Formata o código usando Prettier.

---

## 🎨 Customização

O projeto é altamente configurável através de arquivos JSON e CSS:

### Configuração Geral (`src/assets/info/general-config.json`)
- `initialSlug`: Define qual missão carregar por padrão.
- `planetPath`: Caminho para o vídeo/gif do planeta no cabeçalho.
- `header`: Customização de textos e sub-headers do topo da página.

### Pasta `public/` (Ativos Estáticos)
- `/pilots` e `/mechs`: Armazene as imagens dos seus personagens. Os nomes dos arquivos devem corresponder ao `callsign` do piloto.
- `/faction-logos`: Logotipos SVG usados para mapear ícones de fabricantes.
- `startup.ogg`: Som de inicialização do sistema.

### Estilização (`src/assets/_base.css`)
Contém as variáveis de cores, fontes e tokens de design. Ideal para mudar o "feeling" da facção principal.

---

## 🌐 Deploy (Hospedagem)

Recomendamos o uso do **Netlify** para um deploy rápido e gratuito:
1. Conecte seu fork do GitHub ao Netlify.
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`
4. **Branch**: `master` (ou sua branch principal).

---

## 💎 Créditos

- **Original Mission Briefing**: Criado por [Kuenaimaku](https://lancer.kuenaimaku.com/).
- **Tradução e Modernização**: Dante3147 / LPfontes.
- **Figma Reference**: Alkyama#2737.
- **Efeitos Visuais**: [VantaJS](https://www.vantajs.com/).

---

*LANCER is a tabletop RPG created by Massif Press. This tool is a fan project and is not affiliated with Massif Press.*
