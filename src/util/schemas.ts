export const schema = {
    article: `{
        "article": "string",
    }`,
    topicAndData: `{
                "sub_topics": [
                    {
                        "name": "string",
                        "content": "string", 
                        "mysterious_name": "string",
                        "quiz_type": "string",
                        "explanation": "string",
                    }
                ]
            }, where each sub-topic is an object with the following fields:
            - "name": the name of the subtopic
            - "mysterious_name": a name that expresses the subtopic in a mysterious context
            - "content": the full text of the paragraph related to that subtopic, without summarizing or omitting any part, and it must include at least 30 words.
            - "quiz_type": the most suitable quiz type for this subtopic, chosen from the following list:
                1. "physical_object_selection" - for text that describes concrete items, tools, materials, or physical entities that can be identified or distinguished from one another using text-icons.
                2. "event_to_category_matching" - for text that contains multiple events, actions, or concepts that naturally fall into distinct categories or themes.
                3. "logical_or_chronological_ordering" - for text that includes sequences, processes, steps, timelines, ordered physical layouts or any content that implies an order.
                4. "true_false_fact_questions" - for text that presents standalone facts, statements, descriptions, or informational content that can be turned into correctness-based questions.
            - "explanation": an explanation of why that quiz type is the most suitable for the subtopic, in the user language, in 100 words or less.
            The output should be an array of such objects, ordered according to the original structure of the text and includes at least 2 objects for each one of the four quiz types.
            Do not add interpretations, summaries, or commentary.
            Preserve all of the original wording of the section / paragraph / text exactly.`,
    true_false_fact_questions: `{
                "questions": [
                    {
                        "situationAndAction": "string",
                        "correctIcon": "string",
                        "incorrectIcon": "string",
                        "hint": "string",
                        "is_correct_action": "boolean",
                    }
                ],
                quizInstructions: "string",
            }. This quiz is a list of either Yes or No questions or statements or facts that are either correct or incorrect 
            (the user must choose the correct answer for each question- either Yes/correct or No/incorrect by selecting the correct icon).
            Each element in the array is an object with the following fields:
                - "situationAndAction": the situation and action to be performed or a fact to be checked or a yes-or-no question with a clear yes or no answer.
                - "correctIcon": a unique icon that should be logically related to the situation or action.
                - "incorrectIcon": a unique icon that should be logically related to not performing the situation or action.
                - "hint": a hint that can imply the correct action or the correct fact for the question.
                - "is_correct_action": "true" if the action or fact is correct, "false" if otherwise.
                there must be at least 10 objects in the array`,
    physical_object_selection: `{
                "questions": [
                    [
                        {
                            "icon": "string",
                            "title": "string",
                        }
                    ],
                    [
                        {
                            "icon": "string",
                            "title": "string",
                        }
                    ],
                ],
                quizInstructions: "string",
            }. This quiz includes two arrays of icon objects, 
            where in the first array there are 10 objects with unique text-icons that appear in or are related to the text,
            and in the second array there are 10 objects with unique text-icons that are not related in any way to the text 
            (the user must choose the related objects from a grid that includes both related and unrelated objects).
            In each object the "icon" should be a unique icon string that represents the object and the "title" should be the name of the object`,
    event_to_category_matching: `{
                "questions": [
                {
                    "title": "string",
                    "desc": "string",
                    "status": {
                        {key: "string", value: "string"},
                        {key: "string", value: "string"},
                        {key: "string", value: "string"},
                        {key: "string", value: "string"},
                    },
                    "answer": { {key: "string", value: "string"}, {key: "string", value: "string"} },
                    "image": "string",
                }
            ],
            quizInstructions: "string",
        }. This quiz is a list of events or situations or objects that can be categorized to the same subject (the user must choose the right value in each category for each event or situation or object).
        Each event or situation or object is represented by an object with the following fields:
            - "title": the title of the event or situation or object.
            - "desc": a short description of the event or situation or object.
            - "status": an object with up to 4 key-value pairs where in each object the key is the subject of the description (to be generated by you, the AI) and the value is the precise descriptive value of that event or situation or object for that subject.
            - "answer": an object with two key-value pairs where in both objects the key is the subject of the category (to be generated by you, the AI) and the value is the correct answer for that category in the event or situation or object. 
            In the first key value pair, the correct value should be an option out of only two options that relate to all the events or situations or objects this quiz is about,
            and in the second key value pair, the correct value should be an option out of only three options that relate to all the events or situations or objects this quiz is about.
            - "image": is a text-icon that represents the event or situation or object.
            There must be at least 5 objects in the array`,
    logical_or_chronological_ordering: `{
                "questions": [
                {
                    "title": "string",
                    "content": "string",
                    "explanation": "string",
                    "interesting_insights": "string",
                }
            ],
            quizInstructions: "string",
        }. This quiz is a list or a sequence of events or actions that must be performed or has been performed in a specific logical or chronological order
         or a physical layout that has a specific logical structured order (the user must sort the events or actions or items in the correct order).
        Each event or action is represented by an object with the following fields:
            - "title": the title of the event or action or item.
            - "content": the content or description of the event or action or item.
            - "explanation": an explanation of how to perform the event or action or about the item's position.
            - "interesting_insights": an interesting insight about the event or action or item that is not obvious
            Each object represents a single event or action or item that fit in to a logical or chronological order, 
            and must be in the correct order of the events or actions or items in the logical or chronological order`,
};
