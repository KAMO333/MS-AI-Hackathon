import express from "express";
import "dotenv/config";
import OpenAI from "openai";
import readline from "readline/promises";

const app = express();
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client1 = {
  name: "kamogelo",
  surname: "xxx",
  age: 25,
  location: "soweto",
  issue: "need help quitting drugs",
};

// Start the server first
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Then start the AI interaction
  startAIInteraction();
});

async function startAIInteraction() {
  try {
    // Get single user input
    const userMessage = await rl.question("Your message to AI: ");

    // Create raw combined message
    const fullMessage = `
    Client Data: 
    ${JSON.stringify(client1, null, 2)}
    
    Message: ${userMessage}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional Social Worker assistant. Your role is to help social workers by providing advice, support, and guidance for their clients. You should be empathetic, professional, and focus on evidence-based interventions while maintaining a supportive and non-judgmental approach. Consider the client's background information when providing responses."
        },
        {
          role: "user",
          content: fullMessage,
        },
      ],
    });

    console.log("\nAI Response:");
    console.log(response.choices[0].message.content);

    rl.close();
    process.exit(0); // Exit after completion
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
