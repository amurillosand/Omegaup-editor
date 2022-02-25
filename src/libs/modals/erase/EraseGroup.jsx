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

import { useAppContext } from "../../../AppContext";

const EraseGroup = (props) => {
  const { eraseGroup } = useAppContext();
  const { isOpen, onClose, groupId } = props;

  const toast = useToast();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Borrar grupo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          ¿Estás seguro que deseas borrar este grupo? Este cambio no se puede deshacer
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
                title: "Grupo borrado",
                description: "El grupo ha sido borrado exitosamente",
                status: "success",
                isClosable: true,
              });

              eraseGroup(groupId);

              onClose();
            }}>
            Borrar grupo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EraseGroup;
