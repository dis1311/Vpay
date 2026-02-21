const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure Multer for audio uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Helper for intent parsing
function parseIntent(text) {
  const lowerText = text.toLowerCase();
  const intent = {
    type: 'unknown',
    amount: 0,
    biller: null,
  };

  if (lowerText.includes('pay')) {
    intent.type = 'bill_payment';

    // Extract amount
    const amountMatch = text.match(/(\d+)/);
    if (amountMatch) {
      intent.amount = parseInt(amountMatch[0], 10);
    }

    // Extract biller
    if (lowerText.includes('electricity')) {
      intent.biller = 'Electricity Board';
    } else if (lowerText.includes('water')) {
      intent.biller = 'Water Board';
    } else if (lowerText.includes('mobile') || lowerText.includes('recharge')) {
      intent.biller = 'Mobile Recharge';
    }
  }

  return intent;
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Vpay API is running (Node.js)' });
});

// Speech API
app.post('/api/speech/process-audio', upload.single('file'), async (req, res) => {
  try {
    // In a real app, you would send req.file.buffer to Google Cloud Speech API
    // const client = new speech.SpeechClient();
    // const audio = { content: req.file.buffer.toString('base64') };
    // ...

    // MOCK RESPONSE
    const transcript = "Pay electricity bill 500 rupees";
    
    // Simulate processing delay
    setTimeout(() => {
        // We can't actually delay the response easily in sync code without a promise wrapper or just returning
    }, 500);

    res.json({
      text: transcript,
      intent: parseIntent(transcript),
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

// Payment API
app.post('/api/payment/create-order', (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // MOCK RAZORPAY ORDER
    const mockOrder = {
      id: `order_mock_${Date.now()}`,
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      status: 'created',
    };

    res.json(mockOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/payment/verify-payment', (req, res) => {
  res.json({ status: 'success', message: 'Payment verified successfully' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
