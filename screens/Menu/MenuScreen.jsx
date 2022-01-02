import { View, FlatList } from "react-native";
import { IconButton, AddIcon, HamburgerIcon } from "native-base";
import React, { useLayoutEffect } from "react";

export default function MenuScreen({ navigation }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Menu',
            headerRight: () => (
                <IconButton
                    icon={<AddIcon si name="emoji-happy" size="4" />}
                    onPress={() => { navigation.navigate('CreateCategories') }}
                    borderRadius="full" />
            ),
            headerLeft: () => (
                <IconButton
                    icon={<HamburgerIcon si name="emoji-happy" size="4" />}
                    onPress={() => { navigation.toggleDrawer() }}
                    borderRadius="full" />
            ),
        });

    }, [navigation]);

    return (
        <View style={{ flexGrow: 0 }}>
            <FlatList />
        </View>
    )
}