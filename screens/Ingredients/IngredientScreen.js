import {
    IconButton, HamburgerIcon, AddIcon, FlatList, Box,
    Avatar,
    HStack,
    VStack,
    Text,
    Spacer,
    useToast
} from "native-base";
import React, { useLayoutEffect, useEffect, useContext, useState } from "react";
import { IngredientContext } from "../../store/IngredientsStore";
import { TouchableNativeFeedback, View } from "react-native";
import AlertShowDialog from "../../components/AlertShowDialog";
import api from "../../services/Axios";

export default function IngredientScreen({ route, navigation }) {

    const ingredientContext = useContext(IngredientContext);
    const [showAlertDelete, setShowAlertDelete] = useState(false)
    const [ingredientToDelete, setIngredientToDelete] = useState(null)
    const toast = useToast()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Ingredients',
            headerRight: () => (
                <IconButton
                    icon={<AddIcon si name="emoji-happy" size="4" />}
                    onPress={() => { navigation.navigate('SaveIngredient') }}
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
        if (ingredientContext.listIngredients.length === 0) {
            ingredientContext.getIngredients(1);
        }
    }, [ingredientContext.listIngredients])

    const handleTouch = (ingredient) => {
        navigation.navigate('SaveIngredient', { ingredient })
    }

    const handleLongPress = (categoryParam) => {
        setShowAlertDelete(true)
        setIngredientToDelete(categoryParam)
    }

    const handleDelete = () => {
        api.delete(`foodingredient/${ingredientToDelete.id}`).then(data => {
            toast.show({
                title: "Deleted!",
                status: "success",
                description: "Ingredient Deleted!.",
                duration: 3000
            })
            ingredientContext.refresh()
            setShowAlertDelete(false)
        })
    }

    const handleEndReached = () => {
        if (ingredientContext.page > ingredientContext.totalPages) return;
        ingredientContext.setPage(ingredientContext.page + 1)
    }

    return (
        <View style={{ flexGrow: 0 }}>
            <FlatList
                data={ingredientContext.listIngredients}
                refreshing={ingredientContext.isLoading}
                onRefresh={() => ingredientContext.refresh()}
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
                message={`Are you sure you want to delete ${ingredientToDelete?.name}`}
                isClosed={showAlertDelete}
                onCancel={() => setShowAlertDelete(false)}
                onOk={handleDelete} />
        </View>
    )
}