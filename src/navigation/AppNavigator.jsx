import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
/** import screens folder */
import {
  AccountScreen,
  ChildSelectionScreen,
  HomeScreen,
  LoginScreen,
  RegisterScreen,
} from '../screens';
// import { useBackgroundTask, useMonitor } from '../hooks';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {
  View,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, request } from 'react-native-permissions';
import io from 'socket.io-client';
const socket = io.connect('http://192.168.2.101:3001/');

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  // const [isAuth, setIsAuth] = React.useState(false);
  /** currentSession - accessToken ... */
  const currentUser = useSelector((state) => state.userReducers?.user);
  const currentChild = useSelector((state) => state.kidReducers?.kid);

  const kidAppData = React.useMemo(() => {
    if (currentChild) {
      const data = JSON.parse(currentChild);
      const { childId, hourUsage, minuteUsage, children } = data;
      return { childId, hourUsage, minuteUsage, children };
    }
  }, [currentChild]);

  const session = React.useMemo(() => {
    if (!currentUser) return;
    const { session } = currentUser;
    return session;
  }, [currentUser]);

  return (
    <Stack.Navigator>
      {session ? (
        currentChild ? (
          <>
            {/**
             *
             */}
            <Stack.Screen
              name="Home"
              component={HomeStack}
              initialParams={{ kidAppData }}
              options={{ headerShown: false }}
            ></Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="ChildSelection"
              component={ChildSelectionScreen}
            ></Stack.Screen>
          </>
        )
      ) : (
        <>
          <Stack.Screen
            name="SignIn"
            component={LoginScreen}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="SignUp"
            component={RegisterScreen}
            options={{ headerShown: false }}
          ></Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

const HomeStack = ({ route }) => {
  const { kidAppData } = route.params;
  const { childId, hourUsage, minuteUsage, children } = kidAppData;
  const [region, setRegion] = React.useState({});
  const [childIdState, setChildId] = React.useState(null);
  const [checkUpdate, setCheckUpdate] = React.useState(null);

  // React.useEffect(() => {
  //   const requestLocationPermission = async () => {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //           {
  //             title: 'Location Permission',
  //             message: 'This app needs access to your location.',
  //             buttonNeutral: 'Ask Me Later',
  //             buttonNegative: 'Cancel',
  //             buttonPositive: 'OK',
  //           },
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         // If permission granted, get current location
  //         Geolocation.watchPosition(
  //           (position) => {
  //             const { latitude, longitude } = position.coords;
  //             // console.log(position.coords);
  //             console.log({latitude,
  //               longitude,
  //               latitudeDelta: 0.0922,
  //               longitudeDelta: 0.0421,});

  //             setRegion({
  //               latitude,
  //               longitude,
  //               latitudeDelta: 0.0922,
  //               longitudeDelta: 0.0421,
  //             });
  //             setCheckUpdate(false)
  //           },
  //           (error) => console.error(error),
  //           { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  //         );
  //       } else {
  //         Alert.alert("Location permission denied","Kiểm tra trong cài đặt")
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   };

  //   requestLocationPermission();

  //   // cleanup function
  //   return () => {
  //     // clear watch position if any
  //     Geolocation.clearWatch();
  //   };
  // }, []);

  // React.useEffect(()=>{
  //   if(checkUpdate==true){
  //     socket.emit('locationChild', (region, childId))
  //   }
  //   else{
  //     console.log("childtest trong hook:" , region);
  //     socket.on('requestLocationToSpecificDevice', (childId) => {
  //       console.log(childId+" may child");

  //       if(childId){
  //         socket.emit('locationChild',region, childId)
  //       }
  //       setCheckUpdate(true)
  //     });
  //   }
  // }, [region])

  // const { activities, activitiesUsage } = useMonitor(childId);
  /** useBackground hook */
  // useBackgroundTask(parentId: children.parentId, childId, hourUsage, minuteUsage);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarLabel: '',
        tabBarIconStyle: { marginTop: 10 },
        tabBarStyle: { padding: 0, margin: 0 },
      }}
    >
      {/** home screen -> usage screen */}
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        initialParams={{
          childId,
          childName: children.kidName,
          childImage: children.avatarUrl,
          phoneType: children.phoneType,
        }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        initialParams={{ childId }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account' : 'account-outline'}
              size={24}
              color={'black'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
