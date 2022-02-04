import React from 'react';
import {
  View,
  Text, FlatList, Image, TouchableOpacity,
  TouchableHighlight, StyleSheet, ActivityIndicator,
  RefreshControl, Modal
} from 'react-native';
import { dateDiff } from '../../../../../../../utils/funcKits';
import { topicTrends, topicTrendsNum, articleType, screenHeight } from '../../../../../../../utils/stylesKits';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import Popover, { Rect } from 'react-native-popover-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { Card } from 'react-native-shadow-cards';


const spinnerTextArray = ["关注", "私聊", "拉黑", "举报"];


class Index extends React.Component {

  constructor() {
    super();
    this.downArrowRef = {};

    this.contentOffsetY = 0;
    this.velocityY = 0;

    this.state = {
      isFirstLoad: true, //是否是第1次加载
      isRefresh: false,  //是否刷新列表
      page: 1,           //数据分页展示的第1页
      totalDataSize: 30, //数据总共有30条
      hasMorePage: true, //通过比较已经加载的数据条数和总的数据条数来判断是否还有更多数据
      loadingMore: false,//通过该字段来重新渲染新的加载数据
      sizePerPage: 7,    //每一页7条数据
      data: [],           //已经加载的数据

      showAlbum: false
    };
  }

  // 点击相册图片放大
  handleShowAlbum = (index, i) => {
    const imgUrls = this.state.data[index].imgPaths.map((v) => {
      // return ({url:v,props:{}})
      return { url: "", props: { source: v } }
    });
    this.setState({ imgUrls, albumIndex: i, showAlbum: true });
  }

  //开关下拉列表
  toggleSpinner = (index) => {
    this.downArrowRef[index].measure((ox, oy, width, height, px, py) => {
      this.setState({
        index: index,
        rect: new Rect(px, py - height * 3 / 2, width, height),
        showPopover: this.state.showPopover ? false : true
      });
    });

  }

  //2个问题：1、无法获得遍历后每个元素的measure（解决）
  //2、无法打开下拉列表（源代码还有问题）(解决)

  //item就是data传进去的，index就是list中每个元素的key属性
  _renderItem = ({ item, index }) => {
    // return (<></>);
    return (
      <Card key={index}
        cornerRadius={0} elevation={5} opacity={0.2}
        style={{
          width: "auto",
          // height: 160,
          marginTop: 10, marginLeft: 10, marginRight: 10, borderRadius: 10, backgroundColor: "#fff"
        }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("ChatScreen");
          }}
          activeOpacity={0.7}
          style={{
            padding: 10, paddingTop: 10, paddingBottom: 10,
            backgroundColor: "#fff",
            borderRadius: 10,
            // height: 65
          }}>
          {/* 第1行 */}
          <View style={{flexDirection: "row", alignItems: "center",justifyContent:"space-between"}}>
            {/**第1列 聊天室 cover*/}
            <View style={{  alignItems: "center" }}>
              <Image source={item.cover} style={{
                width: 72, height: 108, resizeMode: "stretch",
                borderRadius: 20,
              }} />
            </View>
            {/* 第2列 聊天室 信息*/}
            <View style={{ flex: 1,paddingLeft:5, }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View><Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text></View>
                <View style={{ alignItems: "center" }}>
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={
                      [articleType.transfer.gradient_start,
                      articleType.transfer.gradient_end]
                    }
                    style={{
                      alignItems: "center", justifyContent: "center", borderRadius: 10,
                      paddingLeft: 5, paddingRight: 5, paddingTop: 2, paddingBottom: 2,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 10 }}>互动</Text>
                  </LinearGradient>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <Text style={{ fontSize: 14, color: "#000b" }}>{item.creator} </Text>
                <Text style={{ fontSize: 14, color: "#000b" }}>{dateDiff(item.createTime)}</Text>
              </View>
              <View>
                <Text numberOfLines={3} style={{ fontSize: 10, color: "#878c92" }}>
                  {item.about}
                </Text>
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap", overflow: "hidden", alignItems: "center" }}>
                {
                  item.tags.length != 0
                    ? item.tags.map((v, i) => {
                      if (i == 0) {
                        return <View key={i + "#" + Math.random() * new Date().getTime()} style={{ margin: 2, paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1, justifyContent: "center", backgroundColor: "#ffd5d3", borderRadius: 5 }}>
                          <Text style={{ color: "#ec1a0a", fontSize: 10 }}>{v}</Text>
                        </View>
                      }

                      else return <View key={i + "#" + Math.random() * new Date().getTime()} style={{ margin: 2, paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1, justifyContent: "center", backgroundColor: "#eee", borderRadius: 5 }}>
                        <Text style={{ color: "#aaa", fontSize: 10 }}>{v}</Text>
                      </View>
                    })
                    : <></>
                }
              </View>
            </View>
          </View>
          {/* 第2行 */}
          <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
            {/* 第2.1列 */}
            <View style={{flexDirection:"row",alignItems:"center"}}>
                <Text>活跃：</Text>
                {
                  function(){
                    let array = [];
                    let i = 0;
                    for(; i < item.activeIndex; i++){
                      array.push(<AntDesign name="star" size={20} color='#ec1a0a' />)
                    }
                    for(; i < 5; i++){
                      array.push(<AntDesign name="staro" size={20} color='#ffd5d3' />)
                    }
                    return array;
                  }()
                }
            </View>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                <Text>在线：{item.online}</Text>
            </View>
          </View> 
        </TouchableOpacity>
      </Card>
    );
  }

  _onRefresh = () => {
    this.setState({
      isRefresh: true,
      page: 1
    }, () => {
      this.getShowData(1, 'refresh')
    })
  }

  _onLoadMore = () => {
    if ((this.state.page - 1) * this.state.sizePerPage < this.state.totalDataSize && !this.state.loadingMore) {
      this.setState({
        loadingMore: true,
        hasMorePage: true
      }, () => {
        this.getShowData(this.state.page);
      })
    } else if ((this.state.page - 1) * this.state.sizePerPage >= this.state.totalDataSize && !this.state.loadingMore) {
      this.setState({
        hasMorePage: false
      })
    }
  }

  getShowData = (page, type) => {
    const { sizePerPage, totalDataSize } = this.state;
    new Promise((resolve, reject) => {
      let array = [];
      for (let i = (page - 1) * sizePerPage, j = 0; i < totalDataSize && j < sizePerPage; i++, j++) {
        let obj = {
          key: i,
          cover: require("../../../../../../../res/img/landscape.png"),
          title: "聊人生理想，不谈风花雪月",
          creator: "qgao",
          createTime: 1643863061000,//时间戳形式,ms
          about: "胆大者半价打磨，血热的附赠寒冰，不要让我向永恒开战了，我要送你满屋热气与一把蝴蝶。",
          tags: [
            "react-native",
            "es6"
          ],
          online: 96,//在线人数
          activeIndex: 4,//活跃指数

        };
        array.push(obj);
      }
      setTimeout(() => {
        resolve(array);
        // resolve([]);
      }, 500);

    }).then((data) => {
      if (data.length > 0) {
        if (type === 'refresh') {
          this.setState({
            data: [...data],
            page: this.state.page + 1,
            isRefresh: false,
            isFirstLoad: false,
            loadingMore: false,
          })
        } else {
          this.setState({
            data: [...this.state.data, ...data],
            page: this.state.page + 1,
            isRefresh: false,
            isFirstLoad: false,
            loadingMore: false,
          })
        }
      } else {
        this.setState({
          data: [...this.state.data, ...data],
          isRefresh: false,
          isFirstLoad: false,
          loadingMore: false,
        })
      }

    })

  }

  _renderFooter = () => {
    let { hasMorePage, page } = this.state;
    const { topicTrends, topicTrendsNum } = this.props;

    if (hasMorePage && page >= 2) {
      return (
        <View style={{ flexDirection: 'row', height: 30, alignItems: 'center', justifyContent: 'center', }}>
          <ActivityIndicator animating={true}
            color={topicTrends[topicTrendsNum].style_desc.gradient_start}
          />
          <Text style={{ color: '#999999', fontSize: 14, }}>
            正在加载更多数据...
          </Text>
        </View>
      )
    } else if (!hasMorePage) {
      return (
        <View style={{ height: 30, alignItems: 'center', justifyContent: 'flex-start', }}>
          <Text style={{ color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5, }}>
            没有更多数据了
          </Text>
        </View>
      )
    } else {    //解决上拉刷新时出现的bug
      return <></>
    }
  }

  _renderEmptyer = () => {
    // 解决二级导航的bug加上backgroundColor:"#fff",
    return <View style={{ height: screenHeight * 1.5 / 2, alignItems: "center", justifyContent: "center" }}>
      <Text>空空如也!</Text>
    </View>
  }
  renderFlatList = () => {
    const { isRefresh } = this.state;
    const { topicTrends, topicTrendsNum } = this.props;

    return (
      <>
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          style={{ backgroundColor: "#fff" }}

          onScrollBeginDrag={(evt) => {
            this.contentOffsetY = evt.nativeEvent.contentOffset.y;
            this.velocityY = evt.nativeEvent.velocity.y;
          }}
          onScrollEndDrag={(evt) => {

            //手指从上往下
            if (evt.nativeEvent.contentOffset.y == 0 ||
              evt.nativeEvent.contentOffset.y < this.contentOffsetY &&
              evt.nativeEvent.velocity.y > this.velocityY) {
              this.props.showSearchFrame(true);
            } else {
              this.props.showSearchFrame(false);
            }
          }}

          refreshControl={
            <RefreshControl
              refreshing={isRefresh}
              onRefresh={this._onRefresh}//上拉刷新
              colors={[topicTrends[topicTrendsNum].style_desc.gradient_start, "#ec1a0a", "#ffc051"]}
              progressBackgroundColor="#fff"
            />
          }

          onEndReached={() => this._onLoadMore()}//下拉加载
          onEndReachedThreshold={0.3}
          ListFooterComponent={this._renderFooter}
          ListEmptyComponent={this._renderEmptyer}
        />
        <Popover from={this.state.rect}
          isVisible={this.state.showPopover}
          onRequestClose={() => this.setState({ showPopover: false })}
          backgroundStyle={{ backgroundColor: "#000", opacity: 0.1 }}
          animationConfig={{ duration: 200 }}
          popoverStyle={{ borderRadius: 5 }}
        >
          {spinnerTextArray.map((v, i) => {
            return <TouchableHighlight key={i} onPress={() => { alert(v, ",index:", this.state.index) }}
              underlayColor='#ddd'>
              <Text style={{ padding: 5, paddingLeft: 10, paddingRight: 10, color: '#5c5c5c' }}>
                {v}
              </Text>
            </TouchableHighlight>
          })
          }
        </Popover>
        <Modal visible={this.state.showAlbum} onRequestClose={() => this.setState({ showAlbum: false })} transparent={true}>
          <ImageViewer
            enableSwipeDown={true}
            swipeDownThreshold={0.5}
            onSwipeDown={() => this.setState({ showAlbum: false })}
            imageUrls={this.state.imgUrls}
            index={this.state.albumIndex}
            loadingRender={this.renderInitLoadIndicator}
            menuContext={{ saveToLocal: '保存到本地', cancel: '取消' }}
            onSave={() => alert("点击了保存图片")}
          />
        </Modal>
      </>


    );
  }

  renderInitLoadIndicator = () => {
    const { topicTrends, topicTrendsNum } = this.props;

    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true}
          color={topicTrends[topicTrendsNum].style_desc.gradient_start}
          size="large" />
      </View>
    )
  }

  componentDidMount() {
    this.getShowData(1);
  }

  render() {
    const { isFirstLoad } = this.state;
    if (isFirstLoad) {
      return this.renderInitLoadIndicator();
    } else {
      return this.renderFlatList();
    }
  }
}
//使用reselect机制，防止不避要的re-render
const getTopicTrends = createSelector(
  [state => state.topicTrends],
  topicTrends => topicTrends
)
const getTopicTrendsNum = createSelector(
  [state => state.topicTrendsNum],
  topicTrendsNum => topicTrendsNum.value
)
const mapStateToProps = (state) => {
  return {
    topicTrends: getTopicTrends(state),
    topicTrendsNum: getTopicTrendsNum(state),
  }
}


export default connect(mapStateToProps, null)(Index);

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
  }
})