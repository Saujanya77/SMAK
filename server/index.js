import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        res.json({ response: response.text });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ response: "Error fetching response" });
    }
});

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});

