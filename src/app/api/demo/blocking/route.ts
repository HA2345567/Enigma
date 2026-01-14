import { generateText } from 'ai';
import {createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST() {
    const response = await generateText({
        model: google('models/gemini-2.5-flash'),
        prompt: "My name is Harsh",
        experimental_telemetry:{
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
        }
    });

    return Response.json({ text: response.text });
}
