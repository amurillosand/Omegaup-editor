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
import { uuid } from "uuidv4";
import { useAppContext } from "../../../AppContext";

const AddGroup = (props) => {
  const { onClose } = props;
  const { groups, setGroups } = useAppContext();
  const [autoPoints, setAutoPoints] = useState(true);

  const groupName = useRef("");
  const points = useRef(50);
  const pointsDefined = useRef(false);

  const toast = useToast();

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const validName = groupName.current.toLowerCase().replaceAll(" ", "_");

    console.clear();
    console.log("Group name:", validName);

    let isValid = true;
    groups.forEach((groupElement) => {
      if (groupElement.name === validName) {
        isValid = false;
        return;
      }
    });

    console.log("Valid:", isValid);

    if (!isValid) {
      toast({
        title: "Error al crear grupo",
        description: "No puedes tener grupos con el mismo nombre",
        status: "error",
        isClosable: true,
      });
      return;
    }

    // console.log(uuid());
    console.log(validName);
    console.log(points.current);
    console.log(pointsDefined.current);
    console.log([]);

    const newGroup = {
      groupId: uuid(),
      name: validName,
      points: points.current,
      defined: pointsDefined.current,
      cases: [],
    };

    console.log("Add group:", newGroup);
    setGroups((prevGroups) => ([...prevGroups, newGroup]));

    onClose();
  }

  return (
    <>
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
        onClick={(e) => handleSubmit(e)}>
        Agregar grupo
      </Button>
    </>
  );
};

export default AddGroup;
