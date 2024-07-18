const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = 5000;
app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
app.get("/", async (req, res) => {
  return res.send({ message: "Api is Working" });
});
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Choose a model that's appropriate for your use case.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `Summarize the following content and also give me sentiment analysis, topic identification and key word extraction of given content in json format: ${prompt}`
    );
    const response = result;
    // const text = response;

    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// const {GoogleGenerativeAI}=require("@google/generative-ai");

// // Access your API key as an environment variable.
// const genAI = new GoogleGenerativeAI('AIzaSyB4An4lRY5NzrYTYaBsW_8qBmPiE4CnEmo');

// async function run() {
//   // Choose a model that's appropriate for your use case.
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

//   const prompt = "Write a story about a magic backpack."

//   const result = await model.generateContent(prompt);
//   const response = result.response;
//   const text = response.text();
//   console.log(text);
// }

// run();
