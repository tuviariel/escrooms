import { getClient } from "./client";
import { fetchUserAttributes } from "aws-amplify/auth";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
/**
 * Rooms routes:
 * @returns the response data
 */

export const roomsService = {
    async listRooms() {
        try {
            const client = await getClient();
            const rooms = await client.models.Room.list({
                filter: { public: { eq: true } },
                selectionSet: ["id", "name", "description", "mainImage"],
            });
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
        console.log(userId);
        const rooms = await client.models.Room.list({
            filter: { creatorId: { eq: userId } },
        });
        return rooms.data;
    },
    async getRoomById(roomId: string) {
        const client = await getClient();
        const rooms = await client.models.Room.list({
            filter: { id: { eq: roomId } },
        });
        return rooms.data;
    },
};

/**
 * Quiz routes:
 * @returns the response data
 */

export const quizService = {
    async createQuiz(quizData: any) {
        const client = await getClient();
        const result = await client.models.Quiz.create(quizData);
        return result.data;
    },
    async updateQuiz(quizId: string, updateData: any) {
        const client = await getClient();
        const existingQuiz = await client.models.Quiz.update({ id: quizId, ...updateData });
        console.log("Updated quiz:", existingQuiz);
        return existingQuiz.data;
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
        console.log("Uploading file:", file, "to room:", roomId);
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
        console.log("Got file URL:", url);
        return url.url.href;
    },
    async deleteFile(pathname: string) {
        try {
            const result = await remove({ path: pathname });
            console.log("Deleted file:", result);
            return result;
        } catch (error) {
            console.error("Delete failed:", error);
        }
    },
};
