import React from "react";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  useToast,
  Button,
  useColorModeValue,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import ReactSelectDark from "../../../components/ReactSelectDark"

import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../../App";
import { useCaseContext } from "../../../pages/cases/CasesWindow";

const EditCase = (props) => {
  const { selected, setSelected } = useCaseContext();
  const { groups, editCase, maxPointsAvailable } = useAppContext();
  const { isOpen, onClose } = props;

  const [autoPoints, setAutoPoints] = useState(!selected.defined);
  const [selectedGroupId, setSelectedGroupId] = useState(selected.groupId);
  const [hasGroup, setHasGroup] = useState(selectedGroupId !== options[0].value);

  const caseNameRef = useRef(selected.name);
  const pointsRef = useRef(selected.points);
  const pointsDefinedRef = useRef(selected.defined);

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

    let isValid = true;
    groups.forEach((group) => {
      if (group.groupId === selectedGroupId) {
        group.cases.forEach((caseElement) => {
          if (caseElement.name === validName && validName !== selected.name) {
            isValid = false;
            return;
          }
        });
        if (!isValid) return;
      }
    });

    if (!isValid) {
      toast({
        title: "Error al editar el caso",
        description: "No puedes tener casos con el mismo nombre",
        status: "error",
        isClosable: true,
      });
      return;
    }

    editCase({
      info: {
        caseId: selected.caseId,
        name: validName,
        points: pointsRef.current,
        groupId: selectedGroupId,
        defined: pointsDefinedRef.current,
        input: selected.input,
        output: selected.output,
      },
      lastGroupId: selected.groupId,
    }, () => {
      setSelected(prevSelected => ({
        ...prevSelected,
        groupId: selectedGroupId,
      }));
    });

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Editar caso </ModalHeader>
        <ModalCloseButton />

        <ModalBody mb={5}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <FormControl mt={3} isRequired>
              <FormLabel> Nombre del caso</FormLabel>
              <Input
                onChange={(e) => (caseNameRef.current = e.target.value)}
                defaultValue={selected.name}
              />
              <FormHelperText> Sin espacios. </FormHelperText>
            </FormControl>

            {/* <FormControl mt={5} isRequired>
              <FormLabel> Nombre del grupo </FormLabel>
              <ReactSelectDark
                defaultValue={options.find((obj) => obj.value === selectedGroupId)}
                onChange={handleSelectGroupId}
                value={options.find((obj) => obj.value === selectedGroupId)}
                options={options}
                darkTheme={darkTheme} />
            </FormControl> */}

            {/* {!hasGroup && (
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
                  defaultValue={selected.points}
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
            )} */}

            <Button
              colorScheme="green"
              isFullWidth
              mt={10}
              type={"submit"}>
              Editar caso
            </Button>
          </form>

        </ModalBody>

      </ModalContent>
    </Modal>
  );
};

export default EditCase;
