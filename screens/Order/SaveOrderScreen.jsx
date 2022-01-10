import { Pressable, View } from "react-native";
import { Stack, FormControl, Input, Icon, WarningOutlineIcon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useLayoutEffect, useState } from "react";

export default function SaveOrderScreen({ navigation }) {

    const [isOverlayManuOpen, setIsOverlayManuOpen] = useState(false)
    const [menu, setMenu] = useState(null)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Save Orders',
        })
    })

    return (
        <Stack space={4} w="100%" alignItems="center" marginTop="10">
            <FormControl
                isInvalid={!menu}
                w={{
                    base: "75%",
                    md: "100%",
                }}
            >
                <Pressable onPress={() => setIsOverlayManuOpen(true)}>
                    <View pointerEvents="none">
                        <FormControl.Label>Menu</FormControl.Label>
                        <Input
                            value={menu?.name}
                            autoCapitalize="none"
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="menu-book" />}
                                    size={5}
                                    ml="2"
                                    color="muted.400"
                                />
                            }
                            placeholder="Menu"
                        />
                    </View>
                </Pressable>
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                    Menu cannot be empty.
                </FormControl.ErrorMessage>
            </FormControl>
        </Stack>
    )
}