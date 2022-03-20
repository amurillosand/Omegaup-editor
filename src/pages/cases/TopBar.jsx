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

import EraseCase from "../../libs/modals/erase/EraseCase";
import { useCaseContext } from "./CasesWindow";
import { useAppContext } from "../../App";

const TopBar = () => {
  const { groups } = useAppContext();
  const { selected } = useCaseContext();

  const eraseCase = useDisclosure();

  const selectedGroup = groups.find((group) => group.groupId === selected.groupId);

  return (
    <Box mb={2}>
      <HStack h={"20%"} w={"100%"} pl={5}>
        <Text fontWeight={"bold"} fontSize={20}>
          {selected.name}
        </Text>

        <h1> ({selectedGroup.name}) </h1>

        <Spacer />

        <Button
          leftIcon={<DeleteIcon />}
          size={"sm"}
          onClick={eraseCase.onOpen}>
          Eliminar caso
        </Button>
      </HStack>

      <EraseCase
        isOpen={eraseCase.isOpen}
        onClose={eraseCase.onClose} />
    </Box>
  );
};

export default TopBar;
