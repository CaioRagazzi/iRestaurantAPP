import React, { useState, useEffect } from 'react'
import {
    Button,
    Modal,
    Box,
    HStack,
    Avatar,
    VStack,
    Text,
    Spacer,
    FlatList
} from "native-base"
import { TouchableNativeFeedback, SafeAreaView, View } from 'react-native'
import api from "../services/Axios";

export default function OverlayCategories({ isOpen, onOverlayCategoryClose, selectedCategory }) {

    const [listCategory, setListCategory] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(50)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        if (listCategory.length === 0) {
            getCategories(1);
        }
    }, [listCategory])

    const getCategories = (pageParam) => {
        if (isLoading) return;
        setIsLoading(true)
        api.get(`foodcategory?page=${pageParam}&pageSize=${perPage}`)
            .then(data => {
                setTotalPages(data.data.pageCount);
                setListCategory([...listCategory, ...data.data.results])
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }

    const handleEndReached = () => {
        if (page > totalPages) return;
        setPage(page + 1)
    }

    const handleTouch = (category) => {
        selectedCategory(category);
        onOverlayCategoryClose(false)
    }

    const refresh = () => {
        setListCategory([]);
        setPage(1)
    }

    return (
        <Modal isOpen={isOpen} onClose={() => onOverlayCategoryClose(false)}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Select Category</Modal.Header>
                <View style={{ height: '80%' }}>
                    <SafeAreaView>
                        <FlatList
                            nestedScrollEnabled
                            data={listCategory}
                            refreshing={isLoading}
                            onRefresh={() => refresh()}
                            onEndReached={() => handleEndReached()}
                            onEndReachedThreshold={0.8}
                            renderItem={({ item }) => (
                                <TouchableNativeFeedback
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
                                        </HStack>
                                    </Box>
                                </TouchableNativeFeedback>
                            )}
                            keyExtractor={(item) => item.id}
                        />
                    </SafeAreaView>
                </View>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                                onOverlayCategoryClose(false)
                            }}
                        >
                            Cancel
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
