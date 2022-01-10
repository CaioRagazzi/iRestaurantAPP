import { IconButton, Icon, Fab, HamburgerIcon } from "native-base";
import { AntDesign } from "@expo/vector-icons"
import { View } from "react-native";
import React, { useLayoutEffect } from "react";

export default function OrderScreen({ navigation }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Orders',
            headerLeft: () => (
                <IconButton
                    icon={<HamburgerIcon si name="emoji-happy" size="4" />}
                    onPress={() => { navigation.toggleDrawer() }}
                    borderRadius="full" />
            ),
        })
    })

    return (
        <View style={{ flex: 1 }}>
            {/* <Fab
                size="sm"
                style={{ marginBottom: 48 }}
                onPress={() => navigation.navigate('SaveOrder')}
                icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
            /> */}
        </View>
    )
}
