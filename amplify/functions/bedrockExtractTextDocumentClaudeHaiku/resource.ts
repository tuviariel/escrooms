import { defineFunction } from "@aws-amplify/backend";

export const bedrockExtractTextDocumentClaudeHaikuFn = defineFunction({
    name: "bedrockExtractTextDocumentClaudeHaikuFn",
    entry: "./handler.ts",
});
