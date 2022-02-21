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
} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";
import { ChevronUpIcon, UpDownIcon } from "@chakra-ui/icons";

import SidebarWindow from "./sidebar/SidebarWindow";
// import InputWindow from "./input/InputWindow";
// import OutWindow from "./output/OutWindow";

const CasesWindow = () => {
  const [showOut, setShowOut] = useState(false);
  const [selected, setSelected] = useState({
    caseId: 0,

  });

  const showOutRef = useRef(null);
  const addCaseRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", (key) => handleKeyPress(key));
    return () => {
      document.removeEventListener("keydown", (key) => handleKeyPress(key));
    };
  }, []);

  function handleKeyPress(key) {
    if (key.ctrlKey) {
      if (key.which === 72 && showOutRef.current !== null) {
        showOutRef.current.click();
      }
      if (key.which === 65 && addCaseRef.current !== null) {
        addCaseRef.current.click(); // A
      }
    }
  }

  function handleGoUp() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  return (
    <>
      <Flex>
        <Box w={"30%"}>
          <SidebarWindow addRef={addCaseRef} />
        </Box>

        {/* <HStack w={"100%"}>
          <InputWindow />
          {!(selected.caseId === "None" || selected.caseId === "None") &&
            showOut && <OutWindow />}
        </HStack> */}
      </Flex>
      {/* 
      <HStack pos={"fixed"} right={10} bottom={5}>
        <Tooltip label={"Ir hacia arriba | Ctrl + T"} mr={2}>
          <IconButton
            onClick={() => handleGoUp()}
            aria-label={"Go-up"}
            icon={<ChevronUpIcon />}
            size={"sm"}
          />
        </Tooltip>

        <Button
          disabled={selected.caseId === "None" || selected.caseId === "None"}
          ref={showOutRef}
          size={"sm"}
          colorScheme={"green"}
        // onClick={() => tabIndex === 2 && setShowOut(!showOut)}
        >
          <HStack>
            <Text> {showOut ? "Ocultar Salida" : "Mostrar Salida"}</Text>
            <Text fontSize={"smaller"} opacity={"0.5"}>
              Ctrl + H
            </Text>
          </HStack>
        </Button>
      </HStack> */}
    </>
  );
};

export default CasesWindow;
