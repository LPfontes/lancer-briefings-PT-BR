import React, { useState, useEffect } from 'react';
import {
    Shield,
    Apple,
    Hammer,
    Flame,
    Heart,
    Calendar,
    Plus,
    Minus,
    Check,
    AlertTriangle,
    Skull,
    Compass,
    BookOpen,
    Search,
    RefreshCw,
    Sparkles,
    Users,
    Activity,
    UserX,
    Volume2
} from 'lucide-react';

// --- TABELAS DE DADOS EXTRAÍDAS DO PDF OFICIAL "MARCHA PARA O OESTE" ---

const INITIAL_ATTRIBUTES = {
    seguranca: 3,
    alimentacao: 3,
    recursos: 3,
    infraestrutura: 2,
    moral: 4
};

const ATTRIBUTE_METADATA = {
    seguranca: { name: 'Segurança', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-950/40', border: 'border-blue-800', catastrafe: 'Vila invadida, colonos morrem' },
    alimentacao: { name: 'Alimentação', icon: Apple, color: 'text-emerald-500', bg: 'bg-emerald-950/40', border: 'border-emerald-800', catastrafe: 'Fome generalizada, mortes semanais' },
    recursos: { name: 'Recursos', icon: Hammer, color: 'text-amber-500', bg: 'bg-amber-950/40', border: 'border-amber-800', catastrafe: 'Escassez total, infraestrutura cai' },
    infraestrutura: { name: 'Infraestrutura', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-950/40', border: 'border-orange-800', catastrafe: 'Colapso físico e fim de jogo' },
    moral: { name: 'Moral', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-950/40', border: 'border-rose-800', catastrafe: 'Revolta, colonos abandonam Deneb' }
};

const MONSTERS = [
    {
        id: 'rato_espinho',
        name: 'Rato-Espinho',
        nd: 1,
        classification: 'Comum',
        type: 'Animal',
        pv: 26,
        pe: 10,
        pa: 3,
        attack: '2d6+1 (HAB +1)',
        dano: 'Perfurante Leve',
        ecologia: 'Roedor do tamanho de um cão pequeno, com espinhos rígidos que pode disparar. Vive em ninhos de 2d4 indivíduos.',
        fraquezas: 'Fogo (exige PRE CD 6 para não recuar)',
        habilidades: [
            { name: 'Predador [Inata]', desc: 'Iniciativa +2. Causa +2 de dano fixo contra alvos Derrubados.' },
            { name: 'Espinhos Projéteis [Comum]', desc: 'Disparo de espinhos (alcance 6m, munição: 6 antes de descansar).' }
        ]
    },
    {
        id: 'lagarto_crista',
        name: 'Lagarto-Crista',
        nd: 2,
        classification: 'Comum',
        type: 'Animal',
        pv: 37,
        pe: 14,
        pa: 3,
        attack: '2d6+2 (HAB +2)',
        dano: 'Perfurante Média',
        ecologia: 'Réptil do tamanho de um cão grande com crista óssea luminescente que pisca em padrões hipnóticos para confundir presas.',
        fraquezas: 'Fogo (tocha direcionada exige PRE CD 7 para recuar)',
        habilidades: [
            { name: 'Brilho da Crista [Comum - 2 PE]', desc: 'Alvo a 9m testa ANI CD 8 ou recebe Desvantagem no próximo ataque.' },
            { name: 'Predador de Emboscada [Inata]', desc: 'Ganha +1d em Furtividade e Vantagem no primeiro ataque em vegetação.' }
        ]
    },
    {
        id: 'coruja_espectro',
        name: 'Coruja-Espectro',
        nd: 3,
        classification: 'Raro',
        type: 'Animal (Etéreo)',
        pv: 74,
        pe: 20,
        pa: 4,
        attack: '3d6+3 (HAB +3)',
        dano: 'Cortante Leve',
        ecologia: 'Coruja translúcida com aura dourada. Nativa de clareiras antigas e ruínas. Ataca presas isoladas.',
        fraquezas: 'Luz solar direta (-1d Furtividade), Fogo (impõe Desvantagem)',
        habilidades: [
            { name: 'Grito Fantasma [Raro - 3 PE]', desc: 'Cone de 6m. Alvos testam ANI CD 9 ou ficam Atordoados por 1 rodada.' },
            { name: 'Voo Silencioso [Inata]', desc: 'Vantagem em Furtividade em voo. Aproxima-se a 3m sem ruído.' }
        ]
    },
    {
        id: 'urso_caverna',
        name: 'Urso-da-Caverna',
        nd: 3,
        classification: 'Raro',
        type: 'Animal',
        pv: 74,
        pe: 18,
        pa: 4,
        attack: '3d6+2 (POT +2)',
        dano: 'Contusa Média',
        ecologia: 'Versão jovem do Urso-Cinzeiro. Extremamente territorial se estiver a proteger o filhote.',
        fraquezas: 'Fogo (tocha exige PRE CD 8 para recuar)',
        habilidades: [
            { name: 'Proteção do Filhote [Inata]', desc: 'Se o filhote estiver presente, ganha +1d de ataque e não foge.' },
            { name: 'Musculatura Densa [Inata]', desc: 'Causa +2 dano fixo por acerto. RD 1 contra danos não-elementais.' }
        ]
    },
    {
        id: 'onca_sombria',
        name: 'Onça-Pintada Sombria',
        nd: 4,
        classification: 'Raro',
        type: 'Animal (Etéreo)',
        pv: 92,
        pe: 24,
        pa: 5,
        attack: '3d6+2 (HAB +4)',
        dano: 'Cortante Média',
        ecologia: 'Felino cujas manchas pretas absorvem a luz. Mestre de emboscadas que ataca sempre pelas costas.',
        fraquezas: 'Trovão (ignora defesas, impõe Desvantagem, afasta-a)',
        habilidades: [
            { name: 'Passo Sombrio [Raro - 4 PE]', desc: 'Teleporta até 12m entre duas sombras. O próximo ataque ganha Vantagem.' },
            { name: 'Predadora Invisível [Inata]', desc: 'Vantagem em Furtividade na escuridão. Primeiro ataque tem Vantagem automática.' }
        ]
    },
    {
        id: 'javali_touro',
        name: 'Javali-Touro',
        nd: 5,
        classification: 'Místico',
        type: 'Animal',
        pv: 150,
        pe: 28,
        pa: 5,
        attack: '4d6+4 (POT +4)',
        dano: 'Contusa Pesada',
        ecologia: 'Monstro colossal do tamanho de um touro. Persegue os alvos em fúria destrutiva cega.',
        fraquezas: 'Fogo no rosto (PRE CD 9 para recuar), Comida em abundância',
        habilidades: [
            { name: 'Fúria Instável [Místico]', desc: 'Abaixo de 50% PV: ganha +1d de ataque, mas perde 2 PV por rodada e não recua.' },
            { name: 'Pisotear [Raro - 5 PE]', desc: 'Área de 6m. Alvos testam Atletismo CD 10 ou ficam Derrubados e sofrem 1d6.' }
        ]
    },
    {
        id: 'serpente_cipó',
        name: 'Serpente-Cipó (Rainha)',
        nd: 5,
        classification: 'Raro',
        type: 'Animal',
        pv: 110,
        pe: 22,
        pa: 5,
        attack: '4d6+2 (HAB +3)',
        dano: 'Perfurante Média',
        ecologia: 'Constritor mestre da camuflagem. Capaz de se disfarçar em galhos finos. Quase impossível de detetar até atacar.',
        fraquezas: 'Fogo (+2 de dano por golpe e quebra a camuflagem)',
        habilidades: [
            { name: 'Constrição [Comum]', desc: 'Acerto 3+ agarra o alvo. Testar POT CD 12 para escapar. Alvo agarrado sofre 4 de dano automático.' },
            { name: 'Camuflagem Natural [Comum]', desc: 'Exige PER CD 11 para detetar quando estática.' }
        ]
    },
    {
        id: 'esqueleto_guerreiro',
        name: 'Esqueleto Guerreiro',
        nd: 2,
        classification: 'Comum',
        type: 'Morto-Vivo',
        pv: 56,
        pe: 6,
        pa: 3,
        attack: '2d6+2 (POT +1)',
        dano: 'Cortante Média',
        ecologia: 'Guerreiro caído cujos ossos guardam a memória muscular do treino militar.',
        fraquezas: 'Dano Contuso (causa +3 de dano fixo extra por acerto)',
        habilidades: [
            { name: 'Impassível [Inata]', desc: 'Imune a medo, charme, exaustão e efeitos mentais.' },
            { name: 'Ímpeto Guerreiro [Comum - 2 PE]', desc: 'Gasta 2 PE para realizar um ataque adicional como ação livre.' }
        ]
    },
    {
        id: 'elemental_terra',
        name: 'Elemental de Terra',
        nd: 3,
        classification: 'Raro',
        type: 'Elemental',
        pv: 74,
        pe: 22,
        pa: 4,
        attack: '3d6+2 (POT +3)',
        dano: 'Contusa Média',
        ecologia: 'Entidade de rocha e minerais. Lento, protetor e extremamente resiliente. Não é hostil se for respeitado.',
        fraquezas: 'Água e Madeira (causam +50% de dano e ignoram a Redução de Dano)',
        habilidades: [
            { name: 'Corpo Elemental [Inata]', desc: 'Imune a Terra. Quem ataca corpo a corpo sofre 2 de dano automático de terra.' },
            { name: 'Pele de Pedra [Inata]', desc: 'RD 3 contra danos físicos não-elementais.' }
        ]
    }
];

const MISSIONS = [
    {
        id: 'm_palicada',
        npc: 'Greta Alvras',
        name: 'A Paliçada',
        nd: '1-2',
        deadline: 6,
        rewards: { seguranca: 1, moral: 1 },
        penalties: { seguranca: -1 },
        desc: 'Bruno e os seus comparsas fugiram para o sul com ferramentas essenciais. Recupere a madeira e as ferramentas.',
        consequenceDesc: 'Bruno invade a cidade e rouba suprimentos.',
        solvedDesc: 'Paliçada reforçada! Evitou invasões iniciais de Lagartos-Crista.'
    },
    {
        id: 'm_venenos',
        npc: 'Elara Souza',
        name: 'Coletando Venenos',
        nd: '1',
        deadline: 6,
        rewards: { moral: 1 },
        penalties: { moral: -1, alimentacao: -1 },
        desc: 'A Serpente Rainha picou colonos a leste. Recupere glândulas de veneno na floresta para criar antídotos.',
        consequenceDesc: 'Colonos morrem de febre, derrubando o moral e o estoque.',
        solvedDesc: 'Antídotos criados a tempo! A enfermaria esvaziou.'
    },
    {
        id: 'm_carta',
        npc: 'Greta Alvras',
        name: 'Carta Perdida',
        nd: '3',
        deadline: 8,
        rewards: { moral: 1, recursos: 1 },
        penalties: { moral: -1, alimentacao: -1 },
        desc: 'O mensageiro do Conde d\'Faz está atrasado a leste. Encontre a carroça e recupere os papéis urgentes.',
        consequenceDesc: 'Novos colonos chegam sem preparo ou cabanas.',
        solvedDesc: 'Papéis salvos! A transição de novos colonos foi organizada.'
    },
    {
        id: 'm_terras',
        npc: 'Greta Alvras',
        name: 'Disputa de Terras',
        nd: '2-3',
        deadline: 8,
        rewards: { seguranca: 1 },
        penalties: { seguranca: -1 },
        desc: 'Jairson e Jonas disputam o mesmo lote com documentos suspeitos. Resolva sem recorrer à força.',
        consequenceDesc: 'Jairson forja documentos e cria um submundo criminoso.',
        solvedDesc: 'Justiça feita! O lote foi distribuído legalmente.'
    },
    {
        id: 'm_infiltrados',
        npc: 'Greta Alvras',
        name: 'Os Infiltrados',
        nd: '2-3',
        deadline: 10,
        rewards: { alimentacao: 1, moral: 1 },
        penalties: { alimentacao: -1 },
        desc: 'Os inventários não batem. Há espiões de Florensa infiltrados sabotassem os mantimentos.',
        consequenceDesc: 'Incêndio na taverna e prefeitura a longo prazo.',
        solvedDesc: 'Sabotadores capturados! A comida do depósito está segura.'
    },
    {
        id: 'm_carvao',
        npc: 'Henrique K\'Heiz',
        name: 'Carvão para a Forja',
        nd: '2',
        deadline: 10,
        rewards: { recursos: 1 },
        penalties: { recursos: -1 },
        desc: 'Limpe a carbonária a leste dos mortos-vivos e libertes o suprimento de combustível da forja.',
        consequenceDesc: 'A forja para de funcionar por falta de carvão.',
        solvedDesc: 'Carvão recuperado! Henrique começa a aquecer os metais.'
    },
    {
        id: 'm_urso',
        npc: 'Henrique K\'Heiz',
        name: 'Pele de Urso',
        nd: '3',
        deadline: 12,
        rewards: { recursos: 1, moral: 1 },
        penalties: { recursos: -1 },
        desc: 'O fole da forja rasgou. Traga couro de urso da caverna a noroeste para consertá-lo.',
        consequenceDesc: 'O filhote de urso cresce e torna-se um monstro de ND 4 na região.',
        solvedDesc: 'Fole consertado! Armas podem ser afiadas com segurança.'
    },
    {
        id: 'm_minerio',
        npc: 'Henrique K\'Heiz',
        name: 'Minério Perdido',
        nd: '2-3',
        deadline: 15,
        rewards: { recursos: 2 },
        penalties: { recursos: -1 },
        desc: 'A carga de minério de ferro foi roubada por bandidos liderados por Dagmar a sudoeste.',
        consequenceDesc: 'Dagmar vende o minério para contrabandistas de Florensa.',
        solvedDesc: 'Metal de qualidade recuperado! Prontos para projetos de pedra.'
    },
    {
        id: 'm_muralha',
        npc: 'Projetos de Expansão',
        name: 'A Muralha de Pedra',
        nd: '3-4',
        deadline: 99,
        rewards: { seguranca: 3, infraestrutura: 2 },
        penalties: {},
        desc: 'Requer Paliçada e Minério resolvidos. Extraia pedras cinzas da pedreira e erga a primeira muralha.',
        consequenceDesc: '',
        solvedDesc: 'Deneb deixa de ser um mero acampamento e passa a ser uma vila fortificada!'
    }
];

const EVENT_CATEGORIES = {
    1: { name: 'Hostil', icon: Skull, color: 'text-red-500' },
    2: { name: 'Neutro / Social', icon: Users, color: 'text-blue-400' },
    3: { name: 'Fenómeno / Interesse', icon: Compass, color: 'text-emerald-400' },
    4: { name: 'Sorte ou Azar', icon: Sparkles, color: 'text-amber-400' },
    5: { name: 'Pista / Mistério', icon: BookOpen, color: 'text-purple-400' }
};

const RANDOM_EVENTS = {
    1: { // Hostil
        2: 'Emboscada coordenada! Inimigos têm cobertura e atacam de surpresa.',
        3: 'Predador territorial avistado. Tem o dobro do tamanho comum e fúria.',
        4: 'Bando de criaturas pequenas (2d6 ratos/insetos) bloqueia a rota.',
        5: 'Armadilha de caçador ativa camuflada sob folhas (Percepção CD 8).',
        6: 'Criatura agressiva a defender o seu filhote. Não recuará facilmente.',
        7: 'Batalha campal entre duas feras elementais! O grupo pode contornar ou lucrar.',
        8: 'Criatura faminta tenta emboscar, mas pode ser distraída com rações.',
        9: 'Pegadas colossais na lama. Segui-las leva a um perigo de ND+2.',
        10: 'Gás tóxico ou esporos na área (Resistência CD 7 ou condição Enjoado).',
        11: 'Fera ferida e encurralada (metade do PV, mas ganha Vantagem no ataque).',
        12: 'Monstro raro de ND+2 surge momentaneamente na névoa e desaparece.'
    },
    2: { // Neutro
        2: 'Viajante perdido de Ardósia sem água pede direções para Deneb.',
        3: 'Caçador de peles local conhece atalhos e vende informações úteis.',
        4: 'Fera assustada cruza o caminho correndo, fugindo de algo maior a norte.',
        5: 'Eremita excêntrico oferece abrigo temporário em troca de uma história.',
        6: 'Grupo de nativos (povos-bicho) desconfiados, abertos à diplomacia.',
        7: 'Mercador ambulante com carroça quebrada oferece descontos em poções.',
        8: 'Cadáver de mensageiro com diário pessoal e moedas antigas de Florensa.',
        9: 'Pequena ruína coberta de heras. Esconde uma entrada selada.',
        10: 'Fonte de água cristalina pura. Recupera 1d6 de PE a quem beber.',
        11: 'Clareira com plantas medicinais raras (Natureza CD 7 para colher).',
        12: 'Acampamento de pioneiros abandonado com rastro recente de fuga.'
    },
    3: { // Fenómeno
        2: 'Ruínas inundadas. Requer natação e oferece mistérios aquáticos.',
        3: 'Fenda profunda que emana calor e vapor vulcânico de Anima pura.',
        4: 'Carvalho ancião com tronco oco grande o suficiente para abrigar o grupo.',
        5: 'Ponte de pedra natural sobre um desfiladeiro perigoso.',
        6: 'Cachoeira do Cantor. Gruta escondida atrás do véu de água.',
        7: 'Círculo de monólitos de pedra esculpida com marcas de rituais elementais.',
        8: 'Toca subterrânea vazia que serve como excelente acampamento seguro.',
        9: 'Pedra Negra gravada com runas antigas (Conhecimento Arcano CD 9).',
        10: 'Cemitério esquecido coberto de névoa. Forte aura necrótica.',
        11: 'A Árvore dos Enforcados. Má presença constante (Aura persistente).',
        12: 'Portal de pedra desativado que brilha levemente em noites de lua cheia.'
    },
    4: { // Sorte / Azar
        2: 'Baú de ferro enterrado sob raízes (Percepção CD 9; contém 2d6x10 Dinheiros).',
        3: 'Orvalho de flores raras que cura 2d6 PV se aplicado imediatamente.',
        4: 'Fruto elemental delicioso que concede +1d no próximo teste físico.',
        5: 'Madeira de lei perfeita para a construção. Levar a Deneb dá +1 Recursos.',
        6: 'Caça farta no local. Rende rações extras abundantes para o grupo.',
        7: 'Colmena de abelhas híbridas com mel que neutraliza toxinas.',
        8: 'Cogumelos cintilantes úteis para alquimia (Natureza CD 7 para colher).',
        9: 'Pele de urso intacta deixada para trás por caçadores rivais.',
        10: 'Bolha de gás inflamável! Tochas acesas na área causam explosão pequena.',
        11: 'Lajes de pedra solta (Acrobacia CD 8 para evitar queda e dano contuso).',
        12: 'Névoa gélida que impede o descanso restaurador (Cansado por 1 dia).'
    },
    5: { // Pistas
        2: 'Rastro de garras gigantescas a 3 metros de altura num tronco de árvore.',
        3: 'Símbolo militar de Florensa esculpido secretamente numa rocha.',
        4: 'Bilhete rasgado escrito em código cifrado florenino.',
        5: 'Pena azulada gigantesca que exala cheiro a tempestade de trovões.',
        6: 'Fogueira apagada há poucas horas com cinzas ainda mornas.',
        7: 'Ponta de seta de aço negro cravada no crânio de uma criatura elemental.',
        8: 'Diário de bordo de uma patrulha que desapareceu há dez anos.',
        9: 'Estátua partida de uma divindade esquecida que parece chorar se tocada.',
        10: 'Pingente de prata gravado com o nome de um colono ativo em Deneb.',
        11: 'Voz sussurrada pelo vento indicando o caminho para o esconderijo de Florensa.',
        12: 'Visão espiritual rápida que revela a localização exata do próximo perigo.'
    }
};

export default function App() {
    // --- ESTADO GLOBAL DA CAMPANHA ---
    const [attributes, setAttributes] = useState(INITIAL_ATTRIBUTES);
    const [day, setDay] = useState(1);
    const [completedMissions, setCompletedMissions] = useState(['m_infiltrados_stub']); // stub para controle
    const [failedMissions, setFailedMissions] = useState([]);
    const [logs, setLogs] = useState([
        'Dia 1: Chegada das caravanas a Deneb. Greta Alvras Mathes assume como supervisora provisória.',
        'ALERTA: Trabalhadores foram atacados pela Serpente Rainha a leste! Elara precisa de ingredientes de veneno.'
    ]);
    const [activeTab, setActiveTab] = useState('painel');

    // --- ESTADO DO SIMULADOR DE DADOS ---
    const [conjunto, setConjunto] = useState(2);
    const [diceRolls, setDiceRolls] = useState([]);
    const [diceTotal, setDiceTotal] = useState(null);

    // --- ESTADO DO GERADOR DE EVENTOS ---
    const [terrainType, setTerrainType] = useState('comum');
    const [eventResult, setEventResult] = useState(null);

    // --- ESTADO DO BESTIÁRIO & COMBATE ---
    const [searchMonster, setSearchMonster] = useState('');
    const [combatants, setCombatants] = useState([]);

    // --- ESTADO DO NOTIFICADOR INTERNO ---
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    // --- ALTERAR ATRIBUTO MANUALMENTE ---
    const updateAttribute = (attr, val) => {
        setAttributes(prev => {
            const nextVal = Math.max(0, prev[attr] + val);
            if (nextVal === 0) {
                showNotification(`PERIGO: Atributo ${ATTRIBUTE_METADATA[attr].name} chegou a zero! CATÁSTROFE ATIVADA: ${ATTRIBUTE_METADATA[attr].catastrafe}`, 'danger');
            }
            return { ...prev, [attr]: nextVal };
        });
    };

    // --- AVANÇAR O DIA ---
    const handleAdvanceDay = () => {
        const nextDay = day + 1;
        setDay(nextDay);

        // Verificação de prazos ativos e avisos
        const systemLogs = [`Avançou para o Dia ${nextDay} da colonização.`];

        // Avisar prazos em risco
        const activeDeadlines = MISSIONS.filter(m =>
            !completedMissions.includes(m.id) &&
            !failedMissions.includes(m.id) &&
            m.deadline === nextDay
        );

        activeDeadlines.forEach(m => {
            systemLogs.push(`ATENÇÃO: A missão "${m.name}" atingiu o limite de tempo no Dia ${nextDay}!`);
            showNotification(`Prazo esgotado para a missão: "${m.name}"`, 'warning');
        });

        setLogs(prev => [...systemLogs, ...prev]);
    };

    // --- MARCAR MISSÃO COMO RESOLVIDA ---
    const handleCompleteMission = (m) => {
        if (completedMissions.includes(m.id)) return;

        setCompletedMissions(prev => [...prev, m.id]);
        setFailedMissions(prev => prev.filter(id => id !== m.id));

        // Aplicar recompensas
        Object.entries(m.rewards).forEach(([attr, val]) => {
            updateAttribute(attr, val);
        });

        const msg = `Missão resolvida com sucesso: "${m.name}". Recompensas aplicadas ao assentamento.`;
        setLogs(prev => [msg, ...prev]);
        showNotification(msg, 'success');
    };

    // --- MARCAR MISSÃO COMO FALHADA ---
    const handleFailMission = (m) => {
        if (failedMissions.includes(m.id)) return;

        setFailedMissions(prev => [...prev, m.id]);
        setCompletedMissions(prev => prev.filter(id => id !== m.id));

        // Aplicar penalidades
        Object.entries(m.penalties).forEach(([attr, val]) => {
            updateAttribute(attr, val);
        });

        const msg = `CONSEQUÊNCIA: A missão "${m.name}" foi dada como falhada/esgotada. Consequência: ${m.consequenceDesc}`;
        setLogs(prev => [msg, ...prev]);
        showNotification(`Missão falhada: ${m.name}`, 'danger');
    };

    // --- RESETAR JOGO ---
    const handleReset = () => {
        setAttributes(INITIAL_ATTRIBUTES);
        setDay(1);
        setCompletedMissions([]);
        setFailedMissions([]);
        setEventResult(null);
        setCombatants([]);
        setLogs([
            'Dia 1: Chegada das caravanas a Deneb. Greta Alvras Mathes assume como supervisora provisória.',
            'ALERTA: Trabalhadores foram atacados pela Serpente Rainha a leste! Elara precisa de ingredientes de veneno.'
        ]);
        showNotification('Painel de controle de Deneb reiniciado!', 'info');
    };

    // --- ROLAR DADOS DO ANIMUS ---
    const rollAnimusDice = () => {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const rawTotal = d1 + d2;
        const finalTotal = rawTotal + conjunto;

        let label = 'Fácil (CD 6)';
        let color = 'text-gray-400';
        if (finalTotal >= 13) {
            label = 'ÉPICO (CD 13+)';
            color = 'text-indigo-400';
        } else if (finalTotal >= 10) {
            label = 'DIFÍCIL (CD 10-12)';
            color = 'text-red-400';
        } else if (finalTotal >= 7) {
            label = 'NORMAL (CD 7-9)';
            color = 'text-emerald-400';
        } else {
            label = 'FÁCIL (CD 3-6)';
            color = 'text-amber-400';
        }

        if (d1 === 6 && d2 === 6) {
            label = 'CRÍTICO! DUPLO 6';
            color = 'text-purple-400 font-bold animate-pulse';
        }

        setDiceRolls([d1, d2]);
        setDiceTotal({ total: finalTotal, raw: rawTotal, label, color });
    };

    // --- GERADOR DE EVENTOS ALEATÓRIOS ---
    const generateRandomEvent = () => {
        // 1d6 para verificar ocorrência
        const triggerRoll = Math.floor(Math.random() * 6) + 1;
        let threshold = 3; // comum
        if (terrainType === 'seguro') threshold = 2;
        if (terrainType === 'perigoso') threshold = 4;
        if (terrainType === 'hostil') threshold = 5;

        const eventTriggered = triggerRoll <= threshold;

        if (!eventTriggered) {
            setEventResult({
                triggered: false,
                roll: triggerRoll,
                threshold,
                text: 'Nenhum evento incomum detetado nesta área. A jornada segue com segurança.'
            });
            return;
        }

        // Role Categoria (1 a 5)
        const categoryRoll = Math.floor(Math.random() * 5) + 1;
        // Role 2d6 para evento específico (2 a 12)
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const subRoll = d1 + d2;

        const categoryMeta = EVENT_CATEGORIES[categoryRoll];
        const eventText = RANDOM_EVENTS[categoryRoll][subRoll] || 'Nativo de passagem com novidades.';

        setEventResult({
            triggered: true,
            roll: triggerRoll,
            threshold,
            categoryRoll,
            subRoll,
            categoryName: categoryMeta.name,
            categoryColor: categoryMeta.color,
            text: eventText
        });

        setLogs(prev => [`Evento Gerado: [${categoryMeta.name}] ${eventText}`, ...prev]);
    };

    // --- CONTROLADOR DE INIMIGOS NO COMBATE ---
    const addMonsterToCombat = (monster) => {
        const newCombatant = {
            ...monster,
            uniqueId: Date.now() + Math.random(),
            currentPv: monster.pv
        };
        setCombatants(prev => [...prev, newCombatant]);
        showNotification(`${monster.name} adicionado ao combate!`, 'info');
    };

    const updateCombatantPv = (uniqueId, change) => {
        setCombatants(prev => prev.map(c => {
            if (c.uniqueId === uniqueId) {
                const nextPv = Math.min(c.pv, Math.max(0, c.currentPv + change));
                return { ...c, currentPv: nextPv };
            }
            return c;
        }));
    };

    const removeCombatant = (uniqueId) => {
        setCombatants(prev => prev.filter(c => c.uniqueId !== uniqueId));
    };

    return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-800">

            {/* --- CABEÇALHO --- */}
            <header className="border-b border-stone-800 bg-stone-900/80 backdrop-blur sticky top-0 z-30 px-4 py-3 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-900/50 rounded-lg border border-emerald-700">
                        <Compass className="w-6 h-6 text-emerald-400 animate-spin-slow" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-stone-100">DENEB: Marcha para o Oeste</h1>
                        <p className="text-xs text-stone-400">Companion App Oficial de Campanha | Animus RPG 2d6</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-semibold">Dia {day} da Colonização</span>
                    </div>
                    <button
                        onClick={handleAdvanceDay}
                        className="bg-emerald-700 hover:bg-emerald-650 text-white font-medium text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-md shadow-emerald-950/20"
                    >
                        Avançar Dia
                        <Plus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleReset}
                        title="Resetar Painel"
                        className="p-1.5 bg-stone-800 hover:bg-stone-750 text-stone-300 rounded-lg transition-colors border border-stone-750"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* --- NOTIFICAÇÃO FLUTUANTE --- */}
            {notification && (
                <div className={`fixed top-16 right-4 z-50 max-w-md p-4 rounded-xl shadow-2xl border flex items-start gap-3 animate-fade-in-down ${notification.type === 'success' ? 'bg-emerald-900/90 border-emerald-700 text-emerald-100' :
                        notification.type === 'danger' ? 'bg-rose-900/90 border-rose-700 text-rose-100' :
                            notification.type === 'warning' ? 'bg-amber-900/90 border-amber-700 text-amber-100' :
                                'bg-stone-900/95 border-stone-700 text-stone-100'
                    }`}>
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium">{notification.message}</p>
                    </div>
                </div>
            )}

            <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* --- COLUNA ESQUERDA: ATRIBUTOS DE DENEB --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 space-y-4">
                        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                            <h2 className="font-semibold text-stone-200 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                Status de Deneb
                            </h2>
                            <span className="text-xs text-stone-400">CD de Perigo CD 6</span>
                        </div>

                        <div className="space-y-4">
                            {Object.entries(attributes).map(([key, value]) => {
                                const meta = ATTRIBUTE_METADATA[key];
                                const Icon = meta.icon;
                                return (
                                    <div key={key} className={`p-3 rounded-xl border ${meta.bg} ${meta.border} transition-all`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2">
                                                <Icon className={`w-4 h-4 ${meta.color}`} />
                                                <span className="text-sm font-medium text-stone-200">{meta.name}</span>
                                            </div>
                                            <span className="text-lg font-bold text-white">{value}</span>
                                        </div>

                                        <div className="w-full bg-stone-950 rounded-full h-1.5 mb-2 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${value >= 4 ? 'bg-emerald-500' : value >= 2 ? 'bg-amber-500' : 'bg-rose-500'
                                                    }`}
                                                style={{ width: `${Math.min(100, (value / 5) * 100)}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-stone-400 italic">
                                                {value === 0 ? `Catástrofe: ${meta.catastrafe}` : 'Estável'}
                                            </span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => updateAttribute(key, -1)}
                                                    className="p-1 bg-stone-950 hover:bg-stone-800 rounded text-stone-400 hover:text-white transition-colors border border-stone-800"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => updateAttribute(key, 1)}
                                                    className="p-1 bg-stone-950 hover:bg-stone-800 rounded text-stone-400 hover:text-white transition-colors border border-stone-800"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- ROLADOR DE DADOS DO ANIMUS --- */}
                    <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 space-y-4">
                        <h3 className="font-semibold text-stone-200 flex items-center gap-2 border-b border-stone-800 pb-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            Rolador de Testes (Animus)
                        </h3>
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <label className="text-xs text-stone-400 block mb-1">Bónus do Conjunto</label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setConjunto(p => Math.max(0, p - 1))}
                                        className="p-1.5 bg-stone-800 rounded hover:bg-stone-750"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-lg font-bold w-6 text-center">+{conjunto}</span>
                                    <button
                                        onClick={() => setConjunto(p => p + 1)}
                                        className="p-1.5 bg-stone-800 rounded hover:bg-stone-750"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={rollAnimusDice}
                                className="bg-emerald-700 hover:bg-emerald-600 text-white p-3 rounded-xl shadow font-semibold transition-all flex flex-col items-center justify-center shrink-0 w-24 h-16"
                            >
                                <span className="text-xs uppercase font-medium">Rolar Teste</span>
                                <span className="text-sm">2d6+{conjunto}</span>
                            </button>
                        </div>

                        {diceTotal && (
                            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-center space-y-1">
                                <div className="text-xs text-stone-400">
                                    Valores obtidos: {diceRolls[0]} + {diceRolls[1]} (Soma {diceTotal.raw}) + {conjunto}
                                </div>
                                <div className="text-3xl font-extrabold text-white">
                                    Total: {diceTotal.total}
                                </div>
                                <div className={`text-sm font-semibold uppercase tracking-wider ${diceTotal.color}`}>
                                    {diceTotal.label}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- COLUNA PRINCIPAL: TABS INTERATIVAS --- */}
                <div className="lg:col-span-3 space-y-6">

                    {/* --- SELETOR DE ATIVIDADES --- */}
                    <nav className="flex flex-wrap gap-2 border-b border-stone-800 pb-2">
                        <button
                            onClick={() => setActiveTab('painel')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'painel' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-stone-400 hover:text-stone-200'
                                }`}
                        >
                            <Compass className="w-4 h-4" />
                            Diário & Emergência
                        </button>
                        <button
                            onClick={() => setActiveTab('missoes')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'missoes' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-stone-400 hover:text-stone-200'
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            Directório de Missões
                        </button>
                        <button
                            onClick={() => setActiveTab('bestiario')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'bestiario' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-stone-400 hover:text-stone-200'
                                }`}
                        >
                            <Skull className="w-4 h-4" />
                            Bestiário & Combate
                        </button>
                        <button
                            onClick={() => setActiveTab('eventos')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'eventos' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-stone-400 hover:text-stone-200'
                                }`}
                        >
                            <Compass className="w-4 h-4" />
                            Viagens & Eventos
                        </button>
                    </nav>

                    {/* --- TAB 1: PAINEL DIÁRIO & EMERGÊNCIA --- */}
                    {activeTab === 'painel' && (
                        <div className="space-y-6">

                            {/* ALERTA DE EMERGÊNCIA ESPECIAL (ELARA/SERPENTE REINHA) */}
                            <div className="bg-gradient-to-r from-emerald-950/80 to-stone-900 p-6 rounded-2xl border border-emerald-800/60 shadow-lg space-y-4">
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <span className="px-2.5 py-1 bg-emerald-900/50 text-emerald-400 border border-emerald-700 text-[10px] rounded-full uppercase tracking-wider font-semibold">
                                            Missão de Emergência Ativa
                                        </span>
                                        <h3 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                                            <Volume2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                                            O Ataque da Serpente Rainha (Antídotos)
                                        </h3>
                                    </div>
                                    <div className="bg-stone-950 px-3 py-1 rounded-lg border border-stone-800 text-xs">
                                        <span className="text-stone-400">Prazo crítico:</span> <strong className="text-rose-400">Dia 6</strong>
                                    </div>
                                </div>

                                <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-850 space-y-3">
                                    <p className="text-sm text-stone-300">
                                        A supervisora Greta Falko e a alquimista Elara Souza precisam urgentemente que os pioneiros tragam ingredientes de veneno da floresta leste antes que a febre consuma os trabalhadores picados na enfermaria.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                        <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800">
                                            <span className="text-stone-400 block mb-0.5">Se concluído a tempo:</span>
                                            <strong className="text-emerald-400">+1 Moral, enfermaria esvazia, antídotos garantidos</strong>
                                        </div>
                                        <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800">
                                            <span className="text-stone-400 block mb-0.5">Se falhar ou passar o Dia 6:</span>
                                            <strong className="text-rose-400">-1 Alimentação, -1 Moral, colono morre (perdas humanas)</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        onClick={() => handleFailMission(MISSIONS.find(m => m.id === 'm_venenos'))}
                                        className="px-4 py-2 bg-rose-900/40 border border-rose-800/80 hover:bg-rose-900/60 text-rose-300 rounded-xl text-xs font-semibold transition-colors"
                                    >
                                        Marcar Falha (Consequência)
                                    </button>
                                    <button
                                        onClick={() => handleCompleteMission(MISSIONS.find(m => m.id === 'm_venenos'))}
                                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-650 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                                    >
                                        <Check className="w-4 h-4" /> Marcar Conclusão (Sucesso)
                                    </button>
                                </div>
                            </div>

                            {/* CONTEÚDO AUXILIAR DO PAINEL */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* CALENDÁRIO DE PRAZOS */}
                                <div className="md:col-span-1 bg-stone-900/40 p-5 rounded-2xl border border-stone-800 space-y-4">
                                    <h4 className="font-semibold text-stone-200 flex items-center gap-2 border-b border-stone-800 pb-2 text-sm">
                                        <Calendar className="w-4 h-4 text-emerald-400" />
                                        Cronograma de Limites
                                    </h4>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                        {MISSIONS.filter(m => m.deadline !== 99).map(m => {
                                            const isCompleted = completedMissions.includes(m.id);
                                            const isFailed = failedMissions.includes(m.id);
                                            const isLate = day > m.deadline;

                                            return (
                                                <div
                                                    key={m.id}
                                                    className={`p-2.5 rounded-lg border text-xs flex justify-between items-center ${isCompleted ? 'bg-emerald-950/20 border-emerald-900 text-emerald-400' :
                                                            isFailed ? 'bg-rose-950/20 border-rose-900 text-rose-400' :
                                                                isLate ? 'bg-amber-950/20 border-amber-900 text-amber-400' :
                                                                    'bg-stone-950 border-stone-850'
                                                        }`}
                                                >
                                                    <div>
                                                        <p className="font-semibold truncate max-w-[120px]">{m.name}</p>
                                                        <span className="text-[10px] text-stone-400">Limite: Dia {m.deadline}</span>
                                                    </div>
                                                    <div>
                                                        {isCompleted && <span className="text-[10px] uppercase font-bold text-emerald-400">Concluído</span>}
                                                        {isFailed && <span className="text-[10px] uppercase font-bold text-rose-400">Falhado</span>}
                                                        {!isCompleted && !isFailed && isLate && <span className="text-[10px] uppercase font-bold text-rose-400 animate-pulse">Atrasado</span>}
                                                        {!isCompleted && !isFailed && !isLate && <span className="text-[10px] text-stone-400">Pendente</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* DIÁRIO DA COLONIZAÇÃO */}
                                <div className="md:col-span-2 bg-stone-900/40 p-5 rounded-2xl border border-stone-800 space-y-4 flex flex-col h-[380px]">
                                    <h4 className="font-semibold text-stone-200 flex items-center gap-2 border-b border-stone-800 pb-2 text-sm">
                                        <BookOpen className="w-4 h-4 text-emerald-400" />
                                        Diário de Bordo de Deneb
                                    </h4>
                                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 font-mono text-xs">
                                        {logs.map((log, i) => (
                                            <div key={i} className="p-2 bg-stone-950 rounded border border-stone-850 text-stone-300">
                                                {log}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* --- TAB 2: DIRECTÓRIO DE MISSÕES --- */}
                    {activeTab === 'missoes' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-stone-200">Missões de Marcha para o Oeste</h3>
                                <span className="text-xs text-stone-400">Total: {MISSIONS.length} missões catalogadas</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {MISSIONS.map(m => {
                                    const isCompleted = completedMissions.includes(m.id);
                                    const isFailed = failedMissions.includes(m.id);

                                    return (
                                        <div
                                            key={m.id}
                                            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${isCompleted ? 'bg-emerald-950/20 border-emerald-800/80 shadow-md shadow-emerald-950/20' :
                                                    isFailed ? 'bg-rose-950/20 border-rose-900' :
                                                        'bg-stone-900/40 border-stone-800 hover:border-stone-750'
                                                }`}
                                        >
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div>
                                                        <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">{m.npc}</span>
                                                        <h4 className="text-md font-bold text-white mt-0.5">{m.name}</h4>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span className="px-2 py-0.5 bg-stone-950 text-stone-400 rounded-md text-[10px] border border-stone-800">
                                                            ND {m.nd}
                                                        </span>
                                                        {m.deadline !== 99 && (
                                                            <span className="px-2 py-0.5 bg-stone-950 text-stone-400 rounded-md text-[10px] border border-stone-800">
                                                                Limite: Dia {m.deadline}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-xs text-stone-300 leading-relaxed">{m.desc}</p>

                                                <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-950 p-2 rounded-xl border border-stone-850">
                                                    <div>
                                                        <span className="text-stone-400 block">Recompensas:</span>
                                                        <span className="text-emerald-400 font-medium">
                                                            {Object.entries(m.rewards).map(([attr, val]) => `+${val} ${ATTRIBUTE_METADATA[attr].name}`).join(', ')}
                                                        </span>
                                                    </div>
                                                    {m.deadline !== 99 && (
                                                        <div>
                                                            <span className="text-stone-400 block">Penalidade de Limite:</span>
                                                            <span className="text-rose-400 font-medium">
                                                                {Object.entries(m.penalties).map(([attr, val]) => `${val} ${ATTRIBUTE_METADATA[attr].name}`).join(', ') || 'Sem impactos directos'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 pt-4 border-t border-stone-800/60 mt-4">
                                                {!isCompleted && !isFailed ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleFailMission(m)}
                                                            className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 rounded-lg text-xs font-semibold border border-rose-900/60 transition-colors"
                                                        >
                                                            Dar como Falhada
                                                        </button>
                                                        <button
                                                            onClick={() => handleCompleteMission(m)}
                                                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-650 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow"
                                                        >
                                                            <Check className="w-3 h-3" /> Completar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setCompletedMissions(prev => prev.filter(id => id !== m.id));
                                                            setFailedMissions(prev => prev.filter(id => id !== m.id));
                                                            showNotification(`Missão "${m.name}" colocada como pendente.`, 'info');
                                                        }}
                                                        className="text-xs text-stone-400 hover:text-white underline"
                                                    >
                                                        Redefinir Estado
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* --- TAB 3: BESTIÁRIO & COMBATE --- */}
                    {activeTab === 'bestiario' && (
                        <div className="space-y-6">

                            {/* INTERFACE DE COMBATE ATIVO */}
                            <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 space-y-4">
                                <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                                    <h3 className="font-bold text-stone-200 flex items-center gap-2">
                                        <Skull className="w-5 h-5 text-rose-400 animate-pulse" />
                                        Mesa de Combate Ativa (GM)
                                    </h3>
                                    <button
                                        onClick={() => setCombatants([])}
                                        className="text-xs text-rose-400 hover:underline"
                                    >
                                        Limpar Combate
                                    </button>
                                </div>

                                {combatants.length === 0 ? (
                                    <p className="text-sm text-stone-400 text-center py-6 italic">
                                        Nenhuma criatura activa no combate. Adicione monstros usando o directório abaixo para monitorizar os Pontos de Vida (PV) em combate.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {combatants.map(c => {
                                            const percentage = (c.currentPv / c.pv) * 100;
                                            return (
                                                <div key={c.uniqueId} className="p-4 bg-stone-950 rounded-xl border border-stone-800 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-stone-200">{c.name}</h4>
                                                            <span className="text-[10px] text-stone-400">ND {c.nd} | {c.type}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => removeCombatant(c.uniqueId)}
                                                            className="text-stone-400 hover:text-rose-400 text-xs"
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>

                                                    <div className="space-y-1.5 my-3">
                                                        <div className="flex justify-between text-xs font-semibold">
                                                            <span>PV: {c.currentPv} / {c.pv}</span>
                                                            <span className="text-stone-400">PE: {c.pe}</span>
                                                        </div>
                                                        <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden border border-stone-800">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${percentage >= 50 ? 'bg-emerald-500' : percentage >= 20 ? 'bg-amber-500' : 'bg-rose-500'
                                                                    }`}
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => updateCombatantPv(c.uniqueId, -5)}
                                                                className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded text-xs border border-stone-800"
                                                            >
                                                                -5
                                                            </button>
                                                            <button
                                                                onClick={() => updateCombatantPv(c.uniqueId, -1)}
                                                                className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded text-xs border border-stone-800"
                                                            >
                                                                -1
                                                            </button>
                                                            <button
                                                                onClick={() => updateCombatantPv(c.uniqueId, 1)}
                                                                className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded text-xs border border-stone-800"
                                                            >
                                                                +1
                                                            </button>
                                                            <button
                                                                onClick={() => updateCombatantPv(c.uniqueId, 5)}
                                                                className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded text-xs border border-stone-800"
                                                            >
                                                                +5
                                                            </button>
                                                        </div>
                                                        <span className="text-[10px] text-stone-400">Ações/Turno: {c.pa} PA</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* DIRECTÓRIO DE MONSTROS COMPLETO */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                    <h3 className="text-lg font-bold text-stone-200">Bestiário de Marcha para o Oeste</h3>
                                    <div className="relative w-full max-w-xs">
                                        <input
                                            type="text"
                                            placeholder="Pesquisar criatura..."
                                            value={searchMonster}
                                            onChange={e => setSearchMonster(e.target.value)}
                                            className="w-full bg-stone-950 border border-stone-800 hover:border-stone-750 focus:border-emerald-700 rounded-xl px-4 py-2 text-sm text-stone-100 placeholder-stone-450 outline-none"
                                        />
                                        <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {MONSTERS.filter(m => m.name.toLowerCase().includes(searchMonster.toLowerCase())).map(m => (
                                        <div key={m.id} className="p-5 bg-stone-900/40 rounded-2xl border border-stone-800 flex flex-col justify-between">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-start gap-2 border-b border-stone-800 pb-2">
                                                    <div>
                                                        <h4 className="font-bold text-stone-100">{m.name}</h4>
                                                        <span className="text-[10px] text-stone-400">{m.type} | ND {m.nd} ({m.classification})</span>
                                                    </div>
                                                    <span className="px-2 py-1 bg-stone-950 text-[10px] text-stone-300 border border-stone-850 rounded">
                                                        {m.pv} PV | {m.pe} PE
                                                    </span>
                                                </div>

                                                <p className="text-xs text-stone-300 italic">{m.ecologia}</p>

                                                <div className="text-xs space-y-1">
                                                    <p><strong className="text-stone-400">Ataque Base:</strong> <span className="text-emerald-400">{m.attack} ({m.dano})</span></p>
                                                    <p><strong className="text-stone-400">Fraquezas:</strong> <span className="text-amber-400">{m.fraquezas}</span></p>
                                                </div>

                                                <div className="space-y-1 pt-2">
                                                    <strong className="text-xs text-stone-400 block">Habilidades Especiais:</strong>
                                                    {m.habilidades.map((h, idx) => (
                                                        <div key={idx} className="p-2 bg-stone-950 rounded-lg border border-stone-850 text-[11px]">
                                                            <span className="text-emerald-400 font-semibold">{h.name}: </span>
                                                            <span className="text-stone-300">{h.desc}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4 mt-4 border-t border-stone-800/60">
                                                <button
                                                    onClick={() => addMonsterToCombat(m)}
                                                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-650 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> Adicionar ao Combate
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* --- TAB 4: VIAGEM E EVENTOS --- */}
                    {activeTab === 'eventos' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* CALCULADOR DE JORNADA */}
                            <div className="bg-stone-900/40 p-5 rounded-2xl border border-stone-800 space-y-4">
                                <h3 className="font-bold text-stone-200 flex items-center gap-2 border-b border-stone-800 pb-2">
                                    <Compass className="w-5 h-5 text-emerald-400" />
                                    Calculador de Viagem (Hexágonos)
                                </h3>
                                <div className="space-y-3 text-xs">
                                    <p className="text-stone-300 leading-relaxed">
                                        Deneb fica no centro do mapa explorado. Cada hexágono representa aproximadamente 6 km (algumas horas de caminhada). Use esta ferramenta para calcular o tempo da jornada.
                                    </p>

                                    <div className="space-y-2">
                                        <label className="text-xs text-stone-400 block">Selecione a Dificuldade do Terreno</label>
                                        <select
                                            value={terrainType}
                                            onChange={e => setTerrainType(e.target.value)}
                                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-200 outline-none"
                                        >
                                            <option value="seguro">Terreno Seguro (Planícies de Deneb) - Evento 2 em 1d6</option>
                                            <option value="comum">Terreno Comum (Florestas/Colinas) - Evento 3 em 1d6</option>
                                            <option value="perigoso">Terreno Perigoso (Pântano/Montanha) - Evento 4 em 1d6</option>
                                            <option value="hostil">Terreno Hostil (Ninhos de Feras) - Evento 5 em 1d6</option>
                                        </select>
                                    </div>

                                    <div className="p-3 bg-stone-950 rounded-xl border border-stone-850 space-y-1">
                                        <span className="text-stone-400 font-semibold block uppercase text-[10px] tracking-wider">Tabela de Velocidade de Viagem:</span>
                                        <ul className="space-y-1 text-[11px] text-stone-300 list-disc pl-4">
                                            <li><strong>Terreno Seguro:</strong> ½ dia de viagem</li>
                                            <li><strong>Terreno Comum:</strong> 1 dia de viagem</li>
                                            <li><strong>Terreno Perigoso:</strong> 2 dias de viagem</li>
                                            <li><strong>Viagem Noturna:</strong> Adiciona +½ dia de viagem e aumenta o risco de eventos de combate.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* GERADOR DE EVENTOS ALEATÓRIOS */}
                            <div className="bg-stone-900/40 p-5 rounded-2xl border border-stone-800 space-y-4">
                                <h3 className="font-bold text-stone-200 flex items-center gap-2 border-b border-stone-800 pb-2">
                                    <Sparkles className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                                    Gerador de Encontros por Hexágono
                                </h3>
                                <div className="space-y-3">
                                    <p className="text-xs text-stone-300">
                                        Ao cruzar um novo hexágono de terreno <strong>{terrainType.toUpperCase()}</strong>, role a probabilidade do encontro.
                                    </p>

                                    <button
                                        onClick={generateRandomEvent}
                                        className="w-full py-3 bg-emerald-700 hover:bg-emerald-650 text-white font-semibold rounded-xl text-sm transition-colors shadow-md shadow-emerald-900/20"
                                    >
                                        Gerar Evento para este Hexágono
                                    </button>

                                    {eventResult && (
                                        <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
                                            <div className="flex justify-between items-center border-b border-stone-800 pb-2 text-xs">
                                                <span className="text-stone-400">Rolagem 1d6: <strong>{eventResult.roll}</strong> (CD &lt;= {eventResult.threshold})</span>
                                                <span className={`font-semibold uppercase tracking-wider ${eventResult.triggered ? 'text-emerald-400 animate-pulse' : 'text-stone-400'}`}>
                                                    {eventResult.triggered ? 'EVENTO DISPARADO!' : 'ZONA SEGURA'}
                                                </span>
                                            </div>

                                            {eventResult.triggered ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded bg-stone-900 border border-stone-800 ${eventResult.categoryColor}`}>
                                                            Categoria: {eventResult.categoryName}
                                                        </span>
                                                        <span className="text-[10px] text-stone-400">Rolagem 2d6: {eventResult.subRoll}</span>
                                                    </div>
                                                    <p className="text-sm text-stone-200 font-medium italic leading-relaxed">
                                                        "{eventResult.text}"
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-stone-400 italic">
                                                    {eventResult.text}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}

                </div>

            </div>

            {/* --- RODAPÉ INFORMATIVO --- */}
            <footer className="border-t border-stone-850 bg-stone-950/90 py-4 px-4 text-center text-xs text-stone-500 mt-auto">
                <p>Mundo de Celeste • Marcha para o Oeste • Sistema Animus RPG vBeta</p>
                <p className="text-[10px] mt-1 text-stone-600">Desenvolvido em exclusivo para a tua mesa de RPG de mesa de exploração hexagonal.</p>
            </footer>

        </div>
    );
}