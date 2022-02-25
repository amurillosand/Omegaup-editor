import React from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import EditGroup from "./EditGroup";

const EditGroupContainer = (props) => {
  const { isOpen, onClose } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Editar grupo </ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={5}>
          <EditGroup {...props} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditGroupContainer;
