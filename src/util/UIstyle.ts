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
    redBlueGray: { dark: "#5A0E24", second: "#76153C", bright: "#BF124D", light: "#67B2D8" },
    blueToRed: { dark: "#050E3C", second: "#002455", bright: "#DC0000", light: "#FF3838" },
    blueToYellow: { dark: "#360185", second: "#8F0177", bright: "#DE1A58", light: "#F4B342" },
    greenToPink: { dark: "#B8DB80", second: "#F7F6D3", bright: "#FFE4EF", light: "#F39EB6" },
    greenToRed: { dark: "#BBCB64", second: "#FFE52A", bright: "#F79A19", light: "#CF0F0F" },
    greenToWhite: { dark: "#005461", second: "#018790", bright: "#00B7B5", light: "#F4F4F4" },
    blueToPink: { dark: "#301CA0", second: "#7132CA", bright: "#C47BE4", light: "#F29AAE" },
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
    inter: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    georgia: "Georgia, serif",
    trebuchet: "'Trebuchet MS', sans-serif",
};
export const firstLowercaseGroup = (str: string) => {
    const match = str.match(/[a-z]+/);
    console.log(match ? match[0] : "");
    return match ? match[0] : "";
};
