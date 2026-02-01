import { useEffect, useState } from "react";
import { get_text } from "../../../util/language";
import { useUserContext } from "../../../contexts/userStyleContext";
import { colorPalette, fontFamily } from "../../../util/UIstyle";
import { roomsService } from "../../../services/service";
import { useSelector } from "react-redux";
import { userType } from "../../../components/Login/Login";
import { fieldsOfStudy } from "../../../util/utils";
import { aiService } from "../../../services/service";
// import { schema } from "../../../util/schemas";
// import { useAIGeneration } from "../../../services/client";
// import { Flex, TextAreaField, Loader, Text, View, Button } from "@aws-amplify/ui-react";

type RoomInfo = {
    roomType: string;
    roomField: string;
    roomTopic: string;
    roomName: string;
    roomDescription: string;
    roomStyle: string; // a background image url
    roomColor: string; // hex * 3 (light, dark, bright)
    roomFont: string; // font-family
    roomMainImage: string; // main image url
    roomCoverImage: string; // cover image url
};
type RoomInfoProps = {
    roomId: string;
    subTopics: { name: string; content: string; quizType: string }[];
};
const LOCAL_KEY = "roomInfoData";

const COLOR_GROUPS = Object.keys(colorPalette);
const FONT_OPTIONS = Object.keys(fontFamily);

export const RoomInfoForm = ({ roomId, subTopics }: RoomInfoProps) => {
    console.log(subTopics);
    const [roomInfo, setRoomInfo] = useState<RoomInfo>({
        roomType: "educational",
        roomField: "",
        roomTopic: "",
        roomName: "",
        roomDescription: "",
        roomStyle: "realistic", // Default style, will be set based on color selection
        roomColor: COLOR_GROUPS[0],
        roomFont: FONT_OPTIONS[0],
        roomMainImage: "",
        roomCoverImage: "",
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>("starter");

    const { userLanguage } = useUserContext();
    const userRedux: any = useSelector((state: { user: userType }) => state.user);
    // load draft from localStorage
    useEffect(() => {
        const getRoomData = async () => {
            try {
                const raw = localStorage.getItem(LOCAL_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw) as Partial<RoomInfo>;
                    console.log(parsed);
                    setRoomInfo((prev) => ({ ...prev, ...parsed }));
                } else if (roomId) {
                    const res = await roomsService.getRoomById(roomId);
                    if (res && res[0]) {
                        const info = {
                            roomType: res[0].type || "educational",
                            roomTopic: res[0].topic || "",
                            roomName: res[0].name,
                            roomDescription: res[0].description || "",
                            roomStyle: res[0].imageStyle || "",
                            roomColor: res[0].colorPalette || "",
                            roomFont: res[0].fontFamily || "",
                        };
                        setRoomInfo((prev: RoomInfo) => ({ ...prev, ...info }));
                    } else {
                    }
                }
            } catch {
                // ignore parse errors
            }
        };

        getRoomData();
    }, []);

    // save draft on every change
    useEffect(() => {
        if (status) {
            setStatus("");
        } else {
            try {
                localStorage.setItem(LOCAL_KEY, JSON.stringify(roomInfo));
            } catch {
                // ignore storage errors
            }
        }
    }, [roomInfo]);
    // const [{ data, isLoading }, generateRoom] = useAIGeneration("generateRoom");
    const handleGenerateRoom = async () => {
        try {
            let prompt =
                `You MUST respond with valid JSON only. No text, no markdown, no explanation.` +
                `\n\nCreating an escape room on the topic of "${roomInfo.roomTopic}"` +
                `\n\nGenerate a list of 8 sub-topics for the room quizzes. Each sub-topic of ${roomInfo.roomTopic} should be a string and should be unique.`;
            console.log(prompt);
            const res = await aiService.openAI(
                prompt,
                "json",
            );
            // const res = generateRoom({ description: prompt });
            console.log(res);
            if (res) {
                console.log(res);

                // setRoomInfo((prev) => ({ ...prev, ...res.data }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const update = (patch: Partial<RoomInfo>) => {
        setRoomInfo((s) => ({ ...s, ...patch }));
    };

    const handleEnd = async () => {
        setLoading(true);
        setStatus("");
        try {
            let res;
            if (roomId) {
                //will update roomData in roomId is located
                res = await roomsService.updateRoom(roomId, {
                    type: roomInfo.roomType,
                    topic: roomInfo.roomTopic,
                    name: roomInfo.roomName,
                    colorPalette: roomInfo.roomColor || "blueToRed",
                    imageStyle: roomInfo.roomStyle || "",
                    fontFamily: roomInfo.roomFont || "sansSerif",
                    description: roomInfo.roomDescription,
                });
            } else {
                //will create roomData
                res = await roomsService.createRoom({
                    creatorId: userRedux.user.id,
                    type: roomInfo.roomType,
                    topic: roomInfo.roomTopic,
                    name: roomInfo.roomName,
                    mainImage: "",
                    colorPalette: roomInfo.roomColor || "blueToRed",
                    imageStyle: roomInfo.roomStyle || "",
                    fontFamily: roomInfo.roomFont || "sansSerif",
                    description: roomInfo.roomDescription,
                });
                if (res && res.id) {
                    // setRoomId(res.id);
                }
            }
            console.log("Room created:", res);
            // success: clear draft
            // localStorage.removeItem(LOCAL_KEY);
            setStatus("Saved successfully.");
            // setStep(1);
        } catch (err) {
            console.error(err);
            setStatus("Failed to save. Try again.");
        } finally {
            setLoading(false);
        }
    };
    console.log(roomInfo.roomColor, colorPalette[roomInfo.roomColor as keyof typeof colorPalette]);
    return (
        <div
            className="max-w-3xl mt-0 mx-20 py-4 text-white"
            dir={userLanguage === "he" ? "rtl" : "ltr"}>
            {/* Type- for adding options like non generated rooms for private events */}
            {/* <div className="mb-3">
                <label className="flex text-lg mb-1.5">
                    {get_text("room_type", userLanguage)}{" "}
                    <span
                        className="text-red-500 cursor-pointer"
                        title={get_text("mandatory_field", userLanguage)}>
                        *
                    </span>
                </label>
                <select
                    // disabled={roomInfo.mainImage}
                    value={roomInfo.roomType}
                    onChange={(e) => update({ roomType: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#e5e7eb]">
                    <option>{get_text("choose_room_type", userLanguage)}</option>
                    <option value="personal">{get_text("personal", userLanguage)}</option>
                    <option value="educational">{get_text("educational", userLanguage)}</option>
                </select>
            </div> */}
            <button onClick={handleGenerateRoom}>Generate Room info</button>
            {/* {isLoading ? (
                <Loader variation="linear" />
            ) : (
                <>
                    <Text fontWeight="bold">{data?.name}</Text>
                    {/* <Text>{data?.description}</Text> 
                    <Text>{data?.subTopics?.join(", ")}</Text>
                     <Text>{data?.categorizingQuizTopics?.join(", ")}</Text> 
                </>
            )} */}
            {/* Field */}
            <div className="mb-3">
                <label className="flex text-lg mb-1.5 text-white">
                    {get_text("room_field", userLanguage)}{" "}
                    <span
                        className="text-red-400 cursor-pointer"
                        title={get_text("mandatory_field", userLanguage)}>
                        *
                    </span>
                </label>
                <select
                    // disabled={roomInfo.mainImage}
                    value={roomInfo.roomField}
                    onChange={(e) => update({ roomField: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white">
                    <option>{get_text("choose_room_field", userLanguage)}</option>
                    {Object.keys(fieldsOfStudy).map((field) => {
                        return (
                            <option key={field} value={field}>
                                {fieldsOfStudy[field][userLanguage]}
                            </option>
                        );
                    })}
                </select>
            </div>
            {/* Topic */}
            {roomInfo.roomType === "educational" && (
                <div className="mb-3">
                    <label className="flex text-lg mb-1.5 text-white">
                        {get_text("topic", userLanguage)}{" "}
                        <span
                            className="text-red-400 cursor-pointer"
                            title={get_text("mandatory_field", userLanguage)}>
                            *
                        </span>
                    </label>
                    <input
                        value={roomInfo.roomTopic}
                        disabled={roomInfo.roomType !== "educational"}
                        onChange={(e) => update({ roomTopic: e.target.value })}
                        placeholder={get_text("eg_first_aid", userLanguage)}
                        className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                    />
                </div>
            )}
            {/* Name */}
            <div className="mb-3">
                <label className="flex text-lg mb-1.5 text-white">
                    {get_text("name", userLanguage)}{" "}
                    <span
                        className="text-red-400 cursor-pointer"
                        title={get_text("mandatory_field", userLanguage)}>
                        *
                    </span>
                </label>
                <input
                    value={roomInfo.roomName}
                    onChange={(e) => update({ roomName: e.target.value })}
                    placeholder={get_text("room_name", userLanguage)}
                    className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                />
            </div>
            {/* Description */}
            <div className="mb-4">
                <label className="flex text-lg mb-1.5 text-white">
                    {get_text("desc", userLanguage)}
                </label>
                <textarea
                    value={roomInfo.roomDescription}
                    onChange={(e) => update({ roomDescription: e.target.value })}
                    placeholder={get_text("room_desc", userLanguage)}
                    rows={4}
                    className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                    style={{
                        resize: "vertical",
                    }}
                />
            </div>
            {/* Color selection with background preview */}
            <div className="mb-5">
                <label className="flex text-lg mb-4 text-white">
                    {get_text("color", userLanguage)}
                </label>
                <div className="flex gap-x-6 gap-y-6 flex-wrap">
                    {COLOR_GROUPS.map((colorGroup, i) => {
                        const active = roomInfo.roomColor === colorGroup;
                        return (
                            <div
                                key={i}
                                onClick={() =>
                                    update({ roomColor: colorGroup, roomStyle: "realistic" })
                                }
                                className={`relative cursor-pointer ${active ? "border-4 border-cyan-500" : "border-4 border-gray-600"} rounded-lg overflow-hidden bg-gray-800`}
                                aria-pressed={active}>
                                {/* Background Image Preview */}
                                <div
                                    className="w-48 h-32 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${
                                            colorPalette[colorGroup as keyof typeof colorPalette]
                                                .background
                                        })`,
                                    }}></div>
                                {/* Color Palette Preview */}
                                <div className="p-3 flex items-center justify-center gap-2 rounded-lg min-h-12">
                                    <div
                                        className={`rounded-full border border-gray-600 transition-transform duration-300 w-8 h-8 ${
                                            active ? "scale-125" : "scale-100"
                                        }`}
                                        style={{
                                            background:
                                                colorPalette[
                                                    colorGroup as keyof typeof colorPalette
                                                ].dark,
                                        }}></div>
                                    <div
                                        className={`rounded-full border border-gray-600 transition-transform duration-300 w-8 h-8 ${
                                            active ? "scale-125" : "scale-100"
                                        }`}
                                        style={{
                                            background:
                                                colorPalette[
                                                    colorGroup as keyof typeof colorPalette
                                                ].bright,
                                        }}></div>
                                    <div
                                        className={`rounded-full border border-gray-600 transition-transform duration-300 w-8 h-8 ${
                                            active ? "scale-125" : "scale-100"
                                        }`}
                                        style={{
                                            background:
                                                colorPalette[
                                                    colorGroup as keyof typeof colorPalette
                                                ].light,
                                        }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Font selection */}
            <div className="mb-5">
                <label className="flex text-lg mb-2 text-white">
                    {get_text("font", userLanguage)}
                </label>
                <div className="flex gap-3 flex-wrap">
                    {FONT_OPTIONS.map((f, idx) => {
                        const active = roomInfo.roomFont === f;
                        return (
                            <button
                                key={idx}
                                onClick={() => update({ roomFont: f })}
                                aria-pressed={active}
                                className={`py-2.5 px-3 rounded-lg cursor-pointer h-24 w-32 bg-gray-800 text-white text-center min-w-28 ${active ? "border-2 border-cyan-500" : "border border-gray-600"}`}>
                                <div
                                    style={{
                                        fontSize: 30,
                                        fontFamily: fontFamily[f as keyof typeof fontFamily],
                                    }}>
                                    {userLanguage === "he" ? "אב גד" : "Aa Bb"}
                                </div>
                                <div className="text-base text-gray-400 mt-1.5">{f}</div>
                            </button>
                        );
                    })}
                </div>
            </div>
            {/* Preview */}
            <div className="mt-3 mb-5">
                <label className="flex text-lg mb-2 text-white">
                    {get_text("preview", userLanguage)}
                </label>
                <div
                    className="rounded-lg border border-gray-600 p-4 min-h-32 w-full h-full"
                    style={{
                        backgroundImage: `url(${
                            colorPalette[roomInfo.roomColor as keyof typeof colorPalette].background
                        })`,
                        backgroundSize: "cover",
                    }}>
                    <div
                        className="w-2/3 h-2/3 px-8 border-2 ml-auto bg-gray-900/80 backdrop-blur-sm rounded-lg"
                        style={{
                            borderColor:
                                colorPalette[roomInfo.roomColor as keyof typeof colorPalette].light,
                            fontFamily: fontFamily[roomInfo.roomFont as keyof typeof fontFamily],
                        }}>
                        <h3
                            className="my-2 w-fit ml-auto rounded-lg p-1"
                            style={{
                                color: colorPalette[roomInfo.roomColor as keyof typeof colorPalette]
                                    .bright,
                                backgroundColor:
                                    colorPalette[roomInfo.roomColor as keyof typeof colorPalette]
                                        .light,
                            }}>
                            {roomInfo.roomName || get_text("room_name", userLanguage)}
                        </h3>
                        <p
                            className="my-2 w-fit ml-auto rounded-lg p-1"
                            style={{
                                color: colorPalette[roomInfo.roomColor as keyof typeof colorPalette]
                                    .dark,
                                backgroundColor:
                                    colorPalette[roomInfo.roomColor as keyof typeof colorPalette]
                                        .light,
                            }}>
                            {roomInfo.roomDescription || get_text("room_desc", userLanguage)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 items-center">
                <button
                    onClick={handleEnd}
                    disabled={loading}
                    className="text-white bg-cyan-500 hover:bg-cyan-600 border-0 py-2.5 px-3.5 rounded-lg cursor-pointer transition-colors">
                    {loading
                        ? get_text("saving", userLanguage)
                        : get_text("next_page", userLanguage)}
                </button>
                <button
                    onClick={() => {
                        localStorage.removeItem(LOCAL_KEY);
                        setRoomInfo({
                            roomType: "educational",
                            roomField: "",
                            roomTopic: "",
                            roomName: "",
                            roomDescription: "",
                            roomStyle: "realistic",
                            roomColor: COLOR_GROUPS[0],
                            roomFont: FONT_OPTIONS[0],
                            roomMainImage: "",
                            roomCoverImage: "",
                        });
                        setStatus("Draft cleared");
                    }}
                    disabled={loading}
                    className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white py-2.5 px-3 rounded-lg cursor-pointer transition-colors">
                    {get_text("clear_draft", userLanguage)}
                </button>
                {status && <div className="ml-2 text-gray-300">{status}</div>}
            </div>
        </div>
    );
};

// import { useState } from 'react';
// import { Flex, TextAreaField, Loader, Text, View, Button } from "@aws-amplify/ui-react";

// export default function App() {
//     const [description, setDescription] = useState<string>("");
//     const [{ data, isLoading }, generateRoom] = useAIGeneration("generateRoom");

//     const handleClick = async () => {
//         generateRoom({ description });
//     };

//     return (
//         <Flex direction="column">
//             <Flex direction="row">
//                 <TextAreaField
//                     autoResize
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     label="Description"
//                 />
//                 <Button onClick={handleClick}>Generate recipe</Button>
//             </Flex>
//             {isLoading ? (
//                 <Loader variation="linear" />
//             ) : (
//                 <>
//                     <Text fontWeight="bold">{data?.name}</Text>
//                     <View as="ul">
//                         {data?.cardSortingQuizTopics?.map((ingredient) => (
//                             <View as="li" key={ingredient}>
//                                 {ingredient}
//                             </View>
//                         ))}
//                     </View>
//                     {/* <Text>{data?.instructions}</Text> */}
//                 </>
//             )}
//         </Flex>
//     );
// }
