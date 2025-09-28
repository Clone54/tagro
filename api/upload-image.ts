
// This is a Vercel Serverless Function
// It will live at the URL /api/upload-image

// @ts-ignore
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ success: false, message: 'Only POST requests are allowed' });
  }

  const { IMGBB_API_KEY } = process.env;
  if (!IMGBB_API_KEY) {
    console.error('IMGBB_API_KEY environment variable is not set.');
    return response.status(500).json({ success: false, message: 'Server configuration error.' });
  }

  try {
    const { image } = request.body; // image is a base64 string
    if (!image) {
      return response.status(400).json({ success: false, message: 'Image data is required.' });
    }
    
    const formData = new FormData();
    formData.append('image', image);
    
    // Using native fetch which is available in Node 18+ (Vercel's default)
    const apiResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData as any, // Cast to any to satisfy fetch body type with FormData
    });

    const result = await apiResponse.json();

    if (result.success) {
      return response.status(200).json({ success: true, url: result.data.url });
    } else {
      console.error('ImgBB API Error:', result);
      throw new Error(result.error?.message || 'Failed to upload image via ImgBB.');
    }
  } catch (error: any) {
    console.error('Image Upload Service Error:', error);
    return response.status(500).json({ success: false, message: error.message || "An internal server error occurred." });
  }
}
