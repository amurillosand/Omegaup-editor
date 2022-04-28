import React, { useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import ReactSelectDark from "../../../components/ReactSelectDark"

import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { useAppContext } from "../../../App";

const AddCase = (props) => {
  const { onClose } = props;
  const { groups, addCase, maxPointsAvailable } = useAppContext();
  const [autoPoints, setAutoPoints] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState(undefined);
  const [hasGroup, setHasGroup] = useState(false);

  const caseNameRef = useRef("");
  const numberOfCasesRef = useRef(1);
  const pointsRef = useRef(0);
  const pointsDefinedRef = useRef(false);

  const toast = useToast();
  const darkTheme = useColorModeValue(false, true);

  let options = groups.map((groupElement) => {
    return {
      value: groupElement.groupId,
      label: groupElement.name,
    };
  });

  function handleSubmit(e) {
    e.preventDefault();

    const validName = caseNameRef.current.replaceAll(" ", "_");

    const selectedGroup = groups.find(group => group.groupId == selectedGroupId);
    const points = pointsRef.current / numberOfCasesRef.current;

    if (numberOfCasesRef.current == 1) {
      const caseExists = selectedGroup.cases.find(
        (caseElement) => caseElement.name === validName
      );

      if (caseExists === undefined) {
        addCase({
          caseId: uuid(),
          name: validName,
          groupId: selectedGroupId,
          points: pointsRef.current,
          defined: pointsDefinedRef.current,
          input: "",
          output: "",
        });
      } else {
        toast({
          title: "Error al crear caso",
          description: "No puedes tener casos con el mismo nombre en un mismo grupo",
          status: "error",
          isClosable: true,
        });
        return;
      }
    } else {
      if (selectedGroupId !== undefined) {
        let caseNumber = 0;
        for (let i = 0; i < numberOfCasesRef.current; i++) {
          do {
            caseNumber++;
            const name = validName + caseNumber;
            const caseExists = selectedGroup.cases.find(
              (caseElement) => caseElement.name === name
            );

            if (caseExists === undefined) {
              addCase({
                caseId: uuid(),
                name: name,
                groupId: selectedGroupId,
                points: pointsDefinedRef.current ? points : 0,
                defined: pointsDefinedRef.current,
                input: "",
                output: "",
              });
              break;
            }
          } while (true);
        }
      }
    }

    onClose();
  }

  function handleSelectGroupId(event) {
    setSelectedGroupId(event.value);
    setHasGroup(event.value !== options[0].value);
  }

  const [maxPoints, setMaxPoints] = useState(maxPointsAvailable(groups));

  useEffect(() => {
    setMaxPoints(Math.min(100, maxPointsAvailable(groups).maxPoints));
  }, [pointsRef.current]);

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <FormControl mt={3}>
        <FormLabel> Nombre del caso </FormLabel>
        <Input onChange={(e) => (caseNameRef.current = e.target.value)} />
        <FormHelperText> Sin espacios</FormHelperText>
      </FormControl>

      <FormControl mt={5} isRequired>
        <FormLabel> Grupo </FormLabel>
        <ReactSelectDark
          onChange={handleSelectGroupId}
          value={options.find((obj) => obj.value === selectedGroupId)}
          options={options}
          darkTheme={darkTheme} />
      </FormControl>

      {!hasGroup && (
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
            max={maxPoints}
            isDisabled={autoPoints}>
            <NumberInputField />
          </NumberInput>

          {autoPoints && (
            <FormHelperText>
              El programa calculará automáticamente el puntaje
            </FormHelperText>
          )}
        </FormControl>
      )}

      <FormControl mt={5} isRequired>
        <FormLabel> Número de casos </FormLabel>
        <NumberInput
          onChange={(e, valueAsNumber) => (numberOfCasesRef.current = valueAsNumber)}
          min={1}
          max={25}>
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <Button
        colorScheme="green"
        isFullWidth
        mt={10}
        type="submit">
        Agregar casos
      </Button>
    </form>
  );
};

export default AddCase;
