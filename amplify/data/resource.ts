import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
    // USER PROFILE
    UserProfile: a
        .model({
            id: a.id(),
            displayName: a.string().required(),
            avatar: a.string(),
            email: a.string().required(),
            roomsLeft: a.integer().default(1),
            subscription: a.string().default("free"), // start, pro, admin, etc.
            rooms: a.hasMany("Room", "creatorId"), // A user can have many rooms (FK = creatorId)
            completed: a.json(), // A user can have many completed rooms (FK = id)
        })
        .authorization((allow) => [
            allow.groups(["admin"]),
            allow.owner(),
            allow.authenticated().to(["create"]),
            // .to(["create", "read", "update", "delete"]),
        ]),

    // ROOM
    Room: a
        .model({
            creatorId: a.id().required(),
            creator: a.belongsTo("UserProfile", "creatorId"), // Each room belongs to a user

            name: a.string().required(),
            mainImage: a.string(),
            coverImage: a.string(),
            colorPalette: a.string(),
            imageStyle: a.string(),
            fontFamily: a.string(),
            description: a.string(),
            public: a.boolean().default(false),
            topic: a.string(),
            field: a.string(),
            type: a.string(),
            quizzes: a.hasMany("Quiz", "roomId"), // A room has many quizzes (FK = roomId)
        })
        .authorization((allow) => [
            allow.groups(["admin"]),
            allow.owner(),
            allow.authenticated().to(["read"]),
            // .to(["create", "read", "update", "delete"]),
            allow.guest().to(["read"]),
        ]),

    // QUIZ
    Quiz: a
        .model({
            roomId: a.id().required(),
            room: a.belongsTo("Room", "roomId"), // Each quiz belongs to a room

            type: a.string().required(),
            name: a.string(),
            answer: a.string().required(),
            quiz: a.json(),
            quizImg: a.string(),
            quizText: a.string(),
            hints: a.json(),
        })
        .authorization((allow) => [
            allow.groups(["admin"]),
            allow.owner(),
            allow.authenticated().to(["read"]),
            // .to(["create", "read", "update", "delete"]),
            allow.guest().to(["read"]),
        ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "identityPool",
    },
});

/*https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/
