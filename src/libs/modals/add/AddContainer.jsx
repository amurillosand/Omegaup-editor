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

import { useAppContext } from "../../../App";

const AddContainer = (props) => {
  const { isOpen, onClose } = props;
  const { setGroups, calculatePoints } = useAppContext();

  useEffect(() => {
    setGroups(groups => calculatePoints(groups));
  }, [isOpen]);

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
              {/* <Tab> Casos </Tab> */}
              {/* <Tab> Multiples casos </Tab> */}
            </TabList>

            <TabPanels>
             {/* <TabPanel>
                <AddGroup onClose={onClose} />
              </TabPanel> */}

              <TabPanel>
                <AddCase onClose={onClose} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddContainer;
