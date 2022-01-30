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
    WarningOutlineIcon,
    TextArea
} from "native-base"
import { TouchableNativeFeedback, SafeAreaView, View } from 'react-native'
import api from "../services/Axios";

export default function OverlayMenu({ isOpen, onOverlayMenuClose, selectedOverlayMenu }) {

    const [isLoading, setIsLoading] = useState(false)
    const [isModalQuantityOpen, setIsModalQuantityOpen] = useState(false)
    const [selectedMenu, setSelectedMenu] = useState(null)
    const [quantity, setQuantity] = useState()
    const [listMenus, setListMenus] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [perPage, setPerPage] = useState(50)
    const [additionalComment, setAdditionalComment] = useState('')

    useEffect(() => {
        if (!selectedMenu?.quantity) {
            return
        }
        selectedOverlayMenu(selectedMenu);
        setIsModalQuantityOpen(false)
        onOverlayMenuClose(false)
        setQuantity()
    }, [selectedMenu?.quantity])

    useEffect(() => {
        if (listMenus.length === 0) {
            getMenus(1);
        }
    }, [listMenus])

    const getMenus = (pageParam) => {
        if (isLoading) return;
        setIsLoading(true)
        api.get(`menu?page=${pageParam}&pageSize=${perPage}`)
            .then(data => {
                setTotalPages(data.data.pageCount);
                setListMenus([...listMenus, ...data.data.results])
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

    const handleTouchMenu = (menu) => {
        setSelectedMenu({ ...menu, menuId: menu.id , name: menu.name});
        setIsModalQuantityOpen(true)
    }

    const handleChangeQuantity = ({ nativeEvent: { eventCount, target, text } }) => {
        setQuantity(text);
    }

    const handleCloseModalQuantity = () => {
        setQuantity()
        setIsModalQuantityOpen(false)
    }

    const saveQuantity = () => {
        setSelectedMenu({ ...selectedMenu, quantity: parseFloat(quantity), additionalComment: additionalComment })
        setQuantity()
        setAdditionalComment('')
    }

    const refresh = () => {
        setListMenus([]);
        setPage(1)
    }

    const handleChangeComment = ({ nativeEvent: { eventCount, target, text } }) => {
        setAdditionalComment(text)
    }

    const handleOnCloseModal = () => {
        onOverlayMenuClose(false)
        setQuantity()
        setAdditionalComment('')
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => handleOnCloseModal()}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>Select Menu</Modal.Header>
                    <View style={{ height: '80%' }}>
                        <SafeAreaView>
                            <FlatList
                                nestedScrollEnabled
                                data={listMenus}
                                refreshing={isLoading}
                                onRefresh={() => refresh()}
                                onEndReached={() => handleEndReached()}
                                onEndReachedThreshold={0.8}
                                renderItem={({ item }) => (
                                    <TouchableNativeFeedback
                                        onPress={() => handleTouchMenu(item)}>
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
                                    onOverlayMenuClose(false)
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
                            <FormControl.Label>{selectedMenu?.name}</FormControl.Label>
                            <Input
                                value={quantity?.toString()}
                                onChange={handleChangeQuantity}
                                keyboardType='decimal-pad'
                                placeholder={`Enter quantity`} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {selectedMenu?.unit} cannot be empty
                            </FormControl.ErrorMessage>

                        </FormControl>
                        <FormControl
                            w={{
                                base: "75%",
                                md: "25%",
                            }}
                        >
                            <FormControl.Label>Additional comment</FormControl.Label>
                            <TextArea
                                value={additionalComment.toString()}
                                onChange={handleChangeComment}
                                placeholder={`Comment`} />
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
