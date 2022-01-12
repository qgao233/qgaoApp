import * as React from 'react';
import { View, Text, useWindowDimensions, Image, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
import BottomTabsNav from './3/bottomTabsNav'
import 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { topicTrends, topicTrendsNum } from '../../../utils/stylesKits';

function CustomDrawerContent(props) {

  const { drawerWidth } = props;
  return (
    <View>
      {/* creator信息 */}
      <View style={{ marginTop: 30, width: drawerWidth, alignItems: "center" }}>
        <Image style={{ width: drawerWidth / 2, height: drawerWidth / 2, borderRadius: drawerWidth / 4 }} source={require("../../../res/img/mine.jpg")} />
        <View style={{ flexDirection: "row", paddingTop: 20, paddingBottom: 20 }}>
          <Text style={{ paddingRight: 84 }}>Creator:</Text>
          <Text style={{ paddingLeft: 10 }}>qgao233</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ paddingRight: 10 }}>Contact:</Text>
          <Text style={{ paddingLeft: 10 }}>qgao233@163.com</Text>
        </View>
      </View>
      <View style={{ marginTop: 30, width: drawerWidth, alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => { props.navigation.navigate("OuterVideoHome") }}
          activeOpacity={0.6}
          style={{
            paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20,
            backgroundColor: topicTrends[1].color.color_num,
            borderRadius: 5,
          }}>
          <Text style={{ fontSize: 20, color: "#fff" }}>外链影视</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Drawer = createDrawerNavigator();

const smallScreen = "70%";
const smallScreenNum = 0.7;
const largeScreen = "30%";
const largeScreenNum = 0.3;

function MyDrawer() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const drawerWidthPerc = isLargeScreen ? largeScreen : smallScreen;
  const drawerWidthNumPerc = isLargeScreen ? largeScreenNum : smallScreenNum;

  const drawerWidth = dimensions.width * drawerWidthNumPerc;
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'back',//'back',
        drawerStyle: { width: drawerWidthPerc },
        overlayColor: 'transparent',
        swipeEdgeWidth: dimensions.width / 9,
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} drawerWidth={drawerWidth} />}>
      <Drawer.Screen name="BottomTabsNav" options={{ drawerLabel: "home" }} component={BottomTabsNav} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <MyDrawer />
  );
}
