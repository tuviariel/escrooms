interface TranslationEntry {
    [key: string]: string;
}
interface Translations {
    [key: string]: TranslationEntry; //{ en: string; he: string; ar: string; };
}

const appContext: Translations = {
    welcome: { en: "Welcome", he: "ברוכים הבאים", ar: "" },
    next_page: { en: "Next Page", he: "לעמוד הבא", ar: "" },
    no_next_page: { en: "No Next Page", he: "אין עמוד הבא", ar: "" },
    prev_page: { en: "Previous Page", he: "לעמוד הקודם", ar: "" },
    no_prev_page: { en: "No Previous Page", he: "אין עמוד הקודם", ar: "" },
    back_to_main: { en: "Back to main room", he: "חזרה לחדר הראשי", ar: "" },
    success: { en: "Success!", he: "הצלחה!", ar: "" },
    wrong: { en: "Wrong answer... Try again", he: "טעות... נסו שוב", ar: "" },
    continue: { en: "Your getting there... Continue", he: "אתם בדרך הנכונה... המשיכו", ar: "" },
    finish: { en: "Finish", he: "לסיום", ar: "" },
    answer_quiz: { en: "Enter Quiz Answer", he: "מלא תשובה לחידה", ar: "" },
    close: { en: "Close", he: "סגירה", ar: "" },
    close_quiz: { en: "Close Quiz", he: "סגירת חידה", ar: "" },
    check_answer: { en: "Check Answer", he: "בדיקת התשובה", ar: "" },
    more_info: { en: "More Info", he: "מידע נוסף", ar: "" },
    phone_on_side: {
        en: "Please turn your phone on its side",
        he: "אנא סובבו את מכשיר הסלולארי שלכם על צידו",
        ar: "",
    },
    give_hint: { en: "Yes, please give me a hint...", he: "כן, אשמח לקבל רמז בבקשה...", ar: "" },
    get_hint: { en: "Get Hints", he: "קבלו רמזים", ar: "" },
    close_hint: { en: "Close Hints", he: "סגור רמזים", ar: "" },
    do_want_hint: { en: "Do you want a hint?", he: "האם תרצה/י רמז?", ar: "" },
    do_want_another_hint: { en: "Do you want another hint?", he: "האם תרצה/י רמז נוסף?", ar: "" },
    cant_help_more: {
        en: "Sorry, I can't help you any more...",
        he: "מחילה, לא אוכל לעזור לך יותר...",
        ar: "",
    },
    you_can_do_it: {
        en: "Try using the hints I already gave you. You can do it!!",
        he: "נסה להשתמש ברמזים שכבר נתתי לך. אתה יכול לעשות את זה!!",
        ar: "",
    },
    welcome_hint: {
        en: "Hello!! I can help you by giving you hints...",
        he: "שלום! האם אוכל לעזור לך עם רמז?",
        ar: "",
    },
    prepare: { en: "Preparing Riddle", he: "מכין את החידה", ar: "" },
    leave_room: { en: "Leaving The Escape-Room", he: "עזב את החדר", ar: "" },
    are_you_sure: {
        en: "Are you sure you want to leave the escape-room?",
        he: "האם אתה בטוח שברצונך לעזוב את חדר הבריחה?",
        ar: "",
    },
    cancel: { en: "Cancel", he: "ביטול", ar: "" },
    exit_room: { en: "Exit Room", he: "יציאה מהחדר", ar: "" },
    enter_room: { en: "Enter Room", he: "כניסה לחדר", ar: "" },
    sexual_harassment: {
        en: "PreventingSexual Harassment",
        he: "מניעת הטרדות מיניות",
        ar: "",
    },
    first_aid: { en: "First Aid", he: "עזרה ראשונה", ar: "" },
    confirm: { en: "Confirm", he: "אישור", ar: "" },
    fraud: { en: "Embezzlement and fraud", he: "הונאות ומעילות", ar: "" },
    title: { en: "Educational Escape Rooms", he: "חדרי בריחה חינוכיים", ar: "" },
};

export const get_text = (name: string, lang: string) => {
    return appContext[name]
        ? appContext[name][lang]
            ? appContext[name][lang]
            : appContext[name]["en"]
        : name;
};
