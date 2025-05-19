import Q1D1 from "../assets/images/10.png";
import Q1D2 from "../assets/images/11.png";
import Q1D3 from "../assets/images/12.png";
import Q1D4 from "../assets/images/13.png";
import Q1D5 from "../assets/images/14.png";
import Q1Image from "../assets/images/24.png";
import inCo1 from "../assets/images/icons/1.png";
import inCo2 from "../assets/images/icons/2.png";
import inCo3 from "../assets/images/icons/3.png";
import inCo4 from "../assets/images/icons/4.png";
import inCo5 from "../assets/images/icons/5.png";
import inCo6 from "../assets/images/icons/6.png";
import inCo7 from "../assets/images/icons/7.png";
import inCo8 from "../assets/images/icons/8.png";
import inCo9 from "../assets/images/icons/9.png";
import co1 from "../assets/images/icons/10.png";
import co2 from "../assets/images/icons/11.png";
import co3 from "../assets/images/icons/12.png";
import co4 from "../assets/images/icons/13.png";
import co5 from "../assets/images/icons/14.png";
import co6 from "../assets/images/icons/15.png";
import co7 from "../assets/images/icons/16.png";
import co8 from "../assets/images/icons/17.png";
import co9 from "../assets/images/icons/18.png";
import co10 from "../assets/images/icons/19.png";
import co11 from "../assets/images/icons/20.png";
import co12 from "../assets/images/icons/21.png";
import cat1 from "../assets/images/icons/24.png";
import cat2 from "../assets/images/icons/23.png";
import cat3 from "../assets/images/icons/22.png";
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

const data = {
    _id: "kjbhdfvksjdf",
    name: "מעילות והונאות", //Embezzlement and fraud
    mainImage: "imageURL",
    quiz: [
        {
            _id: "1",
            type: "7segments",
            answer: "247",
            quizImg: Q1Image,
            quizText: "טקסט מסביר את המשימה...",
            quizData: [Q1D1, Q1D2, Q1D3, Q1D4, Q1D5],
            category: [cat1, cat2, cat3],
            orderAnswer: null,
            correctOptions: [co1, co2, co3, co4, co5, co6, co7, co8, co9, co10, co11, co12],
            inCorrectOptions: [inCo1, inCo2, inCo3, inCo4, inCo5, inCo6, inCo7, inCo8, inCo9],
            hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
        },
        {
            _id: "2",
            type: "gridPlay",
            answer: "בדה",
            quizImg: "imageURL",
            quizText: "עבור כל דמות וסיטואציה חובה לקבוע אם הוא פעל כראוי או אם עבר על איסוי מעילה",
            quizData: ["imageURL"],
            category: null,
            orderAnswer: null,
            correctOptions: ["correct1", "correct2", "correct3", "correct4"],
            inCorrectOptions: ["incorrect1", "incorrect2", "incorrect3", "incorrect4"],
            hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
        },
        {
            _id: "3",
            type: "colorChange",
            answer: "1491",
            quizImg: Q3D7,
            quizText: "עבור כל דמות וסיטואציה חובה לקבוע אם הוא פעל כראוי או אם עבר על איסוי מעילה",
            quizData: [Q3D1, Q3D2, Q3D3, Q3D4, Q3D5, Q3D6],
            category: [Q3O1, Q3O2, Q3O3, Q3O4],
            orderAnswer: [0, 2, 1, 3, 2, 0],
            correctOptions: ["correct1", "correct2", "correct3", "correct4"],
            inCorrectOptions: ["incorrect1", "incorrect2", "incorrect3", "incorrect4"],
            hints: [
                "לחצו על הדפים השונים עד שיתגלה הדין הנכון של הסיטואציה",
                "ןהקשיבו",
                "אולי שמישהו יקרא את שמות המשפחה לפי הסדר ומישהוא אחר יקשיב לו...",
                "forthHint",
                "fifthHint",
            ],
        },
        {
            _id: "4",
            type: "turnRound",
            answer: "1234",
            quizImg: "imageURL",
            quizText: "imageURL",
            quizData: ["imageURL"],
            category: null,
            orderAnswer: null,
            correctOptions: ["correct1", "correct2", "correct3", "correct4"],
            inCorrectOptions: ["incorrect1", "incorrect2", "incorrect3", "incorrect4"],
            hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
        },
        {
            _id: "5",
            type: "7segments",
            answer: "247",
            quizImg: Q1Image,
            quizText: "טקסט מסביר את המשימה...",
            quizData: [Q1D1, Q1D2, Q1D3, Q1D4, Q1D5],
            category: [cat1, cat2, co11],
            orderAnswer: null,
            correctOptions: [co9, co9, co9, co9, co9, co9, co9, co9, co9, co9, co9, co9],
            inCorrectOptions: [co9, co9, co9, co9, co9, co9, co9, co9, co9],
            hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
        },
    ],
};
export default data;
