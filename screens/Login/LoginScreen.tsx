import { MaterialIcons } from "@expo/vector-icons";
import { Button, Center, Divider, Icon, Input, Stack, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons"

export default function LoginScreen({ navigation }: any) {

    const [passwordVisible, setPasswordVisible] = useState(false)

    const ShowPassword = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleCreateLogin = () => {
        navigation.navigate('CreateLogin');
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
                    onPress={() => {}}>
                    Log in
                </Button>
                <Divider my="2" />
                <Text underline onPress={() => handleCreateLogin()}>Create Login</Text>
            </Stack>
        </Center>
    )
}
