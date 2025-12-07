import { getClient } from "./client";
import { fetchUserAttributes } from "aws-amplify/auth";
import { uploadData, getUrl } from "aws-amplify/storage";
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
    async updateRoom(roomId: string, updateData: any) {
        const client = await getClient();
        const existingRoom = await client.models.Room.update({ id: roomId, ...updateData });
        console.log("Updated room:", existingRoom);
        return existingRoom.data;
    },
    async deleteRoom(roomId: string) {
        const client = await getClient();
        const deletedRoom = await client.models.Room.delete({ id: roomId });
        console.log("Deleted room:", deletedRoom);
        return deletedRoom.data;
    },
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
                displayName: attributes.name || user.signInDetails.loginId.split("@")[0],
                avatar: attributes.picture || user.avatar || "",
                roomsLeft: 1,
                subscription: "free",
            });
            console.log("end ensure function:", user, newProfile);
            return newProfile.data;
        }
    },
};

/**
 * image/file routes (for the storage):
 * @returns the response data
 */

export const fileStorage = {
    async uploadFile(file: File, roomId: string) {
        try {
            const result = await uploadData({
                path: `images/${roomId}/${file.name}`, // S3 prefix from backend.ts
                data: file,
            }).result;

            console.log("Uploaded:", result);
            return result;
        } catch (error) {
            console.error("Upload failed:", error);
        }
    },
    async getFileUrl(pathname: string) {
        const url = await getUrl({ path: pathname });
        return url.url.toString();
    },
};
