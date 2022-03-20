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

import CodeEditor from "../../components/CodeEditor"
import "../../libs/markdown/editorStyles/react-mde-all.css"
import "../../libs/aceStyles/darkTheme.css";
import SadSloth from "../../components/SadSloth";

import ReactMde from "react-mde";
import { useRef, useState, useEffect } from "react";
import { useAppContext } from "../../App";

const SolutionWindow = () => {
  const { solution, setSolution } = useAppContext();

  const [editorHeight, setEditorHeight] = useState(695);
  const [showCode, setShowCode] = useState(true);
  const [showSolution, setShowSolution] = useState(true);

  const mdEditorRef = useRef(null);
  const showCodeRef = useRef(null);
  const showSolutionRef = useRef(null);

  const style = useColorModeValue("light", "dark");

  useEffect(() => {
    handleResize();
    document.addEventListener("keyup", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, []);

  function handleResize() {
    if (mdEditorRef.current !== null) {
      setEditorHeight(
        mdEditorRef.current.finalRefs.textarea.current.scrollHeight
      );
    }
  }

  function handleKeyPress(key) {
    if (key.ctrlKey && key.which === 72 && showCodeRef.current !== null) {
      showCodeRef.current.click();
    }
    if (key.ctrlKey && key.which === 77 && showSolutionRef.current !== null) {
      showSolutionRef.current.click();
    }
  }

  return (
    <>
      <Flex>
        {showCode && (
          <Box w={"100%"}>
            {/* <Text> Código </Text> */}

            <CodeEditor
              code={solution.code}
              setCode={(newCode) => {
                setSolution((prevState) => ({
                  ...prevState,
                  code: newCode
                }))
              }}
              language={solution.language}
              setLanguage={(newLanguage) => {
                setSolution((prevState) => ({
                  ...prevState,
                  language: newLanguage,
                }))
              }}
              height={editorHeight}
            />
          </Box>
        )}

        {showSolution && (
          <Box ml={5} w={"100%"}>
            {/* <Text> Redacción </Text> */}

            <Box className={style}>
              <ReactMde
                ref={mdEditorRef}
                value={solution.text}
                minEditorHeight={editorHeight}
                minPreviewHeight={editorHeight}
                onChange={(newText) => {
                  setSolution((prevState) => ({
                    ...prevState,
                    text: newText
                  }))
                }}
              />{" "}
            </Box>
          </Box>
        )}
      </Flex>

      {!showSolution && !showCode && (
        <SadSloth />
      )}

      <Box pos={"fixed"} zIndex={5} left={3} bottom={5}>
        <VStack>
          <Button
            data-test={"show-code"}
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
            data-test={"show-solution"}
            ref={showSolutionRef}
            colorScheme={"blue"}
            size={"sm"}
            width={"200px"}
            onClick={() => setShowSolution(!showSolution)}
          >
            <HStack>
              <Text>
                {showSolution ? "Ocultar redacción" : "Mostrar redacción"}
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

export default SolutionWindow;
