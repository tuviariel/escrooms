import RBG from "../assets/images/UIelements/backgrounds/realistic.png";
import ABG from "../assets/images/UIelements/backgrounds/abstract.png";
import MBG from "../assets/images/UIelements/backgrounds/abstract.png";
import CBG from "../assets/images/UIelements/backgrounds/abstract.png";
import VBG from "../assets/images/UIelements/backgrounds/abstract.png";
import RSBG from "../assets/images/UIelements/semiBackgrounds/realistic.png";
import ASBG from "../assets/images/UIelements/semiBackgrounds/abstract.png";
import MSBG from "../assets/images/UIelements/semiBackgrounds/realistic.png";
import CSBG from "../assets/images/UIelements/semiBackgrounds/realistic.png";
import VSBG from "../assets/images/UIelements/semiBackgrounds/realistic.png";

export const colorPalette = {
    //1 - dark/dominant/chosen color, 2 - bright/positive color, 3 - light color
    redBlueGray: { dark: "#E50113", bright: "#0255db", light: "#9ea5b0" },
    orangeGreenWhite: { dark: "#e38202", bright: "#36e039", light: "#ffffff" },
    purpleLightblueYellow: { dark: "#a002ab", bright: "#5093fa", light: "#f0f002" },
};
export const imageStyle = {
    realistic: {
        background: RBG,
        semiBackground: RSBG,
        right: "#FFFFFF",
        left: "#000000",
        back: "",
        info: "",
        hint: "",
        button: "",
    },
    abstract: {
        background: ABG,
        semiBackground: ASBG,
        right: "#FFFFFF",
        left: "#000000",
        back: "",
        info: "",
        hint: "",
        button: "",
    },
    minimalistic: {
        background: MBG,
        semiBackground: MSBG,
        right: "#FFFFFF",
        left: "#000000",
        back: "",
        info: "",
        hint: "",
        button: "",
    },
    comic: {
        background: CBG,
        semiBackground: CSBG,
        right: "#FFFFFF",
        left: "#000000",
        back: "",
        info: "",
        hint: "",
        button: "",
    },
    vintage: {
        background: VBG,
        semiBackground: VSBG,
        right: "#FFFFFF",
        left: "#000000",
        back: "",
        info: "",
        hint: "",
        button: "",
    },
};
export const fontFamily = {
    sansSerif: "Arial, sans-serif",
    serif: "Times New Roman, serif",
    monospace: "Courier New, monospace",
    cursive: "Comic Sans MS, cursive",
    fantasy: "Impact, fantasy",
};
