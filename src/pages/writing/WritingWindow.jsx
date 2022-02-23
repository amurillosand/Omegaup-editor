import * as React from "react";
import { useEffect, useRef, useState } from "react";
import "katex/dist/katex.min.css";
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  Tab,
  TabList,
  Tabs,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"; // `rehype-katex` does not import the CSS for you

import { parse } from "../../libs/markdown/parser";
import "../../libs/aceStyles/darkTheme.css";
import "../../libs/markdown/markdownStyles/MarkdownDark.css";
import "../../libs/markdown/markdownStyles/MarkdownLight.css";
import "../../libs/markdown/markdownStyles/Markdown.css";
import "../../libs/markdown/editorStyles/react-mde-all.css";
// @ts-ignore
import markdownMath from "markdown-it-texmath";
// @ts-ignore
import katex from "katex";

import ReactMde from "react-mde";
import { useAppContext } from "../../AppContext";

const WritingWindow = () => {
  const { writing, setWriting } = useAppContext();
  const style = useColorModeValue("light", "dark");

  const [showEditor, setShowEditor] = useState(true);

  const divRef = useRef(null);
  const generateRef = useRef(null);
  const hideRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", (key) => handleKeyPress(key));
    return () => {
      document.removeEventListener("keydown", (key) => handleKeyPress(key));
    };
  }, []);

  useEffect(() => {
    if (divRef.current !== null && writing !== undefined) {
      divRef.current.innerHTML = parse(writing);
    }
  }, [writing]);

  function handleKeyPress(key) {
    if (key.ctrlKey) {
      if (key.which === 83 && generateRef.current !== null) {
        generateRef.current.click();
      }
      if (key.which === 72 && hideRef.current !== null) {
        hideRef.current.click();
        hideRef.current.focus();
      }
    }
  }

  function handleToggleEditor() {
    setShowEditor(!showEditor);
  }

  return (
    <>
      <Flex direction={"column"} w={"100%"}>
        <Flex>
          {showEditor && (
            <Box className={style}>
              {/* <Text> Editor </Text> */}

              <ReactMde value={writing} onChange={setWriting} />
            </Box>
          )}
          <Box ml={5} w={showEditor ? "50%" : "100%"}>
            {/* <Text> Texto </Text> */}

            <Box
              ref={divRef}
              className={style + " markdown"}
            />
          </Box>
        </Flex>
      </Flex>

      <Box pos={"fixed"} left={3} bottom={5}>
        <Button
          ref={hideRef}
          size={"sm"}
          width={"200px"}
          colorScheme={"twitter"}
          onClick={() => handleToggleEditor()}
        >
          <HStack>
            <Text> {showEditor ? "Ocultar editor" : "Mostrar editor"} </Text>
            <Text fontSize={"smaller"} opacity={"0.5"}>
              Ctrl + H
            </Text>
          </HStack>
        </Button>
      </Box>
    </>
  );
};

export default WritingWindow;
