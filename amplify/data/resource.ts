import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
// import { aiFunction } from "../function/aiHandler/resource";
// import { aiTrigger } from "../function/aiTrigger/resource";

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

            sourceData: a.json(),
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
            completed: a.string(),
            showTime: a.boolean().default(true),
            withGrade: a.boolean().default(false),
            difficultyLevel: a.string(),
            numberOfQuizzes: a.integer().default(6),
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

    // AI JOB
    AIJob: a
        .model({
            id: a.id(),
            status: a.string(), // PENDING | RUNNING | DONE | ERROR
            result: a.json(),
            error: a.string(),
        })
        .authorization((allow) => [allow.authenticated()]),

    // aiTrigger: a
    //     .mutation()
    //     .arguments({
    //         prompt: a.string(),
    //         type: a.string(),
    //         schema: a.string(),
    //     })
    //     .returns(a.json())
    //     .authorization((allow) => [allow.authenticated()])
    //     .handler(a.handler.function(aiTrigger)),

    // getAIJob: a
    //     .query()
    //     .arguments({ id: a.id() })
    //     .returns(a.ref("AIJob"))
    //     .authorization((allow) => [allow.authenticated()]),

    // aiFunction: a
    //     .query()
    //     .arguments({
    //         prompt: a.string(),
    //         type: a.string(),
    //         schema: a.string(),
    //         job: a.string(),
    //     })
    //     .returns(a.json())
    //     .authorization((allow) => [allow.authenticated()])
    //     .handler(a.handler.function(aiFunction)),

    // extractDocument: a
    //     .query()
    //     .arguments({
    //         document: a.string(),
    //         topic: a.string(),
    //         subTopic: a.string(),
    //         schema: a.json(),
    //     })
    //     .returns(a.json())
    //     .authorization((allow) => [allow.authenticated()])
    //     .handler(a.handler.function(extractDocument)),

    // // GENERATE ROOM
    // generateRoom: a
    //     .generation({
    //         aiModel: a.ai.model("Claude 3.5 Haiku"),
    //         systemPrompt: "You are a helpful assistant that generates escape rooms in json format.",
    //     })
    //     .arguments({
    //         description: a.string(),
    //     })
    //     .returns(
    //         // a.json()
    //         a.customType({
    //             name: a.string(),
    //             // mainImage: a.string(),
    //             // coverImage: a.string(),
    //             subTopics: a.string().array(),
    //             // cardSortingQuizTopics: a.string().array(),
    //             // categorizingQuizTopics: a.string().array(),
    //             // trueFalseQuizTopics: a.string().array(),
    //             // choosingIconQuizTopics: a.string().array(),
    //             // matchingQuizTopics: a.string().array(),
    //             // fillInTheBlankQuizTopics: a.string().array(),
    //             // multipleChoiceQuizTopics: a.string().array(),
    //             // flipCardQuizTopics: a.string().array(),
    //         })
    //     )
    //     .authorization((allow) => allow.authenticated()),
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
