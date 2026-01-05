import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import type { Schema } from "../../../amplify/data/resource";
import { Handler } from "aws-cdk-lib/aws-lambda";
const client = new BedrockRuntimeClient({ region: "us-west-2" });

export const handler: Handler = async (event: any) => {
    try {
        const { prompt, schema } = event.arguments;
        console.log(prompt, schema);
        const command = new InvokeModelCommand({
            modelId: "anthropic.claude-3-haiku-20240307-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                messages: [
                    {
                        role: "user",
                        content: `
                    You MUST output valid JSON only.
                    Follow this schema strictly:
                    ${JSON.stringify(schema)}
                    
                    Task:
                    ${prompt}
                  `,
                    },
                ],
                max_tokens: 800,
            }),
        });

        const response = await client.send(command);
        const output = JSON.parse(new TextDecoder().decode(response.body));

        return {
            statusCode: 200,
            body: JSON.stringify(output),
        };
    } catch (err: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
