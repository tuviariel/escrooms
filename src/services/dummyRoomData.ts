import Q1D1 from "../assets/images/10.png";
import Q1D2 from "../assets/images/11.png";
import Q1D3 from "../assets/images/12.png";
import Q1D4 from "../assets/images/13.png";
import Q1D5 from "../assets/images/14.png";
import Q1Image from "../assets/images/24.png";
import Q3D1 from "../assets/images/colorCards/1.png";
import Q3D2 from "../assets/images/colorCards/2.png";
import Q3D3 from "../assets/images/colorCards/3.png";
import Q3D4 from "../assets/images/colorCards/4.png";
import Q3D5 from "../assets/images/colorCards/5.png";
import Q3D6 from "../assets/images/colorCards/6.png";
import Q3D7 from "../assets/images/colorCards/mianImage.png";
import Q3O1 from "../assets/images/colorCards/colors/1.png";
import Q3O2 from "../assets/images/colorCards/colors/2.png";
import Q3O3 from "../assets/images/colorCards/colors/3.png";
import Q3O4 from "../assets/images/colorCards/colors/4.png";
import Q3O5 from "../assets/images/colorCards/colors/5.png";
import MainFraud from "../assets/images/fraud.png";

const data = {
    _id: "kjbhdfvksjdf",
    name: "עזרה ראשונה", //First Aid
    mainImage: MainFraud,
    colorPalette: "redBlueGray",
    imageStyle: "realistic",
    fontFamily: "sansSerif",
    description: "משחק חינוכי ללימוד על עזרה ראשונה",
    quiz: [
        {
            _id: "1",
            type: "7segments",
            answer: "247",
            quiz: [
                {
                    situationAndAction: "חבר התעלף. השכבת אותו על הגב והרמת את הרגליים.",
                    icons: { correct: "🪑", incorrect: "⚡" },
                    hint: "הרמת הרגליים מסייעת לזרימת דם טובה יותר למוח.",
                    is_correct_action: true,
                },
                {
                    situationAndAction: "מישהו מדמם מחתך. שטפת את הפצע במים בלבד בלי ללחוץ.",
                    icons: { correct: "🩹", incorrect: "💧" },
                    hint: "חשוב להפעיל לחץ ישיר עם בד נקי כדי לעצור את הדימום.",
                    is_correct_action: false,
                },
                {
                    situationAndAction: "לילד יש דימום מהאף. הטית את הראש קדימה ולחצת קלות על האף.",
                    icons: { correct: "👃", incorrect: "🚫" },
                    hint: "הראש צריך להיות מוטה קדימה, לא אחורה, כדי למנוע בליעת דם.",
                    is_correct_action: true,
                },
                {
                    situationAndAction: "אדם נגע במחבת חמה. שטפת את המקום במים קרים זורמים.",
                    icons: { correct: "💧", incorrect: "🔥" },
                    hint: "בכוויות יש לקרר במים זורמים, לא לשים קרח או שמנים.",
                    is_correct_action: true,
                },
                {
                    situationAndAction: "דבורה עקצה מישהו. לחצת עם האצבע והוצאת את העוקץ.",
                    icons: { correct: "🐝", incorrect: "🪓" },
                    hint: "לא לוחצים על העוקץ – יש לגרד עם כרטיס כדי לא להחדיר עוד רעל.",
                    is_correct_action: false,
                },
                {
                    situationAndAction: "מישהו נחנק מאוכל. נתת לו מכות חזקות בין השכמות.",
                    icons: { correct: "🍽️", incorrect: "❓" },
                    hint: "מכות בין השכמות עוזרות לשחרר את הגורם החוסם בדרכי הנשימה.",
                    is_correct_action: true,
                },
                {
                    situationAndAction: "לאדם נשברה היד. הזזת אותה כדי לבדוק אם כואב.",
                    icons: { correct: "🦴", incorrect: "🚷" },
                    hint: "אסור להזיז יד שבורה – צריך לקבע אותה במקומה.",
                    is_correct_action: false,
                },
                {
                    situationAndAction: 'מישהו התלונן על כאב חד בחזה. התקשרת מיד למד"א.',
                    icons: { correct: "☎️", incorrect: "⏳" },
                    hint: "במקרה של כאב בחזה כל דקה חשובה – מזעיקים עזרה מיידית.",
                    is_correct_action: true,
                },
            ],
            quizImg: Q1Image,
            outerQuizImg: Q1Image,
            quizText: "טקסט מסביר את המשימה...",
            quizData: [Q1D1, Q1D2, Q1D3, Q1D4, Q1D5],
            category: null,
            orderAnswer: null,
            // correctOptions: [co1, co2, co3, co4, co5, co6, co7, co8, co9, co10, co11, co12],
            // inCorrectOptions: [inCo1, inCo2, inCo3, inCo4, inCo5, inCo6, inCo7, inCo8, inCo9],
            hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
        },
        {
            _id: "2",
            type: "gridPlay",
            answer: "בדה",
            quizImg: "imageURL",
            outerQuizImg: Q1Image,
            quizText: "עבור כל דמות וסיטואציה חובה לקבוע אם הוא פעל כראוי או אם עבר על איסוי מעילה",
            quizData: ["imageURL"],
            category: null,
            orderAnswer: null,
            // correctOptions: ["correct1", "correct2", "correct3", "correct4"],
            // inCorrectOptions: ["incorrect1", "incorrect2", "incorrect3", "incorrect4"],
            hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
        },
        {
            _id: "3",
            type: "colorChange",
            answer: "1491",
            quizImg: Q3D7,
            outerQuizImg: Q1Image,
            quizText:
                "עבור כל דמות וסיטואציה חובה לקבוע אם הוא פעל כראוי או אם עבר על איסור מעילה. כדאי לעיין בעיתון לקבל משום תובנות...",
            quizData: [Q3D1, Q3D2, Q3D3, Q3D4, Q3D5, Q3D6],
            category: [
                [Q3O1, Q3O2],
                [Q3O3, Q3O4, Q3O5],
            ],
            orderAnswer: [
                [0, 0],
                [1, 2],
                [1, 1],
                [1, 1],
                [0, 2],
                [1, 0],
            ], //must change to real answer
            // correctOptions: ["correct1", "correct2", "correct3", "correct4"],
            // inCorrectOptions: ["incorrect1", "incorrect2", "incorrect3", "incorrect4"],
            hints: [
                "לחצו על הדפים השונים עד שיתגלה הדין הנכון של הסיטואציה",
                "כמובן, שצריך לסיים לתייג את כל הדפים",
                "לאחר מכן, יש לסדר את הדפים לפי הסדר הנכון- שנבין מה כתוב באמצע",
                "...והקשיבו",
                "אולי שמישהו יקרא את שמות המשפחה לפי הסדר ומישהוא אחר יקשיב לו...",
            ],
        },
        {
            _id: "4",
            type: "turnRound",
            answer: "1234",
            quizImg: "imageURL",
            outerQuizImg: Q1Image,
            quizText: "imageURL",
            quizData: ["imageURL"],
            category: null,
            orderAnswer: null,
            // correctOptions: ["correct1", "correct2", "correct3", "correct4"],
            // inCorrectOptions: ["incorrect1", "incorrect2", "incorrect3", "incorrect4"],
            hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
        },
        {
            _id: "5",
            type: "7segments",
            answer: "247",
            quizImg: Q1Image,
            outerQuizImg: Q1Image,
            quizText: "טקסט מסביר את המשימה...",
            quizData: [Q1D1, Q1D2, Q1D3, Q1D4, Q1D5],
            category: null,
            orderAnswer: null,
            // correctOptions: [co9, co9, co9, co9, co9, co9, co9, co9, co9, co9, co9, co9],
            // inCorrectOptions: [co9, co9, co9, co9, co9, co9, co9, co9, co9],
            hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
        },
    ],
};
export default data;
