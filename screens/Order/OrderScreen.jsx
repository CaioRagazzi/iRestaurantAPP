import { IconButton, useToast, HamburgerIcon, Stack, AddIcon } from "native-base";
import { Card } from 'react-native-paper';
import { FlatList } from "react-native";
import React, { useLayoutEffect, useState, useContext, useEffect } from "react";
import { OrderContext } from "../../store/OrderStore";

import FAB from 'react-native-fab'

export default function OrderScreen({ navigation }) {

    const orderContext = useContext(OrderContext);
    const [showAlertDelete, setShowAlertDelete] = useState(false)
    const [orderToDelete, setOrderToDelete] = useState(null)
    const toast = useToast()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Order',
            headerRight: () => (
                <IconButton
                    icon={<AddIcon si name="emoji-happy" size="4" />}
                    onPress={() => { navigation.navigate('SaveOrder') }}
                    borderRadius="full" />
            ),
            headerLeft: () => (
                <IconButton
                    icon={<HamburgerIcon si name="emoji-happy" size="4" />}
                    onPress={() => { navigation.toggleDrawer() }}
                    borderRadius="full" />
            ),
        });

    }, [navigation]);

    useEffect(() => {
        if (orderContext.listOrder.length === 0) {
            orderContext.getOrder(1);
        }
    }, [orderContext.listOrder])

    const handleTouch = (order) => {
        navigation.navigate('SaveOrder', { order })
    }

    const handleLongPress = (orderParam) => {
        setShowAlertDelete(true)
        setOrderToDelete(orderParam)
    }

    const handleDelete = () => {
        api.delete(`order/${orderToDelete.id}`).then(data => {
            toast.show({
                title: "Deleted!",
                status: "success",
                description: "Order Deleted!.",
                duration: 3000
            })
            orderContext.refresh()
            setShowAlertDelete(false)
        })
    }

    const handleEndReached = () => {
        if (orderContext.page > orderContext.totalPages) return;
        orderContext.setPage(orderContext.page + 1)
    }



    return (
        <Stack space={4} w="100%" alignItems="center" marginTop="10" style={{ flex: 1 }} >
            <FlatList
                style={{ flexGrow: 1, width: '100%' }}
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
                data={orderContext.listOrder}
                numColumns={2}
                renderItem={({ item }) => (
                    <Card style={{ flexGrow: 1, margin: 5, width: '40%' }} onPress={() => handleTouch(item)}>
                        <Card.Title
                            title={item.table}
                            subtitle={item.description} />
                        {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
                        {/* <Card.Actions>
                            <ButtonPPW
                                icon="delete"
                                onPress={() => removeMenuFromSelected(item)}>Remove</ButtonPPW>
                        </Card.Actions> */}
                    </Card>
                )}
                keyExtractor={(item) => item.id} />
            <FAB
                buttonColor="#06b6d4"
                iconTextColor="#FFFFFF"
                onClickAction={() => { navigation.navigate('SaveOrder') }}
                visible={true}
                iconTextComponent={<AddIcon size={4} />} />
        </Stack >
    )
}
