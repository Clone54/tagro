
// This is a Vercel Serverless Function
// It will live at the URL /api/send-order-confirmation

// @ts-ignore
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const {
    BULKSMSBD_API_KEY,
    BULKSMSBD_SENDER_ID,
  } = process.env;

  if (!BULKSMSBD_API_KEY || !BULKSMSBD_SENDER_ID) {
    console.error('BulkSMSBD environment variables are not set.');
    return response.status(500).json({ success: false, message: 'Server configuration error.' });
  }

  try {
    const { phoneNumber, messageTemplate, orderData } = request.body;
    
    if (!phoneNumber || !messageTemplate || !orderData) {
      return response.status(400).json({ success: false, message: 'Missing required parameters.' });
    }

    // Replace placeholders in the template with actual order data
    const message = messageTemplate
      .replace('{userName}', orderData.userName)
      .replace('{orderId}', orderData.orderId)
      .replace('{totalAmount}', orderData.totalAmount);
    
    const params = new URLSearchParams({
        api_key: BULKSMSBD_API_KEY,
        type: 'text',
        number: phoneNumber,
        senderid: BULKSMSBD_SENDER_ID,
        message: message,
    });
    
    const url = `http://bulksmsbd.net/api/smsapi?${params.toString()}`;

    const apiResponse = await fetch(url);
    const result = await apiResponse.json();

    const successCodes = ['1000', '1002', '1003', '1004'];
    if (successCodes.includes(result.response_code?.toString())) {
       return response.status(200).json({ success: true, message: 'SMS sent successfully.' });
    } else {
       console.error('BulkSMSBD API Error:', result);
       throw new Error(result.error_message || 'Failed to send SMS via BulkSMSBD.');
    }

  } catch (error: any) {
    console.error('SMS Service Error:', error);
    return response.status(500).json({ success: false, message: error.message || "An internal server error occurred." });
  }
}
