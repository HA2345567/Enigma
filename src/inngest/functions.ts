import { generateText } from "ai";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { firecrawl } from "@/lib/firecrawl";

const URL_REGEX= /https?:\/\/[^\s]+/g;

export const demoGenerate = inngest.createFunction(
    { id: "demo-generate" },
    { event: "demo/generate" },
    async ({ step,event}) => {
        const {prompt} = event.data as {prompt: string};

        const urls = await step.run("extract-urls", async()=>{
            return prompt.match(URL_REGEX) ?? [];

        }) as string[];

        const scrapedContext = await step.run("scrape-urls", async()=>{
            const results =await Promise.all(
                urls.map(async(url) =>{
                    const result = await firecrawl.scrape(
                        url,
                        {formats: ['markdown']},
                    );
                    return result.markdown ?? null;
                })
            )
            return results.filter(Boolean).join("\n\n");
        });

        const finalPrompt = scrapedContext
        ? `Context:\n${scrapedContext}\n\n Question: ${prompt}`
        : prompt;
        return await step.run("generate text", async () => {
            const google = createGoogleGenerativeAI({
                apiKey: process.env.GOOGLE_API_KEY!,
            });

            try {
                const result = await generateText({
                    model: google('gemini-2.5-flash'),
                    prompt: finalPrompt ,
                     experimental_telemetry:{
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
        }
                });
                return result.text; // Return only the generated text
            } catch (error) {
                console.error("Error generating text:", error);
                return `Failed to generate text: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
            }
        });
    }
);

export const demoError = inngest.createFunction(
    {id:"demo-error"},
    {event: "demo/error"},
    async({step})=> {
        await step.run("fail", async()=>{
            throw new Error("Inngest error: Background job failed!");
        });
    }
)