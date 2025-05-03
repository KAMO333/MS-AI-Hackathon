import express from "express";
import "dotenv/config";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "say hello in tsonga" }],
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI API error:", error);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
