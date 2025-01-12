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
           
           
    });

  console.log(response.choices[0].message.content);
}
          
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

