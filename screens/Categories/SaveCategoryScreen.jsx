import React, { useState, useEffect } from "react";
import { Button, Stack, FormControl, Icon, Input, WarningOutlineIcon, useToast, HStack, Spinner, Heading } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../../services/Axios";
import { Keyboard } from "react-native";

export default function SaveCategoryScreen({ route, navigation }) {

    const [id, setId] = useState(0);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isEditing, setIsEditing] = useState(false);
    const [screenLoading, setScreenLoading] = useState(true)
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    useEffect(() => {
        setScreenLoading(true);

        const params = route.params;
        if (params) {
            setIsEditing(true);
            setId(params.category.id);
            setName(params.category.name);
            setDescription(params.category.description);
            navigation.setOptions({
                title: 'Edit Category'
            })
        } else {
            navigation.setOptions({
                title: 'Create Category'
            })
        }
        setScreenLoading(false);
    }, [])

    const handleChangeName = ({ nativeEvent: { eventCount, target, text } }) => {
        setName(text);
    }

    const handleChangeDescription = ({ nativeEvent: { eventCount, target, text } }) => {
        setDescription(text);
    }

    const handleCreateCategory = async () => {
        Keyboard.dismiss();
        setLoading(true);
        api.post("foodcategory", {
            name: name,
            description: description
        }).then(data => {
            setLoading(false);
            toast.show({
                title: "Created!",
                status: "success",
                description: "Category Created!.",
                duration: 3000
            })
            navigation.goBack();
        }).catch(data => {
            setLoading(false);
            toast.show({
                title: "Error!",
                status: "error",
                description: "Error creating category =(.",
                duration: 3000
            })
        })
    }

    const handleEditCategory = async () => {
        Keyboard.dismiss();
        setLoading(true);
        api.put(`foodcategory/${id}`, {
            name: name,
            description: description
        }).then(data => {
            setLoading(false);
            toast.show({
                title: "Updated!",
                status: "success",
                description: "Category Updated!.",
                duration: 3000
            })
            navigation.goBack();
        }).catch(data => {
            setLoading(false);
            toast.show({
                title: "Error!",
                status: "error",
                description: "Error updating category =(.",
                duration: 3000
            })
        })
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
                    isInvalid={!name}
                    w={{
                        base: "75%",
                        md: "100%",
                    }}
                >
                    <Input
                        value={description}
                        numberOfLines={8}
                        onChange={handleChangeDescription}
                        autoCapitalize="none"
                        InputLeftElement={
                            <Icon
                                as={<MaterialIcons name="person" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                            />
                        }
                        placeholder="Description"
                    />
                </FormControl>
                <Button
                    isLoading={loading}
                    w={{
                        base: "75%",
                        md: "25%",
                    }}
                    isDisabled={name.trim() === ''}
                    onPress={() => isEditing ? handleEditCategory() : handleCreateCategory()}>
                    {isEditing ? 'Save' : 'Create'}
                </Button>
            </Stack>
    )
}