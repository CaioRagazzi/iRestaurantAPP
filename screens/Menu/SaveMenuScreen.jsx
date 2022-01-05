import React, { useLayoutEffect, useState } from 'react'
import {
    Stack,
    Spinner,
    Text,
    HStack,
    VStack,
    FormControl,
    Input,
    Icon,
    WarningOutlineIcon,
    Divider,
    Fab,
    FlatList,
    Box,
    Spacer,
    Heading,
    IconButton,
    useToast,
    AddIcon
} from "native-base";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import OverlayCategories from "../../components/OverlayCategories";
import { View, Pressable } from "react-native";
import CategoryContextProvider from "../../store/CategoriesStore";
import IngredientContextProvider from '../../store/IngredientsStore';
import OverlayIngredients from '../../components/OverlayIngredients';

export default function SaveMenuScreen({ route, navigation }) {

    const [screenLoading, setScreenLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [id, setId] = useState(0)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isOverlayCategoryOpen, setIsOverlayCategoryOpen] = useState(false)
    const [isOverlayIngredientOpen, setIsOverlayIngredientOpen] = useState(false)
    const [category, setCategory] = useState(null)
    const [selectedIngredients, setSelectedIngredients] = useState([])
    const toast = useToast()

    useLayoutEffect(() => {
        setScreenLoading(true);

        const params = route.params;
        if (params) {
            setIsEditing(true);
            setId(params.category.id);
            setName(params.category.name);
            setDescription(params.category.description);
            navigation.setOptions({
                title: 'Edit Menu'
            })
        } else {
            navigation.setOptions({
                title: 'Create Menu'
            })
        }
        setScreenLoading(false);
    }, [navigation]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon={
                        <IconButton
                            colorScheme="red"
                            onPress={() => save()}
                            variant="ghost"
                            size="30"
                            _icon={{
                                as: AntDesign,
                                name: "save",
                            }}
                        />
                    }
                    onPress={() => save()}
                    borderRadius="full" />
            ),
        });

    }, [navigation, name, category, selectedIngredients]);

    const save = () => {
        if (!name.trim() || !category) {
            toast.show({
                title: "Warning!",
                status: "warning",
                description: "Please, provide all fields!.",
                duration: 3000
            })
        }
        console.log(name);
        console.log(category);
        console.log(selectedIngredients);
    }

    const handleChangeName = ({ nativeEvent: { eventCount, target, text } }) => {
        setName(text);
    }

    const handleChangeDescription = ({ nativeEvent: { eventCount, target, text } }) => {
        setDescription(text);
    }

    const handleSelectedIngredient = (overlaySelectedIngredient) => {

        const existingItem = selectedIngredients.find(r => r.id === overlaySelectedIngredient.id)

        if (existingItem) {
            toast.show({
                title: "Warning!",
                status: "warning",
                description: "Item already added!.",
                duration: 3000
            })
            return
        }

        setSelectedIngredients(oldValue => [...oldValue, overlaySelectedIngredient])
    }

    const removeIngFromSelected = (ingtItem) => {
        const newList = selectedIngredients.filter(i => i.id !== ingtItem.id)

        setSelectedIngredients(newList);
    }

    return (
        screenLoading ?
            <Stack space={4} w="100%" alignItems="center" marginTop="10">
                <Spinner accessibilityLabel="Loading posts" size="lg" />
            </Stack>
            :
            <Stack space={4} w="100%" alignItems="center" marginTop="10">
                <FormControl
                    isInvalid={!name}
                    w={{
                        base: "75%",
                        md: "100%",
                    }}
                >
                    <FormControl.Label>Name</FormControl.Label>
                    <Input
                        value={name}
                        onChange={handleChangeName}
                        autoCapitalize="none"
                        InputLeftElement={
                            <Icon
                                as={<MaterialIcons name="person" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                            />
                        }
                        placeholder="Name"
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Name cannot be empty.
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                    isInvalid={!category}
                    w={{
                        base: "75%",
                        md: "100%",
                    }}
                >
                    <Pressable onPress={() => setIsOverlayCategoryOpen(true)}>
                        <View pointerEvents="none">
                            <FormControl.Label>Category</FormControl.Label>
                            <Input
                                value={category?.name}
                                autoCapitalize="none"
                                InputLeftElement={
                                    <Icon
                                        as={<MaterialIcons name="person" />}
                                        size={5}
                                        ml="2"
                                        color="muted.400"
                                    />
                                }
                                placeholder="Category"
                            />
                        </View>
                    </Pressable>
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Category cannot be empty.
                    </FormControl.ErrorMessage>
                </FormControl>
                <Divider my="2" bg="black" thickness={0.5} width="80%" />
                <Heading fontSize="lg">
                    Ingredients
                </Heading>
                <View style={{ width: '85%' }}>
                    <FlatList
                        data={selectedIngredients}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
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
                                    <VStack>
                                        <Text
                                            _dark={{
                                                color: "warmGray.50",
                                            }}
                                            color="coolGray.800"
                                            bold
                                        >
                                            Ingredient: {item.name}
                                        </Text>
                                        <Text
                                            color="coolGray.600"
                                            _dark={{
                                                color: "warmGray.200",
                                            }}
                                        >
                                            {item.quantity} {item.unit}
                                        </Text>
                                    </VStack>
                                    <Spacer />
                                    <View style={{ justifyContent: 'center', paddingRight: 10 }}>
                                        <IconButton
                                            colorScheme="red"
                                            onPress={() => removeIngFromSelected(item)}
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
                        )} />
                </View>
                <Fab
                    borderRadius="full"
                    size="sm"
                    label='Add Ingr.'
                    onPress={() => setIsOverlayIngredientOpen(true)}
                    icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
                />
                <CategoryContextProvider>
                    <OverlayCategories
                        isOpen={isOverlayCategoryOpen}
                        onOverlayCategoryClose={() => setIsOverlayCategoryOpen(false)}
                        selectedCategory={(overlaySelectedCategory) => setCategory(overlaySelectedCategory)} />
                </CategoryContextProvider>
                <IngredientContextProvider>
                    <OverlayIngredients
                        isOpen={isOverlayIngredientOpen}
                        onOverlayIngredientClose={() => setIsOverlayIngredientOpen(false)}
                        selectedOverlayIngredient={(overlaySelectedIngredient) => handleSelectedIngredient(overlaySelectedIngredient)}>
                    </OverlayIngredients>
                </IngredientContextProvider>
            </Stack>
    )
}
