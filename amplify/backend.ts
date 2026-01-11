import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { aiFunction } from "./function/aiHandler/resource";
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
export const backend = defineBackend({
    auth,
    data,
    storage,
    aiFunction,
});

// Note: Amplify Gen 2 automatically grants functions access to storage
// and sets environment variables. The bucket name will be available as
// STORAGE_ESCAPEROOMSTORAGE_BUCKET_NAME in the Lambda environment.

// const { groups } = backend.auth.resources;
// // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.IRole.html
// groups["admin"];
