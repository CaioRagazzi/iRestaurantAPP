import { Stack, FormControl, useToast, AddIcon, Input, Icon, WarningOutlineIcon, Spinner, IconButton, Heading, Box, HStack, VStack, Text, Spacer, Divider } from "native-base";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import React, { useLayoutEffect, useState, useContext, useEffect } from "react";
import { View, Keyboard, ScrollView } from "react-native";
import OverlayMenu from "../../components/OverlayMenu";
import FAB from 'react-native-fab'
import api from "../../services/Axios";
import { OrderContext } from "../../store/OrderStore";

export default function SaveOrderScreen({ route, navigation }) {

    const orderContext = useContext(OrderContext);
    const [table, setTable] = useState('')
    const [id, setId] = useState(0);
    const [description, setDescription] = useState('')
    const [isOverlayMenuOpen, setIsOverlayMenuOpen] = useState(false)
    const [selectedMenu, setSelectedMenu] = useState([])
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const toast = useToast()

    useEffect(() => {
        const params = route.params;
        if (params) {
            setId(params.order.id)
            setTable(params.order.table);
            setDescription(params.order.description)
            params.order.orderMenus.forEach(menu => {
                setSelectedMenu(old => [...old, {menuId: menu.id, name: menu.menu.name, ...menu}])
            })
            setIsEditing(true);
        }
    }, []);


    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    loading ? <Spinner size="lg" /> :
                        <IconButton
                            colorScheme="red"
                            onPress={() => {
                                isEditing ? handleEditOrder() : handleSaveOrder()
                                Keyboard.dismiss()
                            }}
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

    const validations = () => {
        if (!table.trim()) {
            toast.show({
                title: "Warning!",
                status: "warning",
                description: "Please, provide all required fields!",
                duration: 3000
            })
            setLoading(false)
            return false;
        }

        if (!selectedMenu || selectedMenu.length === 0) {
            toast.show({
                title: "Warning!",
                status: "warning",
                description: "Please, select at least one menu item!",
                duration: 3000
            })
            setLoading(false)
            return false;
        }

        return true
    }

    const handleEditOrder = () => {
        setLoading(true)

        if (!validations()) return;

        api.put(`order/${id}`, {
            Table: table,
            Description: description,
            OrderMenus: selectedMenu
        }).then(data => {
            setLoading(false);
            toast.show({
                title: "Created!",
                status: "success",
                description: "Order Updated!.",
                duration: 3000
            })
            orderContext.refresh();
            setLoading(false)
            navigation.goBack();
        }).catch(err => {
            setLoading(false);
            toast.show({
                title: "Error!",
                status: "error",
                description: "Error updating order =(.",
                duration: 3000
            })
            setLoading(false)
        })
    }

    const handleSaveOrder = () => {
        setLoading(true)
        if (!validations()) return;

        api.post('order', {
            Table: table,
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
            orderContext.refresh();
            setLoading(false)
            navigation.goBack();
        }).catch(err => {
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
            <Divider my="2" bg="black" thickness={0.5} width="80%" />
            <ScrollView style={{ width: '85%' }}>
                <Heading fontSize="lg">
                    Order Items:
                </Heading>
                {
                    selectedMenu.map((item) => {
                        return (
                            <Box
                                borderBottomWidth="1"
                                _dark={{
                                    borderColor: "gray.600",
                                }}
                                borderColor="coolGray.200"
                                pl="4"
                                pr="5"
                                py="2"
                                key={item.menuId}
                            >
                                <HStack space={3} justifyContent="space-between">
                                    <VStack>
                                        <Text
                                            _dark={{
                                                color: "warmGray.50",
                                            }}
                                            color="coolGray.800"
                                            bold
                                        >
                                            {item.name}
                                        </Text>
                                        <Text
                                            color="coolGray.600"
                                            _dark={{
                                                color: "warmGray.200",
                                            }}
                                        >
                                            Qtd: {item.quantity}
                                        </Text>
                                    </VStack>
                                    <Spacer />
                                    <View style={{ justifyContent: 'center', paddingRight: 10 }}>
                                        <IconButton
                                            colorScheme="red"
                                            onPress={() => removeMenuFromSelected(item)}
                                            variant="solid"
                                            size="30"
                                            _icon={{
                                                as: AntDesign,
                                                name: "minus",
                                            }}
                                        />
                                    </View>
                                </HStack>
                            </Box>
                        )
                    })
                }
            </ScrollView>

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