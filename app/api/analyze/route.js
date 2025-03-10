import { Configuration, OpenAIApi } from "openai"
import { NextResponse } from 'next/server';


//Main function
export async function POST(request) {


const body = await request.json();
console.log(body);
console.log(body.blob.url);
//Added Environment Variable 
const token = process.env.AZURE_OPENAI_API_KEY;

try {
        
    console.log("Calling OpenAI with API Key--->" + token);
    console.log("Passing URL blob--->" + JSON.stringify(body.blob.url));

    const configuration = new Configuration({
        apiKey: token,
        basePath: "https://models.inference.ai.azure.com",
      });

   
    const openai = new OpenAIApi(configuration)
    
    const response = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: [
          
          { type: "text", text: "You are a professional stylist. This is an image of a used fashion item. I want to reuse this item. Please tell me how I can style this item. Please output the suggestions in JSON format within an array named 'styles'." },

          {
            type: "image_url",
            image_url: {
              "url": body.blob.url,
            },
          },
          
        ],
        
      },
    ],
  });
    

const analysis = response.data.choices[0].message.content;
const analysisResults = JSON.parse(analysis)
console.log(analysisResults.styles)
return new Response(JSON.stringify(analysisResults.styles));


    } catch (error) {
        const errorText = await error.response;
        console.error(errorText.data)
        return NextResponse.json(
            { error: error.message },
            { status: 400 }, // The webhook will retry 5 times waiting for a status 200
          );
    }

}




