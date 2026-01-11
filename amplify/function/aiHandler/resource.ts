import { defineFunction } from "@aws-amplify/backend-function";
// import { defineApi } from "@aws-amplify/backend-api";

export const aiFunction = defineFunction({
    name: "aiHandler",
    entry: "./handler.ts",
    environment: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    },
    timeoutSeconds: 30,
});

// export const api = defineApi({
//   name: "aiApi",
//   routes: {
//     "/ai": {
//       POST: aiFunction,
//     },
//   },
// });
