import React, { useState } from "react";
import { Keyboard } from "react-native";
import { Button, Center, FormControl, Icon, Input, Stack, WarningOutlineIcon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useToast } from 'native-base';
import validator from 'validator';
import api from "../../services/Axios";

export default function LoginScreen({ navigation }: any) {

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [restaurantName, setRestaurantName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const toast = useToast()

    const handleBack = () => {
        navigation.goBack();
    }

    const isFormInvalid = () => {
        if (!name || !restaurantName || !validator.isEmail(email) || !checkIfPasswordsAreEqual())
            return true

        return false
    }

    const handleCreate = () => {
        Keyboard.dismiss();
        setIsLoading(true);

        api.post("userrestaurant", {
            name: name,
            email: email,
            RestaurantName: restaurantName,
            password: password
        }).then(data => {
            console.log(data);
            setIsLoading(false);
            handleBack();
            toast.show({
                title: "Account Created!",
                status: "success",
                description: "Account created, please log in!.",
                duration: 3000
            })
        }).catch(err => {
            setIsLoading(false);
            if (err.response.data.includes("UserAlreadyExistsException")){
                toast.show({
                    title: "Account already exists!",
                    status: "warning",
                    description: "Account with same email already exists.",
                    duration: 3000
                })
                return
            }

            toast.show({
                title: "Error!",
                status: "error",
                description: "Some error ocured.",
                duration: 3000
            })
        })
    }

    const handleChangeName = ({ nativeEvent: { eventCount, target, text } }: any) => {
        setName(text);
    }

    const handleChangeRestaurantName = ({ nativeEvent: { eventCount, target, text } }: any) => {
        setRestaurantName(text);
    }

    const handleChangeEmail = ({ nativeEvent: { eventCount, target, text } }: any) => {
        setEmail(text);
    }

    const handleChangePassword = ({ nativeEvent: { eventCount, target, text } }: any) => {
        setPassword(text);
    }

    const handleChangeConfirmPassword = ({ nativeEvent: { eventCount, target, text } }: any) => {
        setConfirmPassword(text);
    }

    const ShowPassword = () => {
        setPasswordVisible(!passwordVisible);
    }

    const ShowConfirmPassword = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    }

    const checkIfPasswordsAreEqual = () => {
        if (!password || !confirmPassword)
            return false

        if (password !== confirmPassword)
            return false

        if (!(password.length > 5) || !(confirmPassword.length > 5))
            return false

        return true
    }

    return (
        <Center flex={1} px="3">
            <Stack space={4} w="100%" alignItems="center">
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
                    isInvalid={!restaurantName}
                    w={{
                        base: "75%",
                        md: "100%",
                    }}
                >
                    <Input
                        value={restaurantName}
                        onChange={handleChangeRestaurantName}
                        autoCapitalize="none"
                        InputLeftElement={
                            <Icon
                                as={<MaterialIcons name="person" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                            />
                        }
                        placeholder="Restaurant Name"
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Restaurant Name cannot be empty.
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                    isInvalid={!validator.isEmail(email)}
                    w={{
                        base: "75%",
                        md: "100%",
                    }}
                >
                    <Input
                        value={email}
                        onChange={handleChangeEmail}
                        autoCapitalize="none"
                        InputLeftElement={
                            <Icon
                                as={<MaterialIcons name="person" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                            />
                        }
                        placeholder="Email"
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Ivalid Email.
                    </FormControl.ErrorMessage>
                </FormControl>
                <Input
                    value={password}
                    onChange={handleChangePassword}
                    autoCapitalize="none"
                    type={passwordVisible ? "text" : "password"}
                    w={{
                        base: "75%",
                        md: "25%",
                    }}
                    InputRightElement={
                        <Icon
                            onPress={() => ShowPassword()}
                            as={<MaterialIcons name="visibility-off" />}
                            size={5}
                            mr="2"
                            color="muted.400"
                        />
                    }
                    placeholder="Password"
                />
                <FormControl
                    isInvalid={!checkIfPasswordsAreEqual()}
                    w={{
                        base: "75%",
                        md: "100%",
                    }}
                >
                    <Input
                        value={confirmPassword}
                        onChange={handleChangeConfirmPassword}
                        autoCapitalize="none"
                        type={confirmPasswordVisible ? "text" : "password"}
                        InputRightElement={
                            <Icon
                                onPress={() => ShowConfirmPassword()}
                                as={<MaterialIcons name="visibility-off" />}
                                size={5}
                                mr="2"
                                color="muted.400"
                            />
                        }
                        placeholder="Confirm Password"
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Invalid Email.
                    </FormControl.ErrorMessage>
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Password must have a minimum length of 6.
                    </FormControl.ErrorMessage>
                </FormControl>
                <Button
                    isDisabled={isFormInvalid()}
                    isLoading={isLoading}
                    w={{
                        base: "75%",
                        md: "25%",
                    }}
                    onPress={() => handleCreate()}>
                    Create
                </Button>
                <Button
                    w={{
                        base: "75%",
                        md: "25%",
                    }}
                    onPress={() => handleBack()}>
                    Back
                </Button>
            </Stack>
        </Center>
    )
}