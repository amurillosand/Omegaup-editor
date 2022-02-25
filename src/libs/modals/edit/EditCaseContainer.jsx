import React from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import EditCase from "./EditCase";

const EditCaseContainer = (props) => {
  const { isOpen, onClose } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Editar caso </ModalHeader>
        <ModalCloseButton />

        <ModalBody mb={5}>
          <EditCase {...props} />
        </ModalBody>

      </ModalContent>
    </Modal>
  );
};

export default EditCaseContainer;
