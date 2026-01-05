import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { bedrockJsonClaude35HaikuFn as claudeJson } from "./functions/bedrockJsonClaude35Haiku/resource";
import { bedrockImageStableDiffusionFn as imageStableDiffusion } from "./functions/bedrockImageStableDiffusion/resource";
import { bedrockExtractTextDocumentClaudeHaikuFn as extractDocument } from "./functions/bedrockExtractTextDocumentClaudeHaiku/resource";
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
export const backend = defineBackend({
    auth,
    data,
    storage,
    claudeJson,
    imageStableDiffusion,
    extractDocument,
});

// const { groups } = backend.auth.resources;
// // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.IRole.html
// groups["admin"];
