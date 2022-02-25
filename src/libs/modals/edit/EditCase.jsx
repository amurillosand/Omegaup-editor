import React from "react";
import {
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
  Select,
  toast,
  useToast,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

import RSelect from "react-select";
import chakraColors from "../../other/chakraColors";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../../AppContext";

const EditCase = (props) => {
  const { groups, editCase, maxPointsAvailable } = useAppContext();
  const { groupId, caseId, name, points, defined, onClose } = props;

  const [autoPoints, setAutoPoints] = useState(!defined);
  const [selectedValue, setSelectedValue] = useState(groupId);

  const caseName = useRef(name);
  const pointsRef = useRef(points);
  const pointsDefined = useRef(defined);

  const toast = useToast();
  const darkTheme = useColorModeValue(false, true);

  let options = groups.map((groupElement) => {
    return {
      value: groupElement.groupId,
      label: groupElement.name,
    };
  });

  const [hasGroup, setHasGroup] = useState(groupId !== options[0].value);

  // Tengo que quitarlo primero del grupo donde estaba antes
  // Tengo que agregarlo al nuevo grupo

  function handleSubmit(e) {
    e.preventDefault();

    const validName = caseName.current.replaceAll(" ", "_");

    let isValid = true;
    let selectedGroupId = selectedValue;

    if (selectedGroupId === "") {
      selectedGroupId = options[0].value;
    }

    groups.forEach((groupElement) => {
      if (groupElement.groupId === groupId) {
        groupElement.cases.forEach((caseElement) => {
          if (caseElement.name === validName && validName !== name) {
            isValid = false;
            return;
          }
        });
        if (!isValid) return;
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

    // cambiar el selected
    editCase({
      case: {
        caseId: caseId,
        name: validName,
        points: pointsRef.current,
        groupId: selectedGroupId,
        defined: pointsDefined.current,
      },
      lastId: groupId,
    });

    handleGroupChange({ caseId: caseId, newGroupId: selectedGroupId });

    onClose();
  }

  function handleSelectChange(event) {
    setSelectedValue(event.value);
    setHasGroup(event.value !== options[0].value);
  }

  const [maxPoints, setMaxPoints] = useState(maxPointsAvailable(groups));

  useEffect(() => {
    setMaxPoints(Math.min(100, maxPointsAvailable(groups).maxPoints));
  }, [pointsRef.current]);

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <FormControl mt={3} isRequired>
        <FormLabel> Nombre del caso</FormLabel>
        <Input
          onChange={(e) => (caseName.current = e.target.value)}
          defaultValue={name}
        />
        <FormHelperText>En minúsculas y sin espacios</FormHelperText>
      </FormControl>

      <FormControl mt={5} isRequired>
        <FormLabel> Nombre del grupo </FormLabel>
        <RSelect
          defaultValue={options.find((obj) => obj.value === groupId)}
          options={options}
          value={options.find((obj) => obj.value === selectedValue)}
          onChange={handleSelectChange}
          theme={
            darkTheme
              ? (theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: chakraColors.blue[200], // Selected
                  primary25: chakraColors.gray[600], // Ring
                  primary50: chakraColors.blue[600], // Ring
                  primary75: chakraColors.blue[700], // Ring
                  neutral0: chakraColors.gray[700],
                  neutral5: chakraColors.gray[700],
                  neutral10: chakraColors.gray[700],
                  neutral20: chakraColors.gray[600],
                  neutral30: chakraColors.gray[500],
                  neutral40: chakraColors.white,
                  neutral50: chakraColors.white,
                  neutral80: chakraColors.white,
                  neutral90: chakraColors.white,
                },
              })
              : undefined
          }
        />

      </FormControl>
      {!hasGroup && (
        <FormControl mt={5}>
          <FormLabel> Puntaje </FormLabel>
          <NumberInput
            onChange={(e, valueAsNumber) => (pointsRef.current = valueAsNumber)}
            defaultValue={points}
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

      <Button
        colorScheme="green"
        isFullWidth
        mt={10}
        type={"submit"}>
        Editar caso
      </Button>
    </form>
  );
};

export default EditCase;
