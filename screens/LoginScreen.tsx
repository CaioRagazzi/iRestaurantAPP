import { MaterialIcons } from "@expo/vector-icons";
import { Center, Icon, Input, Stack } from "native-base";
import React from "react";
import { View, Text } from "react-native";

export default function LoginScreen() {
    return (
        <Center flex={1} px="3">
            <Stack space={4} w="100%" alignItems="center">
                <Input
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
                    w={{
                        base: "75%",
                        md: "25%",
                    }}
                    InputRightElement={
                        <Icon
                            as={<MaterialIcons name="visibility-off" />}
                            size={5}
                            mr="2"
                            color="muted.400"
                        />
                    }
                    placeholder="Password"
                />
            </Stack>
        </Center>
    )
}