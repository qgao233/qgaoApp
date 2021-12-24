import React, {PureComponent} from 'react';

import {View, StyleSheet, Text, Image, FlatList, ActivityIndicator, Dimensions,RefreshControl} from 'react-native';
let totalWidth=Dimensions.get('window').width;
export default class FlatListDemo extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      showData:[],
      noData:false,
      isRefresh:false,
      isLoading:true,
      page:1,
      listSize:null,
      hasMorePage:true,
      loadingMore:false
    };
    this._onRefresh=this._onRefresh.bind(this);
    this._renderFooter=this._renderFooter.bind(this);
  }
  
  _renderItem({item,index}){
    let {pic,title,runDistance,registTime,userName,price} = item;
    return(
      <View key={index} style={styles.listItem}>
        <Image source={{uri:pic}} style={styles.cheyuanPic}/>
        <View style={styles.rightBox}>
          <Text style={styles.cheyuanTitle} ellipsizeMode='tail' numberOfLines={1}>{title}</Text>
          <Text style={styles.cheyuanJianjie}>{registTime} {runDistance}</Text>
          <Text style={styles.cheyuanJianjie}>{userName}</Text>
          <View style={styles.priceBox}>
            <Text style={styles.cheyuanPrice}>{price}万</Text>
          </View>
        </View>
      </View>
    )
  }

  _onRefresh(){
    this.setState({
      isRefresh:true,
      page:1
    },()=>{
      this.getShowData(1,'refresh')
    })
  }

  _onLoadMore(){
    if((this.state.page - 1) * 20 < this.state.listSize && !this.state.loadingMore){
      this.setState({
        loadingMore:true
      },()=>{
        this.getShowData(this.state.page);
      })
    }else if((this.state.page - 1) * 20 >= this.state.listSize && !this.state.loadingMore){
      this.setState({
        hasMorePage:false
      })
    }
  }

  getShowData(page,type){
    fetch(`https://cheapi.58.com/cst/getPriceTop?brand=408844&series=409052&cid=304&pageIndex=${page}`)
      .then(res=>res.json())
      .then(data=>{
        if(data.status===0 && data.result.infoMap.listSize!==0){
          let dateAry = data.result.infoMap.InfoList.map(item => {
            return item.infoMap;
          });
          if(type==='refresh'){
            this.setState({
              showData:[...dateAry],
              page:this.state.page+1,
              isRefresh:false,
              isLoading:false,
              noData:false,
              loadingMore:false,
              listSize:data.result.infoMap.listSize
            })
          }else {
            this.setState({
              showData:[...this.state.showData,...dateAry],
              page:this.state.page+1,
              isRefresh:false,
              isLoading:false,
              noData:false,
              loadingMore:false,
              listSize:data.result.infoMap.listSize
            })
          }
        }else if(data.status===0 && data.result.infoMap.listSize===0){
          this.setState({
            noData:true,
            showData:[],
            page:this.state.page+1,
            isRefresh:false,
            isLoading:false,
            loadingMore:false,
            listSize:data.result.infoMap.listSize
          })
        }
      })
  }

  componentDidMount(){
    this.getShowData(1);
  }

  renderLoadingView(){
    return(
      <View style={styles.container}>
        <ActivityIndicator animating={true}
                           color='red'
                           size="large"/>
      </View>
    )
  }

  renderData(){
    let {showData,isRefresh} = this.state;
    return(
      <FlatList data={showData}
                renderItem={this._renderItem}
                getItemLayout={(data,index)=>(
                  {length:115,offset:115*index,index}
                )}
                refreshControl={
                  <RefreshControl
                        refreshing={isRefresh}
                        onRefresh={this._onRefresh}//因为涉及到this.state
                        // colors={['#ff0000', '#00ff00','#0000ff','#3ad564']}
                        progressBackgroundColor="#ffffff"
                    />
                }
                
                onEndReached={() => this._onLoadMore()}
                onEndReachedThreshold={0.1}
                ListFooterComponent={this._renderFooter}
                ItemSeparatorComponent={this._separator}
                keyExtractor={item => item.infoId}/>
    )
  }

  renderEmptyView(){
    return (
      <View style={styles.listEmpty}>
        <Image style={styles.default_img}
               source={{uri: "https://img.58cdn.com.cn/escstatic/fecar/pmuse/chejian_list/momren.png"}} />
        <Text style={styles.default_content}>您暂无符合此筛选条件的车源</Text>
      </View>
    );
  }

  _renderFooter(){
    let {hasMorePage,page}=this.state;
    if(hasMorePage && page>=2){
      return(
        <View style={styles.footer}>
          <ActivityIndicator />
          <Text>正在加载更多数据...</Text>
        </View>
      )
    }else if(!hasMorePage && page>=2) {
      return(
        <View style={{height:30,alignItems:'center',justifyContent:'flex-start',}}>
          <Text style={{color:'#999999',fontSize:14,marginTop:5,marginBottom:5,}}>
            没有更多数据了
          </Text>
        </View>
      )
    }else {
      return (
        <View style={styles.footer}>
          <Text></Text>
        </View>
      );
    }
  }

  _separator(){
    return <View style={{height:1,backgroundColor:'lightgray'}}/>;
  }

  render(){
    let {isLoading,noData} = this.state;

    if (isLoading){
      return this.renderLoadingView();
    }else if(!noData && !isLoading){
      return this.renderData()
    }else if(noData && !isLoading){
      return this.renderEmptyView()
    }
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    width:totalWidth,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#F5FCFF'
  },
  listItem:{
    height:115,
    width:totalWidth,
    backgroundColor: '#FFFFFF',
    paddingLeft:15,
    paddingTop:15,
    paddingRight:15,
    flexDirection: 'row'
  },
  cheyuanPic:{
    height: 80,
    width:105
  },
  rightBox:{
    flex:1,
    marginLeft:10,
    height:80
  },
  cheyuanTitle:{
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 14,
    color: '#333333',
  },
  cheyuanJianjie:{
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999999'
  },
  priceBox:{
    marginTop:5
  },
  cheyuanPrice:{
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 13,
    color: '#FF552E'
  },
  footer:{
    flexDirection:'row',
    height:24,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:10,
  },
  listEmpty:{
    flex:1,
    width:totalWidth,
    justifyContent: 'center',
    alignItems:'center',
  },
  default_img:{
    width:90,
    height:90,
    marginBottom:20
  },
  default_content:{
    fontFamily: 'PingFangSC-Regular',
    fontSize: 15,
    height: 21,
    color: '#CCCCCC',
    textAlign: 'center'
  }
});
