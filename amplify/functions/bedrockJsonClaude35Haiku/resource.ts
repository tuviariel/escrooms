import { defineFunction } from "@aws-amplify/backend";

export const bedrockJsonClaude35HaikuFn = defineFunction({
    name: "bedrockJsonClaude35HaikuFn",
    entry: "./handler.ts",
});
