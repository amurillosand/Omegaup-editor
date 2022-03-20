import * as React from "react";

import {
  Box,
  Center,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import sloth from "../assets/images/sloth.png";

const SelectACaseSloth = () => {
  return (
    <>
      <Center h="60vh">
        <VStack>
          <Center w={"300px"} h={"300px"}>
            <Image src={sloth} w={"full"} />
          </Center>
          <Text fontWeight={"bold"}> Selecciona un caso para empezar</Text>
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

export default SelectACaseSloth;