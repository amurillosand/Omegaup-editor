import * as React from "react";
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

// TODO handle logic for no group cases

const AddCase = (props) => {
  const { onClose } = props;
  const { setGroups, setCases, groups } = useAppContext();
  const [autoPoints, setAutoPoints] = useState(true);
  const [selectedValue, setSelectedValue] = useState("");
  const [hasGroup, setHasGroup] = useState(false);

  const caseName = useRef("");
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

    const validName = caseName.current.toLowerCase().replaceAll(" ", "_");
    let isValid = true;
    let selectedGroupId = selectedValue;

    if (selectedGroupId === "") {
      selectedGroupId = options[0].value;
    }

    groups.forEach((groupElement) => {
      if (groupElement.groupId === selectedGroupId) {
        groupElement.cases.forEach((caseElement) => {
          if (caseElement.name === validName) {
            isValid = false;
            return;
          }
        });
      }
      if (!isValid) return;
    });

    if (!isValid) {
      toast({
        title: "Error al crear caso",
        description: "No puedes tener casos con el mismo nombre en un mismo grupo",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const newCase = {
      caseId: uuid(),
      name: validName,
      groupId: selectedGroupId,
      points: points.current,
      defined: pointsDefined.current,
    };

    setCases(prevCases => [...prevCases, newCase])

    setGroups(prevGroups => {
      return prevGroups.map(group => {
        if (group.groupId === selectedGroupId) {
          // Modify group by adding the newCase.caseId
          return {
            ...group,
            cases: [...group.cases, newCase]
          }
        }
        return group;
      });
    });

    onClose();
  }

  function handleSelectChange(event) {
    setSelectedValue(event.value);
    setHasGroup(event.value !== options[0].value);
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <FormControl mt={3} isRequired>
        <FormLabel> Nombre del caso</FormLabel>
        <Input onChange={(e) => (caseName.current = e.target.value)} />
        <FormHelperText>En minúsculas y sin espacios</FormHelperText>
      </FormControl>

      <FormControl mt={5} isRequired>
        <FormLabel> Nombre del grupo</FormLabel>

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
            max={100}
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

      <Button
        colorScheme="green"
        isFullWidth
        mt={10}
        type="submit">
        Agregar Caso
      </Button>
    </form>
  );
};

export default AddCase;
