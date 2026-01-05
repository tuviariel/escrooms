import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { Handler } from "aws-cdk-lib/aws-lambda";

const client = new BedrockRuntimeClient({ region: "us-west-2" });

export const handler: Handler = async (event: any) => {
    try {
        const { prompt, style } = JSON.parse(event.body);

        const command = new InvokeModelCommand({
            modelId: "stability.stable-diffusion-xl",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                prompt: `${prompt}, style: ${style}`,
                cfg_scale: 7,
                steps: 30,
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
