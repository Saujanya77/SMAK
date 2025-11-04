import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Razorpay from 'razorpay';
import { GoogleGenAI } from "@google/genai";
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
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

// Verify Razorpay payment signature
app.post('/verify-payment', async (req, res) => {
    const { orderId, paymentId, signature, itemType, itemId, amount } = req.body;
    if (!orderId || !paymentId || !signature) {
        return res.status(400).json({ success: false, error: 'Missing parameters' });
    }

    try {
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        if (expectedSignature === signature) {
            // Persist a record of this successful verification (append to payments.json)
            try {
                const record = {
                    orderId,
                    paymentId,
                    itemType: itemType || null,
                    itemId: itemId || null,
                    amount: amount || null,
                    timestamp: new Date().toISOString()
                };
                const paymentsPath = path.join(process.cwd(), 'server', 'payments.json');
                const line = JSON.stringify(record) + '\n';
                fs.appendFile(paymentsPath, line, (err) => {
                    if (err) console.error('Failed to persist payment record:', err);
                });
            } catch (e) {
                console.error('Error saving payment record:', e);
            }
            // Optionally you can capture the payment here or store records
            return res.json({ success: true });
        }

        return res.status(400).json({ success: false, error: 'Invalid signature' });
    } catch (err) {
        console.error('Verify payment error:', err);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});

