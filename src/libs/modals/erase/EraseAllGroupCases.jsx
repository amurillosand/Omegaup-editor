import * as React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";

import { useAppContext } from "../../../App";

const EraseAllGroupCases = (props) => {
  const { eraseAllGroupCases } = useAppContext();
  const { isOpen, onClose, groupId, groupName } = props;

  const toast = useToast();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Borrar casos de {groupName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          ¿Estás seguro que deseas borrar TODOS los casos de {groupName}? Este cambio no se puede deshacer
        </ModalBody>
        <ModalFooter>
          <Button variant={"ghost"} mr={3} onClick={onClose}>
            Cerrar
          </Button>
          <Button
            colorScheme="red"
            type={"submit"}
            onClick={() => {
              toast({
                title: "Casos borrados",
                description: "Los casos del grupo han sido borrado exitosamente",
                status: "success",
                isClosable: true,
              });

              eraseAllGroupCases(groupId);

              onClose();
            }}>
            Borrar casos
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EraseAllGroupCases;
