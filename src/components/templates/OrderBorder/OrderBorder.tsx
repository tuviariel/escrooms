import { useEffect, useState } from "react";
import Button from "../../Button";
import { ListNumObj } from "../../../util/utils";
import { TemplateProps } from "../../../pages/QuizTemplate/QuizTemplate";
import { imageStyle } from "../../../util/UIstyle";
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

export const OrderBorder = (props: TemplateProps) => {
    const { data, result, setResult, setOpenLock } = props;
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
    // const [disabled, setDisabled] = useState(false);
    const { roomStyle } = useRoomContext();
    useEffect(() => {
        const setList = () => {
            setCards(() => {
                let answer = "";
                if (/\d/.test(data.answer[0])) {
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
        };
        setList();
    }, []);

    const checkAnswer = () => {
        let finished = true;
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (card.id !== i) {
                finished = false;
                setResult(get_text("wrong", "he"));
                break;
            }
        }
        if (finished) {
            setResult(get_text("success", "he"));
            // setDisabled(true);
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
        const { active, over } = event;
        result === get_text("wrong", "he") && setResult("");
        if (active.id !== over?.id) {
            const oldIndex = cards.findIndex((c) => c.id === active.id);
            const newIndex = cards.findIndex((c) => c.id === over.id);
            const newCards = arrayMove(cards, oldIndex, newIndex);
            setCards(newCards);
            // onOrderChange?.(newCards);
        }
    };

    // console.log(cards);
    return (
        <div
            style={{
                backgroundImage: `url(${imageStyle[roomStyle as keyof typeof imageStyle].background})`,
                backgroundSize: "cover",
            }}
            className="py-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                    items={cards.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col items-center">
                        {cards.map((card, i) => (
                            <SortableCard key={card.id} {...card} index={i} result={result} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            <div className="flex">
                <Button
                    label={
                        result === get_text("success", "he")
                            ? get_text("finish", "he")
                            : get_text("check_answer", "he")
                    }
                    onClick={() =>
                        result === get_text("success", "he") ? setOpenLock(true) : checkAnswer()
                    }
                    className="flex w-auto mx-10 min-w-fit "
                />
                {result && (
                    <div className="m-auto p-1 rounded-xl text-center bg-amber-50" dir="rtl">
                        {result}
                    </div>
                )}
            </div>
        </div>
    );
};
