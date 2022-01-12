import React, { useRef, useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    ActivityIndicator, StatusBar, TextInput,
    Vibration
} from 'react-native';
import Modal from 'react-native-modal'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { WebView } from 'react-native-webview';
import RichEditor from '../../../../../utils/components/richWebView/RichEditor';
import RichToolbar from '../../../../../utils/components/richWebView/RichToolbar';
import { screenHeight, screenWidth, statusBarHeight } from '../../../../../utils/stylesKits';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { selectTopicTrendsNum } from '../../../../../utils/slice/topicTrendsNumSlice'
import { selectTopicTrends } from '../../../../../utils/slice/topicTrendsSlice'
import FullPageHeader from '../../../../../utils/components/fullPageHeader';
import { CommonPicker, DatePicker, RegionPicker } from "@yz1311/react-native-wheel-picker";
import Toast, { DURATION } from 'react-native-easy-toast'


const pcSource = { uri: 'https://qgao233.github.io/qgao2021-html/html/article/writeArticle.html' };

const options = {
    mediaType: "photo",
    quality: 0.2,          //1质量最高
    includeBase64: true, //生成base64返回
    selectionLimit: 0,   //允许多张
};

const typeOptions = [
    "原创", "转载", "翻译",
];
const extraTypeOptions = [
    "开发日志"
]



export default (props) => {

    const toastRef = useRef();

    const [isShowMainBody, setIsShowMainBody] = useState(false);//default false
    const [createArticleMode, setCreateArticleMode] = useState("");//default ""

    const [isLoadFinish, setIsLoadFinish] = useState(false);
    const topicTrendsNum = useSelector(selectTopicTrendsNum);
    const topicTrends = useSelector(selectTopicTrends);

    const renderPCRichEditor = () => {
        return (

            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* 第1层 返回头部 */}
                <FullPageHeader style={{}} middleName="编辑文章" />
                {!isLoadFinish
                    ? <ActivityIndicator animating={true}
                        color={topicTrends[topicTrendsNum].style_desc.gradient_start}
                        size="large" />
                    : <></>
                }
                {/* 必须外层flex为1，或者自身成为最外层才能显示 */}
                <WebView
                    // startInLoadingState={true}
                    // renderLoading={() => <ActivityIndicator animating={true}
                    //     color={topicTrends[topicTrendsNum].style_desc.gradient_start}
                    //     size="large" />}
                    // style={{ flex: 0,height:screenHeight-200 }}
                    source={pcSource} onLoadEnd={() => { setIsLoadFinish(true) }}
                />
            </View>
        );
    }

    const richEditorRef = useRef();

    const _onPressAddImage = () => {
        return new Promise((resolve, reject) => {
            launchImageLibrary(options)
                .then(response => {
                    resolve(response.assets);
                })
                .catch(err => {
                    reject(err)
                })
        });
    }

    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [typePickerShow, setTypePickerShow] = useState(false);

    const [tagsOptions, setTagsOptions] = useState([
        "react-native", "java", "html", "python", "ai", "funny"
    ]);

    const [tags, setTags] = useState([]);
    const [tagsPickerShow, setTagsPickerShow] = useState(false);
    const [tagsChange, setTagsChange] = useState(false);

    const removeTag = (index) => {
        setTags(tags => {
            tags.splice(index, 1);
            return tags;
        })
        Vibration.vibrate([0, 25], false);//震动提示
        setTagsChange(tagsChange => !tagsChange)//没其它作用，就是强制让上面的tags更新成功，强制渲染画面。
    }

    const validateTagsData = (val) => {
        setTags(preVals => {

            if (preVals.length == 5) {
                toastRef.current.show('标签数量不能超过5', 1500);
                return preVals;
            }
            let canBeAdded = true;
            preVals.forEach(element => {
                if (element == val) {
                    toastRef.current.show('标签不能重复', 1500);
                    canBeAdded = false;
                    return;
                }
            });
            return canBeAdded ? [...preVals, val[0]] : preVals;
        });
        setTagsPickerShow(false);
    }

    const [isAddTagModalShow, setIsAddTagModalShow] = useState(false);
    const [newTag, setNewTag] = useState("");

    const createNewTag = () => {
        setTagsPickerShow(false)
        setIsAddTagModalShow(true);
    }

    const [privateCategoryPickerShow, setPrivateCategoryPickerShow] = useState(false);
    const [privateCategory, setPrivateCategory] = useState(null);
    const [privateCategoryOptions, setPrivateCategoryOptions] = useState([
        "ss", "ddd"
    ])
    const [isAddPrivateCategoryModalShow, setIsAddPrivateCategoryModalShow] = useState(false);
    const [newPrivateCategory, setNewPrivateCategory] = useState(null);

    const [categoryPickerShow, setCategoryPickerShow] = useState(false);
    const [category, setCategory] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([
        "bb", "ccc"
    ])

    const [finishModelShow, setFinishModelShow] = useState(false);

    const validateArticle = async (chooseType)=>{
        if(chooseType == "save"){
            let content = await richEditorRef.current.getContentHtml();
            // console.log(content);
        }
    }

    const renderMobileRichEditor = () => {
        return (
            <View style={{ flex: 1, }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={false} />
                {/* 第1层 返回头部 */}
                <FullPageHeader style={{}} middleName={"编辑文章"} rightComponent={(props) =>
                    <TouchableOpacity
                        onPress={() => {
                            setFinishModelShow(true)
                        }}
                        activeOpacity={0.8}>
                        <Text style={{ fontSize: props.fontSize, color: props.color }}>完成</Text>
                    </TouchableOpacity>
                } />
                <ScrollView>
                    {/* 输入题目 */}
                    <View
                        style={{
                            backgroundColor: "#fff",
                            padding: 20, paddingBottom: 10,
                        }}>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 16, color: "#000b" }}>标题</Text>
                        </View>
                        <TextInput style={{
                            backgroundColor: "#f6f7f9",
                            borderRadius: 10,
                            padding: 10, fontSize: 16
                        }}
                            placeholder='请输入题目'
                            placeholderTextColor="#CFD6DB"
                            onSubmitEditing={() => { }}
                            onChangeText={(value) => setTitle(value)}
                            value={title}
                            multiline={false}
                        ></TextInput>
                    </View>
                    {/* 选择文章类型 */}
                    <TouchableOpacity
                        onPress={() => { setTypePickerShow(true) }}
                        activeOpacity={0.6}
                        style={{
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            backgroundColor: "#fff", padding: 20,
                        }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 16, color: "#000b" }}>类型</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ marginRight: 10, fontSize: 16, color: '#0007' }}>
                                {type == "" ? "请选择" : type}
                            </Text>
                            <FontAwesomeIcon name='angle-right' size={20} color='#0007' />
                        </View>
                    </TouchableOpacity>
                    <CommonPicker
                        pickerData={typeOptions}
                        selectedValue={[typeOptions[0]]}
                        pickerToolBarStyle={{ backgroundColor: "#fff", borderBottomWidth: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        modalProps={{ backdropColor: "#0004", onBackdropPress: () => { setTypePickerShow(false) } }}
                        onPickerCancel={() => { setTypePickerShow(false) }}
                        onPickerConfirm={(val) => {
                            setType(val);
                            setTypePickerShow(false);
                        }}
                        isModal={true}
                        modalVisible={typePickerShow}
                    />
                    {/* 选择文章标签 */}
                    <TouchableOpacity
                        onPress={() => { setTagsPickerShow(true) }}
                        activeOpacity={0.6}
                        style={{
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            backgroundColor: "#fff",
                            padding: 20,

                        }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 16, color: "#000b" }}>标签</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ marginRight: 10, fontSize: 16, color: '#0007' }}>
                                {tags.length == 0 ? "请选择" : tags.length + "<=5"}
                            </Text>
                            <FontAwesomeIcon name='angle-right' size={20} color='#0007' />
                        </View>
                    </TouchableOpacity>
                    {
                        tags.length > 0
                            ? <View style={{
                                flexDirection: "row", padding: 20,paddingTop:10,paddingBottom:10,
                                backgroundColor: "#fff",borderWidth:0,
                            }}>
                                {
                                    tags.map((v, i) => {
                                        if (i == 0)
                                            return <TouchableOpacity onLongPress={() => { removeTag(i) }} key={i} style={{ marginRight: 5, paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1, justifyContent: "center", backgroundColor: "#ffd5d3", borderRadius: 5 }}>
                                                <Text style={{ color: "#ec1a0a", fontSize: 10 }}>{v}</Text>
                                            </TouchableOpacity>
                                        else return <TouchableOpacity onLongPress={() => { removeTag(i) }} key={i} style={{ marginRight: 5, paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1, justifyContent: "center", backgroundColor: "#eee", borderRadius: 5 }}>
                                            <Text style={{ color: "#aaa", fontSize: 10 }}>{v}</Text>
                                        </TouchableOpacity>
                                    })

                                }
                            </View>
                            : <></>
                    }

                    <CommonPicker
                        pickerData={tagsOptions}
                        selectedValue={[tagsOptions[0]]}
                        pickerToolBarStyle={{ backgroundColor: "#fff", borderBottomWidth: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        modalProps={{ backdropColor: "#0004", onBackdropPress: () => { setTagsPickerShow(false) } }}
                        pickerCancelBtnText="新增标签"
                        onPickerCancel={() => {
                            createNewTag();
                        }}
                        onPickerConfirm={(val) => {
                            validateTagsData(val)
                        }}
                        isModal={true}
                        modalVisible={tagsPickerShow}
                    />
                    <Modal isVisible={isAddTagModalShow} backdropColor="#0004"
                        style={{
                            margin: 0,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onBackButtonPress={() => { setIsAddTagModalShow(false) }}
                        onBackdropPress={() => { setIsAddTagModalShow(false) }}
                    >

                        <View style={{
                            borderRadius: 10,
                            backgroundColor: "#fff", alignItems: "center"
                        }}>
                            <View style={{ padding: 10, alignItems: "center" }}>
                                <Text>新增标签：</Text>
                            </View>
                            <View style={{ padding: 20, width: screenWidth / 1.5, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                <TextInput style={{ backgroundColor: "#f6f7f9", padding: 10, fontSize: 16, borderRadius: 10 }}
                                    placeholder='请输入新的标签'
                                    placeholderTextColor="#CFD6DB"
                                    onSubmitEditing={() => { }}
                                    onChangeText={(value) => setNewTag(value)}
                                    value={newTag}
                                    multiline={false}
                                ></TextInput>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (newTag && newTag != "") setTagsOptions(pre => [...pre, newTag]);
                                        setIsAddTagModalShow(false)
                                    }}
                                    activeOpacity={0.7}
                                    style={{ padding: 5 }}>
                                    <Text style={{ fontSize: 16, color: topicTrends[topicTrendsNum].style_desc.gradient_start }}>确定</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Modal>
                    {/* 选择文章个人分类 */}
                    <TouchableOpacity
                        onPress={() => { setPrivateCategoryPickerShow(true) }}
                        activeOpacity={0.6}
                        style={{
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            backgroundColor: "#fff",
                            padding: 20,

                        }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 16, color: "#000b" }}>个人分类</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ marginRight: 10, fontSize: 16, color: '#0007' }}>
                                {privateCategory == null ? "请选择" : privateCategory}
                            </Text>
                            <FontAwesomeIcon name='angle-right' size={20} color='#0007' />
                        </View>
                    </TouchableOpacity>
                    <CommonPicker
                        pickerData={privateCategoryOptions}
                        selectedValue={[privateCategoryOptions[0]]}
                        pickerToolBarStyle={{ backgroundColor: "#fff", borderBottomWidth: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        modalProps={{ backdropColor: "#0004", onBackdropPress: () => { setPrivateCategoryPickerShow(false) } }}
                        pickerCancelBtnText="新增个人分类"
                        onPickerCancel={() => {
                            setPrivateCategoryPickerShow(false);
                            setIsAddPrivateCategoryModalShow(true);
                        }}
                        onPickerConfirm={(val) => {
                            setPrivateCategory(val)
                            setPrivateCategoryPickerShow(false);
                        }}
                        isModal={true}
                        modalVisible={privateCategoryPickerShow}
                    />
                    <Modal isVisible={isAddPrivateCategoryModalShow} backdropColor="#0004"
                        style={{
                            margin: 0,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onBackButtonPress={() => { setIsAddPrivateCategoryModalShow(false) }}
                        onBackdropPress={() => { setIsAddPrivateCategoryModalShow(false) }}
                    >

                        <View style={{
                            borderRadius: 10,
                            backgroundColor: "#fff", alignItems: "center"
                        }}>
                            <View style={{ padding: 10, alignItems: "center" }}>
                                <Text>新增个人分类：</Text>
                            </View>
                            <View style={{ padding: 10, width: screenWidth / 1.5, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                <TextInput style={{ backgroundColor: "#f6f7f9", padding: 10, fontSize: 16, borderRadius: 10 }}
                                    placeholder='请输入新的个人分类'
                                    placeholderTextColor="#CFD6DB"
                                    onSubmitEditing={() => { }}
                                    onChangeText={(value) => setNewPrivateCategory(value)}
                                    value={newPrivateCategory}
                                    multiline={false}
                                ></TextInput>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (newPrivateCategory && newPrivateCategory != "") setPrivateCategoryOptions(pre => [...pre, newPrivateCategory]);
                                        setIsAddPrivateCategoryModalShow(false)
                                    }}
                                    activeOpacity={0.7}
                                    style={{ padding: 5 }}>
                                    <Text style={{ fontSize: 16, color: topicTrends[topicTrendsNum].style_desc.gradient_start }}>确定</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Modal>
                    {/* 选择文章公有分类 */}
                    <TouchableOpacity
                        onPress={() => { setCategoryPickerShow(true) }}
                        activeOpacity={0.6}
                        style={{
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            backgroundColor: "#fff",
                            padding: 20,

                        }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 16, color: "#000b" }}>公有分类</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ marginRight: 10, fontSize: 16, color: '#0007' }}>
                                {category == null ? "请选择" : category}
                            </Text>
                            <FontAwesomeIcon name='angle-right' size={20} color='#0007' />
                        </View>
                    </TouchableOpacity>
                    <CommonPicker
                        pickerData={categoryOptions}
                        selectedValue={[categoryOptions[0]]}
                        pickerToolBarStyle={{ backgroundColor: "#fff", borderBottomWidth: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        modalProps={{ backdropColor: "#0004", onBackdropPress: () => { setCategoryPickerShow(false) } }}
                        pickerCancelBtnText="取消"
                        onPickerCancel={() => {
                            setCategoryPickerShow(false);
                        }}
                        onPickerConfirm={(val) => {
                            setCategory(val)
                            setCategoryPickerShow(false);
                        }}
                        isModal={true}
                        modalVisible={categoryPickerShow}
                    />
                    {/* 文章内容 */}
                    <View
                        style={{
                            backgroundColor: "#fff", paddingLeft: 20, paddingRight: 20, paddingTop: 20,
                        }}>
                        <Text style={{ fontSize: 16, color: "#000b" }}>内容</Text>
                    </View>
                    <RichEditor
                        editorStyle={{ padding: 20, backgroundColor: "#fff" }}
                        height={screenHeight - 90}
                        ref={richEditorRef}
                        editorInitializedCallback={() => {
                            richEditorRef.current.focusContentEditor();
                        }}
                        initialContentHTML="请输入"
                    />
                </ScrollView>
                <RichToolbar
                    getEditor={() => richEditorRef.current}
                    onPressAddImage={() => _onPressAddImage()}
                    toolBarBackgroundColor="#f6f7f9"
                />
                <Modal isVisible={finishModelShow} backdropColor="#0004"
                    onBackdropPress={() => { setFinishModelShow(false) }}
                    style={{
                        width: screenWidth,
                        margin: 0,
                        justifyContent: "flex-end"
                    }}
                >

                    <View style={{
                        borderTopLeftRadius: 10, borderTopRightRadius: 10,
                        backgroundColor: "#fff",
                    }}>
                        <View style={{ padding: 20, alignItems: "center" }}>
                            <Text>请选择</Text>
                        </View>
                        <View style={{ padding: 20, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>

                            <TouchableOpacity
                                onPress={() => {
                                    validateArticle("publish");
                                }}
                                activeOpacity={0.7}
                                style={{ alignItems: "center" }}>
                                <FontAwesomeIcon name="upload" size={50} />
                                <Text style={{ fontSize: 15 }}>发布</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    validateArticle("save");
                                }}
                                activeOpacity={0.7}
                                style={{ alignItems: "center" }}>
                                <FontAwesomeIcon name="file-archive-o" size={50} />
                                <Text style={{ fontSize: 15 }}>保存</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    props.navigation.goBack()
                                }}
                                activeOpacity={0.7}
                                style={{ alignItems: "center" }}>
                                <FontAwesomeIcon name="trash-o" size={50} />
                                <Text style={{ fontSize: 15 }}>丢弃</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Modal>
                {/* toast放在最外层View的底部 */}
                <Toast ref={toastRef} style={{ backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#eee" }} textStyle={{ color: "#000" }} />

            </View>
        );
    }

    const renderMainBody = () => {
        return createArticleMode == "pc"
            ? renderPCRichEditor()
            : renderMobileRichEditor()
    }

    const renderOptions = () => {
        return (
            <Modal isVisible={true} backdropColor="#0004"
                style={{
                    margin: 0,
                    justifyContent: "center",
                    alignItems: "center"
                }}
                onBackButtonPress={() => { props.navigation.goBack() }}
            >

                <View style={{
                    borderRadius: 10,
                    backgroundColor: "#fff", alignItems: "center"
                }}>
                    <View style={{ padding: 20, alignItems: "center" }}>
                        <Text>请选择方式：</Text>
                    </View>
                    <View style={{ padding: 20, width: screenWidth / 1.5, flexDirection: "row", justifyContent: "space-evenly", alignItems: "flex-end" }}>

                        <TouchableOpacity
                            onPress={() => {
                                setCreateArticleMode("pc")
                                setIsShowMainBody(true);
                            }}
                            activeOpacity={0.7}
                            style={{ alignItems: "center" }}>
                            <FontAwesomeIcon name="desktop" size={50} />
                            <Text style={{ fontSize: 15 }}>PC网页</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCreateArticleMode("mobile")
                                setIsShowMainBody(true)
                            }}
                            activeOpacity={0.7}
                            style={{ alignItems: "center" }}>
                            <FontAwesomeIcon name="mobile" size={60} />
                            <Text style={{ fontSize: 15 }}>移动端</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>
        );
    }

    return (
        isShowMainBody
            ? renderMainBody()
            : renderOptions()
    );
}