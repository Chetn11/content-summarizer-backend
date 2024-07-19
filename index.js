const express = require("express");
const cors = require("cors");
const JSON5=require("json5")
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");
require("dotenv").config();

// const app = express();
// const port = 5000;

// app.use(cors());
// app.use(bodyParser.json());

// const upload = multer();
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// app.get("/", async (req, res) => {
//   res.send({ message: "API is working" });
// })


const app = express();
const port = 5000;
app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyParser.json());
const upload = multer();
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
      `Summarize the following content and also give me sentiment analysis, topic identification, keyword extraction then convert into json format and give me just json file: ${prompt}`
    );
    var response = result.response.text();
    // let jsonResponse = response.replace(/```json\n|\n```/g, '').trim();
    let jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      let jsonResponse = jsonMatch[1].trim();

      // Log the cleaned string to ensure it is correct
      console.log("Cleaned JSON String:\n" + jsonResponse);

      // Parse the JSON string into an object
      let jsonObject = JSON.parse(jsonResponse);
      console.log("Parsed JSON Object:", jsonObject);
      res.send(jsonObject)
  } else {
      throw new Error("No JSON content found in the response string.");
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

//////////
app.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const text = req.file.buffer.toString("utf-8");

    // Check if text is empty
    if (!text.trim()) {
      return res.status(400).json({ error: "File is empty" });
    }

    const document = {
      content: text,
      type: "PLAIN_TEXT",
    };
    

    
  if (!document.content) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Choose a model that's appropriate for your use case.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `Summarize the following content in short form and also give me sentiment analysis, topic identification, keyword extraction then convert into json format and give me just json file: ${document.content}`
    );
    var response = result.response.text();
    // let jsonResponse = response.replace(/```json\n|\n```/g, '').trim();
    let jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      let jsonResponse = jsonMatch[1].trim();

      // Log the cleaned string to ensure it is correct
      console.log("Cleaned JSON String:\n" + jsonResponse);

      // Parse the JSON string into an object
      let jsonObject = JSON.parse(jsonResponse);
      console.log("Parsed JSON Object:", jsonObject);
      res.send(jsonObject)
  } else {
      throw new Error("No JSON content found in the response string.");
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate content" });
  }

  } catch (err) {
    console.error("Error processing file:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
