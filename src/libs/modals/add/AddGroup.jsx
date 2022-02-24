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
  const { groups, setGroups } = useAppContext();
  const [autoPoints, setAutoPoints] = useState(true);

  const groupName = useRef("");
  const points = useRef(0);
  const pointsDefined = useRef(false);

  const toast = useToast();

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const validName = groupName.current.toLowerCase().replaceAll(" ", "_");

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

    const newGroup = {
      groupId: uuid(),
      name: validName,
      points: points.current,
      defined: pointsDefined.current,
      cases: [],
    };

    setGroups((prevGroups) => ([...prevGroups, newGroup]));

    onClose();
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <FormControl mt={3} isRequired>
        <FormLabel> Nombre del grupo </FormLabel>
        <Input onChange={(e) => (groupName.current = e.target.value)} />
        <FormHelperText> En minúsculas y sin espacios </FormHelperText>
      </FormControl>

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
            El programa calculará automáticamente el puntaje.
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
