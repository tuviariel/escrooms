export const schema = {
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
                1. "physical_object_selection" - for text that describes concrete items, tools, materials, or physical entities that can be identified or distinguished from one another.
                2. "event_to_category_matching" - for text that contains multiple events, actions, or concepts that naturally fall into distinct categories or themes.
                3. "logical_or_chronological_ordering" - for text that includes sequences, processes, steps, timelines, or any content that implies an order.
                4. "true_false_fact_questions" - for text that presents standalone facts, statements, descriptions, or informational content that can be turned into correctness-based questions.
            - "explanation": an explanation of why that quiz type is the most suitable for the subtopic, in the user language, in 100 words or less.
            The output should be an array of such objects, ordered according to the original structure of the text and includes at least 2 objects for each quiz type.
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
            }, where each question is an object with the following fields:
                - "situationAndAction": the situation and action to be performed or the fact to be checked
                - "correctIcon": a unique icon that is not used in this quiz for the correct answer - should be logically related to the situation and action
                - "incorrectIcon": a unique icon that is not used in this quiz for the incorrect answer - should be logically related to not performing the situation and action
                - "hint": a hint that can imply the correct action or the correct fact for the question
                - "is_correct_action": "true" if the action or fact is correct, "false" if otherwise
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
            }, where in the first array there are 10 unique objects of physical objects that appear or are related to the text
            and in the second array there are 10 unique objects of physical objects that are not related in any way to the text.
            In each the "icon" should be a unique icon string that represents the object and the "title" should be the name of the object`,
    event_to_category_matching: `{
                "questions": [
                {
                    "title": "string",
                    "desc": "string",
                    "status": {
                        "description-value-1": "string",
                        "description-value-2": "string",
                        "description-value-3": "string",
                        "description-value-4": "string",
                    },
                    "answer": { "category-1": "string", "category-2": "string" },
                    "image": "string",
                }
            ],
            quizInstructions: "string",
        }, where each question is an object with the following fields:
            - "title": the title of the event or situation
            - "desc": a short description of the event or situation
            - "status": an object with up to 4 key-value pairs where the key is a precise description topic (to be generated by you, the AI) and the value is the precise descriptive value of that event for that topic:
                - "description-value-1": the precise descriptive value of the event for the first description topic
                - "description-value-2": the precise descriptive value of the event for the second description topic
                - "description-value-3": the precise descriptive value of the event for the third description topic
                - "description-value-4": the precise descriptive value of the event for the fourth description topic
            - "answer": an object with two key-value pairs where the key is the category topic (to be generated by you, the AI) and the value is the correct answer for that category to the event or situation:
                - "category-1": the first category topic - should be one of two options that each event can fall into (an either-or choice).
                - "category-2": the second category topic - should be one of three options that each event can fall into (an either-or-or choice).
            - "image": an empty string for now.
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
        }, where each question is an object with the following fields:
            - "title": the title of the event or action
            - "content": the content of the event or action
            - "explanation": an explanation of how to perform the event or action
            - "interesting_insights": an interesting insight about the event or action that is not obvious
            The objects must be in the correct order of the events or actions logical or chronological order`,
};
