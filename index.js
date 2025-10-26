import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Dados simulados (mock)
const MOCK = [
  {
    id: "ad_1",
    plataforma: "Meta",
    termo: "emagrecimento",
    produto: "Cápsulas Fit X",
    imagem: "https://via.placeholder.com/300x200?text=Produto",
    anunciosAtivos: 27,
    primeiraAparicao: "2025-09-18",
    ultimaAparicao: "2025-10-22",
    textoAnuncio: "Perda de peso sem loucuras. 3 cápsulas/dia.",
    linkOrigem: "https://facebook.com/ads/library",
  },
  {
    id: "ad_2",
    plataforma: "Shopee",
    termo: "emagrecimento",
    produto: "Cinta Modeladora Pro",
    imagem: "https://via.placeholder.com/300x200?text=Cinta",
    anunciosAtivos: 14,
    primeiraAparicao: "2025-10-01",
    ultimaAparicao: "2025-10-23",
    textoAnuncio: "Modelagem imediata. Frete grátis hoje.",
    linkOrigem: "https://shopee.com.br",
  }
];

// 🔹 Endpoint de busca
app.post("/buscar", (req, res) => {
  const { termo = "" } = req.body || {};
  const termoNorm = termo.toLowerCase();
  const data = MOCK.filter(x => x.termo.includes(termoNorm) || termoNorm === "");
  res.json({ resultados: data });
});
// 🔹 Endpoint de análise (simulado por enquanto)
app.post("/analise", (req, res) => {
  const { textos = [] } = req.body || {};
  const resumo = `
Padrões detectados:
• Promessa rápida + benefício direto.
• Preço abaixo de R$100 e frete grátis.
• Criativos com antes/depois e foco no corpo.

Sugestões:
• Use gancho emocional no 1º segundo.
• CTA com urgência ("Hoje", "Últimas unidades").
  `.trim();
  res.json({ resumo });
});


// 🔹 Inicialização
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ TrendSpy API rodando na porta ${PORT}`));
