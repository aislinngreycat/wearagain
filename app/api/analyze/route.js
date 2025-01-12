import { Configuration, OpenAIApi } from "openai"
import { NextResponse } from 'next/server';


//Main function
export async function POST(request) {


const body = await request.json();
console.log(body);
//Added Environment Variable 
const token = process.env.AZURE_OPENAI_API_KEY;

try {
        
    console.log("Calling OpenAI with API Key--->" + token);

    const configuration = new Configuration({
        apiKey: token,
        basePath: "https://models.inference.ai.azure.com",
      });
    const openai = new OpenAIApi(configuration)
    
    const response = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "You are a professional stylist. This is an image of a used fashion item. I want to reuse this item. Please tell me how I can style this item." },
          {
            type: "image_url",
            image_url: {
              "url": body.blob,
            },
          },
        ],
      },
    ],
  });
    

const analysisResults = response.data.choices[0].message.content;
console.log(analysisResults)


return new Response(analysisResults);


    } catch (error) {
        const errorText = await error.response.text();
        console.error(errorText)
        return NextResponse.json(
            { error: error.message },
            { status: 400 }, // The webhook will retry 5 times waiting for a status 200
          );
    }

}




