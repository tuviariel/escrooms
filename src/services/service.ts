import { getClient } from "./client";
import { fetchUserAttributes } from "aws-amplify/auth";
/**
 * Rooms routes:
 * @returns the response data
 */

export const roomsService = {
    async listRooms() {
        try {
            const client = await getClient();
            const rooms = await client.models.Room.list();
            console.log("Fetched rooms:", rooms);
            return rooms.data;
        } catch (errors) {
            console.error("Error fetching rooms:", errors);
        }
    },
    async createRoom(roomData: any) {
        const client = await getClient();
        const result = await client.models.Room.create(roomData);
        return result.data;
    },
    // async updateRoom(roomId: string, updateData: any) {
    // const client = await getClient();
    // const existingRoom = await client.models.Room.update(roomId);
    // return existingRoom.data;
    // },
    async getRoomByUser(userId: string) {
        const client = await getClient();
        const rooms = await client.models.Room.list({
            filter: { creatorId: { eq: userId } },
        });
        return rooms.data;
    },
};

/**
 * User routes:
 * @returns the response data
 */

export const userService = {
    async ensureUserProfileExists(user: any) {
        console.log("in ensure function", user);
        // setUser(user);
        const client = await getClient();
        const existing = await client.models.UserProfile.get({ id: user.userId });
        console.log("before exist ensure", existing);
        if (existing && existing.data?.id) {
            console.log("existing", existing.data);
            return existing.data;
        } else {
            const attributes = await fetchUserAttributes();
            console.log("attributes ensure", attributes);
            const newProfile = await client.models.UserProfile.create({
                id: user.userId,
                email: attributes.email || user.signInDetails.loginId,
                displayName: attributes.name || user.username,
                avatar: attributes.picture || user.avatar || "",
                roomsLeft: 1,
                subscription: "free",
            });
            console.log("end ensure function:", user, newProfile);
            return newProfile.data;
        }
    },
};
