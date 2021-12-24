import React from 'react';
import {
  View,
  Text, FlatList, Image, TouchableOpacity,
  TouchableHighlight, StyleSheet, ActivityIndicator,
  RefreshControl, Modal
} from 'react-native';
import { dateDiff } from '../../../../../../utils/funcKits';
import { topicTrends, topicTrendsNum, articleType, screenHeight, screenWidth } from '../../../../../../utils/stylesKits';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Popover, { Rect } from 'react-native-popover-view';
import { useNavigation } from '@react-navigation/native';

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
      <TouchableOpacity activeOpacity={0.9} onPress={()=>{this.props.navigation.navigate("VideoDetail")}}>
      <View key={index} style={{ borderRadius: 10, padding: 5, marginTop: 5, backgroundColor: "#fff" }}>
        {/* 封面 */}
        <View style={{ position: "relative" }}>
          <Image style={styles.img} source={item.posterPath} />
          <View style={{ position: "absolute", bottom: 0, left:5, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesomeIcon name="thumbs-o-up" size={styles.widget.fontSize} color={styles.widget.color} />
              <Text style={{ ...styles.widget,  }}>
                {item.good}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesomeIcon name="star-o" size={styles.widget.fontSize} color={styles.widget.color} />
              <Text style={{ ...styles.widget,  }}>
                {item.store}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesomeIcon name="commenting-o" size={styles.widget.fontSize} color={styles.widget.color} />
              <Text style={{ ...styles.widget,  }}>
                {item.comment}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesomeIcon name="gift" size={styles.widget.fontSize} color={styles.widget.color} />
              <Text style={{ ...styles.widget,  }}>
                {item.reward}
              </Text>
            </View>
          </View>
        </View>
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
            {/* <TouchableOpacity style={{ marginRight: 10, padding: 5, paddingLeft: 10, paddingRight: 10, backgroundColor: topicTrends[topicTrendsNum].color.color_num, borderRadius: 5 }}>
                            <Text style={{ color: "#fff" }}>关注</Text>
                        </TouchableOpacity> */}
            <TouchableOpacity ref={(ref) => {
              this.downArrowRef[index] = ref;
            }} onPress={() => { this.toggleSpinner(index) }} style={{ padding: 5, paddingLeft: 10, paddingRight: 10,alignItems:"center",width:35 }}>
              {
                !this.state.showPopover
                  ? <FontAwesomeIcon name="ellipsis-v" size={15} color="#ddd" />
                  : this.state.index != index
                    ? <FontAwesomeIcon name="ellipsis-v" size={15} color="#ddd" />
                    : <FontAwesomeIcon name="chevron-down" size={15} color="#ddd" />
              }
            </TouchableOpacity>

          </View>
        </View>
      </View>
      </TouchableOpacity>
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
        let type = i % 4 == 0 ? "原" : i % 4 == 1 ? "转" : i % 4 == 2 ? "翻" : "志";
        let obj = {
          key: i,
          photoPath: require("../../../../../../res/img/photo.jpg"),
          nickName: "qgao",
          publishTime: 1630584687000,//时间戳形式,ms
          title: i%4!=0?"论如何渲染flatlist":"23333333333",
          type: type,
          posterPath:require("../../../../../../res/img/snow.jpg"),
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
    if (hasMorePage && page >= 2) {
      return (
        <View style={{ flexDirection: 'row', height: 30, alignItems: 'center', justifyContent: 'center', }}>
          <ActivityIndicator animating={true}
            color={topicTrends[topicTrendsNum].color.color_num}
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
    return (
      <>
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          style={{ backgroundColor: "#eee" }}
          numColumns={2}//两列
          columnWrapperStyle={{ justifyContent: 'space-evenly' }}

          onScrollBeginDrag={(evt)=>{
            this.contentOffsetY = evt.nativeEvent.contentOffset.y;
            this.velocityY = evt.nativeEvent.velocity.y;
          }}
          onScrollEndDrag={(evt)=>{

            //手指从上往下
            if(evt.nativeEvent.contentOffset.y==0 || 
              evt.nativeEvent.contentOffset.y < this.contentOffsetY && 
              evt.nativeEvent.velocity.y > this.velocityY){
              this.props.showSearchFrame(true);
            }else{
              this.props.showSearchFrame(false);
            }
          }}

          refreshControl={
            <RefreshControl
              refreshing={isRefresh}
              onRefresh={this._onRefresh}//上拉刷新
              colors={[topicTrends[topicTrendsNum].color.color_num, "#ec1a0a", "#ffc051"]}
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
      </>


    );
  }

  renderInitLoadIndicator() {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true}
          color={topicTrends[topicTrendsNum].color.color_num}
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
export default Index;

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
    width: screenWidth / 2.2,
    height: screenWidth / 2.2 * 9 / 16,
    resizeMode: 'contain',
    borderRadius: 20
  },
  widget:{
    fontSize: 12,
    paddingLeft:2,
    paddingRight: 6,
    color:"#ffffffe6"
  }
})