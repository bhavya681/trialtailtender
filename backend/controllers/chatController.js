import {GoogleGenerativeAI} from '@google/generative-ai';

const apiKey = 'AIzaSyDH_4MXmE3Lbiip056qRDbItSjZE6sbS58';

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const chatBot= async (req, res) => {
  const { input } = req.body;

  if (!input || typeof input !== "string") {
    return res.status(400).json({ error: "Invalid input. Please provide a valid message." });
  }

  try {

  const chatSession=model.startChat({generationConfig,history:[]});
  const result=await chatSession.sendMessage(input);
  const responseText=result.response.text();

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Error in Google Generative AI:", error.message);
    res.status(500).json({
      error: "Failed to fetch AI response. Please try again later.",
    });
  }
};

