import React, { useLayoutEffect, useState } from 'react'
import { Stack, Spinner, FormControl, Input, Icon, WarningOutlineIcon, Divider } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import OverlayCategories from "../../components/OverlayCategories";
import { View, Pressable } from "react-native";
import CategoryContextProvider from "../../store/CategoriesStore";

export default function SaveMenuScreen({ route, navigation }) {

    const [screenLoading, setScreenLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [id, setId] = useState(0)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isOverlayOpen, setIsOverlayOpen] = useState(false)
    const [category, setCategory] = useState(null)

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

    const handleChangeName = ({ nativeEvent: { eventCount, target, text } }) => {
        setName(text);
    }

    const handleChangeDescription = ({ nativeEvent: { eventCount, target, text } }) => {
        setDescription(text);
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
                    <Pressable onPress={() => setIsOverlayOpen(true)}>
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
                <CategoryContextProvider>
                    <OverlayCategories
                        isOpen={isOverlayOpen}
                        onOverlayCategoryClose={() => setIsOverlayOpen(false)}
                        selectedCategory={(overlaySelectedCategory) => setCategory(overlaySelectedCategory)} />
                </CategoryContextProvider>
            </Stack>
    )
}
