import { handleUpload } from '@vercel/blob/client';
import { Configuration, OpenAIApi } from 'openai';
import { NextResponse } from 'next/server';
 
export async function POST(request) {
  const body = await request.json();
 
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
            generateClientToken()
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            // you could pass a user id from auth, or a value from clientPayload
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow
 
        console.log('blob upload completed', blob, tokenPayload);
      
 
        try {
          // Run any logic after the file upload completed
          
          // Call the OPEN.AT model to analyze the image
          const analysisResponse = await analyzeImage(blob.url);
          
          return new Response(JSON.stringify(analysisResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// Function to call the OPEN.AT model to analyze the image
async function analyzeImage(imageUrl) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
    
      const prompt = `You are a professional stylist. This is an image of a used fashion item. I want to reuse this item. Please tell me how I can style this item in Javascript array format.\nImage URL: ${imageUrl}`;
    
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 150,
      });
    
      const data = response.data.choices[0].text.trim();
      return JSON.parse(data);
}


