import { defineFunction } from "@aws-amplify/backend";

export const bedrockImageStableDiffusionFn = defineFunction({
    name: "bedrockImageStableDiffusionFn",
    entry: "./handler.ts",
});
