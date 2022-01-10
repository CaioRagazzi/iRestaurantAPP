import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import OrderScreen from '../screens/Order/OrderScreen';
import CreateLoginScreen from '../screens/Login/CreateLoginScreen';
import LoginScreen from '../screens/Login/LoginScreen';
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
import MenuContextProvider from "../store/MenuStore";
import SaveMenuScreen from '../screens/Menu/SaveMenuScreen';
import SaveOrderScreen from '../screens/Order/SaveOrderScreen';


export default function Navigation() {

  const loggedUser = useHookState(AuthStore);

  const Stack = createNativeStackNavigator();

  function LoginRootNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="LoginStack" component={LoginNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  const BottomTab = createBottomTabNavigator();

  function BottomTabNavigator() {

    return (
      <BottomTab.Navigator
        initialRouteName="Order"
        screenOptions={{
          headerShown: true
        }}>
        <BottomTab.Screen
          name="Order"
          component={OrderNavigator}
          options={({ navigation }) => ({
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="cart-plus" color={color} />
          })}
        />
      </BottomTab.Navigator>
    );
  }

  function OrderNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="ListOrder" component={OrderScreen} options={{ headerShown: true }} />
        <Stack.Screen name="SaveOrder" component={SaveOrderScreen} options={{ headerShown: true }} />
      </Stack.Navigator>
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
      <MenuContextProvider>
        <Stack.Navigator>
          <Stack.Screen name="ListMenu" component={MenuScreen} options={{ headerShown: true }} />
          <Stack.Screen name="SaveMenu" component={SaveMenuScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
      </MenuContextProvider>
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
          options={{ headerShown: false }}
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
    <NavigationContainer>
      {
        loggedUser.get().logged ?
          <DrawerNavigator /> :
          <LoginRootNavigator />
      }
    </NavigationContainer>
  );
}
