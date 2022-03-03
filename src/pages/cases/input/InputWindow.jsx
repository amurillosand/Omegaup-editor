import React from "react";
import { Box, Center, Divider, Image, Text, VStack, Input } from "@chakra-ui/react";

import TopBar from "./TopBar";

import sloth from "../../../assets/images/sloth.png";

import { useCaseContext } from "../CasesWindow";

const InputWindow = () => {
  const { selected } = useCaseContext();
  console.log(selected);

  return (
    <Box w={"100%"} h={"100%"}>
      {selected.caseId === null ? (
        <Center h="60vh">
          <VStack>
            <Box w={"300px"} h={"300px"}>
              <Image src={sloth} w={"full"} />
            </Box>
            <Text fontWeight={"bold"}> Selecciona un caso para empezar</Text>
            <Box fontSize={9}>
              <a href="https://www.freepik.com/vectors/tree">
                Tree vector created by pch.vector - www.freepik.com
              </a>
            </Box>
          </VStack>
        </Center>
      ) : (
        <div>
          <TopBar />
          <Divider mb={4} />

          <Input>
            {selected.input}
          </Input>

        </div>
      )}
    </Box>
  );
};
export default InputWindow;
