import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import HomeTabScreen from '../screens/Home/HomeTabScreen';
import CreateLoginScreen from '../screens/Login/CreateLoginScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { useState as useHookState } from "@hookstate/core";
import AuthStore from "../store/AuthStore";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CategoryScreen from '../screens/Categories/CategoryScreen';
import MenuScreen from '../screens/Menu/MenuScreen';
import CreateCategoryScreen from '../screens/Categories/SaveCategoryScreen';
import IngredientScreen from '../screens/Ingredients/IngredientScreen';
import SaveIngredientScreen from '../screens/Ingredients/SaveIngredientScreen';
import IngredientContextProvider from "../store/IngredientsStore";
import CategoryContextProvider from "../store/CategoriesStore";


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {

  const loggedUser = useHookState(AuthStore);

  const Stack = createNativeStackNavigator();

  function LoginRootNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="LoginStack" component={LoginNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  const BottomTab = createBottomTabNavigator<RootTabParamList>();

  function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
      <BottomTab.Navigator
        initialRouteName="TabOne"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme].tint, headerShown: false
        }}>
        <BottomTab.Screen
          name="TabOne"
          component={HomeTabScreen}
          options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
            headerRight: () => (
              <Pressable
                onPress={() => navigation.navigate('Modal')}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}>
                <FontAwesome
                  name="info-circle"
                  size={25}
                  color={Colors[colorScheme].text}
                  style={{ marginRight: 15 }}
                />
              </Pressable>
            ),
          })}
        />
      </BottomTab.Navigator>
    );
  }

  function LoginNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateLogin" component={CreateLoginScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  function MenuNavigator() {
    return (
        <Stack.Navigator>
          <Stack.Screen name="ListMenu" component={MenuScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
    );
  }

  function CategoryNavigator() {
    return (
      <CategoryContextProvider>
        <Stack.Navigator>
          <Stack.Screen name="ListCategories" component={CategoryScreen} options={{ headerShown: true }} />
          <Stack.Screen name="CreateCategories" component={CreateCategoryScreen} options={{ headerShown: true, title: '' }} />
        </Stack.Navigator>
      </CategoryContextProvider>
    );
  }

  function IngredientNavigator() {
    return (
      <IngredientContextProvider>
        <Stack.Navigator>
          <Stack.Screen name="ListIngredient" component={IngredientScreen} options={{ headerShown: true }} />
          <Stack.Screen name="SaveIngredient" component={SaveIngredientScreen} options={{ headerShown: true, title: '' }} />
        </Stack.Navigator>
      </IngredientContextProvider>
    );
  }


  function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
  }) {
    return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
  }

  const Drawer = createDrawerNavigator();

  function DrawerNavigator() {
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          options={{ headerShown: true }}
          name="Home"
          component={BottomTabNavigator} />
        <Drawer.Screen
          options={{ headerShown: false }}
          name="Menu"
          component={MenuNavigator} />
        <Drawer.Screen
          options={{ headerShown: false }}
          name="Categories"
          component={CategoryNavigator} />
        <Drawer.Screen
          options={{ headerShown: false }}
          name="Ingredients"
          component={IngredientNavigator} />
      </Drawer.Navigator>
    );
  }

  function CustomDrawerContent(props: any) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          onPress={async () => {
            await AsyncStorage.clear()
            loggedUser.merge({ token: '', logged: false, userId: 0, email: '' })
          }}
        />
      </DrawerContentScrollView>
    );
  }

  return (
    <NavigationContainer
      linking={LinkingConfiguration}>
      {
        loggedUser.get().logged ?
          <DrawerNavigator /> :
          <LoginRootNavigator />
      }
    </NavigationContainer>
  );
}
