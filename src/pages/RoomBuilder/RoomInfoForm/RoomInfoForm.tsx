import { useEffect, useState } from "react";
import { get_text } from "../../../util/language";
import { useUserContext } from "../../../contexts/userStyleContext";
import { colorPalette, fontFamily, imageStyle } from "../../../util/UIstyle";
import { roomsService } from "../../../services/service";
import { useSelector } from "react-redux";
import { userType } from "../../../components/Login/Login";
import { fieldsOfStudy } from "../../../util/utils";

type RoomInfo = {
    roomType: string;
    roomField: string;
    roomTopic: string;
    roomName: string;
    roomDescription: string;
    roomStyle: string; // a background image url
    roomColor: string; // hex * 3 (light, dark, bright)
    roomFont: string; // font-family
};
type RoomInfoProps = {
    setStep: (index: number) => void;
    setRoomId: (id: string) => void;
    roomId: string;
};
const LOCAL_KEY = "roomInfoData";

const BACKGROUNDS = Object.keys(imageStyle);
const COLOR_GROUPS = Object.keys(colorPalette);
const FONT_OPTIONS = Object.keys(fontFamily);

export const RoomInfoForm = ({ setStep, setRoomId, roomId }: RoomInfoProps) => {
    const [roomInfo, setRoomInfo] = useState<RoomInfo>({
        roomType: "educational",
        roomField: "",
        roomTopic: "",
        roomName: "",
        roomDescription: "",
        roomStyle: BACKGROUNDS[0],
        roomColor: COLOR_GROUPS[0],
        roomFont: FONT_OPTIONS[0],
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
                    colorPalette: roomInfo.roomColor || "redBlueGray",
                    imageStyle: roomInfo.roomStyle || "realistic",
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
                    colorPalette: roomInfo.roomColor || "redBlueGray",
                    imageStyle: roomInfo.roomStyle || "realistic",
                    fontFamily: roomInfo.roomFont || "sansSerif",
                    description: roomInfo.roomDescription,
                });
                if (res && res.id) {
                    setRoomId(res.id);
                }
            }
            console.log("Room created:", res);
            // success: clear draft
            // localStorage.removeItem(LOCAL_KEY);
            setStatus("Saved successfully.");
            setStep(1);
        } catch (err) {
            console.error(err);
            setStatus("Failed to save. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mt-0 mx-20 py-4" dir={userLanguage === "he" ? "rtl" : "ltr"}>
            {/* Type- for adding options like non generated rooms for private events */}
            {/* <div className="mb-3">
                <label className="flex text-base mb-1.5">
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
            {/* Field */}
            <div className="mb-3">
                <label className="flex text-base mb-1.5">
                    {get_text("room_field", userLanguage)}{" "}
                    <span
                        className="text-red-500 cursor-pointer"
                        title={get_text("mandatory_field", userLanguage)}>
                        *
                    </span>
                </label>
                <select
                    // disabled={roomInfo.mainImage}
                    value={roomInfo.roomField}
                    onChange={(e) => update({ roomField: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#e5e7eb]">
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
                    <label className="flex text-base mb-1.5">
                        {get_text("topic", userLanguage)}{" "}
                        <span
                            className="text-red-500 cursor-pointer"
                            title={get_text("mandatory_field", userLanguage)}>
                            *
                        </span>
                    </label>
                    <input
                        value={roomInfo.roomTopic}
                        disabled={roomInfo.roomType !== "educational"}
                        onChange={(e) => update({ roomTopic: e.target.value })}
                        placeholder={get_text("eg_first_aid", userLanguage)}
                        className="w-full p-2 rounded-lg border border-[#e5e7eb]"
                    />
                </div>
            )}
            {/* Name */}
            <div className="mb-3">
                <label className="flex text-base mb-1.5">
                    {get_text("name", userLanguage)}{" "}
                    <span
                        className="text-red-500 cursor-pointer"
                        title={get_text("mandatory_field", userLanguage)}>
                        *
                    </span>
                </label>
                <input
                    value={roomInfo.roomName}
                    onChange={(e) => update({ roomName: e.target.value })}
                    placeholder={get_text("room_name", userLanguage)}
                    className="w-full p-2 rounded-lg border border-[#e5e7eb]"
                />
            </div>
            {/* Description */}
            <div className="mb-4">
                <label className="flex text-base mb-1.5">{get_text("desc", userLanguage)}</label>
                <textarea
                    value={roomInfo.roomDescription}
                    onChange={(e) => update({ roomDescription: e.target.value })}
                    placeholder={get_text("room_desc", userLanguage)}
                    rows={4}
                    className="w-full p-2 rounded-lg border border-[#e5e7eb]"
                    style={{
                        resize: "vertical",
                    }}
                />
            </div>
            {/* Style selection */}
            <div className="mb-5">
                <label className="flex text-base mb-2">{get_text("style", userLanguage)}</label>
                <div className="flex gap-3 flex-wrap">
                    {BACKGROUNDS.map((style, i) => {
                        const active = roomInfo.roomStyle === style;
                        return (
                            <div className="flex flex-col overflow-hidden" key={i}>
                                <label className={`flex mb-1 ${active}`}>
                                    {get_text(style, userLanguage)}
                                </label>
                                <div
                                    onClick={() => update({ roomStyle: style })}
                                    className={`cursor-pointer w-36 h-24 rounded-lg p-0 ${active ? "border-2 border-[#2563eb]" : "border border-[#e5e7eb]"}`}
                                    aria-pressed={active}
                                    style={{
                                        backgroundImage: `url(${imageStyle[style as keyof typeof imageStyle].background})`,
                                        backgroundSize: "cover",
                                    }}>
                                    <div
                                        className={`mt-10 mr-10 z-10 w-30 h-20 overflow-hidden rounded-lg ${active ? "border-b-2 border-l-2 border-[#2563eb]" : "border-b border-l border-[#e5e7eb]"}`}
                                        style={{
                                            backgroundImage: `url(${imageStyle[style as keyof typeof imageStyle].semiBackground})`,
                                            backgroundSize: "cover",
                                        }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Color selection */}
            <div className="mb-5">
                <label className="flex text-base mb-2">{get_text("color", userLanguage)}</label>
                <div className="flex gap-3 flex-wrap">
                    {COLOR_GROUPS.map((colorGroup, i) => {
                        const active = roomInfo.roomColor === colorGroup;
                        return (
                            <div
                                key={i}
                                onClick={() => update({ roomColor: colorGroup })}
                                className={`relative cursor-pointer w-20 h-12 rounded-full ${active ? "border-4 border-[#2563eb]" : "border border-[#e5e7eb]"}`}
                                aria-pressed={active}>
                                <div
                                    className={`absolute -top-3 right-1/2 translate-x-1/2 cursor-pointer w-10 h-10 rounded-full z-10 border border-black`}
                                    style={{
                                        background:
                                            colorPalette[colorGroup as keyof typeof colorPalette]
                                                .bright,
                                    }}></div>
                                <div
                                    className={`absolute top-3 right-0 cursor-pointer w-10 h-10 rounded-full z-20 border border-black`}
                                    style={{
                                        background:
                                            colorPalette[colorGroup as keyof typeof colorPalette]
                                                .dark,
                                    }}></div>
                                <div
                                    className={`absolute top-3 left-0 cursor-pointer w-10 h-10 rounded-full z-20 border border-black`}
                                    style={{
                                        background:
                                            colorPalette[colorGroup as keyof typeof colorPalette]
                                                .light,
                                    }}></div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Font selection */}
            <div className="mb-5">
                <label className="flex text-base mb-2">{get_text("font", userLanguage)}</label>
                <div className="flex gap-3 flex-wrap">
                    {FONT_OPTIONS.map((f, idx) => {
                        const active = roomInfo.roomFont === f;
                        return (
                            <button
                                key={idx}
                                onClick={() => update({ roomFont: f })}
                                aria-pressed={active}
                                className={`py-2.5 px-3 rounded-lg cursor-pointer h-24 w-32 bg-[#ffffff] text-center min-w-28 ${active ? "border-2 border-[#2563eb]" : "border border-[#e5e7eb]"}`}>
                                <div
                                    style={{
                                        fontSize: 30,
                                        fontFamily: fontFamily[f as keyof typeof fontFamily],
                                    }}>
                                    {userLanguage === "he" ? "אב גד" : "Aa Bb"}
                                </div>
                                <div className="text-base text-[#6b7280] mt-1.5">{f}</div>
                            </button>
                        );
                    })}
                </div>
            </div>
            {/* Preview */}
            <div className="mt-3 mb-5">
                <label className="flex text-base mb-2">{get_text("preview", userLanguage)}</label>
                <div
                    className="rounded-lg corder border-[#e5e7eb] p-4 min-h-32 w-full h-full"
                    style={{
                        backgroundImage: `url(${imageStyle[roomInfo.roomStyle as keyof typeof imageStyle].background})`,
                        backgroundSize: "cover",
                    }}>
                    <div
                        className="w-2/3 h-2/3 px-8 border-2 ml-auto"
                        style={{
                            backgroundImage: `url(${imageStyle[roomInfo.roomStyle as keyof typeof imageStyle].semiBackground})`,
                            backgroundSize: "cover",
                            borderColor:
                                colorPalette[roomInfo.roomColor as keyof typeof colorPalette].light,
                            fontFamily: roomInfo.roomFont,
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
                    className="text-[#ffffff] bg-blue-600 border-0 py-2.5 px-3.5 rounded-lg cursor-pointer">
                    {loading
                        ? get_text("saving...", userLanguage)
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
                            roomStyle: BACKGROUNDS[0],
                            roomColor: COLOR_GROUPS[0],
                            roomFont: FONT_OPTIONS[0],
                        });
                        setStatus("Draft cleared");
                    }}
                    disabled={loading}
                    className="bg-[#ffffff] border border-[#e5e7eb] py-2.5 px-3 rounded-lg cursor-pointer">
                    {get_text("clear_draft", userLanguage)}
                </button>
                {status && <div className="ml-2 text-[#374151]">{status}</div>}
            </div>
        </div>
    );
};
