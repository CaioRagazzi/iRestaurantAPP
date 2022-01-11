import { IconButton, Icon, HamburgerIcon, Stack, AddIcon } from "native-base";
import { Text } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import FAB from 'react-native-fab'

export default function OrderScreen({ navigation }) {

    const [isOverlayMenuOpen, setIsOverlayMenuOpen] = useState(false)

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
        <Stack space={4} w="100%" alignItems="center" marginTop="10" style={{ flex: 1 }} >
            <FAB
                buttonColor="#06b6d4"
                iconTextColor="#FFFFFF"
                onClickAction={() => { navigation.navigate('SaveOrder') }}
                visible={true}
                iconTextComponent={<AddIcon size={4} />} />
        </Stack >
    )
}
