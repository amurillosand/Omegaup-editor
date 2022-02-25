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
} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../../AppContext";

const EditGroup = (props) => {
  const { groups, editGroup, maxPointsAvailable } = useAppContext();
  const { groupId, name, points, defined, onClose, cases } = props;

  const [autoPoints, setAutoPoints] = useState(!defined);

  const groupName = useRef(name);
  const pointsRef = useRef(points);
  const pointsDefinedRef = useRef(defined);

  const toast = useToast();

  function handleSubmit(e) {
    e.preventDefault();

    const validName = groupName.current.replaceAll(" ", "_");

    let isValid = true;
    groups.forEach((group) => {
      if (group.name === validName && validName !== name) {
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

    editGroup({
      groupId: groupId,
      points: pointsRef.current,
      defined: pointsDefinedRef.current,
      name: validName,
      cases: cases,
    });

    onClose();
  }

  const [maxPoints, setMaxPoints] = useState(maxPointsAvailable(groups));

  useEffect(() => {
    setMaxPoints(Math.min(100, maxPointsAvailable(groups).maxPoints));
  }, [pointsRef.current]);

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <FormControl mt={3} isRequired>
        <FormLabel> Nombre del grupo </FormLabel>
        <Input
          onChange={(e) => (groupName.current = e.target.value)}
          defaultValue={name}
        />
        <FormHelperText> Sin espacios </FormHelperText>
      </FormControl>

      <FormControl mt={5}>
        <FormLabel> Puntaje </FormLabel>
        <NumberInput
          defaultValue={points}
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

        <Checkbox
          mt={3}
          isChecked={autoPoints}
          onChange={() => {
            setAutoPoints(!autoPoints);
            pointsDefinedRef.current = autoPoints;
          }}>
          Puntaje automático
        </Checkbox>
      </FormControl>

      <Button
        colorScheme="green"
        isFullWidth
        mt={10}
        type={"submit"}>
        Editar grupo
      </Button>
    </form>
  );
};

export default EditGroup;
