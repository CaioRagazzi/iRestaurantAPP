import {
    IconButton, HamburgerIcon, AddIcon, FlatList, Box,
    Avatar,
    HStack,
    VStack,
    Text,
    Spacer
} from "native-base";
import React, { useLayoutEffect, useState, useEffect, useContext } from "react";
import { IngredientStore } from "../../store/IngredientsStore";
import { useIsFocused } from "@react-navigation/native";
import { TouchableNativeFeedback, View } from "react-native";
import api from "../../services/Axios";

export default function IngredientScreen({ route, navigation }) {

    const [ingredients, setIngredients] = useState([])
    const isFocused = useIsFocused();
    const [perPage, setPerPage] = useState(25)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const ingredientStore = useContext(IngredientStore);

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

    }, [navigation, isFocused]);

    useEffect(() => {
        ingredientStore.list = [];
        console.log('teste caio', ingredientStore.get())
    }, [])

    useEffect(() => {
        getIngredients();
    }, [page])

    const getIngredients = () => {
        setIsLoading(true)
        api.get(`foodingredient?page=${page}&pageSize=${perPage}`)
            .then(data => {
                setTotalPages(data.data.pageCount);
                ingredientStore.list = [...ingredientStore.list, ...data.data.results]
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err.response);
            })
    }

    const handleTouch = (ingredient) => {
        navigation.navigate('SaveIngredient', { ingredient })
    }

    const handleLongPress = (category) => {
        // api.delete(`foodcategory/${category.id}`)
    }

    const handleEndReached = () => {
        if (page >= totalPages) return;
        setPage(page + 1)
    }

    const refresh = () => {
        setIngredients([]);
        if (page === 1) {
            getIngredients()
        }
        setPage(1);
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={ingredientStore.list}
                refreshing={isLoading}
                onRefresh={() => refresh()}
                onEndReached={() => handleEndReached()}
                onEndReachedThreshold={0.5}
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
        </View>
    )
}