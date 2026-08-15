import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import voice from "elevenlabs-node";
import express from "express";
import { promises as fs } from "fs";
dotenv.config();

const OLLAMA_API_URL = "http://localhost:11434/api/chat";
const OLLAMA_MODEL = "llama3:latest";

const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
const voiceID = "QPBKI85w0cdXVqMSJ6WB";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/voices", async (req, res) => {
  try {
    const voices = await voice.getVoices(elevenLabsApiKey);
    res.send(voices);
  } catch (error) {
    console.error("Error getting voices:", error);
    res.status(500).send({ error: "Failed to get voices", details: error.message });
  }
});

// Test endpoint for checking API keys
app.get("/test-keys", (req, res) => {
  res.send({
    elevenLabsApiKey: elevenLabsApiKey ? "Present" : "Missing",
    ollamaUrl: OLLAMA_API_URL,
    ollamaModel: OLLAMA_MODEL,
    voiceID: voiceID,
    elevenLabsKeyLength: elevenLabsApiKey ? elevenLabsApiKey.length : 0
  });
});

// Simple POST endpoint to test text-to-speech directly
app.post("/simple-tts", async (req, res) => {
  try {
    const { text } = req.body;
    const testText = text || "Hello! This is a simple test.";
    
    console.log("=== SIMPLE TTS TEST ===");
    console.log("Text:", testText);
    console.log("API Key Present:", !!elevenLabsApiKey);
    console.log("Voice ID:", voiceID);
    
    const fileName = "audios/simple_test.mp3";
    
    console.log("Calling ElevenLabs API...");
    await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, testText);
    console.log("TTS call completed!");
    
    // Wait a moment and check if file exists
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const stats = await fs.stat(fileName);
      res.send({
        success: true,
        message: "Text-to-speech successful!",
        fileSize: stats.size,
        fileName: fileName,
        text: testText
      });
    } catch (fileError) {
      res.status(500).send({
        success: false,
        error: "File not created",
        fileName: fileName,
        text: testText
      });
    }
    
  } catch (error) {
    console.error("Simple TTS Error:", error);
    res.status(500).send({ 
      success: false,
      error: error.message,
      voiceID: voiceID,
      apiKeyPresent: !!elevenLabsApiKey
    });
  }
});

// Test Ollama chat without TTS
app.post("/chat-test", async (req, res) => {
  try {
    const userMessage = req.body.message || "Hello";
    
    console.log("=== OLLAMA CHAT TEST ===");
    console.log("User message:", userMessage);
    
    const ollamaResponse = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: "system",
            content: `You are a virtual girlfriend.
          You will always reply with a JSON array of messages. With a maximum of 3 messages.
          Each message has a text, facialExpression, and animation property.
          The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
          The different animations are: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry.
          IMPORTANT: Reply ONLY with valid JSON. Do not include any other text.`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        stream: false,
        format: "json",
        options: {
          temperature: 0.6,
          num_predict: 1000,
        },
      }),
    });

    const ollamaData = await ollamaResponse.json();
    console.log("Ollama response:", JSON.stringify(ollamaData, null, 2));
    
    let messages = JSON.parse(ollamaData.message.content);
    if (messages.messages) {
      messages = messages.messages;
    }
    
    res.send({ 
      success: true,
      messages: messages,
      rawResponse: ollamaData
    });
    
  } catch (error) {
    console.error("Chat test error:", error);
    res.status(500).send({ 
      success: false,
      error: error.message 
    });
  }
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message) => {
  const time = new Date().getTime();
  console.log(`Starting conversion for message ${message}`);
  await execCommand(
    `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
    // -y to overwrite the file
  );
  console.log(`Conversion done in ${new Date().getTime() - time}ms`);
  await execCommand(
    `./bin/rhubarb -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`
  );
  // -r phonetic is faster but less accurate
  console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    res.send({
      messages: [
        {
          text: "Hey dear... How was your day?",
          audio: await audioFileToBase64("audios/intro_0.wav"),
          lipsync: await readJsonTranscript("audios/intro_0.json"),
          facialExpression: "smile",
          animation: "Talking_1",
        },
        {
          text: "I missed you so much... Please don't go for so long!",
          audio: await audioFileToBase64("audios/intro_1.wav"),
          lipsync: await readJsonTranscript("audios/intro_1.json"),
          facialExpression: "sad",
          animation: "Crying",
        },
      ],
    });
    return;
  }
  if (!elevenLabsApiKey) {
    res.send({
      messages: [
        {
          text: "Please my dear, don't forget to add your ElevenLabs API key!",
          audio: await audioFileToBase64("audios/api_0.wav"),
          lipsync: await readJsonTranscript("audios/api_0.json"),
          facialExpression: "angry",
          animation: "Angry",
        },
        {
          text: "You don't want to ruin Wawa Sensei with a crazy ElevenLabs bill, right?",
          audio: await audioFileToBase64("audios/api_1.wav"),
          lipsync: await readJsonTranscript("audios/api_1.json"),
          facialExpression: "smile",
          animation: "Laughing",
        },
      ],
    });
    return;
  }

  // Call Ollama API
  const ollamaResponse = await fetch(OLLAMA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a virtual girlfriend.
        You will always reply with a JSON array of messages. With a maximum of 3 messages.
        Each message has a text, facialExpression, and animation property.
        The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
        The different animations are: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry.
        IMPORTANT: Reply ONLY with valid JSON. Do not include any other text.`,
        },
        {
          role: "user",
          content: userMessage || "Hello",
        },
      ],
      stream: false,
      format: "json",
      options: {
        temperature: 0.6,
        num_predict: 1000,
      },
    }),
  });

  const ollamaData = await ollamaResponse.json();
  let messages = JSON.parse(ollamaData.message.content);
  if (messages.messages) {
    messages = messages.messages; // ChatGPT is not 100% reliable, sometimes it directly returns an array and sometimes a JSON object with a messages property
  }
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    // generate audio file
    const fileName = `audios/message_${i}.mp3`; // The name of your audio file
    const textInput = message.text; // The text you wish to convert to speech
    await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, textInput);
    // generate lipsync
    await lipSyncMessage(i);
    message.audio = await audioFileToBase64(fileName);
    message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
  }

  res.send({ messages });
});

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

app.listen(port, () => {
  console.log(`Virtual Girlfriend listening on port ${port} with Ollama (${OLLAMA_MODEL})`);
});
