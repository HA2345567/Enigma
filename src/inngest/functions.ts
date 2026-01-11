import { generateText } from "ai";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const demoGenerate = inngest.createFunction(
    { id: "demo-generate" },
    { event: "demo/generate" },
    async ({ step }) => {
        return await step.run("generate text", async () => {
            const google = createGoogleGenerativeAI({
                apiKey: process.env.GOOGLE_API_KEY!,
            });

            try {
                const result = await generateText({
                    model: google('gemini-2.5-flash'),
                    prompt: "My name is Harsh  ",
                });
                return result.text; // Return only the generated text
            } catch (error) {
                console.error("Error generating text:", error);
                return `Failed to generate text: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
            }
        });
    }
);