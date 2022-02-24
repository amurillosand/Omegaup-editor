import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import AddCase from "./AddCase";
import AddGroup from "./AddGroup";
// import AddMultipleCases from "./AddMultipleCases";

import { useAppContext } from "../../../AppContext";

export function calculatePoints(groups) {
  let maxPoints = 100;
  let notDefinedCount = 0;

  groups.forEach((group) => {
    console.log(group);
    if (group.name === "sin_grupo") {
      group.cases.forEach((testCase) => {
        if (testCase.defined) {
          maxPoints -= testCase.points;
        } else {
          notDefinedCount++;
        }
      });
    } else {
      if (group.defined) {
        maxPoints -= group.points;
      } else {
        notDefinedCount++;
      }
    }
  });

  let individualPoints = 0;
  if (notDefinedCount > 0) {
    individualPoints = maxPoints / notDefinedCount;
  }

  console.log("maxPoints:", maxPoints, " notDefinedCount:", notDefinedCount);

  return groups.map((group) => {
    if (group.name === "sin_grupo") {
      group.points = 0;
      group.cases = group.cases.map((testCase) => {
        if (!testCase.defined) {
          testCase.points = individualPoints;
        }
        return testCase;
      });
    } else if (!group.defined) {
      group.points = individualPoints;
    }
    return group;
  });
}

const AddContainer = (props) => {
  const { isOpen, onClose } = props;
  const { cases, groups, setGroups } = useAppContext();

  useEffect(() => {
    console.log("Calculate points");
    setGroups(calculatePoints(groups));

  }, [isOpen]);

  console.log("groups:", groups);
  console.log("cases:", cases);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader> Agregar </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Tabs size={"sm"}>
            <TabList>
              <Tab> Grupo </Tab>
              <Tab> Caso </Tab>
              {/* <Tab> Multiples casos </Tab> */}
            </TabList>

            <TabPanels>
              <TabPanel>
                <AddGroup onClose={onClose} />
              </TabPanel>

              <TabPanel>
                <AddCase onClose={onClose} />
              </TabPanel>

              {/* <TabPanel>
                <AddMultipleCases
                  isOpen={isOpen}
                  onClose={onClose}
                  addCase={addCase}
                  removeCase={removeCase}
                  groups={groups} />
              </TabPanel> */}
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddContainer;
