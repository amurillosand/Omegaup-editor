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
import { useAppContext } from "../../../AppContext";

const AddCase = (props) => {
  const { onClose } = props;
  const { groups, addCase, maxPointsAvailable } = useAppContext();
  const [autoPoints, setAutoPoints] = useState(true);
  const [selectedValue, setSelectedValue] = useState("");
  const [hasGroup, setHasGroup] = useState(false);

  const caseName = useRef("");
  const numberOfCases = useRef(1);
  const points = useRef(0);
  const pointsDefined = useRef(false);

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

    const validName = caseName.current.replaceAll(" ", "_");
    let selectedGroupId = selectedValue;

    if (selectedGroupId === "") {
      selectedGroupId = options[0].value;
    }

    const selectedGroup = groups.find(group => group.groupId == selectedGroupId);

    if (numberOfCases.current == 1) {
      const caseExist = selectedGroup.cases.find(
        (caseElement) => caseElement.name === validName
      );

      if (caseExist === undefined) {
        addCase({
          caseId: uuid(),
          name: validName,
          groupId: selectedGroupId,
          points: points.current,
          defined: pointsDefined.current,
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
      if (selectedGroup !== undefined) {
        let caseNumber = 0;
        for (let i = 0; i < numberOfCases.current; i++) {
          do {
            caseNumber++;
            const name = validName + caseNumber;
            const caseExist = selectedGroup.cases.find(
              (caseElement) => caseElement.name === name
            );
            if (caseExist === undefined) {
              addCase({
                caseId: uuid(),
                name: name,
                groupId: selectedGroupId,
                points: 0,
                defined: false,
              });
              break;
            }
          } while (true);
        }
      }
    }

    onClose();
  }

  function handleSelectChange(event) {
    setSelectedValue(event.value);
    setHasGroup(event.value !== options[0].value);
  }

  const [maxPoints, setMaxPoints] = useState(maxPointsAvailable(groups));

  useEffect(() => {
    setMaxPoints(Math.min(100, maxPointsAvailable(groups).maxPoints));
  }, [points.current]);

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <FormControl mt={3} isRequired>
        <FormLabel> Nombre del caso </FormLabel>
        <Input onChange={(e) => (caseName.current = e.target.value)} />
        <FormHelperText> Sin espacios</FormHelperText>
      </FormControl>

      <FormControl mt={5} isRequired>
        <FormLabel> Grupo </FormLabel>
        <ReactSelectDark
          onChange={handleSelectChange}
          value={options.find((obj) => obj.value === selectedValue)}
          options={options}
          defaultValue={{ label: "sin_grupo", value: options[0].value }}
          darkTheme={darkTheme} />
      </FormControl>

      {!hasGroup && (
        <FormControl mt={5}>
          <FormLabel> Puntaje </FormLabel>
          <NumberInput
            onChange={(e, valueAsNumber) => (points.current = valueAsNumber)}
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

          <Checkbox
            mt={3}
            isChecked={autoPoints}
            onChange={() => {
              setAutoPoints(!autoPoints);
              pointsDefined.current = autoPoints;
            }}>
            Puntaje automático
          </Checkbox>
        </FormControl>
      )}

      <FormControl mt={5} isRequired>
        <FormLabel> Número de casos </FormLabel>
        <NumberInput
          onChange={(e, valueAsNumber) => (numberOfCases.current = valueAsNumber)}
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
