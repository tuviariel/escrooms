import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { fetchAuthSession } from "aws-amplify/auth";
import { createAIHooks } from "@aws-amplify/ui-react-ai";

export async function getClient() {
    const session = await fetchAuthSession();
    const hasUser = !!session.tokens;
    // console.log("hasUser:", hasUser, session);
    return generateClient<Schema>({
        authMode: hasUser ? "userPool" : "identityPool",
    });
}
export async function isAdmin() {
    const session = await fetchAuthSession();
    const groups = session.tokens?.idToken?.payload["cognito:groups"] ?? [];
    if (Array.isArray(groups)) {
        return groups.includes("Admin");
    }
    return false;
}

const client = generateClient<Schema>({ authMode: "userPool" });
export const { useAIConversation, useAIGeneration } = createAIHooks(client);
