import React, { useContext, useEffect } from 'react'
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
import { CategoryContext } from "../store/CategoriesStore";
import { TouchableNativeFeedback, SafeAreaView, View } from 'react-native'

export default function OverlayCategories({ isOpen, onOverlayCategoryClose, selectedCategory }) {

    const categoryContext = useContext(CategoryContext)

    useEffect(() => {
        if (categoryContext.listCategory.length === 0) {
            categoryContext.getCategories(1);
        }
    }, [categoryContext.listCategory])

    const handleEndReached = () => {
        if (categoryContext.page > categoryContext.totalPages) return;
        categoryContext.setPage(categoryContext.page + 1)
    }

    const handleTouch = (category) => {
        selectedCategory(category);
        onOverlayCategoryClose(false)
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
                            data={categoryContext.listCategory}
                            refreshing={categoryContext.isLoading}
                            onRefresh={() => categoryContext.refresh()}
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
