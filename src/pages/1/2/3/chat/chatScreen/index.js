import React, { useState, useCallback, useEffect } from 'react'
import { StatusBar, TouchableOpacity,View } from 'react-native'
import { GiftedChat, Send,Bubble } from 'react-native-gifted-chat'
import { SafeAreaView } from 'react-native-safe-area-context';
import FullPageHeader2 from '../../../../../../utils/components/fullPageHeader2';
import Feather from 'react-native-vector-icons/Feather'
import { useTopicTrends } from '../../utils/hooks'


export default (props) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello',
        createdAt: new Date(1643807499000),
        user: {
          _id: 1,
          name: 'qgao233',
          avatar: require("../../../../../../res/img/photo.jpg"),
        },
      },
      {
        _id: 2,
        text: 'Hello developer',
        createdAt: new Date(1643807499000),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },

    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  const { topicTrends, topicTrendsNum } = useTopicTrends();

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:"#fff" }}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={true} hidden={false} />
      <FullPageHeader2 color="#000b" middleName="qgao233" style={{ backgroundColor: "#fff" }} rightComponent={() => {
        return <TouchableOpacity activeOpacity={0.6} onPress={()=>{
          props.navigation.navigate("DoUser");
        }}>
          <Feather name="user" size={25} color='#000b' />
        </TouchableOpacity>
      }} />
      <GiftedChat
        // style
        messages={messages}
        onSend={messages => onSend(messages)}
        timeFormat='HH:mm:ss'
        dateFormat='YYYY-MM-DD'
        showUserAvatar={true}
        renderAvatarOnTop={true}
        renderSend={(props) => {
          return <Send
            {...props}
          >
            <View style={{ marginRight: 10, marginBottom: 5 }}>
              <Feather name="send" size={25} color={topicTrends[topicTrendsNum].style_desc.gradient_start} />
            </View>
          </Send>
        }}
        renderBubble={(props)=>{
          return <Bubble {...props} wrapperStyle={{
            // left:{
            //   backgroundColor:topicTrends[topicTrendsNum].style_desc.gradient_start,
            // },
            right:{
              backgroundColor:topicTrends[topicTrendsNum].style_desc.gradient_start,
            }
          }}></Bubble>
        }}
        parsePatterns={(linkStyle) => [
          { type: 'phone', style: linkStyle, onPress: ()=>{} },
          { pattern: /#(\w+)/, style: { ...linkStyle, }, onPress: ()=>{} },
        ]}
        user={{
          _id: 1,
          name: 'qgao233',
          avatar: require("../../../../../../res/img/photo.jpg"),
        }}
      />
    </SafeAreaView>

  )
}