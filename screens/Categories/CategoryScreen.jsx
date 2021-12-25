import {
    IconButton, HamburgerIcon, AddIcon, FlatList, Box,
    Avatar,
    HStack,
    VStack,
    Text,
    Spacer
} from "native-base";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { TouchableNativeFeedback, View } from "react-native";
import api from "../../services/Axios";

export default function CategoryScreen({ navigation }) {

    const [categories, setCategories] = useState([])
    const isFocused = useIsFocused();
    const [perPage, setPerPage] = useState(20)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

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

    }, [navigation, isFocused]);

    useEffect(() => {
        getCategories(page);
    }, [page])

    const getCategories = (pageParam) => {
        console.log(page);
        api.get(`foodcategory?page=${pageParam}&pageSize=${50}`)
            .then(data => {
                setTotalPages(data.data.pageCount);
                setCategories(oldArray => [...oldArray, ...data.data.results]);
            })
            .catch(err => {
                console.log(err.response);
            })
    }

    const handleTouch = (category) => {
        navigation.navigate('CreateCategories', { category })
    }

    const handleEndReached = () => {
        console.log('page', page);
        console.log('totalPages', totalPages);
        if (page >= totalPages) return;
        setPage(page + 1)
        console.log('chegou no final');
    }

    return (
        <View style={{flexGrow: 1}}>
            <FlatList
                data={categories}
                onEndReached={() => handleEndReached()}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <TouchableNativeFeedback onPress={() => handleTouch(item)}>
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
