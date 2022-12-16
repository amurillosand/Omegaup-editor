import React from "react"

import { GrGraphQl as GraphIcon } from "react-icons/gr";
import { FaDrawPolygon as GeometryIcon } from "react-icons/fa";
import { BsGrid1X2 as GridIcon } from "react-icons/bs";
import { FaTools as Tools } from "react-icons/fa"

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";

export default function OtherTools() {
  return (
    <>
      <Menu>
        <Tooltip label={"Más herramientas"}>
          <MenuButton
            as={IconButton}
            icon={<Tools />}
            variant="ghost" />
        </Tooltip>

        <MenuList>
          <MenuItem
            icon={<GraphIcon />}
            as="a"
            href="https://graph-editor-abraham-murillo.netlify.app/">
            Graph editor
          </MenuItem>

          <MenuItem
            icon={<GeometryIcon />}
            as="a"
            href="https://geometry-editor-abraham-murillo.netlify.app/">
            Geometry editor
          </MenuItem>

          <MenuItem
            icon={<GridIcon />}
            as="a"
            href="https://golovanov399.github.io/grid/rect_grid_draw.htm">
            Grid editor
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
