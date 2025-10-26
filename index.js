import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Inicializa o cliente da OpenAI (Render lê a variável OPENAI_API_KEY automaticamente)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// 🔹 Endpoint de análise (IA real)
app.post("/analise", async (req, res) => {
  try {
    const { textos = [] } = req.body || {};

    // Prompt enviado à OpenAI
    const prompt = `
Analise os seguintes textos de anúncios e me diga:
1️⃣ Quais padrões e gatilhos são usados (ex: urgência, prova social, promessa, preço).
2️⃣ O que eles têm em comum.
3️⃣ Sugestões práticas para melhorar os anúncios e aumentar conversão.

Textos:
${textos.join("\n\n")}
`;

    // 🔹 Chamada à API da OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    // 🔹 Envia o resultado ao front
    const resumo = completion.choices[0].message.content;
    res.json({ resumo });
  } catch (error) {
    console.error("Erro ao gerar análise IA:", error);
    res
      .status(500)
      .json({ resumo: "❌ Erro ao processar análise com a IA." });
  }
});

// 🔹 Inicialização do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ TrendSpy API rodando na porta ${PORT}`));
