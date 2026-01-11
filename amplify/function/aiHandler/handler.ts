import OpenAI from "openai";
import { Handler } from "aws-cdk-lib/aws-lambda";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const handler: Handler = async (event: any) => {
    try {
        // In Amplify Gen 2, query arguments are passed via event.arguments
        const { prompt, type, schema } = event.arguments || {};

        if (!openai.apiKey) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "OpenAI API key is not set" }),
            };
        }

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing prompt" }),
            };
        }

        // Parse schema if it's a string, otherwise use as-is
        let parsedSchema = schema;
        if (typeof schema === "string") {
            try {
                parsedSchema = JSON.parse(schema);
            } catch (e) {
                // If parsing fails, use the string as-is
                parsedSchema = schema;
            }
        }

        // Build the prompt with schema instructions
        const systemPrompt = schema
            ? `You are a ${type} generator. You MUST output valid JSON only.
Follow this schema strictly:
${JSON.stringify(parsedSchema, null, 2)}

Return only the JSON object, no other text.`
            : `You MUST output valid JSON only. Return only the JSON object, no other text.`;

        const userPrompt = typeof prompt === "string" ? prompt : JSON.stringify(prompt);

        // 🧠 TEXT → JSON using OpenAI Chat Completions
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 4000,
        });

        const resultText = completion.choices[0]?.message?.content || "{}";

        // Parse the result to ensure it's valid JSON
        let result;
        try {
            result = JSON.parse(resultText);
        } catch (e) {
            // If parsing fails, return the raw text
            result = { error: "Failed to parse JSON response", raw: resultText };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (err: any) {
        console.error("Handler error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Internal server error" }),
        };
    }
};
