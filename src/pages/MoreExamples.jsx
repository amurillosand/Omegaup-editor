import React from "react"

import { BiHelpCircle as Help } from "react-icons/bi";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";

import { useAppContext } from "../App";

export default function MoreExamples() {
  const {
    loadArraySumProblem,
    loadHideAndSeekProblem,
    loadPalindromicityProblem
  } = useAppContext();

  return (
    <>
      <Menu>
        <Tooltip label={"Más ejemplos"}>
          <MenuButton
            as={IconButton}
            icon={<Help />}
            variant="ghost" />
        </Tooltip>

        <MenuList>
          <MenuItem
            as="button"
            onClick={loadArraySumProblem}>
            Suma de un arreglo
          </MenuItem>

          <MenuItem
            as="button"
            onClick={loadHideAndSeekProblem}>
            Escondidas
          </MenuItem>

          <MenuItem
            as="button"
            onClick={loadPalindromicityProblem}>
            Creando palíndromos
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
