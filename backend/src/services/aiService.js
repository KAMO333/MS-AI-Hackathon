import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const generateSocialWorkerAdvice = async (clientData, message) => {
  const fullMessage = `
    Client Information:
    Name: ${clientData.name} ${clientData.surname}
    Age: ${clientData.age}
    Location: ${clientData.location}
    Primary Issue: ${clientData.issue}
    
    Social Worker's Message:
    ${message}
  `;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a professional Social Worker assistant. Help provide advice and guidance based on the client's background.",
      },
      { role: "user", content: fullMessage },
    ],
  });

  return response.choices[0].message.content;
};
