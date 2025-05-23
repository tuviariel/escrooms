export const dateDisplay = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString("he-IL");
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
