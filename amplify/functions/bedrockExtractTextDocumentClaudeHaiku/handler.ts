import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Handler } from "aws-cdk-lib/aws-lambda";
const s3 = new S3Client({});
const textract = new TextractClient({});
const bedrock = new BedrockRuntimeClient({ region: "us-west-2" });

export const handler: Handler = async (event: any) => {
    try {
        const { bucket, key } = JSON.parse(event.body);

        // 1. Download the file from S3
        const file = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
        const fileBytes = await file.Body?.transformToByteArray();

        if (!fileBytes) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Could not read file bytes" }),
            };
        }

        // 2. Extract text using Textract
        const textractResult = await textract.send(
            new AnalyzeDocumentCommand({
                Document: { Bytes: fileBytes },
                FeatureTypes: ["TABLES", "FORMS"],
            })
        );

        const extractedText = textractResult.Blocks?.filter((b) => b.BlockType === "LINE")
            .map((b) => b.Text)
            .join("\n");

        if (!extractedText) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No text extracted from document" }),
            };
        }

        // 3. Ask Claude to segment into subtopics + JSON
        const prompt = `
      You are an expert document analyst.
      Extract the main subtopics from the following document and return a JSON object.
      Each key must be a subtopic.
      Each value must be the extracted text belonging to that subtopic.

      Document:
      ${extractedText}
    `;

        const command = new InvokeModelCommand({
            modelId: "anthropic.claude-3-sonnet",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                max_tokens: 2000,
            }),
        });

        const response = await bedrock.send(command);
        const output = JSON.parse(new TextDecoder().decode(response.body));

        return {
            statusCode: 200,
            body: JSON.stringify({
                subtopics: output,
            }),
        };
    } catch (err: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
