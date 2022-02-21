import * as React from "react";

import {
  Box,
  Center,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import sloth from "../assets/images/sadSloth.png";

const SadSloth = () => {
  return (
    <>
      <Center h="60vh">
        <VStack>
          <Center w={"300px"} h={"300px"}>
            <Image src={sloth} w={"50%"} />
          </Center>
          <Text fontWeight={"bold"}> No ocultes todo :(</Text>
          <Box fontSize={9}>
            <a href="https://www.freepik.com/vectors/tree">
              Tree vector created by pch.vector - www.freepik.com
            </a>
          </Box>
        </VStack>
      </Center>
    </>
  );
};

export default SadSloth;