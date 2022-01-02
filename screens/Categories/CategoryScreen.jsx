import {
    IconButton, HamburgerIcon, AddIcon, FlatList, Box,
    Avatar,
    HStack,
    VStack,
    Text,
    Spacer,
    useToast
} from "native-base";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { CategoryContext } from "../../store/CategoriesStore";
import { TouchableNativeFeedback, View } from "react-native";
import AlertShowDialog from "../../components/AlertShowDialog";
import api from "../../services/Axios";

export default function CategoryScreen({ navigation }) {

    const categoryContext = useContext(CategoryContext);
    const [showAlertDelete, setShowAlertDelete] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState(null)
    const toast = useToast()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Categories',
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

    useEffect(() => {
        if (categoryContext.listCategory.length === 0) {
            categoryContext.getCategories(1);
        }
    }, [categoryContext.listCategory])

    const handleTouch = (category) => {
        navigation.navigate('CreateCategories', { category })
    }

    const handleLongPress = (categoryParam) => {
        setShowAlertDelete(true)
        setCategoryToDelete(categoryParam)
    }

    const handleDelete = () => {
        api.delete(`foodcategory/${categoryToDelete.id}`).then(data => {
            toast.show({
                title: "Deleted!",
                status: "success",
                description: "Category Deleted!.",
                duration: 3000
            })
            categoryContext.refresh()
            setShowAlertDelete(false)
        })
    }

    const handleEndReached = () => {
        if (categoryContext.page > categoryContext.totalPages) return;
        categoryContext.setPage(categoryContext.page + 1)
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={categoryContext.listCategory}
                refreshing={categoryContext.isLoading}
                onRefresh={() => categoryContext.refresh()}
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
                message={`Are you sure you want to delete ${categoryToDelete?.name}`}
                isClosed={showAlertDelete}
                onCancel={() => setShowAlertDelete(false)}
                onOk={handleDelete} />
        </View>
    )
}
