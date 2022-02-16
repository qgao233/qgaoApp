import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StatusBar, TouchableHighlight,
    Animated, Easing, Image, ActivityIndicator, StyleSheet, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Swiper from 'react-native-swiper'
import { statusBarHeight, screenWidth, articleType } from '../../../../../utils/stylesKits';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather'
import { calcStringLen, dateDiff } from '../../../../../utils/funcKits'
import { useTopicTrends } from '../utils/hooks'
import { Card } from 'react-native-shadow-cards';
import LinearGradient from 'react-native-linear-gradient';
import Popover, { Rect } from 'react-native-popover-view';
import ImageViewer from 'react-native-image-zoom-viewer';

const preNotices = [
    "本app准备了一些彩蛋，请尽情探索！",
    "该版本为alpha内测版本，存在一些bug在所难免，请多谅解，谢谢。"
]

const noticeHeight = 16;
const msPerChar = 500;

const onLayout = (e, index) => {
    let { width } = e.nativeEvent.layout;
    // console.log(index, width, screenWidth)
}

const preSlidePics = [
    {
        pic: require("../../../../../res/img/snow.jpg"),
        desc: "沮丧是浪费大脑的资源。"
    },
    {
        pic: require("../../../../../res/img/girl.jpg"),
        desc: "科学的敌人，不比朋友少。"
    },
    {
        pic: require("../../../../../res/img/sakura.jpg"),
        desc: "进步不是什么事件，而是一种需要。"
    }
]
const spinnerTextArray = ["关注", "私聊", "拉黑", "举报"];


export default (props) => {

    const { topicTrends, topicTrendsNum } = useTopicTrends();

    const [notices, setNotices] = useState([
        "本app准备了一些彩蛋，请尽情探索！",
        "该版本为alpha内测版本，存在一些bug在所难免，请多谅解，谢谢。"
    ]);
    const [noticeTranslateX, setNoticeTranslateX] = useState([
        new Animated.Value(0), new Animated.Value(0)
    ]);

    const getNotices = useCallback(() => {
        const notices = preNotices;
        const noticeLen = notices.length;
        let arr = [];
        for (let i = 0; i < noticeLen; i++) {
            arr.push(new Animated.Value(0));
        }
        setNotices(notices);
        // setNoticeTranslateX(arr);
    }, [])

    const animateNotices = useCallback(() => {
        getNotices();
        animateSlide(0)
    }, [])

    const noticeRef = useRef();

    const animateSlide = (index) => {
        let charNum = notices[index].length;
        let width = charNum * noticeHeight;
        let duration = charNum * msPerChar;

        const config1 = {
            toValue: 100,
            duration: 0,
            easing: Easing.linear,
            useNativeDriver: false,
        };
        const config2 = {
            toValue: -width + (screenWidth - 80) / 2,
            duration: charNum * msPerChar,
            easing: Easing.linear,
            useNativeDriver: false,
        }
        Animated.sequence([
            Animated.timing(noticeTranslateX[index], config1),
            Animated.timing(noticeTranslateX[index], config2),
        ]).start(() => {
            noticeRef.current.scrollBy(index + 1, true)
            if (index + 1 == notices.length) {
                animateSlide(0);
            } else {
                animateSlide(index + 1);
            }
        })

        // Animated.loop(animateSlide).start()
    }

    const [slidePics, setSlidePics] = useState([]);

    const getSlidePics = useCallback(() => {
        setSlidePics(preSlidePics);
    }, [])

    const [articleData, setArticleData] = useState([]);
    const [articleRefresh, setArticleRefresh] = useState(true);

    const getArticleList = () => {
        new Promise((resolve, reject) => {
            const array = [];
            for (let i = 0; i < 5; i++) {
                let type = i % 4 == 0 ? "原" : i % 4 == 1 ? "转" : i % 4 == 2 ? "翻" : "志";
                let obj = {
                    key: i,
                    photoPath: require("../../../../../res/img/photo.jpg"),
                    nickName: "qgao",
                    publishTime: 1630584687000,//时间戳形式,ms
                    title: "论如何渲染flatlist",
                    type: type,
                    content: "先查阅相关组件的资料，然后查看属性的介绍，根据自己想要实现的功能，来实现自己的列表渲染",
                    imgPaths: [
                        require("../../../../../res/img/snow.jpg"),
                        require("../../../../../res/img/photo.jpg")
                        // "http://img.netbian.com/file/2021/0527/small2998966e25f9370d55e4672ade1013dc1622123475.jpg",
                        // "http://img.netbian.com/file/2021/0605/smalld9fcb449fa428b1cc001b40527b990761622906649.jpg"
                    ],
                    tags: [
                        "react-native",
                        "es6"
                    ],
                    good: 6,
                    bad: 2,
                    store: 8,
                    comment: 10,
                    reward: 10,
                };
                array.push(obj);
            }

            setTimeout(() => {
                resolve(array);
                // resolve([]);
            }, 500);

        }).then((data) => {
            if (data.length > 0) {
                setArticleData(data);
                setArticleRefresh(false);
            }
        }).catch(err => console.log("article", err));
    }

    const [videoData, setVideoData] = useState([]);
    const getVideoList = () => {
        new Promise((resolve, reject) => {
            let array = [];
            for (let i = 0; i < 6; i++) {
                let type = i % 4 == 0 ? "原" : i % 4 == 1 ? "转" : i % 4 == 2 ? "翻" : "志";
                let obj = {
                    key: i,
                    photoPath: require("../../../../../res/img/photo.jpg"),
                    nickName: "qgao",
                    publishTime: 1630584687000,//时间戳形式,ms
                    title: i % 4 != 0 ? "论如何渲染flatlist" : "23333333333",
                    type: type,
                    posterPath: require("../../../../../res/img/snow.jpg"),
                    good: 6,
                    bad: 2,
                    store: 8,
                    comment: 10,
                    reward: 10,

                };
                array.push(obj);
            }
            setTimeout(() => {
                resolve(array);
                // resolve([]);
            }, 500);

        }).then((data) => {
            if (data.length > 0) {
                setVideoData(data);
                setVideoRefresh(false);
            }
        }).catch(err => console.log("article", err));
    }

    useEffect(() => {
        animateNotices();//获取通知，并使通知向左滑动
        getSlidePics();//获取轮播图

        //获取推荐文章
        getArticleList();
        //获取推荐视频
        getVideoList();
    }, [])


    const [rectWithArticle, setRectWithArticle] = useState(new Rect(0, 0, 0, 0));
    const [showPopoverWithArticle, setShowPopoverWithArticle] = useState(false);
    const [showAlbumWithArticle, setShowAlbumWithArticle] = useState(false);
    const [imgUrlsWithArticle, setImgUrlsWithArticle] = useState(undefined);
    const [albumIndexWithArticle, setAlbumIndexWithArticle] = useState(0);

    const downArrowWithArticleRef = useRef([]);

    const [indexWithArticle, setIndexWithArticle] = useState(0);
    const toggleSpinnerWithArticle = (index) => {
        downArrowWithArticleRef.current[index].measure((ox, oy, width, height, px, py) => {
            setIndexWithArticle(index);
            setRectWithArticle(new Rect(px, py - height * 3 / 2, width, height))
            setShowPopoverWithArticle(pre => pre ? false : true);
        });

    }
    const handleShowAlbum = (index, i) => {
        const imgUrls = articleData[index].imgPaths.map((v) => {
            // return ({url:v,props:{}})
            return { url: "", props: { source: v } }
        });
        setImgUrlsWithArticle(imgUrls);
        setAlbumIndexWithArticle(i);
        setShowAlbumWithArticle(true);
    }
    const renderArticleList = () => {
        return (
            <View>
                {
                    articleData.map((item, index) => {
                        return (
                            <Card key={index}
                                cornerRadius={0} elevation={5} opacity={0.2}
                                style={{ width: "auto", marginTop: 10, borderRadius: 10, padding: 10, backgroundColor: "#fff" }}>
                                {/**第1层 */}
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <TouchableOpacity onPress={() => { }} style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Image style={{ ...styles.profilePhoto }} source={item.photoPath} />
                                            <View style={{ paddingLeft: 10 }}>
                                                <Text style={{ fontSize: 15, color: "#5a5a5a" }}>
                                                    {item.nickName}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: "#0004" }}>
                                                    {dateDiff(item.publishTime)}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                                        {/* <TouchableOpacity style={{ marginRight: 10, padding: 5, paddingLeft: 10, paddingRight: 10, backgroundColor: topicTrends[topicTrendsNum].style_desc.gradient_start, borderRadius: 5 }}>
                                          <Text style={{ color: "#fff" }}>关注</Text>
                                      </TouchableOpacity> */}
                                        <TouchableOpacity ref={ref => {
                                            downArrowWithArticleRef.current[index] = ref
                                        }}
                                            onPress={() => { toggleSpinnerWithArticle(index) }} style={{ padding: 5, paddingLeft: 10, paddingRight: 10, }}>
                                            {
                                                !showPopoverWithArticle
                                                    ? <FontAwesomeIcon name="ellipsis-h" size={15} color="#ddd" />
                                                    : indexWithArticle != index
                                                        ? <FontAwesomeIcon name="ellipsis-h" size={15} color="#ddd" />
                                                        : <FontAwesomeIcon name="chevron-down" size={12} color="#ddd" />
                                            }
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => props.navigation.navigate("ArticleDetail")}>
                                    {/* 第2层 标题层 */}
                                    <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5, paddingBottom: 5 }}>
                                        <View style={{ flex: 9 }}><Text style={{ fontSize: 15 }}>{item.title}</Text></View>
                                        <View style={{ flex: 1, alignItems: "center" }}>
                                            <LinearGradient
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                colors={item.type == "原" ?
                                                    [articleType.original.gradient_start,
                                                    articleType.original.gradient_end]
                                                    : item.type == "转" ?
                                                        [articleType.transfer.gradient_start,
                                                        articleType.transfer.gradient_end]
                                                        : item.type == "翻" ?
                                                            [articleType.translate.gradient_start,
                                                            articleType.translate.gradient_end]
                                                            : [articleType.log.gradient_start,
                                                            articleType.log.gradient_end]

                                                }
                                                style={{
                                                    alignItems: "center", justifyContent: "center", borderRadius: 10,
                                                    paddingLeft: 5, paddingRight: 5, paddingTop: 2, paddingBottom: 2,
                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontSize: 10 }}>{item.type}</Text>
                                            </LinearGradient>
                                        </View>
                                    </View>
                                    {/**第3层 内容层*/}
                                    <View>
                                        <View><Text style={{ color: "#5c5c5c", fontSize: 10 }}>{item.content}</Text></View>
                                    </View>
                                </TouchableOpacity>

                                {/* 第4层 图片层 */}
                                <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5, paddingBottom: 5 }}>
                                    {

                                        item.imgPaths.map((v, i, arr) => {

                                            return <TouchableOpacity key={i} onPress={() => handleShowAlbum(index, i)} style={{ marginRight: 5 }}>
                                                <Image source={v} style={{ ...styles.img }} />
                                            </TouchableOpacity>

                                        })
                                    }
                                </View>
                                {/* 第5层 标签层 */}
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                                    {
                                        item.tags.map((v, i) => {
                                            if (i == 0)
                                                return <View key={i} style={{ marginLeft: 5, paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1, justifyContent: "center", backgroundColor: "#ffd5d3", borderRadius: 5 }}>
                                                    <Text style={{ color: "#ec1a0a", fontSize: 10 }}>{v}</Text>
                                                </View>
                                            else return <View key={i} style={{ marginLeft: 5, paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1, justifyContent: "center", backgroundColor: "#eee", borderRadius: 5 }}>
                                                <Text style={{ color: "#aaa", fontSize: 10 }}>{v}</Text>
                                            </View>
                                        })
                                    }
                                </View>
                                {/* 第6层 交互层 */}
                                <View style={{ paddingTop: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                                    <TouchableOpacity>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <FontAwesomeIcon name="thumbs-o-up" size={20} color="#0007" />
                                            <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                                {item.good}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <FontAwesomeIcon name="thumbs-o-down" size={20} color="#0007" />
                                            <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                                {item.bad}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <FontAwesomeIcon name="star-o" size={20} color="#0007" />
                                            <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                                {item.store}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <FontAwesomeIcon name="commenting-o" size={20} color="#0007" />
                                            <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                                {item.comment}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <FontAwesomeIcon name="gift" size={20} color="#0007" />
                                            <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                                {item.reward}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        );
                    })
                }
                <Popover from={rectWithArticle}
                    isVisible={showPopoverWithArticle}
                    onRequestClose={() => setShowPopoverWithArticle(false)}
                    backgroundStyle={{ backgroundColor: "#000", opacity: 0.1 }}
                    animationConfig={{ duration: 200 }}
                    popoverStyle={{ borderRadius: 5 }}
                >
                    {spinnerTextArray.map((v, i) => {
                        return <TouchableHighlight key={i} onPress={() => { alert(v, ",index:") }}
                            underlayColor='#ddd'>
                            <Text style={{ padding: 5, paddingLeft: 10, paddingRight: 10, color: '#5c5c5c' }}>
                                {v}
                            </Text>
                        </TouchableHighlight>
                    })
                    }
                </Popover>
                <Modal visible={showAlbumWithArticle} onRequestClose={() => setShowAlbumWithArticle(false)} transparent={true}>
                    <ImageViewer
                        enableSwipeDown={true}
                        swipeDownThreshold={0.5}
                        onSwipeDown={() => setShowAlbumWithArticle(false)}
                        imageUrls={imgUrlsWithArticle}
                        index={albumIndexWithArticle}
                        // loadingRender={this.renderInitLoadIndicator}
                        menuContext={{ saveToLocal: '保存到本地', cancel: '取消' }}
                        onSave={() => alert("点击了保存图片")}
                    />
                </Modal>
            </View>
        );
    }

    const [videoRefresh, setVideoRefresh] = useState(true);
    const downArrowWithVideoRef = useRef([]);
    const [indexWithVideo, setIndexWithVideo] = useState(0);
    const [rectWithVideo, setRectWithVideo] = useState(new Rect(0, 0, 0, 0));
    const [showPopoverWithVideo, setShowPopoverWithVideo] = useState(false);

    const toggleSpinnerWithVideo = (index) => {
        downArrowWithVideoRef.current[index].measure((ox, oy, width, height, px, py) => {
            setIndexWithVideo(index);
            setRectWithVideo(new Rect(px, py - height * 3 / 2, width, height))
            setShowPopoverWithVideo(pre => pre ? false : true);
        });

    }
    const renderVideoList = () => {
        return (
            <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: "space-between" }}>
                {
                    videoData.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={{ marginBottom: 10, }}
                                activeOpacity={0.9} onPress={() => { props.navigation.navigate("VideoDetail") }}>
                                <Card
                                    cornerRadius={0} elevation={5} opacity={0.5}
                                    style={{ width: "auto", borderRadius: 10, backgroundColor: "#fff" }}>
                                    {/* 封面 */}
                                    <View style={{ position: "relative" }}>
                                        <Image style={styles.videoImg} source={item.posterPath} />
                                        <View style={{ position: "absolute", bottom: 0, left: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <FontAwesomeIcon name="thumbs-o-up" size={styles.widget.fontSize} color={styles.widget.color} />
                                                <Text style={{ ...styles.widget, }}>
                                                    {item.good}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <FontAwesomeIcon name="star-o" size={styles.widget.fontSize} color={styles.widget.color} />
                                                <Text style={{ ...styles.widget, }}>
                                                    {item.store}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <FontAwesomeIcon name="commenting-o" size={styles.widget.fontSize} color={styles.widget.color} />
                                                <Text style={{ ...styles.widget, }}>
                                                    {item.comment}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <FontAwesomeIcon name="gift" size={styles.widget.fontSize} color={styles.widget.color} />
                                                <Text style={{ ...styles.widget, }}>
                                                    {item.reward}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ padding: 5, }}>
                                        {/* 标题 */}
                                        <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 2, paddingBottom: 2 }}>
                                            <View style={{ flex: 8 }}><Text style={{ fontSize: 12 }}>{item.title}</Text></View>
                                            <View style={{ flex: 2, alignItems: "center" }}>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    colors={item.type == "原" ?
                                                        [articleType.original.gradient_start,
                                                        articleType.original.gradient_end]
                                                        : item.type == "转" ?
                                                            [articleType.transfer.gradient_start,
                                                            articleType.transfer.gradient_end]
                                                            : item.type == "翻" ?
                                                                [articleType.translate.gradient_start,
                                                                articleType.translate.gradient_end]
                                                                : [articleType.log.gradient_start,
                                                                articleType.log.gradient_end]

                                                    }
                                                    style={{
                                                        alignItems: "center", justifyContent: "center", borderRadius: 10,
                                                        paddingLeft: 5, paddingRight: 5, paddingTop: 2, paddingBottom: 2,
                                                    }}
                                                >
                                                    <Text style={{ color: "#fff", fontSize: 10 }}>{item.type}</Text>
                                                </LinearGradient>
                                            </View>
                                        </View>
                                        {/* 用户名 */}
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <TouchableOpacity onPress={() => { }} style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Image style={{ ...styles.profilePhoto }} source={item.photoPath} />
                                                    <View style={{ paddingLeft: 10 }}>
                                                        <Text style={{ fontSize: 11, color: "#5a5a5a" }}>
                                                            {item.nickName}
                                                        </Text>
                                                        <Text style={{ fontSize: 11, color: "#0004" }}>
                                                            {dateDiff(item.publishTime)}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>

                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                                                {/* <TouchableOpacity style={{ marginRight: 10, padding: 5, paddingLeft: 10, paddingRight: 10, backgroundColor: topicTrends[topicTrendsNum].style_desc.gradient_start, borderRadius: 5 }}>
                            <Text style={{ color: "#fff" }}>关注</Text>
                        </TouchableOpacity> */}
                                                <TouchableOpacity ref={(ref) => {
                                                    downArrowWithVideoRef.current[index] = ref;
                                                }} onPress={() => { toggleSpinnerWithVideo(index) }} style={{ padding: 5, paddingLeft: 10, paddingRight: 10, alignItems: "center", width: 35 }}>
                                                    {
                                                        !showPopoverWithVideo
                                                            ? <FontAwesomeIcon name="ellipsis-v" size={15} color="#ddd" />
                                                            : indexWithVideo != index
                                                                ? <FontAwesomeIcon name="ellipsis-v" size={15} color="#ddd" />
                                                                : <FontAwesomeIcon name="chevron-down" size={15} color="#ddd" />
                                                    }
                                                </TouchableOpacity>

                                            </View>
                                        </View>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        );
                    })
                }
                <Popover from={rectWithVideo}
                    isVisible={showPopoverWithVideo}
                    onRequestClose={() => setShowPopoverWithVideo(false)}
                    backgroundStyle={{ backgroundColor: "#000", opacity: 0.1 }}
                    animationConfig={{ duration: 200 }}
                    popoverStyle={{ borderRadius: 5 }}
                >
                    {spinnerTextArray.map((v, i) => {
                        return <TouchableHighlight key={i} onPress={() => { alert(v, ",index:") }}
                            underlayColor='#ddd'>
                            <Text style={{ padding: 5, paddingLeft: 10, paddingRight: 10, color: '#5c5c5c' }}>
                                {v}
                            </Text>
                        </TouchableHighlight>
                    })
                    }
                </Popover>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={true} hidden={false} />

            <ScrollView>
                {/* 第1行 通知轮播*/}
                <View style={{
                    flexDirection: "row", justifyContent: 'space-evenly', alignItems: "center",
                }}>
                    <MaterialCommunityIcons name='bullhorn' color='#ec1a0a' size={20} />
                    <View style={{ justifyContent: "center" }}>
                        <Swiper
                            ref={noticeRef}
                            height={30} width={screenWidth - 80}
                            horizontal={false}
                            style={{ backgroundColor: "#fff" }}
                            showsButtons={false}
                            showsPagination={false}
                            onIndexChanged={(index) => { }}
                        >
                            {notices.map((v, i) => {
                                let width = v.length * noticeHeight;
                                return <View key={i} onLayout={e => onLayout(e, i)} style={{
                                    width: width,
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <Animated.Text
                                        style={{
                                            fontSize: noticeHeight,
                                            transform: [{ translateX: noticeTranslateX[i] },],
                                        }}>{v}</Animated.Text>
                                </View>
                            })}
                        </Swiper>
                    </View>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => {
                        props.navigation.navigate("Search")
                    }}>
                        <FontAwesomeIcon name='search' size={30} color='#0008' />
                    </TouchableOpacity>

                </View>
                {/* 第2行 轮播图 */}
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <Swiper
                        height={(screenWidth - 24) * 9 / 16}
                        width={screenWidth - 24}
                        dot={
                            <View
                                style={{
                                    backgroundColor: '#eeeb',
                                    width: 5,
                                    height: 5,
                                    borderRadius: 4,
                                    marginLeft: 3,
                                    marginRight: 3,
                                    marginTop: 3,
                                    marginBottom: 3
                                }}
                            />
                        }
                        activeDot={
                            <View
                                style={{
                                    backgroundColor: topicTrends[topicTrendsNum].style_desc.gradient_start,
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    marginLeft: 3,
                                    marginRight: 3,
                                    marginTop: 3,
                                    marginBottom: 3
                                }}
                            />
                        }
                        paginationStyle={{
                            bottom: -23,
                            left: null,
                            right: 10,
                        }}
                        autoplay={true}
                    >
                        {
                            slidePics.map((v, i) => {
                                return <View key={i} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                                    title={
                                        <Text numberOfLines={1}>{v.desc}</Text>
                                    }
                                >
                                    <Image source={v.pic} style={{
                                        width: screenWidth - 24,
                                        height: (screenWidth - 24) * 9 / 16,
                                        borderRadius: 10,
                                    }} />

                                </View>
                            })
                        }
                    </Swiper>
                </View>

                {/* 第3行 文章推荐 */}
                <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 30 }}>
                    {/* 3.1行 头部 */}
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-end" }}>
                        <View>
                            <Text style={{ fontSize: 22, color: "#000b" }}>文章推荐</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center", marginRight: 10 }}
                                onPress={() => {
                                    setArticleRefresh(true);
                                    getArticleList();
                                }}
                            >
                                <Feather name='refresh-ccw' size={15} color='#ccc' />
                                <Text style={{ fontSize: 15, color: "#ccc" }}>刷新</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center" }}>
                                <Text style={{ fontSize: 15, color: "#ccc" }}>更多</Text>
                                <Feather name='chevron-right' size={15} color='#ccc' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* 3.2行 */}
                    {
                        articleRefresh
                            ? <View>
                                <ActivityIndicator animating={true}
                                    color={topicTrends[topicTrendsNum].style_desc.gradient_start}
                                />
                            </View>
                            : <></>
                    }

                    {/* 3.3行 */}
                    {renderArticleList()}
                </View>

                {/* 第4行 视频推荐 */}
                <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 30 }}>
                    {/* 3.1行 头部 */}
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-end" }}>
                        <View>
                            <Text style={{ fontSize: 22, color: "#000b" }}>视频推荐</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center", marginRight: 10 }}
                                onPress={() => {
                                    setVideoRefresh(true);
                                    getVideoList();
                                }}
                            >
                                <Feather name='refresh-ccw' size={15} color='#ccc' />
                                <Text style={{ fontSize: 15, color: "#ccc" }}>刷新</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center" }}>
                                <Text style={{ fontSize: 15, color: "#ccc" }}>更多</Text>
                                <Feather name='chevron-right' size={15} color='#ccc' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* 3.2行 */}
                    {
                        videoRefresh
                            ? <View>
                                <ActivityIndicator animating={true}
                                    color={topicTrends[topicTrendsNum].style_desc.gradient_start}
                                />
                            </View>
                            : <></>
                    }
                    <View style={{ height: 10 }}></View>
                    {/* 3.3行 */}
                    {renderVideoList()}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",//// 解决二级导航的bug加上marginTop:screenHeight/3

    },
    profilePhoto: {
        width: 30,
        height: 30,
        borderRadius: 15
    },
    img: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        borderRadius: 5
    },
    videoImg: {
        width: screenWidth / 2.2,
        height: screenWidth / 2.2 * 9 / 16,
        resizeMode: 'contain',
        // borderRadius: 20
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    widget: {
        fontSize: 12,
        paddingLeft: 2,
        paddingRight: 6,
        color: "#ffffffe6"
    }
})