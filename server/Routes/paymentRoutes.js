import express from 'express';
import {
  createCheckoutSession,
  createPayment,
  createPaymentWithSession,
  webhookHandler
} from '../Controller/paymentController.js';
import {
  authenticatePayment,
  paymentRateLimit
} from '../Authentication/authMiddleware.js';
import axios from 'axios';
import Order from '../Models/orderModel.js';
import User from '../Models/userModel.js';
import transactionModel from '../Models/transactionModel.js';

const router = express.Router();
const YUNO_API = "https://api-sandbox.y.uno/v1";

const YUNO_API_BASE = "https://api-sandbox.y.uno/v1";


router.post('/checkout-sessions',  createCheckoutSession);

router.post("/create-payment", async (req, res) => {
  const { orderId, customer_session, oneTimeToken, cardData } = req.body;
  console.log("Card",cardData)
    try {

    // Fetch order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Fetch user
    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare payload for Yuno
    const payload = {
      country: "US", 
      amount: {
        currency: order.currency,
        value: Math.round(order.totalAmount * 100), 
      },
      customer_payer: {
        id: user.yunoCustomerId,
        name: user.name,
        email: user.email,
        merchant_customer_validations: {
          account_is_verified: true,
          email_is_verified: true,
          phone_is_verified: true,
        },
      },
      workflow: "DIRECT",
      payment_method: {
        detail: {
          card: {
            card_data: {
              number: "4242424242424242", // ⚠️ test card
              expiration_month: 9,
              expiration_year: 29,
              security_code: "123",
              holder_name: user.name,
            },
            verify: false,
            capture: true,
          },
        },
        type: "CARD",
      },
      account_id: process.env.YUNO_ACCOUNT_ID, 
      description: `Order ${order.orderNumber}`,
      merchant_order_id: order.orderNumber,
    };


    
    // Axios call
    const response = await axios.post(
      "https://api-sandbox.y.uno/v1/payments",
      payload,
      {
        headers: {
          accept: "application/json",
          "X-Idempotency-Key": Date.now().toString(),
          "content-type": "application/json",
          "public-api-key": process.env.PUBLIC_API_KEY,
          "private-secret-key": process.env.PRIVATE_SECURITY_KEY,
        },
      }
    );
    await transactionModel.create({
      paymentId: response.data.id,
      providerName: "yuno",
      providerTransactionId: response.data.id,
      netAmount: order.totalAmount,
      amount: order.totalAmount,
      currency: order.currency,
      status: response.data.status,
      providerResponse: response.data,
      processedAt: new Date(),
      metadata: {
        cardData: cardData,
      },
    });

    console.log("✅ Yuno Payment Success:", response.data);
    return res.json(response.data);
  } catch (error) {
    console.error("❌ Yuno Payment Error:", error.response?.data || error.message);
    return res
      .status(500)
      .json({ error: error.response?.data || error.message });
  }
});


router.post('/process',   async (req, res) => {
  try {
    const { orderId, customerSession } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const paymentResp = await axios.post(
      `${YUNO_API_BASE}/payments`,
      {
        account_id: process.env.YUNO_ACCOUNT_ID,
        description: `Payment for order ${order._id}`,
        merchant_order_id: order._id.toString(),
        amount: { value: order.totalAmount, currency: order.currency || "USD" },
        payment_method: {
          detail: { type: "CARD", capture: true } // or false if 2-step
        },
        customer_session: customerSession
      },
      {
        headers: {
          "X-Idempotency-Key": crypto.randomUUID(), 
          accept: "application/json",
          "content-type": "application/json",
          "public-api-key": process.env.PUBLIC_API_KEY,
          "private-secret-key": process.env.PRIVATE_SECURITY_KEY
        }
      }
    );

    const paymentData = paymentResp.data;

    res.json({
      paymentId: paymentData.id,
      clientSecret: paymentData.client_secret, 
      status: paymentData.status
    });

  } catch (err) {
    console.error("Yuno payment creation error:", err);
    res.status(500).json({ error: err.message });
  }
}
);

router.post('/webhook', webhookHandler);

export default router;
