import React, { useEffect, useState } from 'react'
import {
    Button,
    Modal,
    Box,
    HStack,
    Avatar,
    VStack,
    Text,
    Spacer,
    FlatList,
    FormControl,
    Input,
    WarningOutlineIcon
} from "native-base"
import { TouchableNativeFeedback, SafeAreaView, View } from 'react-native'
import api from "../services/Axios";

export default function OverlayIngredients({ isOpen, onOverlayIngredientClose, selectedOverlayIngredient }) {

    const [isLoading, setIsLoading] = useState(false)
    const [isModalQuantityOpen, setIsModalQuantityOpen] = useState(false)
    const [selectedIngredient, setSelectedIngredient] = useState(null)
    const [quantity, setQuantity] = useState(0)
    const [listIngredients, setListIngredients] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [perPage, setPerPage] = useState(50)

    useEffect(() => {
        if (!selectedIngredient?.quantity) {
            return
        }
        selectedOverlayIngredient(selectedIngredient);
        setIsModalQuantityOpen(false)
        onOverlayIngredientClose(false)
        setQuantity(0)
    }, [selectedIngredient?.quantity])

    useEffect(() => {
        if (listIngredients.length === 0) {
            getIngredients(1);
        }
    }, [listIngredients])

    const getIngredients = (pageParam) => {
        if (isLoading) return;
        setIsLoading(true)
        api.get(`foodingredient?page=${pageParam}&pageSize=${perPage}`)
            .then(data => {
                setTotalPages(data.data.pageCount);
                setListIngredients([...listIngredients, ...data.data.results])
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

    const handleTouchIngredient = (ingredient) => {
        setSelectedIngredient({ ...ingredient, ingredientId: ingredient.id });
        setIsModalQuantityOpen(true)
    }

    const handleChangeQuantity = ({ nativeEvent: { eventCount, target, text } }) => {
        setQuantity(text);
    }

    const handleCloseModalQuantity = () => {
        setQuantity(0)
        setIsModalQuantityOpen(false)
    }

    const saveQuantity = () => {
        setSelectedIngredient({ ...selectedIngredient, quantity: parseFloat(quantity) })
    }

    const refresh = () => {
        setListIngredients([]);
        setPage(1)
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => onOverlayIngredientClose(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>Select Ingredient</Modal.Header>
                    <View style={{ height: '80%' }}>
                        <SafeAreaView>
                            <FlatList
                                nestedScrollEnabled
                                data={listIngredients}
                                refreshing={isLoading}
                                onRefresh={() => refresh()}
                                onEndReached={() => handleEndReached()}
                                onEndReachedThreshold={0.8}
                                renderItem={({ item }) => (
                                    <TouchableNativeFeedback
                                        onPress={() => handleTouchIngredient(item)}>
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
                                    onOverlayIngredientClose(false)
                                }}
                            >
                                Cancel
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={isModalQuantityOpen} onClose={() => handleCloseModalQuantity()}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>Select Quantity</Modal.Header>
                    <Modal.Body style={{ alignItems: 'center' }}>
                        <FormControl
                            isInvalid={!quantity || quantity == 0}
                            w={{
                                base: "75%",
                                md: "25%",
                            }}
                        >
                            <FormControl.Label>{selectedIngredient?.name} ({selectedIngredient?.unit})</FormControl.Label>
                            <Input
                                value={quantity.toString()}
                                onChange={handleChangeQuantity}
                                keyboardType='decimal-pad'
                                placeholder={`Enter ${selectedIngredient?.unit}`} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {selectedIngredient?.unit} cannot be empty
                            </FormControl.ErrorMessage>
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="ghost"
                                colorScheme="blueGray"
                                onPress={() => {
                                    handleCloseModalQuantity(false)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                isDisabled={!quantity || quantity == 0}
                                onPress={() => {
                                    saveQuantity()
                                }}
                            >
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}
