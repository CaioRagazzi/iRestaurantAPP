import { MaterialIcons } from "@expo/vector-icons";
import { Button, Center, Divider, Icon, Input, Stack } from "native-base";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons"
import api from "../services/Axios";
import * as Google from 'expo-google-app-auth';

export default function LoginScreen() {

    const [passwordVisible, setPasswordVisible] = useState(false)

    const HandleGoogleAuth = () => {
        const config = {
            androidClientId: '1000389315299-0ke0egulbcst2hnkmcinkb7cea0se8ni.apps.googleusercontent.com',
            scopes: ['profile', 'email']
        }

        Google
            .logInAsync(config)
            .then((resultGoogle: any) => {
                api.post("google", {
                    AccessToken: resultGoogle.accessToken,
                    IdToken: resultGoogle.idToken,
                    RefreshToken: resultGoogle.refreshToken,
                    Type: resultGoogle.type,
                    User: {
                        Email: resultGoogle.user.email,
                        FamilyName: resultGoogle.user.familyName,
                        GivenName: resultGoogle.user.givenName,
                        Id: resultGoogle.user.id,
                        Name: resultGoogle.user.name,
                        PhotoUrl: resultGoogle.user.photoUrl,
                    },
                }).then(resultApi => {
                    console.log('resultApi', resultApi.data);
                }).catch(err => {
                    console.log('err resultApi', err);
                })
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    const ShowPassword = () => {
        setPasswordVisible(!passwordVisible);
    }

    return (
        <Center flex={1} px="3">
            <Stack space={4} w="100%" alignItems="center">
                <Input
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
                <Button
                    w={{
                        base: "75%",
                        md: "25%",
                    }}
                    onPress={() => HandleGoogleAuth()}>
                    Log in
                </Button>
                <Divider my="2" />
                <Button
                    leftIcon={<Icon as={AntDesign} name="google" size={4} />}
                    w={{
                        base: "75%",
                        md: "25%",
                    }}
                    onPress={() => HandleGoogleAuth()}>
                    Google Auth
                </Button>
            </Stack>
        </Center>
    )
}