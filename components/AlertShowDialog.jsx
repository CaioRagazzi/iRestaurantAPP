import React, { useState, useRef, useEffect } from 'react'
import { AlertDialog, Button, Center } from "native-base"

export default function AlertShowDialog({ isClosed, onCancel, onOk, message }) {

    useEffect(() => {
        if (isClosed) {
            setIsOpen(true);
            return
        }

        setIsOpen(false)
    }, [isClosed])

    const [isOpen, setIsOpen] = useState(false)

    const onCloseCancel = () => {
        setIsOpen(false)
        onCancel(false)
    }

    const onCloseOk = () => {
        setIsOpen(false)
        onOk(true)
    }

    const onClose = () => setIsOpen(false)

    const cancelRef = useRef(null)

    return (
        <Center>
            <AlertDialog
                leastDestructiveRef={cancelRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Delete</AlertDialog.Header>
                    <AlertDialog.Body>
                        {message}
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="unstyled"
                                colorScheme="coolGray"
                                onPress={onCloseCancel}
                                ref={cancelRef}
                            >
                                Cancel
                            </Button>
                            <Button colorScheme="danger" onPress={onCloseOk}>
                                Delete
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </Center>
    )
}
