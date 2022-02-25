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

const EraseCase = (props) => {
  const { eraseCase } = useAppContext();
  const { isOpen, onClose, groupId, caseId } = props;

  const toast = useToast();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Borrar caso</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          ¿Estás seguro que deseas borrar este caso? 
          Este cambio no se puede deshacer
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
                title: "Caso borrado",
                description: "El caso ha sido borrado exitosamente",
                status: "success",
                isClosable: true,
              });

              eraseCase({
                caseId: caseId,
                groupId: groupId,
              });

              onClose();
            }}>
            Borrar caso
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EraseCase;