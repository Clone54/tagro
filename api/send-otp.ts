
// This is a Vercel Serverless Function
// It will live at the URL /api/send-otp

// @ts-ignore
import { VercelRequest, VercelResponse } from '@vercel/node';

// --- Helper function to generate a 6-digit OTP ---
const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

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
    const { phoneNumber, messageTemplate } = request.body;
    
    if (!phoneNumber) {
      return response.status(400).json({ success: false, message: 'Phone number is required.' });
    }
    if (!messageTemplate || !messageTemplate.includes('{otp}')) {
        return response.status(400).json({ success: false, message: 'Invalid message template. Template must include "{otp}".' });
    }

    const otp = generateOtp();
    const message = messageTemplate.replace('{otp}', otp);
    
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
       return response.status(200).json({ success: true, otp: otp });
    } else {
       console.error('BulkSMSBD API Error:', result);
       throw new Error(result.error_message || 'Failed to send verification code via BulkSMSBD.');
    }

  } catch (error: any) {
    console.error('SMS Service Error:', error);
    return response.status(500).json({ success: false, message: error.message || "An internal server error occurred." });
  }
}
