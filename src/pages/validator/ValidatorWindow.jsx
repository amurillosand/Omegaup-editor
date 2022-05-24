import React from "react";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Spacer,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";

import CodeEditor from "../../components/CodeEditor"
import { useAppContext } from "../../App";

const ValidatorWindow = () => {
  const {
    needsValidator, setNeedsValidator,
    validator, setValidator,
    generatorError } = useAppContext();

  return (
    <Flex w={"100%"}>
      <VStack w={"100%"}>
        <Box w={"100%"}>
          <Text>
            El validador es utilizado cuando el concursante puede dar cualquier respuesta, para esto se comprueba que la respuesta sea válida y se le asigna un porcentaje entre 0 y 1.
          </Text>

          <FormControl mb={5} mt={5} isRequired>
            <FormLabel>
              ¿Este problema necesita validador?
            </FormLabel>

            <Checkbox
              ml={10}
              isChecked={needsValidator}
              onChange={() => setNeedsValidator(!needsValidator)}>
              <Text>
                {needsValidator ? "Sí necesita" : "No necesita"}
              </Text>
            </Checkbox>
          </FormControl>

          <CodeEditor
            hidden={!needsValidator}
            error={generatorError}
            code={validator.code}
            setCode={(newCode) => {
              setValidator((prevState) => ({
                ...prevState,
                code: newCode
              }))
            }}
            language={validator.language}
            setLanguage={(newLanguage) => {
              setValidator((prevState) => ({
                ...prevState,
                language: newLanguage,
              }))
            }}
            height={695}
          />

        </Box>
      </VStack>
    </Flex >
  );
};

export default ValidatorWindow;
