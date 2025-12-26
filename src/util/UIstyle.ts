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
// Import color background images
import blueToRedBg from "../assets/images/colorBackgrounds/blueToRed.png";
// import blueToGreenBg from "../assets/images/colorBackgrounds/blueToGreen.png";
import purpleToOrangeBg from "../assets/images/colorBackgrounds/purpleToOrange.png";
import blueToYellowBg from "../assets/images/colorBackgrounds/blueToYellow.png";
import purpleToGreenBg from "../assets/images/colorBackgrounds/purpleToGreen.png";
import greenToRedBg from "../assets/images/colorBackgrounds/greenToRed.png";

export const colorPalette = {
    //1 - dark/dominant/chosen border-color, 2 - bright/positive clickable-color, 3 - light text-color
    redBlueGray: {
        dark: "#BF124D",
        bright: "#67B2D8",
        light: "#BDE8F5",
        background: blueToRedBg,
    },
    blueToRed: {
        dark: "#BF124D",
        bright: "#67B2D8",
        light: "#BDE8F5",
        background: blueToRedBg,
    },
    blueToYellow: {
        dark: "#360185",
        bright: "#F4B342",
        light: "#F6F3C2",
        background: blueToYellowBg,
    },
    purpleToOrange: {
        dark: "#8F0177",
        bright: "#F79A19",
        light: "#F39EB6",
        background: purpleToOrangeBg,
    },
    blueToGreen: {
        dark: "#73AF6F",
        bright: "#3291B6",
        light: "#F4F4F4",
        background: blueToRedBg,
    },
    greenToRed: {
        dark: "#CF0F0F",
        bright: "#BBCB64",
        light: "#CCE5CF",
        background: greenToRedBg,
    },
    purpleToGreen: {
        dark: "#7132CA",
        bright: "#5C6F2B",
        light: "#F29AAE",
        background: purpleToGreenBg,
    },
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
