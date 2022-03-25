import * as React from "react";
import {
  Box,
  Button,
  Container,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  Spacer,
  useDisclosure,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialog,
  useToast,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { AddIcon, DownloadIcon, TriangleDownIcon } from "@chakra-ui/icons";

import { generateProblem } from "../libs/download/generateProblem";
import { useAppContext } from "../App";

const Header = () => {
  const { title, setTitle } = useAppContext();
  const data = useAppContext();
  const toast = useToast();

  const [isEditTitleActive, setIsEditTitleActive] = React.useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenLoad,
    onOpen: onOpenLoad,
    onClose: onCloseLoad,
  } = useDisclosure();

  const cancelRef = React.useRef(null);

  function handleTitleSubmit(newTitle) {
    setIsEditTitleActive(false);
    setTitle(newTitle);
  }

  function createNewProblem() {
    window.location.reload();
  }

  const toastId = React.useRef(null);


  function handleGenerateProblem() {
    toastId.current = toast({
      title: `Generando problema`,
      description: "Revisando que todo esté completo...",
      status: "success",
      isClosable: false,
    });

    function updateProblemStatus(newContent) {
      toast.update(toastId.current, newContent);
    };

    function closeProblemStatus(newContent) {
      toast.update(toastId.current, {
        ...newContent,
        isClosable: true,
        duration: 10000,
      });
    }

    generateProblem(data, toast, updateProblemStatus, closeProblemStatus);
  }

  return (
    <Container maxW={"container.lg"}>
      <Box mt={"5"}>
        <HStack>
          <Editable
            data-test={"editable-preview"}
            defaultValue={title}
            fontSize={"xl"}
            fontWeight={"bold"}
            placeholder={"Escribe el nombre del problema"}
            onEdit={() => setIsEditTitleActive(true)}
            onSubmit={(e) => handleTitleSubmit(e)}
            onCancel={() => setIsEditTitleActive(false)}
            width={isEditTitleActive ? "50%" : undefined}>
            <EditablePreview />
            <EditableInput data-test={"editable-input"} />
          </Editable>

          <span>
            <AiFillEdit />
          </span>

          <Spacer />
          <Button
            leftIcon={<TriangleDownIcon />}
            size={"sm"}
            onClick={onOpenLoad}>
            Cargar Problema{" "}
          </Button>

          <Button
            leftIcon={<DownloadIcon />}
            size={"sm"}
            colorScheme={"blue"}
            onClick={() => handleGenerateProblem()}>
            Generar Problema
          </Button>

          <Button
            leftIcon={<AddIcon />}
            size={"sm"}
            colorScheme={"orange"}
            onClick={onOpen}>
            Nuevo Problema
          </Button>

          {/* <LoadProblem isOpen={isOpenLoad} onClose={onCloseLoad} /> */}

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
                  onClick={() => createNewProblem()}>
                  Sí
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </HStack>
      </Box>
    </Container>
  );
};

export default Header;
