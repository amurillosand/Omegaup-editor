import React from "react";
import {
  Box,
  Button,
  Center,
  Code,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useColorModeValue,
  VStack,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialog,
} from "@chakra-ui/react";

const CreateNewProblem = (props) => {
  const { isOpen, onClose, cancelRef, handleCreateNewProblem } = props;

  return (
    <AlertDialog
      onClose={onClose}
      isOpen={isOpen}
      isCentered>
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Crear nuevo problema</AlertDialogHeader>
        <AlertDialogBody>
          ¿Deseas crear un nuevo problema? Se borrará TODO el problema
          anterior. Guarda el problema primero antes de crear uno nuevo.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            No
          </Button>
          <Button
            colorScheme="red"
            ml={3}
            onClick={() => handleCreateNewProblem()}>
            Sí
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateNewProblem;