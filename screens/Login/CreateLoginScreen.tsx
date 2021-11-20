import React, { useState } from "react";
import { Button, Center, Divider, Icon, Input, Stack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useToast } from 'native-base';
import validator from 'validator';
import api from "../../services/Axios";

export default function LoginScreen({ navigation }: any) {

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [name, setName] = useState("")
    const [restaurantName, setRestaurantName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const toast = useToast()

    const handleCreateLogin = () => {
        var isEmail = validator.isEmail(email);
        if (!isEmail) {
            toast.show({ description: "Invalid E-mail!" });
        }
    }

    const handleBack = () => {
        navigation.goBack();
    }

    const handleCreate = () => {
        console.log(name);
        console.log(restaurantName);
        console.log(email);
        console.log(password);

        api.post("userrestaurant", {
            name: name,
            email: email,
            RestaurantName: restaurantName,
            password: password
        }).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err.response.data);
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

    return (
        <Center flex={1} px="3">
            <Stack space={4} w="100%" alignItems="center">
                <Input
                    value={name}
                    onChange={handleChangeName}
                    autoCapitalize="none"
                    w={{
                        base: "75%",
                        md: "25%",
                    }}
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
                <Input
                    value={restaurantName}
                    onChange={handleChangeRestaurantName}
                    autoCapitalize="none"
                    w={{
                        base: "75%",
                        md: "25%",
                    }}
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
                <Input
                    value={email}
                    onChange={handleChangeEmail}
                    autoCapitalize="none"
                    w={{
                        base: "75%",
                        md: "25%",
                    }}
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
                <Input
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    autoCapitalize="none"
                    type={confirmPasswordVisible ? "text" : "password"}
                    w={{
                        base: "75%",
                        md: "25%",
                    }}
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
                <Button
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