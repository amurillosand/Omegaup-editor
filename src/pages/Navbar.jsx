import React from "react";
import { Box, Spacer, Flex, Image, Container, useColorModeValue, Text, Tooltip, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";

import dark from "../assets/images/logoDark.png";
import light from "../assets/images/logoLight.png";
import OtherTools from "./OtherTool";
import MoreExamples from "./MoreExamples";

const Navbar = () => {
  const logo = useColorModeValue(light, dark);

  return (
    <Box boxShadow={"md"}>
      <Container maxW={"container.xl"}>
        <Flex align={"center"} height={"38px"}>
          <Box w={"86px"}>
            <a href="/#/">
              <Image w={"100px"} src={logo} />
            </a>
          </Box>

          <Spacer />

          <Box>
            <MoreExamples />
          </Box>

          <Box>
            <OtherTools />
          </Box>

          <Box>
            <ColorModeSwitcher />
          </Box>

        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
