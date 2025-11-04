import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Razorpay from 'razorpay';
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

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

// Razorpay order creation endpoint
app.post('/create-order', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const order = await razorpay.orders.create({
            amount: amount * 100, // amount in paise
            currency: currency || 'INR',
            receipt: 'order_rcptid_' + Date.now()
        });
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});

