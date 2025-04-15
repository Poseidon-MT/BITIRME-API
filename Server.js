const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());
require('dotenv').config();
const api = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(api);





app.get('/', (req, res) => {
  res.status(200).json({ message: "Ana sayfa Basarılı" });
});




app.post('/sendMsg', async (req, res) => {
  const { message, history } = req.body;
  console.log(history);
  console.log(message);

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });


  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];





  const chat = model.startChat({
    history: history,
    generationConfig,
    safetySettings,

  });



  try {

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    return res.send(text);

  } catch (error) {
    console.log(error);
  }


});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is running: http://localhost:${PORT}`);
});
