const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  const names = ["gemini-1.5-flash", "models/gemini-1.5-flash", "gemini-pro", "models/gemini-pro", "gemini-1.5-pro", "gemini-flash-latest"];
  for (const name of names) {
    try {
      console.log(`Testing ${name}...`);
      const model = genAI.getGenerativeModel({ model: name });
      const result = await model.generateContent("test");
      console.log(`SUCCESS with ${name}`);
      return;
    } catch (e) {
      console.error(`FAILED with ${name}: ${e.message}`);
    }
  }
}

listModels();
