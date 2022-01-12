import { Dimensions,NativeModules } from "react-native";

//设计稿的px宽度(320px)：其中元素的px宽度 = 手机的dp宽度(screenWidth)：手机中元素的dp宽度
export const screenWidth = Dimensions.get("window").width;
const tmpScreenHeight = Dimensions.get("window").height;
//andorid全面屏幕中 Dimensions.get('window').height 计算屏幕高度时会自动减少StatusBar 的高度
//高宽比h/w若大于1.8 则为全面屏幕手机，
export const statusBarHeight = NativeModules.StatusBarManager.HEIGHT 
export const screenHeight = tmpScreenHeight/screenWidth > 1.8 
? tmpScreenHeight + statusBarHeight
: tmpScreenHeight;
const draftWidth = 320;
//将设计稿中的像素px(设计稿中某元素的大小)映射到手机屏幕的单位dp
export const pxToDp = (px) => px * screenWidth / draftWidth;



// app的主题风格
export const topicTrendsNum = 2;
export const topicTrends = [
    {
        "color":{
            "color_name":"blue-active",
            "color_num":"#1f8be8"
        },
        "plus_style":{
            "style_name":"sapphire",//蓝宝石
            "style_desc":{
                "padding":"20px 40px",
                "display":"inline-block",
                "border-radius":"10px",
                "background-image": "linear-gradient(to bottom right, #1f8be8, #a5e6ff)",
                "color": "white",
                "box-shadow": "inset 5px 5px 25px 2px #17c2ff"
            },
            "style_desc":{
                "gradient_start":"#1f8be8",
                "gradient_end":"#a5e6ff",
            }
        }
    },
    {
        "color":{
            "color_name":"red-active",
            "color_num":"#ec1a0a"
        },
        "plus_style":{
            "style_name":"ruby",//红宝石
            "style_desc":{
                "gradient_start":"#ec1a0a",
                "gradient_end":"#ffb3ae",
            }
        }
    },
    {
        "color":{
            "color_name":"cyan-active",
            "color_num":"#08b4f4"
        },
        "plus_style":{
            "style_name":"cyan",//青色
            "style_desc":{
                "gradient_start":"#08b4f4",
                "gradient_end":"#40eff6",
            }
        }
    }
]

//原创,转载,翻译,日志
export const articleType = {
    "original":{
        "gradient_start":"#1f8be8",
        "gradient_end":"#a5e6ff",
    },
    "transfer":{
        "gradient_start":"#F3CB85",
        "gradient_end":"#ffe8c1",
    },
    "translate":{
        "gradient_start":"#ff6194",
        "gradient_end":"#fbc2d5",
    },
    "log":{
        "gradient_start":"#ec1a0a",
        "gradient_end":"#ffb3ae",
    }
}

// 中性色：

// 重叠色-背景色：#f6f7f9
// 重叠色-字体色：#D1D9E8
export const inputBoxColor={
    deep_color:"#D1D9E8",
    shallow_color:"#f6f7f9",
}

