import React from "react";
import {
  Box,
  Button,
  Center,
  Code,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import { AiFillFileZip } from "react-icons/all";
import { DeleteIcon } from "@chakra-ui/icons";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { useAppContext } from "../../../App";

import JSZip from "jszip";

function reverse(str) {
  return str.split("").reverse().join("");
}

function splitFilename(filename) {
  const lastPeriod = filename.lastIndexOf('.');
  const lastSlash = filename.lastIndexOf('/');
  let lastFolder = "";
  for (let i = lastSlash - 1; i >= 0; i--) {
    if (filename[i] === '/')
      break;
    lastFolder += filename[i];
  }

  let name = filename.substring(lastSlash + 1, lastPeriod === -1 ? filename.length : lastPeriod);
  let extension = filename.substring(lastPeriod + 1, filename.length);

  if (lastPeriod === -1) {
    extension = null;
  }

  return {
    name,
    extension,
    lastFolder: reverse(lastFolder)
  };
}

function splitTestCase(name) {
  let lastPeriod = name.lastIndexOf('.');
  const groupName = name.substring(0, lastPeriod);
  const caseName = name.substring(lastPeriod + 1, name.length);
  return ({
    groupName,
    caseName
  });
}

function extractTestPlan(testPlan) {
  testPlan = testPlan.split("\n");
  const groupPoints = new Map();
  for (let line of testPlan) {
    line = line.split(" ");
    let testCase = line[0];
    let points = line[1];

    const { groupName, caseName } = splitTestCase(testCase);
    if (points > 0) {
      groupPoints.set(groupName, points);
    }
  }

  console.log(groupPoints);

  return [];
}

const UploadProblem = (props) => {
  const { isOpen, onClose } = props;
  const {
    setGenerator, setSolution, setWriting,
    createCase, createGroup,
    addGroup, addCase,
    editCase, editGroup,
    sortGroups
  } = useAppContext();

  const [isUploading, setIsUploading] = useState(false);
  const [, forceRender] = useState({});

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: [".zip"],
    maxFiles: 1,
  });

  const outlineColor = useColorModeValue("rgba(0,0,0,0.5)", "white");

  function deleteFile() {
    acceptedFiles.length = 0;
    forceRender({});
  }

  async function handleUploadFile() {
    setIsUploading(true);

    await JSZip.loadAsync(acceptedFiles[0]).then((zip) => {
      const groups = new Map();
      const groupIdToName = new Map();
      const cases = new Map();

      Object.keys(zip.files).forEach((filename) => {
        zip.files[filename].async('string').then((fileData) => {
          filename = filename.trim();
          if (filename.startsWith(".") || filename.startsWith("_")) {
            // Trash files
            return;
          }

          const { name, extension, lastFolder } = splitFilename(filename);
          if (extension === null && name !== "testplan") {
            return;
          }

          if (lastFolder.startsWith("statements")) {
            // (es/en).markdown
            if (extension === "markdown") {
              setWriting(fileData);
            }
          } else if (lastFolder.startsWith("solutions")) {
            if (extension === "markdown") {
              setSolution((prevState) => ({
                ...prevState,
                text: fileData
              }));
            } else if (name === "solution") {
              setSolution((prevState) => ({
                ...prevState,
                code: fileData,
                language: extension
              }));
            } else if (name === "generator") {
              setGenerator({
                code: fileData,
                language: extension
              });
            }
          } else if (lastFolder.startsWith("cases")) {
            // a.in
            // a.1.in
            const { groupName, caseName } = splitTestCase(name);
            if (groupName.length === 0) {
              return;
            }

            if (!groups.has(groupName)) {
              const groupData = createGroup(groupName);
              groups.set(groupName, groupData);
              groupIdToName.set(groupData.groupId, groupName);
              addGroup(groupData);
            }

            if (!cases.has(name)) {
              const caseData = createCase(caseName, groups.get(groupName).groupId);
              cases.set(name, caseData);
              addCase(caseData);
            }

            const caseData = cases.get(name);
            if (extension === "in") {
              editCase({
                groupId: caseData.groupId,
                caseId: caseData.caseId,
                input: fileData
              });
            } else if (extension === "out") {
              editCase({
                groupId: caseData.groupId,
                caseId: caseData.caseId,
                output: fileData
              });
            }
          } else if (name.startsWith("testplan")) {
            console.log(fileData);
            const testPlan = extractTestPlan(fileData);
          }
        })
      })
    }).then(() => {
      setIsUploading(false);
      sortGroups();
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cargar problema</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Sube el zip completo del problema{" "}
            <Code> nombre-del-problema.zip</Code>
          </Text>
          <Box
            mt={3}
            h={"300px"}
            border={"1px dashed " + outlineColor}
            {...getRootProps()}>
            <input {...getInputProps()} />
            <Center h={"100%"}>
              <Center>
                <VStack>
                  <AiFillFileZip size={"3em"} color={outlineColor} />
                  <Text>Arrastra tu archivo aquí</Text>
                </VStack>
              </Center>
            </Center>
          </Box>
          <Box mt={2}>
            {acceptedFiles.map((file) => (
              <HStack key={file.size + file.name}>
                <p>{file.name}</p>
                <Spacer />
                <IconButton
                  icon={<DeleteIcon />}
                  onClick={() => deleteFile()}
                  aria-label={"Delete Zip"}
                />
              </HStack>
            ))}
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button variant={"ghost"} mr={3} onClick={onClose}>
            Cerrar
          </Button>

          <Button
            isLoading={isUploading}
            isDisabled={isUploading}
            colorScheme="green"
            onClick={() => handleUploadFile()}
            type={"submit"}>
            Cargar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadProblem;