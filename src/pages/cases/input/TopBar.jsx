import * as React from "react";
import {
  HStack,
  Text,
  Spacer,
  Button,
  useDisclosure,
  Box
} from "@chakra-ui/react";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

import EraseCase from "../../../libs/modals/erase/EraseCase";
import EditCase from "../../../libs/modals/edit/EditCase";
import { useCaseContext } from "../CasesWindow";
import { useAppContext } from "../../../AppContext";

const TopBar = () => {
  const { groups } = useAppContext();
  const { selected } = useCaseContext();

  const editCase = useDisclosure();
  const eraseCase = useDisclosure();

  console.log(selected);

  const selectedGroup = groups.find((group) => group.groupId === selected.groupId);

  return (
    <Box mb={2}>
      <HStack h={"20%"} w={"100%"} pl={5}>
        <Text fontWeight={"bold"} fontSize={20}>
          {selected.name}
        </Text>

        <h2> ({selectedGroup.name}) </h2>

        <Spacer />

        <Button
          leftIcon={<EditIcon />}
          size={"sm"}
          onClick={editCase.onOpen}>
          Editar caso
        </Button>

        <Button
          leftIcon={<DeleteIcon />}
          size={"sm"}
          onClick={eraseCase.onOpen}>
          Eliminar caso
        </Button>
      </HStack>

      {/* <EditCase
        isOpen={editCase.isOpen}
        onClose={editCase.onClose} /> */}

      <EraseCase
        isOpen={eraseCase.isOpen}
        onClose={eraseCase.onClose} />
    </Box>
  );
};

export default TopBar;
