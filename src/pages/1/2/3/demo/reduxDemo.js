import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
    decrement,
    increment,
    incrementByAmount,
    incrementAsync,
    selectCount
} from './reduxSlice'

export default function Counter() {
    const count = useSelector(selectCount)
    const dispatch = useDispatch()
    const [incrementAmount, setIncrementAmount] = useState('2')

    return (
        <View>
            <View >
                <Button
                    title='+'
                    onPress={() => dispatch(increment())}
                />
                <Text>{count}</Text>
                <Button
                    title='-'
                    onPress={() => dispatch(decrement())}
                />
                <Button
                    title='+5'
                    onPress={() => dispatch(incrementByAmount(5))}
                />
            </View>
            {/* 这里省略了额外的 render 代码 */}
        </View>
    )
}