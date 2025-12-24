export const formatDate = (userLanguage: string, dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(userLanguage === "he" ? "he-IL" : "en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
    });
};

interface literalObject {
    width: number;
    points: number[][];
}
export const GridCharObj: Record<string, literalObject> = {
    "1": { width: 1, points: [[1], [5], [9], [13], [17]] },
    "2": { width: 3, points: [[1, 2, 3], [7], [9, 10, 11], [13], [17, 18, 19]] },
    "3": { width: 3, points: [[1, 2, 3], [7], [9, 10, 11], [15], [17, 18, 19]] },
    "4": {
        width: 3,
        points: [[1, 3], [5, 7], [9, 10, 11], [15], [19]],
    },
    "5": { width: 3, points: [[1, 2, 3], [5], [9, 10, 11], [15], [17, 18, 19]] },
    "6": { width: 3, points: [[1, 2, 3], [4], [9, 10, 11], [13, 15], [17, 18, 19]] },
    "7": { width: 3, points: [[1, 2, 3], [7], [11], [15], [19]] },
    "8": {
        width: 3,
        points: [
            [1, 2, 3],
            [5, 7],
            [9, 10, 11],
            [13, 15],
            [17, 18, 19],
        ],
    },
    "9": { width: 3, points: [[1, 2, 3], [5, 7], [9, 10, 11], [15], [17, 18, 19]] },
    "0": {
        width: 3,
        points: [
            [1, 2, 3],
            [5, 7],
            [9, 11],
            [13, 15],
            [17, 18, 19],
        ],
    },
    א: {
        width: 4,
        points: [
            [1, 4],
            [5, 6, 8],
            [10, 11],
            [13, 15, 16],
            [17, 18, 20],
        ],
    },
    ב: {
        width: 4,
        points: [[1, 2, 3], [7], [11], [15], [17, 18, 19, 20]],
    },
    ג: {
        width: 3,
        points: [[1, 2, 3], [7], [10, 11], [13, 15], [17, 19]],
    },
    ד: {
        width: 4,
        points: [[1, 2, 3, 4], [7], [11], [15], [19]],
    },
    ה: {
        width: 3,
        points: [[1, 2, 3], [7], [9, 11], [13, 15], [17, 19]],
    },
    ו: {
        width: 2,
        points: [[1, 2], [6], [10], [14], [18]],
    },
    ז: {
        width: 3,
        points: [[1, 2, 3], [6], [10], [15], [18]],
    },
    ח: {
        width: 3,
        points: [
            [1, 2, 3],
            [5, 7],
            [9, 11],
            [13, 15],
            [17, 19],
        ],
    },
    ט: {
        width: 4,
        points: [
            [1, 4],
            [5, 7, 8],
            [9, 12],
            [13, 16],
            [17, 18, 19, 20],
        ],
    },
    י: {
        width: 2,
        points: [[1, 2], [6], [], [], []],
    },
    כ: {
        width: 3,
        points: [[1, 2, 3], [7], [11], [15], [17, 18, 19]],
    },
    ל: {
        width: 3,
        points: [[1], [5, 6, 7], [11], [14], [17]],
    },
    מ: {
        width: 4,
        points: [
            [1, 3],
            [6, 8],
            [9, 12],
            [13, 16],
            [17, 19, 20],
        ],
    },
    נ: {
        width: 3,
        points: [[2, 3], [7], [11], [15], [17, 18, 19]],
    },
    ס: {
        width: 3,
        points: [[1, 2, 3], [5, 7], [9, 11], [13, 15], [18]],
    },
    ע: {
        width: 4,
        points: [
            [2, 4],
            [6, 8],
            [10, 12],
            [14, 16],
            [17, 18, 19],
        ],
    },
    פ: {
        width: 4,
        points: [[1, 2, 3, 4], [5, 8], [9, 10, 12], [16], [17, 18, 19, 20]],
    },
    צ: {
        width: 4,
        points: [
            [1, 4],
            [5, 6, 8],
            [10, 11],
            [15, 16],
            [17, 18, 19, 20],
        ],
    },
    ק: {
        width: 3,
        points: [[1, 2, 3], [7], [9, 11], [12, 15], [17]],
    },
    ר: {
        width: 3,
        points: [[1, 2, 3], [7], [11], [15], [19]],
    },
    ש: {
        width: 4,
        points: [
            [1, 2, 4],
            [5, 6, 8],
            [9, 10, 12],
            [13, 16],
            [18, 19, 20],
        ],
    },
    ת: {
        width: 4,
        points: [
            [2, 3, 4],
            [6, 8],
            [10, 12],
            [14, 16],
            [17, 18, 20],
        ],
    },
    ך: {
        width: 3,
        points: [[1, 2, 3], [7], [10], [15], [19]],
    },
    ם: {
        width: 3,
        points: [
            [1, 2, 3],
            [5, 7],
            [9, 11],
            [13, 15],
            [17, 18, 19],
        ],
    },
    ן: {
        width: 2,
        points: [[1, 2], [6], [9], [14], [18]],
    },
    ף: {
        width: 4,
        points: [[2, 3, 4], [5, 8], [9, 10, 12], [16], [20]],
    },
    ץ: {
        width: 4,
        points: [[1, 4], [5, 6, 7, 8], [10, 11], [15, 16], [20]],
    },
};

export const ListNumObj: Record<string, string[]> = {
    "1": ["R", "R"],
    "2": ["TR", "TLB"],
    "3": ["TR", "TRB"],
    "4": ["LR", "TR"],
    "5": ["TL", "TRB"],
    "6": ["TL", "TRLB"],
    "7": ["TR", "R"],
    "8": ["TRL", "TRLB"],
    "9": ["TRL", "TRB"],
    "0": ["TRL", "RLB"],
};

export const segmentsCheckObj: Record<number, number[]> = {
    1: [2, 5],
    2: [0, 2, 3, 4, 6],
    3: [0, 2, 3, 5, 6],
    4: [1, 2, 3, 5],
    5: [0, 1, 3, 5, 6],
    6: [0, 1, 3, 4, 5, 6],
    7: [0, 2, 5],
    8: [0, 1, 2, 3, 4, 5, 6],
    9: [0, 1, 2, 3, 5, 6],
    0: [0, 1, 2, 4, 5, 6],
};
export type LanguageMap = {
    en: string;
    he: string;
    ar: string;
};
export type StudyFields = Record<string, LanguageMap>;
export const fieldsOfStudy: StudyFields = {
    agriculture: { en: "Agriculture", he: "חקלאות", ar: "الزراعة" },
    anthropology: { en: "Anthropology", he: "אנתרופולוגיה", ar: "الأنثروبולוגيا" },
    architecture: { en: "Architecture", he: "אדריכלות", ar: "الهندسة المعمارية" },
    art_history: { en: "Art History", he: "תולדות האמנות", ar: "تاريخ الفن" },
    biology: { en: "Biology", he: "ביולוגיה", ar: "علم الأحياء" },
    business_administration: {
        en: "Business Administration",
        he: "מנהל עסקים",
        ar: "إدارة الأعمال",
    },
    chemistry: { en: "Chemistry", he: "כימיה", ar: "الكيمياء" },
    civil_engineering: { en: "Civil Engineering", he: "הנדסה אזרחית", ar: "الهندسة المدنية" },
    communication_studies: { en: "Communication Studies", he: "תקשורת", ar: "دراسات الاتصال" },
    computer_science: { en: "Computer Science", he: "מדעי המחשב", ar: "علوم الحاسوب" },
    criminal_justice: { en: "Criminal Justice", he: "קרימינולוגיה", ar: "العدالة الجنائية" },
    data_science: { en: "Data Science", he: "מדע הנתונים", ar: "علم البيانات" },
    dentistry: { en: "Dentistry", he: "רפואת שיניים", ar: "طب الأسنان" },
    economics: { en: "Economics", he: "כלכלה", ar: "الاقتصاد" },
    education: { en: "Education", he: "חינוך", ar: "التربية" },
    electrical_engineering: {
        en: "Electrical Engineering",
        he: "הנדסת חשמל",
        ar: "الهندسة الكهربائية",
    },
    environmental_studies: {
        en: "Environmental Studies",
        he: "לימודי סביבה",
        ar: "الدراسات البيئية",
    },
    film_studies: { en: "Film Studies", he: "לימודי קולנוע", ar: "دراسات السينما" },
    fine_arts: { en: "Fine Arts", he: "אמנות", ar: "الفنون الجميلة" },
    geography: { en: "Geography", he: "גאוגרפיה", ar: "الجغرافيا" },
    history: { en: "History", he: "היסטוריה", ar: "التاريخ" },
    international_relations: {
        en: "International Relations",
        he: "יחסים בינלאומיים",
        ar: "العلاقات الدولية",
    },
    law: { en: "Law", he: "משפטים", ar: "القانون" },
    linguistics: { en: "Linguistics", he: "בלשנות", ar: "اللغويات" },
    literature: { en: "Literature", he: "ספרות", ar: "الأدب" },
    mathematics: { en: "Mathematics", he: "מתמטיקה", ar: "الرياضيات" },
    mechanical_engineering: {
        en: "Mechanical Engineering",
        he: "הנדסת מכונות",
        ar: "الهندسة الميكانيكية",
    },
    medicine: { en: "Medicine", he: "רפואה", ar: "الطب" },
    music: { en: "Music", he: "מוזיקה", ar: "الموسيقى" },
    nursing: { en: "Nursing", he: "סיעוד", ar: "التمريض" },
    philosophy: { en: "Philosophy", he: "פילוסופיה", ar: "الفلسفة" },
    physics: { en: "Physics", he: "פיזיקה", ar: "الفيزياء" },
    political_science: { en: "Political Science", he: "מדע המדינה", ar: "العلوم السياسية" },
    psychology: { en: "Psychology", he: "פסיכולוגיה", ar: "علم النفس" },
    public_health: { en: "Public Health", he: "בריאות הציבור", ar: "الصحة العامة" },
    social_work: { en: "Social Work", he: "עבודה סוציאלית", ar: "العمل الاجتماعي" },
    sociology: { en: "Sociology", he: "סוציולוגיה", ar: "علم الاجتماع" },
    statistics: { en: "Statistics", he: "סטטיסטיקה", ar: "الإحصاء" },
    theology: { en: "Theology", he: "תאולוגיה", ar: "علم اللاهوت" },
    artificial_intelligence: {
        en: "Artificial Intelligence",
        he: "בינה מלאכותית",
        ar: "الذكاء الاصطناعي",
    },
    cybersecurity: { en: "Cybersecurity", he: "אבטחת סייבר", ar: "الأمن السيبراني" },
    software_engineering: { en: "Software Engineering", he: "הנדסת תוכנה", ar: "هندسة البرمجيات" },
    information_systems: { en: "Information Systems", he: "מערכות מידע", ar: "نظم المعلومات" },
    biotechnology: { en: "Biotechnology", he: "ביוטכנולוגיה", ar: "التكنولوجيا الحيوية" },
    genetics: { en: "Genetics", he: "גנטיקה", ar: "علم الوراثة" },
    neuroscience: { en: "Neuroscience", he: "מדעי המוח", ar: "علم الأعصاب" },
    robotics: { en: "Robotics", he: "רובוטיקה", ar: "الروبوتات" },
    game_design: { en: "Game Design", he: "עיצוב משחקים", ar: "تصميم الألعاب" },
    ui_ux_design: { en: "UI/UX Design", he: "עיצוב חוויית משתמש", ar: "تصميم تجربة المستخدم" },
};
