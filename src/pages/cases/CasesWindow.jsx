import React from "react";
import {
  HStack,
  Flex,
  Box,
  Button,
  Text,
  IconButton,
  Center,
  Tooltip,
  Divider,
  VStack,
  Input,
} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";
import { ChevronUpIcon, UpDownIcon } from "@chakra-ui/icons";

import SadSlot from "../../components/SadSloth";
import SelectACaseSloth from "../../components/SelectACaseSloth";
import SidebarWindow from "./sidebar/SidebarWindow";
import TopBar from "./TopBar";
import TextArea from "./TextArea";
import { useAppContext } from "../../App";

const CaseContext = React.createContext(null);

export function useCaseContext() {
  return React.useContext(CaseContext);
}

const CasesWindow = () => {
  const { groups } = useAppContext();
  const [showOutput, setShowOutput] = useState(true);
  const [showInput, setShowInput] = useState(true);

  const [selected, setSelected] = useState({
    caseId: null,
    name: "None",
    groupId: null,
    points: 0,
    defined: false,
    input: "",
    output: "",
  });

  const addCaseRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", (key) => handleKeyPress(key));
    return () => {
      document.removeEventListener("keydown", (key) => handleKeyPress(key));
    };
  }, []);

  function handleKeyPress(key) {
    if (key.ctrlKey) {
      if (key.which === 73) {
        setShowInput(prevShowInput => !prevShowInput);
      }
      if (key.which === 79) {
        setShowOutput(prevShowOutput => !prevShowOutput);
      }
    }
  }

  return (
    <CaseContext.Provider value={{ selected, setSelected }}>
      <Flex>
        <Box w={"30%"}>
          <SidebarWindow addRef={addCaseRef} />
        </Box>

        <Box w={"100%"} h={"100%"}>
          {selected.caseId === null ? (
            <SelectACaseSloth />
          ) : (
            <div>
              <TopBar />
              <Divider mb={5} />

              {(!showInput && !showOutput) && (
                <SadSlot />
              )}

              <HStack w={"100%"}>
                {showInput && (
                  <TextArea description={"Entrada"} value={selected.input} />
                )}
                {showOutput && (
                  <TextArea description={"Salida"} value={selected.output} />
                )}
              </HStack>
            </div>
          )}
        </Box>

      </Flex>

      <VStack pos={"fixed"} zIndex={5} right={10} bottom={5}>
        <Button
          disabled={selected.caseId === null || selected.groupId === null}
          size={"sm"}
          colorScheme={"twitter"}
          onClick={() => setShowInput(prevShowInput => !prevShowInput)}>
          <HStack>
            <Text> {showInput ? "Ocultar entrada" : "Mostrar entrada"}</Text>
            <Text fontSize={"smaller"} opacity={"0.5"}>
              Ctrl + I
            </Text>
          </HStack>
        </Button>

        <Button
          disabled={selected.caseId === null || selected.groupId === null}
          size={"sm"}
          colorScheme={"blue"}
          onClick={() => setShowOutput(prevShowOutput => !prevShowOutput)}>
          <HStack>
            <Text> {showOutput ? "Ocultar salida" : "Mostrar salida"}</Text>
            <Text fontSize={"smaller"} opacity={"0.5"}>
              Ctrl + O
            </Text>
          </HStack>
        </Button>
      </VStack>
    </CaseContext.Provider >
  );
};

export default CasesWindow;
