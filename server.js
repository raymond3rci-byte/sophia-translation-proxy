import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;

app.post("/translate", async (req, res) => {
  try {
    const { text, target } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `Translate into ${target}. Return only the translated text.` },
          { role: "user", content: text }
        ],
        temperature: 0.1
      })
    });

    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content || "";

    res.json({ translation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(3000, () => console.log("SOPHIA proxy running"));
