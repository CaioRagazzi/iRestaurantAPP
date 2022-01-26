import { Stack, FormControl, useToast, AddIcon, Input, Icon, WarningOutlineIcon, Spinner, IconButton } from "native-base";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import React, { useLayoutEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import OverlayMenu from "../../components/OverlayMenu";
import { Button as ButtonPPW, Card } from 'react-native-paper';
import FAB from 'react-native-fab'
import api from "../../services/Axios";

export default function SaveOrderScreen({ route, navigation }) {

    const [table, setTable] = useState('')
    const [description, setDescription] = useState('')
    const [isOverlayMenuOpen, setIsOverlayMenuOpen] = useState(false)
    const [selectedMenu, setSelectedMenu] = useState([])
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const toast = useToast()

    useLayoutEffect(() => {
        const params = route.params;
        if (params) {
            setIsEditing(true);
        } else {

        }
        navigation.setOptions({
            headerRight: () => {
                return (
                    loading ? <Spinner size="lg" /> :
                        <IconButton
                            colorScheme="red"
                            onPress={() => isEditing ? handleEditOrder() : handleSaveOrder()}
                            variant="ghost"
                            size="30"
                            borderRadius="full"
                            _icon={{
                                as: AntDesign,
                                name: "save",
                            }}
                        />
                )
            },
            title: isEditing ? 'Edit Order' : 'Create new Order',
        });

    }, [navigation, table, description, loading, selectedMenu]);

    const handleEditOrder = () => {
        console.log('edit order');
    }

    const handleSaveOrder = () => {
        setLoading(true)
        if (!table.trim()) {
            toast.show({
                title: "Warning!",
                status: "warning",
                description: "Please, provide all required fields!",
                duration: 3000
            })
            setLoading(false)
            return
        }

        if (!selectedMenu || selectedMenu.length === 0) {
            toast.show({
                title: "Warning!",
                status: "warning",
                description: "Please, select at least one menu item!",
                duration: 3000
            })
            setLoading(false)
            return
        }

        api.post('order', {
            Description: description,
            OrderMenus: selectedMenu
        }).then(data => {
            setLoading(false);
            toast.show({
                title: "Created!",
                status: "success",
                description: "Order Created!.",
                duration: 3000
            })
            navigation.goBack();
            setLoading(false)
        }).catch(err => {
            console.log(err);
            setLoading(false);
            toast.show({
                title: "Error!",
                status: "error",
                description: "Error creating order =(.",
                duration: 3000
            })
            setLoading(false)
        })
    }

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

    const handleChangeTable = ({ nativeEvent: { eventCount, target, text } }) => {
        setTable(text);
    }

    const handleDescriptionTable = ({ nativeEvent: { eventCount, target, text } }) => {
        setDescription(text);
    }

    return (
        <Stack space={4} w="100%" alignItems="center" marginTop="10" style={{ flex: 1 }}>
            <View style={{ flexGrow: 1, width: '100%', height: '29%', alignItems: 'center' }}>
                <FormControl
                    isInvalid={!table}
                    w={{
                        base: "75%",
                        md: "100%",
                    }}
                    style={{ paddingBottom: 16 }}
                >
                    <Input
                        value={table}
                        onChange={handleChangeTable}
                        autoCapitalize="none"
                        InputLeftElement={
                            <Icon
                                as={<MaterialIcons name="person" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                            />
                        }
                        placeholder="Table"
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Table cannot be empty.
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                    isInvalid={!description}
                    w={{
                        base: "75%",
                        md: "100%",
                    }}
                >
                    <Input
                        value={description}
                        numberOfLines={5}
                        onChange={handleDescriptionTable}
                        autoCapitalize="none"
                        InputLeftElement={
                            <Icon
                                as={<MaterialIcons name="person" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                            />
                        }
                        placeholder="Description"
                    />
                </FormControl>
            </View>
            <View style={{ flexGrow: 1, width: '100%', height: '60%', alignItems: 'center' }}>
                <FlatList
                    style={{ flexGrow: 1, width: '100%' }}
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
                    data={selectedMenu}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <Card style={{ flexGrow: 1, margin: 5, width: '40%' }}>
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