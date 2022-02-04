import React, { useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CubeNavigationHorizontal } from 'react-native-3dcube-navigation'
import ArticleHome from './article/articleHome';
import VideoHome from './video/videoHome';

export default (props) => {

    const cubeRef = useRef();

    const callBackAfterSwipe = (position, index)=>{
    }

    const toggleArticleAndVideo = useCallback((index)=>{
        cubeRef.current.scrollTo(index,true);
    })

    return (
        <View style={{flex:1}} >
            <CubeNavigationHorizontal ref={cubeRef} responderCaptureDx={999999999} callBackAfterSwipe={callBackAfterSwipe}>
                <ArticleHome {...props} toggleArticleAndVideo={toggleArticleAndVideo} />
                <VideoHome {...props} toggleArticleAndVideo={toggleArticleAndVideo} />
            </CubeNavigationHorizontal>
        </View >
    );
}