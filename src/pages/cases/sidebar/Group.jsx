import React from "react";
import {
  Badge,
  Box,
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  Flex,
  MenuDivider,
} from "@chakra-ui/react";

import {
  HiOutlineDocumentRemove,
  HiOutlineDotsVertical as Dots,
} from "react-icons/hi";

import { useMediaPredicate } from "react-media-hook";

import { useState } from "react";
import { motion } from "framer-motion";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
} from "@chakra-ui/icons";

import EraseAllGroupCases from "../../../libs/modals/erase/EraseAllGroupCases";
import EraseGroup from "../../../libs/modals/erase/EraseGroup";
import EditGroup from "../../../libs/modals/edit/EditGroup";

import Case from "./Case";
import { useAppContext } from "../../../App";

const Group = (props) => {
  const { setGroups, calculatePoints } = useAppContext();
  const { name, defined, points, groupId, cases } = props;

  const [showCases, setShowCases] = useState(name === "sin_grupo");

  const isLargeScreen = useMediaPredicate("(min-width: 830px)");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const editGroup = useDisclosure();
  const eraseGroup = useDisclosure();
  const eraseAllCases = useDisclosure();

  // This is necessary because otherwise it will toggle when the user clicks on the 3-dots/ menu button
  function handleCasesToggleClick(event) {
    let percentage =
      ((event.pageX - event.currentTarget.offsetLeft) * 100) /
      event.currentTarget.clientWidth;
    if (percentage < 80) setShowCases(!showCases);
  }

  React.useEffect(() => {
    setGroups(groups => calculatePoints(groups));
  }, [editGroup.isOpen, eraseGroup.isOpen, eraseAllCases.isOpen]);

  if (name === "sin_grupo" && cases.length === 0) {
    return <></>;
  } else {
    return (
      <Flex direction={"column"}>
        <Box my={2}>
          <HStack
            mb={2}
            cursor={"pointer"}
            transition={"padding-left 0.1s"}
            _hover={{
              borderLeft: "2px",
              borderColor: `${borderColor}`,
              paddingLeft: "5px",
            }}
            onClick={(event) => handleCasesToggleClick(event)}>

            <Box>{name}</Box>

            <Spacer />

            {name !== "sin_grupo" && (
              <>
                <Tooltip
                  label={"Estos serán los puntos que obtendrá el usuario si resuelve correctamente el grupo"}>
                  <Badge colorScheme={defined ? "green" : "blue"} size={"sm"}>
                    {isLargeScreen ? (
                      <span> {parseFloat("" + points).toFixed(2) + " pts"}</span>
                    ) : (
                      <span>{points && Math.round(points)} </span>
                    )}
                  </Badge>
                </Tooltip>
              </>
            )}

            <Menu isLazy>
              <MenuButton
                as={IconButton}
                icon={<Dots />}
                size={"sm"}
                syle={{ zIndex: 99 }} />
              <MenuList>
                {name !== "sin_grupo" && (
                  <>
                    <MenuItem
                      icon={<EditIcon />}
                      fontSize={"sm"}
                      onClick={editGroup.onOpen}>
                      Editar grupo
                    </MenuItem>

                    <MenuItem
                      icon={<DeleteIcon />}
                      fontSize={"sm"}
                      onClick={eraseGroup.onOpen}>
                      Borrar grupo
                    </MenuItem>
                  </>
                )}

                <MenuItem
                  icon={<HiOutlineDocumentRemove />}
                  fontSize={"sm"}
                  onClick={eraseAllCases.onOpen}>
                  Borrar todos los casos
                </MenuItem>

                <MenuDivider />
              </MenuList>
            </Menu>

            <EditGroup
              {...props}
              isOpen={editGroup.isOpen}
              onClose={editGroup.onClose} />

            <EraseGroup
              isOpen={eraseGroup.isOpen}
              onClose={eraseGroup.onClose}
              groupId={groupId} />

            <EraseAllGroupCases
              isOpen={eraseAllCases.isOpen}
              onClose={eraseAllCases.onClose}
              groupId={groupId}
              groupName={name} />
          </HStack>
        </Box>

        <Box ml={2}>
          {cases && showCases &&
            cases.map((element) => (
              <motion.div
                className={name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: "inline-block" }}
                key={element.caseId}>
                <Case caseInfo={element} shouldShowPoints={name === "sin_grupo"} />
              </motion.div>
            ))
          }
        </Box>
      </Flex>
    );
  }
};

export default Group;
