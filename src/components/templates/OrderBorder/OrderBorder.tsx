import { useEffect, useState } from "react";
import { ListNumObj } from "../../../util/utils";
import { TemplateProps } from "../../../pages/QuizTemplate/QuizTemplate";
import { colorPalette } from "../../../util/UIstyle";
import { useRoomContext } from "../../../contexts/roomStyleContext";
import { get_text } from "../../../util/language";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableCard from "./SortableCard";

import { useUserContext } from "../../../contexts/userStyleContext";
import AnswerButton from "../../AnswerButton";
export const OrderBorder = (props: TemplateProps) => {
    const { data, result, setResult, setOpenLock } = props;
    const { userLanguage } = useUserContext();
    const [cards, setCards] = useState<
        {
            id: number;
            data: {
                title: string;
                content: string;
                explanation: string;
                interesting_insights: string;
            };
            borders: string;
        }[]
    >([]);
    const [disabled, setDisabled] = useState(false);
    const [initial, setInitial] = useState(false);
    const { roomColor } = useRoomContext();
    useEffect(() => {
        const setList = () => {
            // Check if saved state exists in localStorage
            const savedState = data?.id && localStorage.getItem(data.id);
            if (savedState) {
                try {
                    const parsed = JSON.parse(savedState);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setCards(parsed);
                        setInitial(true);
                        return;
                    }
                } catch (e) {
                    console.error("Failed to parse localStorage:", e);
                }
            }

            // If no saved state, create new cards
            setCards(() => {
                let answer = "";
                if (/\d/.test(data.answer[0]) && data.answer.length % 2 === 0) {
                    //checking if answer is a number-
                    answer = data.answer;
                } else {
                    //if it is a letter it shouldn't work, yet
                    answer = data.answer;
                }
                let create: any[] = new Array(data.quiz.length).fill(null).map((_, i) => {
                    return {
                        data: data.quiz[i],
                        borders:
                            ListNumObj[i % 2 === 0 ? answer[i / 2] : answer[(i - 1) / 2]][
                                i % 2 === 0 ? 0 : 1
                            ],
                        id: i,
                    };
                });
                // console.log(create);
                create = create.sort(() => Math.random() - 0.5);
                // console.log(create);
                return create;
            });
            setInitial(true);
        };
        setList();
    }, []);
    useEffect(() => {
        if (initial && cards.length > 0) {
            checkAnswer(false);
            // Save to localStorage on every change
            if (data?.id) {
                localStorage.setItem(data.id, JSON.stringify(cards));
            }
        }
    }, [cards, initial]);
    const checkAnswer = (buttonClicked: boolean) => {
        let finished = true;
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (card.id !== i) {
                finished = false;
                console.log("at finished: ", finished);
                buttonClicked && setResult(get_text("wrong", userLanguage));
                break;
            } //maybe add a validator to check if the some answers are correct
        }
        if (finished) {
            console.log("at finished: ", finished);
            buttonClicked && setResult(get_text("success", userLanguage));
            setDisabled(true);
        }
    };

    const sensors =
        window.outerWidth > 968
            ? useSensors(
                  useSensor(PointerSensor, {
                      activationConstraint: {
                          distance: 5,
                      },
                  }),
                  useSensor(KeyboardSensor, {
                      coordinateGetter: sortableKeyboardCoordinates,
                  })
              )
            : useSensors(
                  useSensor(TouchSensor, {
                      activationConstraint: {
                          distance: 5,
                      },
                  }),
                  useSensor(KeyboardSensor, {
                      coordinateGetter: sortableKeyboardCoordinates,
                  })
              );

    const handleDragEnd = (event: any) => {
        if (disabled) return;
        const { active, over } = event;
        result === get_text("wrong", userLanguage) && setResult("");
        if (active.id !== over?.id) {
            const oldIndex = cards.findIndex((c) => c.id === active.id);
            const newIndex = cards.findIndex((c) => c.id === over.id);
            const newCards = arrayMove(cards, oldIndex, newIndex);
            setCards(newCards);
            // onOrderChange?.(newCards);
            // setTimeout(() => {
            //     checkAnswer(false);
            // }, 3000);
        }
    };

    // console.log(cards);
    return (
        <div
            style={{
                backgroundImage: `url(${colorPalette[roomColor as keyof typeof colorPalette].background})`,
                backgroundSize: "100% auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
            }}
            className="h-screen">
            <div
                className={`${disabled ? "h-8/9 lg:h-1/2 mt-3 lg:mt-56" : "h-4/5 lg:h-1/2 mt-10 lg:mt-56"} py-4 px-10 lg:px-40 ${
                    cards.length === 8
                        ? "columns-4"
                        : cards.length === 6
                          ? "columns-3"
                          : "columns-2"
                }`}
                dir="rtl">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={cards.map((c) => c.id)}
                        strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col items-center h-full">
                            {cards.map((card, i) => (
                                <SortableCard
                                    key={card.id}
                                    {...card}
                                    index={i}
                                    disabled={disabled}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
            {/* <div
                className={`${cards.length < 8 ? "ts:flex" : "ph:flex"} absolute bottom-2 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 hidden flex-col-reverse items-center justify-center`}>
                <Button
                    label={
                        result === get_text("success", userLanguage)
                            ? get_text("finish", userLanguage)
                            : get_text("check_answer", userLanguage)
                    }
                    onClick={() =>
                        result === get_text("success", userLanguage)
                            ? setOpenLock(true)
                            : checkAnswer(true)
                    }
                    className="text-xl lg:text-3xl"
                />
                {result && (
                    <div
                        className="w-fit py-1 px-4 rounded-xl text-center border-2"
                        style={{
                            color: colorPalette[roomColor as keyof typeof colorPalette].light,
                            borderColor: colorPalette[roomColor as keyof typeof colorPalette].light,
                        }}
                        dir={userLanguage === "he" ? "rtl" : "ltr"}>
                        {result}
                    </div>
                )}
            </div> */}
            <AnswerButton
                result={result}
                onClick={() => {
                    result === get_text("success", userLanguage)
                        ? setOpenLock(true)
                        : checkAnswer(true);
                }}
                active={cards}
            />
        </div>
    );
};
