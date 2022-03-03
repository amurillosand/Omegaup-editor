import React from "react";

import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import { BsReverseLayoutTextSidebarReverse, CgLayoutList, FaUpload } from "react-icons/all";
import { motion } from "framer-motion";
import { useMediaPredicate } from "react-media-hook";
import { HiOutlineDotsVertical as Dots } from "react-icons/hi";
import { AddIcon, DownloadIcon } from "@chakra-ui/icons";

import AddContainer from "../../../libs/modals/add/AddContainer";

import Groups from "./Groups";

const SidebarWindow = (props) => {
  const { addRef } = props;

  const divBorderColor = useColorModeValue("gray.200", "gray.600");

  const add = useDisclosure();
  const isLargeScreen = useMediaPredicate("(min-width: 830px)");

  return (
    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
      <Box
        w={"100%"}
        h={"75vh"}
        borderRight={"1px"}
        borderColor={divBorderColor}>

        <Box width={"100%"}>
          <Flex align={"center"} mb={4}>
            <Text mr={5} fontSize={"xl"} fontWeight={"bold"}>
              Grupos
            </Text>

            <Spacer />

            <Tooltip label={"Ctrl + A"}>
              <Button
                ref={addRef}
                size={"sm"}
                colorScheme={"green"}
                onClick={() => add.onOpen()}
                mr={2}>
                {isLargeScreen ? <p> Agregar</p> : <p> + </p>}
              </Button>
            </Tooltip>

            <AddContainer
              isOpen={add.isOpen}
              onClose={add.onClose} />
          </Flex>

          <Divider />

          <Groups />
        </Box>
      </Box>
    </motion.div>
  );
};

export default SidebarWindow;
