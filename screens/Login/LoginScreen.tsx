import React, { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { useState as useHookState } from "@hookstate/core";
import AuthStore from "../../store/AuthStore";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, Center, Divider, Icon, Input, Stack, Text, useToast } from "native-base";
import api from "../../services/Axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

export default function LoginScreen({ navigation }: any) {

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const loggedUser = useHookState(AuthStore);

    useEffect(() => {
        AsyncStorage.getItem('jwt').then(res => {
            console.log(res);
            if (res) {
                var decodedJwt: any = jwtDecode(res)
                loggedUser.merge({ token: res, logged: true, userId: +decodedJwt.UserId, email: decodedJwt.email })
            }
        })
    }, [])

    const ShowPassword = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleCreateLogin = () => {
        navigation.navigate('CreateLogin');
    }

    const storeData = async (value: any) => {
        try {
            await AsyncStorage.setItem('jwt', value)
        } catch (e) {
            // saving error
        }
    }

    const handleLogin = () => {
        Keyboard.dismiss()
        setLoading(true)
        api.post("auth", {
            email: email,
            password: password
        }).then(async (data) => {
            await storeData(data.data)
            var decodedJwt: any = jwtDecode(data.data)
            loggedUser.merge({ token: data.data, logged: true, userId: +decodedJwt.UserId, email: decodedJwt.email })
        }).catch(err => {
            setLoading(false)
            toast.show({
                title: "Error!",
                status: "error",
                description: "Invalid login and/or password!.",
                duration: 3000
            })
        })
    }

    const handleChangeEmail = ({ nativeEvent: { eventCount, target, text } }: any) => {
        setEmail(text);
    }

    const handleChangePassword = ({ nativeEvent: { eventCount, target, text } }: any) => {
        setPassword(text);
    }

    return (
        <Center flex={1} px="3">
            <Stack space={4} w="100%" alignItems="center">
                <Input
                    autoCapitalize="none"
                    onChange={handleChangeEmail}
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
                    autoCapitalize="none"
                    onChange={handleChangePassword}
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
                <Button
                    isLoading={loading}
                    w={{
                        base: "75%",
                        md: "25%",
                    }}
                    onPress={() => handleLogin()}>
                    Log in
                </Button>
                <Divider my="2" />
                <Text underline onPress={() => handleCreateLogin()}>Create Login</Text>
            </Stack>
        </Center>
    )
}
