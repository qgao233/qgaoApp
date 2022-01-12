import React, { useState } from 'react';
import {
    SafeAreaView, View, Text, StatusBar, Image, TouchableOpacity,
    TextInput, StyleSheet, Vibration, ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { screenHeight, screenWidth, statusBarHeight } from '../../../../../../utils/stylesKits';
import { useTopicTrends } from '../../utils/hooks';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { CommonPicker, DatePicker, RegionPicker } from "@yz1311/react-native-wheel-picker";
import moment from 'moment';
import Textarea from 'react-native-textarea'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';//没啥用，完全可以被image-crop-picker替代
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { useDispatch } from 'react-redux';
import { changeLoginStatus } from '../../utils/slice/loginStatusSlice'

const headImgSource = require("../../../../../../res/img/girl.jpg")

const sexOptions = [
    "隐私", "男", "女"
];

const sexIcons = [
    <Ionicons key={0} style={{ marginRight: 10 }} name='male-female-outline' size={25} color='#0004' />,
    <Ionicons key={1} style={{ marginRight: 10 }} name='male-outline' size={25} color='#08b4f4' />,
    <Ionicons key={2} style={{ marginRight: 10 }} name='female-outline' size={25} color='#FF496C' />,
]

const constellationMap = [
    {
        name: "白羊座",
        en_name: "Aries",
        date: {
            from: "3-21",
            to: "4-20"
        }
    },
    {
        name: "金牛座",
        en_name: "Taurus",
        date: {
            from: "4-21",
            to: "5-21"
        }
    },
    {
        name: "双子座",
        en_name: "Gemini",
        date: {
            from: "5-22",
            to: "6-21"
        }
    },
    {
        name: "巨蟹座",
        en_name: "Cancer",
        date: {
            from: "6-22",
            to: "7-22"
        }
    },
    {
        name: "狮子座",
        en_name: "Leo",
        date: {
            from: "7-23",
            to: "8-23"
        }
    },
    {
        name: "处女座",
        en_name: "Virgo",
        date: {
            from: "8-24",
            to: "9-23"
        }
    },
    {
        name: "天秤座",
        en_name: "Libra",
        date: {
            from: "9-24",
            to: "10-23"
        }
    },
    {
        name: "天蝎座",
        en_name: "Scorpio",
        date: {
            from: "10-24",
            to: "11-22"
        }
    },
    {
        name: "射手座",
        en_name: "Sagittarius",
        date: {
            from: "11-23",
            to: "12-21"
        }
    },
    {
        name: "摩羯座",
        en_name: "Capricorn",
        date: {
            from: "12-22",
            to: "1-20"
        }
    },
    {
        name: "水瓶座",
        en_name: "Aquarius",
        date: {
            from: "1-21",
            to: "2-19"
        }
    },
    {
        name: "双鱼座",
        en_name: "Pisces",
        date: {
            from: "2-20",
            to: "3-20"
        }
    },
]
const mapDateToConstellation = (month, day) => {
    let constellation = null;
    constellationMap.forEach((v, i) => {
        let fromArray = v.date.from.split("-");
        let fromMonth = parseInt(fromArray[0]);
        let fromDay = parseInt(fromArray[1]);
        let toArray = v.date.to.split("-");
        let toMonth = parseInt(toArray[0]);
        let toDay = parseInt(toArray[1]);

        if (month >= fromMonth && month <= toMonth) {
            if (month == fromMonth && day >= fromDay) {
                constellation = v.name;
                return;
            }
            if (month == toMonth && day <= toDay) {
                constellation = v.name;
                return;
            }
        } else if (month == 12 && fromMonth == 12 && day >= fromDay) {
            constellation = v.name;
            return;
        } else if (month == 1 && toMonth == 1 && day <= toDay) {
            constellation = v.name;
            return;
        }
    })
    return constellation;
}

export default (props) => {

    const { topicTrends, topicTrendsNum } = useTopicTrends();

    const { navigation } = props;

    const [textValue, setTextValue] = useState("");

    const [sexPickerShow, setSexPickerShow] = useState(false);
    const [sex, setSex] = useState("隐私");

    const [birthday, setBirthday] = useState(null);
    const [constellation, setConstellation] = useState(null);
    const [birthdayPickerShow, setBirthdayPickerShow] = useState(false);

    const [addressPickerShow, setAddressPickerShow] = useState(false);
    const [address, setAddress] = useState(null)

    const [textareaValue, setTextareaValue] = useState("");

    const [photoPickerShow, setPhotoPickerShow] = useState(false);

    const [photo, setPhoto] = useState(require("../../../../../../res/img/mine.jpg"))

    const chooseImg = async () => {
        const image = await ImagePicker.openPicker({
            width: screenWidth / 2,
            height: screenWidth / 2,
            cropping: true
        });
        setPhoto({ uri: image.path })
    }

    const chooseCamera = async () => {
        const image = await ImagePicker.openCamera({
            width: screenWidth / 2,
            height: screenWidth / 2,
            cropping: true
        });
        setPhoto({ uri: image.path })
    }


    const dispatch = useDispatch();
    const validateInfo = ()=>{
        //验证并保存信息,并弹出4个screen
        dispatch(changeLoginStatus(true));
        navigation.pop(4);
    }

    return (
        <SafeAreaView style={{ paddingTop: statusBarHeight, backgroundColor: "#fff", flex: 1 }}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={false} />

            <View style={{ padding: 30, paddingTop: 20, paddingBottom: 0, flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                    <Text style={{ fontSize: 20, color: "#000b" }}>填写资料</Text>
                    <Text style={{ fontSize: 15, color: "#0005", paddingTop: 10, paddingBottom: 10 }}>让更多人认识你</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        validateInfo()
                    }}
                    activeOpacity={0.6}>
                    <Text style={{ fontSize: 15, color: "#0005", }}>跳过</Text>
                </TouchableOpacity>
            </View>
            <ScrollView overScrollMode='always' style={{ paddingTop: 30 }}>
                {/* 更改头像 */}
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => {
                            setPhotoPickerShow(true)
                        }}
                        activeOpacity={0.7}
                        style={{ position: "relative", alignItems: "center" }}>
                        <Image style={{ width: screenWidth / 4, height: screenWidth / 4, borderRadius: screenWidth / 8 }}
                            source={photo}
                        />
                        <Text style={{ position: "absolute", color: "#fff", fontSize: 15, top: (screenWidth / 4 - 15) / 2 }}>更换头像</Text>
                    </TouchableOpacity>
                </View>
                <Modal isVisible={photoPickerShow} backdropColor="#0004"
                    onBackdropPress={() => { setPhotoPickerShow(false) }}
                    style={{
                        width: screenWidth,
                        margin: 0,
                        justifyContent: "flex-end"
                    }}
                >
                    <View style={{
                        borderTopLeftRadius: 10, borderTopRightRadius: 10,
                        backgroundColor: "#fff", padding: 20, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center"
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                chooseImg();
                            }}
                            activeOpacity={0.7}
                            style={{ alignItems: "center" }}>
                            <FontAwesomeIcon name="image" size={50} />
                            <Text style={{ fontSize: 15 }}>图片</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                chooseCamera();
                            }}
                            activeOpacity={0.7}
                            style={{ alignItems: "center" }}>
                            <FontAwesomeIcon name="camera" size={50} />
                            <Text style={{ fontSize: 15 }}>拍照</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                {/* 输入昵称 */}
                <View
                    style={{
                        backgroundColor: "#fff", paddingLeft: 20, paddingRight: 20
                    }}>
                    <View style={{ flexDirection: "row", paddingTop: 20, paddingBottom: 20 }}>
                        <Text style={{ fontSize: 16, color: "#000b" }}>昵称</Text>
                    </View>
                    <TextInput style={{ backgroundColor: "transparent", padding: 0, paddingTop: 20, paddingBottom: 20, fontSize: 16 }}
                        placeholder='请输入昵称'
                        onSubmitEditing={() => { }}
                        onChangeText={(value) => setTextValue(value)}
                        value={textValue}
                        multiline={false}
                    ></TextInput>
                </View>
                {/* 选择性别 */}
                <TouchableOpacity
                    onPress={() => { setSexPickerShow(true) }}
                    activeOpacity={0.6}
                    style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        backgroundColor: "#fff", padding: 20,
                    }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 16, color: "#000b" }}>性别</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        {
                            sexOptions.map((v, i) => {
                                if (v == sex) {
                                    return sexIcons[i];
                                }
                            })
                        }
                        <FontAwesomeIcon name='angle-right' size={20} color='#0007' />
                    </View>
                </TouchableOpacity>
                <CommonPicker
                    pickerData={sexOptions}
                    selectedValue={[sexOptions[0]]}
                    pickerToolBarStyle={{ backgroundColor: "#fff", borderBottomWidth: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    modalProps={{ backdropColor: "#0004", onBackdropPress: () => { setSexPickerShow(false) } }}
                    onPickerCancel={() => { setSexPickerShow(false) }}
                    onPickerConfirm={(val) => {
                        setSex(val);
                        setSexPickerShow(false);
                    }}
                    isModal={true}
                    modalVisible={sexPickerShow}
                />
                {/* 选择生日/星座 */}
                <TouchableOpacity
                    onPress={() => { setBirthdayPickerShow(true) }}
                    activeOpacity={0.6}
                    style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        backgroundColor: "#fff", padding: 20,
                    }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 16, color: "#000b" }}>生日/星座</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ marginRight: 10, color: "#0004" }}>{birthday}{birthday == null ? "未选择" : "/"}{constellation}</Text>
                        <FontAwesomeIcon name='angle-right' size={20} color='#0007' />
                    </View>
                </TouchableOpacity>
                <DatePicker
                    mode={'date'}
                    //date值可以不填，默认是当前时间
                    minDate={moment().subtract(100, "years")}
                    maxDate={moment()}
                    onPickerConfirm={(value) => {
                        //不管mode的值是哪一种, value均是一个Date对象, 需要转换为所需的值
                        //譬如: 如果mode=='year', 则可以通过`moment(value).year()`
                        let constellation = mapDateToConstellation(moment(value).month() + 1, parseInt(moment(value).format("D")))
                        setBirthday(moment(value).format("YYYY-MM-DD"))
                        setConstellation(constellation)
                        setBirthdayPickerShow(false)
                    }}
                    pickerToolBarStyle={{ backgroundColor: "#fff", borderBottomWidth: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    modalProps={{ backdropColor: "#0004", onBackdropPress: () => { setBirthdayPickerShow(false) } }}
                    onPickerCancel={() => { setBirthdayPickerShow(false) }}
                    isModal={true}
                    modalVisible={birthdayPickerShow}
                />
                {/* 选择所在地 */}
                <TouchableOpacity
                    onPress={() => { setAddressPickerShow(true) }}
                    activeOpacity={0.6}
                    style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        backgroundColor: "#fff", padding: 20,
                    }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 16, color: "#000b" }}>所在地</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ marginRight: 10, color: "#0004" }}>{address == null ? "未选择" : address}</Text>
                        <FontAwesomeIcon name='angle-right' size={20} color='#0007' />
                    </View>
                </TouchableOpacity>
                <RegionPicker
                    //模式，'p' | 'pc' | 'pca'三个值分别代表省、省市、省市区 三种模式,默认是pca
                    mode="pca"
                    onPickerConfirm={(names, codes) => {
                        //names: ["上海市", "市辖区", "黄浦区"],根据mode的不同返回不同长度的数组
                        //codes: ["31", "3101", "310101"],根据mode的不同返回不同长度的数组
                        setAddress(names.join("-"));
                        setAddressPickerShow(false);
                    }}
                    pickerToolBarStyle={{ backgroundColor: "#fff", borderBottomWidth: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    modalProps={{ backdropColor: "#0004", onBackdropPress: () => { setAddressPickerShow(false) } }}
                    onPickerCancel={() => { setAddressPickerShow(false) }}
                    isModal={true}
                    modalVisible={addressPickerShow}
                    selectedValue={['']}
                />
                {/* 个性签名 */}
                <View
                    style={{
                        backgroundColor: "#fff", paddingLeft: 20, paddingRight: 20,
                    }}>
                    <View style={{ flexDirection: "row", paddingTop: 20, paddingBottom: 20 }}>
                        <Text style={{ fontSize: 16, color: "#000b" }}>个性签名</Text>
                    </View>
                    <Textarea style={{
                        textAlignVertical: 'top', backgroundColor: "#f6f7f9",
                        borderRadius: 10,
                        padding: 5, height: 100, justifyContent: "flex-start", fontSize: 16,
                    }}
                        placeholder='手握日月摘星辰,世间无我这般人!'
                        placeholderTextColor="#CFD6DB"
                        onSubmitEditing={() => { }}
                        onChangeText={(value) => setTextareaValue(value)}
                        value={textareaValue}
                        multiline={true}
                    />
                </View>
                <View style={{ alignItems: "center",marginTop:-30, }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            validateInfo();
                        }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={[topicTrends[topicTrendsNum].style_desc.gradient_start,
                            topicTrends[topicTrendsNum].style_desc.gradient_end]}
                            style={{
                                alignItems: "center", borderRadius: 10,
                                padding: 15,
                                width: screenWidth / 1.5,
                                borderRadius: 30,
                                flexDirection: "row",
                                justifyContent: "center", alignItems: "center"
                            }}
                        >
                            <Text style={{ fontSize: 18, color: "#fcf5ef" }}>确定</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}