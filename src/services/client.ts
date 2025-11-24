import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { fetchAuthSession } from "aws-amplify/auth";

export async function getClient() {
    const session = await fetchAuthSession();
    const hasUser = !!session.tokens; // user logged in
    // console.log("hasUser:", hasUser, session); //?.id);
    return generateClient<Schema>({
        authMode: hasUser ? "userPool" : "identityPool",
    });
}
