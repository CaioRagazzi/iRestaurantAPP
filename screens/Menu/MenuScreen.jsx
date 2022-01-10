import { View, TouchableNativeFeedback } from "react-native";
import { IconButton, AddIcon, HamburgerIcon, FlatList, Box, Spacer, HStack, useToast, Avatar, VStack, Text } from "native-base";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { MenuContext } from "../../store/MenuStore";
import AlertShowDialog from "../../components/AlertShowDialog";
import api from "../../services/Axios";

export default function MenuScreen({ navigation }) {

    const menuContext = useContext(MenuContext);
    const [showAlertDelete, setShowAlertDelete] = useState(false)
    const [menuToDelete, setMenuToDelete] = useState(null)
    const toast = useToast()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Menu',
            headerRight: () => (
                <IconButton
                    icon={<AddIcon si name="emoji-happy" size="4" />}
                    onPress={() => { navigation.navigate('SaveMenu') }}
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

    useEffect(() => {
        if (menuContext.listMenu.length === 0) {
            menuContext.getMenu(1);
        }
    }, [menuContext.listMenu])

    const handleTouch = (menu) => {
        navigation.navigate('SaveMenu', { menu })
    }

    const handleLongPress = (menuParam) => {
        setShowAlertDelete(true)
        setMenuToDelete(menuParam)
    }

    const handleDelete = () => {
        api.delete(`menu/${menuToDelete.id}`).then(data => {
            toast.show({
                title: "Deleted!",
                status: "success",
                description: "menu Deleted!.",
                duration: 3000
            })
            menuContext.refresh()
            setShowAlertDelete(false)
        })
    }

    const handleEndReached = () => {
        if (menuContext.page > menuContext.totalPages) return;
        menuContext.setPage(menuContext.page + 1)
    }

    return (
        <View style={{ flexGrow: 0 }}>
            <FlatList
                data={menuContext.listMenu}
                refreshing={menuContext.isLoading}
                onRefresh={() => menuContext.refresh()}
                onEndReached={() => handleEndReached()}
                onEndReachedThreshold={0.8}
                renderItem={({ item }) => (
                    <TouchableNativeFeedback
                        onLongPress={() => handleLongPress(item)}
                        onPress={() => handleTouch(item)}>
                        <Box
                            borderBottomWidth="1"
                            _dark={{
                                borderColor: "gray.600",
                            }}
                            borderColor="coolGray.200"
                            pl="4"
                            pr="5"
                            py="2"
                        >
                            <HStack space={3} justifyContent="space-between">
                                <Avatar size="48px">
                                    {item.name.charAt(0).toUpperCase()}
                                </Avatar>
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
                                        {item.description}
                                    </Text>
                                </VStack>
                                <Spacer />
                                <Text
                                    fontSize="xs"
                                    _dark={{
                                        color: "warmGray.50",
                                    }}
                                    color="coolGray.800"
                                    alignSelf="flex-start"
                                >
                                    {item.createdAt}
                                </Text>
                            </HStack>
                        </Box>
                    </TouchableNativeFeedback>
                )}
                keyExtractor={(item) => item.id}
            />
            <AlertShowDialog
                message={`Are you sure you want to delete ${menuToDelete?.name}`}
                isClosed={showAlertDelete}
                onCancel={() => setShowAlertDelete(false)}
                onOk={handleDelete} />
        </View>
    )
}