import * as React from "react";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  toast,
  useToast,
  Button,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { useAppContext } from "../../../AppContext";

const AddGroup = (props) => {
  const { onClose } = props;
  const { groups, addGroup } = useAppContext();
  const [autoPoints, setAutoPoints] = useState(true);

  const groupNameRef = useRef("");
  const pointsRef = useRef(0);
  const pointsDefinedRef = useRef(false);
  const numberOfCasesRef = useRef(1);

  const toast = useToast();

  function handleSubmit(e) {
    e.preventDefault();

    const validName = groupNameRef.current.replaceAll(" ", "_");

    let isValid = true;
    groups.forEach((groupElement) => {
      if (groupElement.name === validName) {
        isValid = false;
        return;
      }
    });

    if (!isValid) {
      toast({
        title: "Error al crear grupo",
        description: "No puedes tener grupos con el mismo nombre",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const groupId = uuid();

    const cases = [];
    for (let numOfCase = 1; numOfCase <= numberOfCasesRef.current; numOfCase++) {
      cases.push({
        caseId: uuid(),
        name: numOfCase.toString(),
        groupId: groupId,
        points: 0,
        defined: false,
        input: "",
        output: "",
      });
    }

    addGroup({
      groupId: groupId,
      name: validName,
      points: pointsRef.current,
      defined: pointsDefinedRef.current,
      cases: cases,
    });

    onClose();
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <FormControl mt={3} isRequired>
        <FormLabel> Nombre del grupo </FormLabel>
        <Input onChange={(e) => (groupNameRef.current = e.target.value)} />
        <FormHelperText> Sin espacios. </FormHelperText>
      </FormControl>

      <FormControl mt={5}>
        <Checkbox
          mt={3}
          isChecked={autoPoints}
          onChange={() => {
            setAutoPoints(!autoPoints);
            pointsDefinedRef.current = autoPoints;
          }}>
          <FormLabel mt={2}> {autoPoints ? "Puntaje automático" : "Puntaje"} </FormLabel>
        </Checkbox>

        <NumberInput
          onChange={(e, valueAsNumber) => (pointsRef.current = valueAsNumber)}
          min={0}
          max={100}
          isDisabled={autoPoints}>
          <NumberInputField />
        </NumberInput>

        {autoPoints && (
          <FormHelperText>
            El programa calculará automáticamente el puntaje.
          </FormHelperText>
        )}
      </FormControl>

      <FormControl mt={5} isRequired>
        <FormLabel> Número de casos </FormLabel>
        <NumberInput
          onChange={(e, valueAsNumber) => (numberOfCasesRef.current = valueAsNumber)}
          min={1}>
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <Button
        colorScheme="green"
        isFullWidth
        mt={10}
        type="submit">
        Agregar grupo
      </Button>
    </form>
  );
};

export default AddGroup;