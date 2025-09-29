import Q1D1 from "../assets/images/10.png";
import Q1D2 from "../assets/images/11.png";
import Q1D3 from "../assets/images/12.png";
import Q1D4 from "../assets/images/13.png";
import Q1D5 from "../assets/images/14.png";
import Q1Image from "../assets/images/24.png";
import Q3D1 from "../assets/images/colorCards/daniel.png";
import Q3D2 from "../assets/images/colorCards/maya.png";
import Q3D3 from "../assets/images/colorCards/tamar.png"; // 3 Needs to be changed
import Q3D4 from "../assets/images/colorCards/tamar.png";
import Q3D5 from "../assets/images/colorCards/tamar.png"; // 5 Needs to be changed
import Q3D6 from "../assets/images/colorCards/tamar.png"; // 6 Needs to be changed
import Q3O1 from "../assets/images/colorCards/colors/1.png";
import Q3O2 from "../assets/images/colorCards/colors/2.png";
import Q3O3 from "../assets/images/colorCards/colors/3.png";
import Q3O4 from "../assets/images/colorCards/colors/4.png";
import Q3O5 from "../assets/images/colorCards/colors/5.png";
import MainFirstAid from "../assets/images/First-aid.jpg";
import Clock from "../assets/images/clock2.png";
import Graph from "../assets/images/graph.jpeg";
import List from "../assets/images/checklist.png";
import Color from "../assets/images/colors.png";

const data = {
    _id: "kjbhdfvksjdf",
    name: "עזרה ראשונה",
    mainImage: MainFirstAid,
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
            quizImg: Clock,
            outerQuizImg: Q1Image,
            quizText: "עבור כל מקרה בטבלה צריך לקבוע אם הפעולה שננקטה הייתה נכונה או לא",
            quizData: [Q1D1, Q1D2, Q1D3, Q1D4, Q1D5],
            category: null,
            orderAnswer: null,
            hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
        },
        {
            _id: "2",
            type: "gridPlay",
            answer: "בדה",
            quiz: [
                [
                    { icon: "🩺", title: "סטטוסקופ" },
                    { icon: "💉", title: "מזרק" },
                    { icon: "🩹", title: "פלסטר" },
                    { icon: "🩸", title: "ערכת עירוי" },
                    { icon: "🧴", title: "חומר חיטוי" },
                    { icon: "🩻", title: "צילום רנטגן" },
                    { icon: "🧯", title: "בלון חמצן" },
                    { icon: "🚑", title: "אמבולנס" },
                ],
                [
                    { icon: "🎸", title: "גיטרה" },
                    { icon: "🎲", title: "קוביית משחק" },
                    { icon: "🚗", title: "מכונית" },
                    { icon: "📱", title: "טלפון נייד" },
                    { icon: "🎨", title: "פלטת צבעים" },
                    { icon: "🍕", title: "פיצה" },
                    { icon: "🏀", title: "כדור סל" },
                    { icon: "🎧", title: "אוזניות" },
                ],
            ],
            quizImg: Graph,
            outerQuizImg: Q1Image,
            quizText: "אתה מארגן תיק של ציוד עזרה ראשונה. מה תשים בתיק?",
            category: null,
            orderAnswer: null,
            hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
        },
        {
            _id: "3",
            type: "colorChange",
            answer: "1491",
            quiz: [
                {
                    title: "דניאל",
                    desc: "גבר בן 34, שיער חום קצר, לבוש בגדי עבודה, שוכב על הקרקע בהכרה חלקית עם פצע מדמם ברגל שמאל.",
                    status: {
                        הכרה: "מעורפל",
                        דופק: "חלש ומהיר",
                        נשימה: "נשימות שטחיות",
                        חשיפה: "דימום פנימי אפשרי בבטן",
                    },
                    answer: { "השגחה צמודה": "כן", "דחיפות פינוי": "מיידי" },
                    image: Q3D1,
                },
                {
                    title: "מאיה",
                    desc: "אישה בת 27, שיער שחור ארוך, יושבת בהכרה מלאה עם חתכים שטחיים בידיים ונשימה תקינה.",
                    status: {
                        הכרה: "בהכרה מלאה",
                        דופק: "תקין",
                        נשימה: "תקין",
                        חשיפה: "אין ממצאים נוספים",
                    },
                    answer: { "השגחה צמודה": "לא", "דחיפות פינוי": "לא דחוף" },
                    image: Q3D2,
                },
                {
                    title: "עומר",
                    desc: "גבר בן 40, גוף מלא, שוכב על צידו עם חבלה בראש, מדמם מהמצח ומגיב לאט לשאלות.",
                    status: {
                        הכרה: "ישנוני",
                        דופק: "חלש",
                        נשימה: "לא סדיר",
                        חשיפה: "פגיעת ראש חשודה",
                    },
                    answer: { "השגחה צמודה": "כן", "דחיפות פינוי": "מיידי" },
                    image: Q3D3,
                },
                {
                    title: "תמר",
                    desc: "נערה בת 16, בלונדינית, נמצאה יושבת בהלם עם פצע חתך עמוק בזרוע ימין אך בהכרה מלאה.",
                    status: {
                        הכרה: "בהכרה מלאה",
                        דופק: "מואץ",
                        נשימה: "מהיר",
                        חשיפה: "דימום חיצוני משמעותי בזרוע",
                    },
                    answer: { "השגחה צמודה": "כן", "דחיפות פינוי": "בהקדם" },
                    image: Q3D4,
                },
                {
                    title: "יוסי",
                    desc: "גבר בן 65, שיער אפור, נמצא שוכב על גבו, מתנשם בכבדות ומחזיק את החזה.",
                    status: {
                        הכרה: "מעורפל",
                        דופק: "חלש ולא סדיר",
                        נשימה: "קשה",
                        חשיפה: "חשד לחזה אוויר או פגיעה לבבית",
                    },
                    answer: { "השגחה צמודה": "כן", "דחיפות פינוי": "מיידי" },
                    image: Q3D5,
                },
                {
                    title: "נועה",
                    desc: "ילדה בת 10, שיער חום אסוף בקוקו, יושבת ומבכה עם שריטה בברך בלבד.",
                    status: {
                        הכרה: "בהכרה מלאה",
                        דופק: "תקין",
                        נשימה: "תקין",
                        חשיפה: "אין פגיעות נסתרות",
                    },
                    answer: { "השגחה צמודה": "לא", "דחיפות פינוי": "לא דחוף" },
                    image: Q3D6,
                },
            ],
            quizImg: Color,
            outerQuizImg: Q1Image,
            quizText:
                "עבור כל דמות וסיטואציה חובה לקבוע עד כמה צריך לטפל ולהשגיח בשטח ואת רמת דחיפות הפינוי...",
            quizData: ["אֵלֶּה", "פְאָר", "בַּמֶּאוֹ", "טִישׁ", "אִימְוֵוה", "חַד"],
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
            hints: [
                "לחצו על הדפים השונים ובחרו את ההגדרה הנכונה לסיטואציה",
                "כמובן, שצריך לסיים לתייג את כל הדפים",
                "לאחר מכן, יש לסדר את הדפים לפי הסדר הנכון",
                "...והקשיבו לשמות המשפחה",
                "אולי שמישהו יקרא את שמות המשפחה לפי הסדר ומישהוא אחר יקשיב לו...",
            ],
        },
        // {
        //     _id: "4",
        //     type: "turnRound",
        //     answer: "1234",
        //     quizImg: "imageURL",
        //     outerQuizImg: Q1Image,
        //     quizText: "imageURL",
        //     quizData: ["imageURL"],
        //     category: null,
        //     orderAnswer: null,
        //     hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
        // },
        {
            _id: "4",
            type: "orderBorder",
            answer: "3579",
            quiz: [
                {
                    title: "🫁 Airway",
                    content: "בדוק שהנתיב האוויר פתוח וודא שאין חסימה.",
                    explanation:
                        "השלב הראשון הוא להבטיח מעבר אוויר תקין. יש לנקות הפרשות, להסיר גוף זר ולהשתמש באמצעים מתקדמים לפי הצורך.",
                    interesting_insights:
                        "אפילו חסימה חלקית של נתיב האוויר יכולה להחמיר במהירות למצוקה חמורה.",
                },
                {
                    title: "🌬️ Breathing",
                    content: "הערך את הנשימה וחפש סימני מצוקה נשימתית.",
                    explanation:
                        "לאחר פתיחת נתיב האוויר, יש לוודא שהמטופל נושם בצורה אפקטיבית. יש לבדוק תנועות בית חזה, קולות נשימה ורמת חמצן.",
                    interesting_insights:
                        "מצבי חזה אוויר בלחץ יכולים להיות קטלניים אם לא מאובחנים מיד.",
                },
                {
                    title: "❤️ Circulation",
                    content: "בדוק דופק, לחץ דם והאם יש דימום חיצוני פעיל.",
                    explanation:
                        "השלב כולל הערכת מצב ההמודינמי ועצירת דימומים חיצוניים באמצעות לחץ ישיר או אמצעים אחרים.",
                    interesting_insights:
                        "דימום בלתי נשלט הוא הסיבה המובילה לתמותה שניתן למנוע בפגיעות טראומה.",
                },
                {
                    title: "🧠 Disability",
                    content: "בצע בדיקה נוירולוגית מהירה.",
                    explanation:
                        "יש להעריך מצב הכרה (AVPU/Glasgow Coma Scale), גודל אישונים ותגובות נוירולוגיות בסיסיות.",
                    interesting_insights:
                        "ירידה חדה במצב ההכרה עשויה להעיד על פגיעת ראש קשה או על חסר חמצן.",
                },
                {
                    title: "🩺 Exposure",
                    content: "חשוף את כל גוף המטופל לבדיקה מלאה.",
                    explanation:
                        "הסרת בגדים מאפשרת לזהות פציעות נוספות אך חשוב לשמור על חימום למניעת היפותרמיה.",
                    interesting_insights:
                        "היפותרמיה עלולה להחמיר הפרעות בקרישת דם ולפגוע בסיכויי ההישרדות.",
                },
                {
                    title: "📊 Full set of vital signs",
                    content: "מדוד את כל המדדים החיוניים.",
                    explanation:
                        "יש לתעד חום, לחץ דם, דופק, קצב נשימה וריווי חמצן כדי לקבל תמונת מצב מלאה.",
                    interesting_insights:
                        "מדדים חיוניים יכולים להתריע מוקדם על הידרדרות לפני שמופיעים סימנים קליניים גלויים.",
                },
                {
                    title: "💊 Give comfort measures",
                    content: "ספק אמצעי נוחות וטיפול בכאב.",
                    explanation:
                        "ניהול כאב הוא חלק חשוב בטיפול בחולה טראומה וישמש לשיפור שיתוף הפעולה והערכת מצב נוספת.",
                    interesting_insights:
                        "כאבים לא מטופלים יכולים לגרום לתגובה פיזיולוגית שמחמירה את מצבו של המטופל.",
                },
                {
                    title: "📋 History and Head-to-toe examination",
                    content: "אסוף אנמנזה ובצע בדיקה גופנית מקיפה.",
                    explanation:
                        "היסטוריה רפואית (AMPLE) ובדיקה מלאה מהראש ועד כפות הרגליים מאפשרות לזהות בעיות שלא התגלו בבדיקה הראשונית.",
                    interesting_insights:
                        "השאלות על אלרגיות, תרופות, מחלות רקע וארוחה אחרונה עשויות לשנות את ניהול הטיפול וההתערבויות.",
                },
            ],
            quizImg: List,
            outerQuizImg: Q1Image,
            quizText: "סדרו את הכרטיסיות לפי סדר הפעולות הנכון של סדר טיפול בפצוע וגלו את הקוד",
            quizData: [Q1D1, Q1D2, Q1D3, Q1D4, Q1D5],
            category: null,
            orderAnswer: null,
            hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
        },
    ],
};
export default data;
