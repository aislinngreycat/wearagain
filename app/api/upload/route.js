import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

 
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


