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
    
    // The ImgBB API expects a URL-encoded form body for base64 uploads.
    // FormData creates multipart/form-data, which is incorrect for this use case.
    // URLSearchParams correctly creates the 'application/x-www-form-urlencoded' body.
    const body = new URLSearchParams();
    body.append('image', image);
    
    const apiResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: body,
    });
    
    // It's crucial to check if the response was successful before parsing JSON.
    // An error from ImgBB might be HTML, not JSON, which would cause a parsing error.
    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('ImgBB API non-OK response:', errorText);
        throw new Error(`ImgBB API responded with status ${apiResponse.status}.`);
    }

    const result = await apiResponse.json();

    if (result.success) {
      return response.status(200).json({ success: true, url: result.data.url });
    } else {
      console.error('ImgBB API Error:', result);
      throw new Error(result.error?.message || 'Failed to upload image via ImgBB.');
    }
  } catch (error: any) {
    console.error('Image Upload Service Error:', error);
    // Return a generic message to the client for security.
    return response.status(500).json({ success: false, message: "An internal server error occurred during image upload." });
  }
}
