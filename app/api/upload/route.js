import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';
 
export async function POST(request) {

  const body = await request.json();
 
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
       
 
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
          tokenPayload: JSON.stringify({
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
      
        console.log('blob upload completed', blob, tokenPayload);
 
        try {
           
        // Call the OPEN.AT model to analyze the image
          const analysisResponse = await analyzeImage(blob.url);
          console.log(analysisReponse)
                    
          return JSON.stringify.analysisResponse 
          
        } catch (error) {
          throw new Error('Error analyzing the image');
        }
      },
    });
 
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }, // The webhook will retry 5 times waiting for a status 200
    );
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
