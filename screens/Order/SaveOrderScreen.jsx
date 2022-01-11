import { Stack, Button, useToast, AddIcon } from "native-base";
import React, { useLayoutEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import OverlayMenu from "../../components/OverlayMenu";
import { Button as ButtonPPW, Card } from 'react-native-paper';
import FAB from 'react-native-fab'

export default function SaveOrderScreen({ navigation }) {

    const [isOverlayMenuOpen, setIsOverlayMenuOpen] = useState(false)
    const [selectedMenu, setSelectedMenu] = useState([])
    const toast = useToast()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Save Orders',
        })
    })

    const handleSelectedMenu = (overlaySelectedMenu) => {
        const existingItem = selectedMenu.find(r => r.id === overlaySelectedMenu.id)

        if (existingItem) {
            toast.show({
                title: "Warning!",
                status: "warning",
                description: "Item already added!.",
                duration: 3000
            })
            return
        }
        setSelectedMenu(oldValue => [...oldValue, overlaySelectedMenu])
    }

    const removeMenuFromSelected = (itemToDelete) => {
        const listWithoutItem = selectedMenu.filter(item => item.id !== itemToDelete.id)

        setSelectedMenu(listWithoutItem);
    }

    return (
        <Stack space={4} w="100%" alignItems="center" marginTop="10" style={{flex: 1}}>
            <View style={{ flexGrow: 1, width: '100%' }}>
                <FlatList
                    data={selectedMenu}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <Card style={{ margin: 5, width: '45%' }}>
                            <Card.Title
                                title={item.name}
                                subtitle={`Quantity: ${item.quantity}`} />
                            {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
                            <Card.Actions>
                                <ButtonPPW
                                    icon="delete"
                                    onPress={() => removeMenuFromSelected(item)}>Remove</ButtonPPW>
                            </Card.Actions>
                        </Card>
                    )}
                    keyExtractor={(item) => item.id} />
            </View>

            <FAB
                buttonColor="#06b6d4"
                iconTextColor="#FFFFFF"
                onClickAction={() => setIsOverlayMenuOpen(true)}
                visible={true}
                iconTextComponent={<AddIcon size={4} />} />

            <OverlayMenu
                isOpen={isOverlayMenuOpen}
                onOverlayMenuClose={() => setIsOverlayMenuOpen(false)}
                selectedOverlayMenu={(overlaySelectedMenu) => handleSelectedMenu(overlaySelectedMenu)} />
        </Stack>
    )
}