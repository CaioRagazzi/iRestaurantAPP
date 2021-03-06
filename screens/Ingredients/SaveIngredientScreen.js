import React, { useState, useEffect, useContext } from "react";
import { Button, Stack, FormControl, Icon, Input, WarningOutlineIcon, useToast, HStack, Spinner, Heading } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../../services/Axios";
import { Keyboard } from "react-native";
import { IngredientContext } from "../../store/IngredientsStore";

export default function SaveIngredientScreen({ route, navigation }) {
    const [id, setId] = useState(0);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [unit, setUnit] = useState('')
    const [isEditing, setIsEditing] = useState(false);
    const [screenLoading, setScreenLoading] = useState(true)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const ingredientContext = useContext(IngredientContext)

    useEffect(() => {
        setScreenLoading(true);

        const params = route.params;
        if (params) {
            setIsEditing(true);
            setId(params.ingredient.id);
            setName(params.ingredient.name);
            setDescription(params.ingredient.description);
            setUnit(params.ingredient.unit);
            navigation.setOptions({
                title: 'Edit Ingredient'
            })
        } else {
            navigation.setOptions({
                title: 'Create Ingredient'
            })
        }
        setScreenLoading(false);
    }, [])

    const handleChangeName = ({ nativeEvent: { eventCount, target, text } }) => {
        setName(text);
    }

    const handleChangeUnit = ({ nativeEvent: { eventCount, target, text } }) => {
        setUnit(text);
    }

    const handleChangeDescription = ({ nativeEvent: { eventCount, target, text } }) => {
        setDescription(text);
    }

    const handleCreateIngredient = async () => {
        Keyboard.dismiss();
        setLoading(true);
        api.post("foodingredient", {
            name: name,
            description: description,
            unit: unit
        }).then(data => {
            setLoading(false);
            toast.show({
                title: "Created!",
                status: "success",
                description: "Ingredient Created!.",
                duration: 3000
            })
            ingredientContext.refresh();
            navigation.goBack();
        }).catch(data => {
            setLoading(false);
            toast.show({
                title: "Error!",
                status: "error",
                description: "Error creating ingredient =(.",
                duration: 3000
            })
        })
    }

    const handleEditIngredient = async () => {
        Keyboard.dismiss();
        setLoading(true);
        api.put(`foodingredient/${id}`, {
            name: name,
            description: description,
            unit: unit
        }).then(data => {
            setLoading(false);
            toast.show({
                title: "Updated!",
                status: "success",
                description: "Ingredient Updated!.",
                duration: 3000
            })
            ingredientContext.refresh();
            navigation.goBack();
        }).catch(data => {
            setLoading(false);
            toast.show({
                title: "Error!",
                status: "error",
                description: "Error updating Ingredient =(.",
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
                    isInvalid={!unit}
                    w={{
                        base: "75%",
                        md: "100%",
                    }}
                >
                    <Input
                        value={unit}
                        onChange={handleChangeUnit}
                        autoCapitalize="none"
                        InputLeftElement={
                            <Icon
                                as={<MaterialIcons name="person" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                            />
                        }
                        placeholder="Unit"
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Unit cannot be empty.
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
                    onPress={() => isEditing ? handleEditIngredient() : handleCreateIngredient()}>
                    {isEditing ? 'Save' : 'Create'}
                </Button>
            </Stack>
    )
}