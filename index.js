import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Inicializa Gemini com a chave
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
  },
];

// 🔹 Endpoint de busca
app.post("/buscar", (req, res) => {
  const { termo = "" } = req.body || {};
  const termoNorm = termo.toLowerCase();
  const data = MOCK.filter(
    (x) => x.termo.includes(termoNorm) || termoNorm === ""
  );
  res.json({ resultados: data });
});

// 🔹 Endpoint de análise com IA Gemini
app.post("/analise", async (req, res) => {
  try {
    const { textos = [] } = req.body || {};

    const prompt = `
Analise os seguintes textos de anúncios e responda de forma clara:
1️⃣ Quais gatilhos mentais aparecem (ex: urgência, autoridade, prova social)?
2️⃣ Quais padrões em comum você nota?
3️⃣ Quais melhorias poderiam aumentar conversão?

Textos:
${textos.join("\n\n")}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const resposta =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não foi possível gerar análise no momento.";

    res.json({ resumo: resposta });
  } catch (error) {
    console.error("Erro ao gerar análise IA:", error);
    res
      .status(500)
      .json({ resumo: "❌ Erro ao processar análise com a IA (Gemini)." });
  }
});

// 🔹 Inicialização
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`✅ TrendSpy API rodando na porta ${PORT}`)
);
