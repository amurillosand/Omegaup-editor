import * as React from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";

import ReactMde from "react-mde";
import CodeEditor from "../../components/CodeEditor";
import SadSloth from "../../components/SadSloth";

import { parse } from "../../libs/markdown/parser";
import "../../libs/markdown/editorStyles/react-mde-all.css";
import "../../libs/aceStyles/darkTheme.css";

import { fileToString } from "../../libs/other/toString"
import informationFile from "./information.txt"

import { useAppContext } from "../../AppContext"
import { useRef, useState } from "react";

const GeneratorWindow = () => {
  // TODO: Bloquear mi Random en el código (?)

  const { generator, setGenerator } = useAppContext();

  const editorHeight = 695;
  const [showCode, setShowCode] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  const divRef = useRef(null);
  fileToString(informationFile, (data) => {
    divRef.current.innerHTML = parse(data);
  });

  const showCodeRef = useRef(null);
  const showExplanationRef = useRef(null);

  const style = useColorModeValue("light", "dark");

  React.useEffect(() => {
    document.addEventListener("keyup", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, []);

  function handleKeyPress(key) {
    if (key.ctrlKey) {
      if (key.which === 72 && showCodeRef.current !== null) {
        showCodeRef.current.click();
      }
      if (key.which === 77 && showExplanationRef.current !== null) {
        showExplanationRef.current.click();
      }
    }
  }

  return (
    <>
      <Flex>
        {showCode && (
          <Box w={"100%"}>
            {/* <Text> Código </Text> */}

            <CodeEditor
              code={generator.code}
              setCode={(newCode) => {
                setGenerator((prevState) => ({
                  ...prevState,
                  code: newCode
                }))
              }}
              language={generator.language}
              setLanguage={(newLanguage) => {
                setGenerator((prevState) => ({
                  ...prevState,
                  language: newLanguage,
                }))
              }}
              height={editorHeight}
            />
          </Box>
        )}

        {showExplanation && (
          <Box ml={5} w={showCode ? "50%" : "100%"}>
            {/* <Text> Explicación de uso </Text> */}
            
            <Box
              ref={divRef}
              className={style + " markdown"}
            />
          </Box>
        )}
      </Flex>

      {!showExplanation && !showCode && (
        <SadSloth />
      )}

      <Box pos={"fixed"} zIndex={5} left={3} bottom={5}>
        <VStack>
          <Button
            ref={showCodeRef}
            size={"sm"}
            colorScheme={"twitter"}
            width={"200px"}
            onClick={() => setShowCode(!showCode)}
          >
            <HStack>
              <Text> {showCode ? "Ocultar código" : "Mostrar código"}</Text>
              <Text fontSize={"smaller"} opacity={"0.5"}>
                Ctrl + H
              </Text>
            </HStack>
          </Button>

          <Button
            ref={showExplanationRef}
            colorScheme={"blue"}
            size={"sm"}
            width={"200px"}
            onClick={() => setShowExplanation(!showExplanation)}
          >
            <HStack>
              <Text>
                {showExplanation ? "Ocultar como usarlo" : "Mostrar como usarlo"}
              </Text>
              <Text fontSize={"smaller"} opacity={"0.5"}>
                Ctrl + M
              </Text>
            </HStack>
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default GeneratorWindow;
