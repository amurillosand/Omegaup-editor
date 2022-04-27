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
import { asyncTimeout } from "../../other/asyncFunctions";
import { validExtension } from "../../coding/codeLanguages"

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
  let groupName = name.substring(0, lastPeriod);
  let caseName = name.substring(lastPeriod + 1, name.length);

  if (groupName.length === 0) {
    groupName = "sin_grupo";
  }

  return ({
    groupName,
    caseName
  });
}

const UploadProblem = (props) => {
  const { isOpen, onClose, handleUploadProblem } = props;
  const {
    setGenerator, setSolution, setWriting,
    createCase, createGroup,
    addGroup, addCase,
    editCase, editGroup,
    groups
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

  async function handleUploadFile(e) {
    e.preventDefault();

    await JSZip.loadAsync(acceptedFiles[0]).then((zip) => {
      let caseNameToData = new Map();
      let groupNameToData = new Map();

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
            } else if (name === "solution" && validExtension(extension)) {
              setSolution((prevState) => ({
                ...prevState,
                code: fileData,
                language: extension
              }));
            } else if (name === "generator" && validExtension(extension)) {
              setGenerator({
                code: fileData,
                language: extension
              });
            }
          } else if (lastFolder.startsWith("cases")) {
            // a.in
            // a.1.in
            const { groupName, caseName } = splitTestCase(name);

            let groupData = groupNameToData.get(groupName);

            let caseData = null;
            if (!caseNameToData.has(name)) {
              caseData = createCase({ name: caseName, groupId: groupData.groupId });
              caseNameToData.set(name, caseData);
              addCase(caseData);
            } else {
              caseData = caseNameToData.get(name);
            }

            if (extension === "in") {
              caseData.input = fileData;
            } else if (extension === "out") {
              caseData.output = fileData;
            }


            caseNameToData.set(name, caseData);
            editCase(caseData);

          } else if (name.startsWith("testplan")) {
            let testPlan = fileData.split("\n");
            let groupNameToPoints = new Map();
            for (let line of testPlan) {
              line = line.split(" ");
              if (line.length === 2) {
                let testCase = line[0];
                let points = parseInt(line[1]);

                const { groupName, caseName } = splitTestCase(testCase);

                if (groupNameToPoints.has(groupName))
                  points += parseInt(groupNameToPoints.get(groupName));

                groupNameToPoints.set(groupName, points);
              }
            }


            groupNameToPoints.forEach((points, groupName) => {
              if (groupName === "sin_grupo") {
                let groupData = groups[0];
                groupNameToData.set(groupName, groupData);
                editGroup({
                  groupdId: groupData.groupId,
                  points: points,
                  defined: true,
                });
              } else {
                let groupData = createGroup({ name: groupName, points: points });
                groupNameToData.set(groupName, groupData);
                addGroup(groupData);
              }
            });
          }
        })
      })

      console.log("Done");
    }).then(() => {
      console.log("Close");
      setIsUploading(false);
      handleUploadProblem();
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
            onClick={(e) => handleUploadFile(e)}
            type={"submit"}>
            Cargar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadProblem;