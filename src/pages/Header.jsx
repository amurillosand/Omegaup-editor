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

  useToast,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { AddIcon, DownloadIcon, TriangleDownIcon } from "@chakra-ui/icons";

import { generateProblem } from "../libs/download/generateProblem";
import { useAppContext } from "../App";
import UploadProblem from "../libs/modals/upload/UploadProblem";
import CreateNewProblem from "../libs/modals/create/CreateNewProblem";
import { asyncTimeout } from "../libs/other/asyncFunctions";

const Header = () => {
  const { title, setTitle, sortGroups } = useAppContext();
  const data = useAppContext();
  const toast = useToast();

  const [isEditTitleActive, setIsEditTitleActive] = React.useState(false);

  const createNewProblem = useDisclosure();
  const uploadProblem = useDisclosure();

  const cancelRef = React.useRef(null);

  function handleTitleSubmit(newTitle) {
    setIsEditTitleActive(false);
    setTitle(newTitle);
  }

  function handleCreateNewProblem() {
    window.location.reload();
  }

  const toastId = React.useRef(null);

  function handleGenerateProblem(e) {
    e.preventDefault();

    toast.closeAll();

    toastId.current = toast({
      title: `Generando problema`,
      description: "Revisando que todo esté completo...",
      status: "success",
      duration: null,
    });

    function updateProblemStatus(newContent) {
      toast.update(toastId.current, {
        duration: null,
        ...newContent,
      });
    };

    generateProblem(data, toast, updateProblemStatus);
  }

  async function handleUploadProblem() {
    await asyncTimeout(() => {
      sortGroups();
      uploadProblem.onClose();
    }, 1000);
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
            onClick={uploadProblem.onOpen}>
            Cargar problema
          </Button>

          <Button
            leftIcon={<DownloadIcon />}
            size={"sm"}
            colorScheme={"blue"}
            onClick={(e) => handleGenerateProblem(e)}>
            Generar problema
          </Button>

          <Button
            leftIcon={<AddIcon />}
            size={"sm"}
            colorScheme={"orange"}
            onClick={createNewProblem.onOpen}>
            Nuevo problema
          </Button>

          <UploadProblem
            isOpen={uploadProblem.isOpen}
            onClose={uploadProblem.onClose}
            handleUploadProblem={handleUploadProblem} />

          <CreateNewProblem
            cancelRef={cancelRef}
            isOpen={createNewProblem.isOpen}
            onClose={createNewProblem.onClose}
            handleCreateNewProblem={handleCreateNewProblem} />
        </HStack>
      </Box>
    </Container>
  );
};

export default Header;
