export const extraWeapons = [
  {
    id: "mw_prototype_1",
    name: "Protótipo de Arma (Engenheiro I)",
    mount: "Main",
    type: "Experimental",
    damage: [
      {
        type: "Cinético/Explosivo/Energético",
        val: "1d6+2"
      }
    ],
    range: [
      {
        type: "Ameaça",
        val: 1
      },
      {
        type: "Alcance",
        val: 10
      }
    ],
    tags: [
      {
        id: "tg_limited",
        val: "1d6+2"
      }
    ],
    description: "Esta arma é um protótipo experimental, personalizado de acordo com as suas necessidades específicas. Ao instalar ou durante um Reparo Completo, você pode escolher um novo tipo de arma, tipo de dano e Ameaça 1 (armas do tipo corpo a corpo) ou Alcance 10 (todos os outros tipos). Além disso, sempre que executar um Reparo Completo, role novamente 1d6+2 para determinar os usos de Limitado desta arma. Esta arma conta como um encaixe integrado e não requer um encaixe.",
    source: "Talento",
    license: "Engenheiro",
    license_level: 1,
    integrated: true
  },
  {
    id: "mw_prototype_2",
    name: "Protótipo de Arma (Engenheiro II)",
    mount: "Main",
    type: "Experimental",
    damage: [
      {
        type: "Cinético/Explosivo/Energético",
        val: "1d6+2"
      }
    ],
    range: [
      {
        type: "Ameaça",
        val: 1
      },
      {
        type: "Alcance",
        val: 10
      }
    ],
    tags: [
      {
        id: "tg_limited",
        val: "1d6+2"
      }
    ],
    description: "Você pode ajustar os componentes essenciais do seu protótipo de arma para aumentar sua eficácia. Ao realizar um Reparo Completo, escolha dois: Ótica Ajustada (+1 de Precisão), Computador Ajustado (Inteligente), ou Proteção do Reator Removida (Ataque em Área).",
    source: "Talento",
    license: "Engenheiro",
    license_level: 2,
    integrated: true
  },
  {
    id: "mw_prototype_3",
    name: "Protótipo de Arma (Engenheiro III)",
    mount: "Main",
    type: "Experimental",
    damage: [
      {
        type: "Cinético/Explosivo/Energético",
        val: "1d6+4"
      }
    ],
    range: [
      {
        type: "Ameaça",
        val: 1
      },
      {
        type: "Alcance",
        val: 10
      }
    ],
    tags: [
      {
        id: "tg_limited",
        val: "2d6"
      }
    ],
    description: "Seu protótipo de arma agora é Limitado [2d6] e causa 1d6+4 de dano.",
    source: "Talento",
    license: "Engenheiro",
    license_level: 3,
    integrated: true
  }
];
