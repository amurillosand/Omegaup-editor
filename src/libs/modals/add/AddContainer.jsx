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

import { useAppContext } from "../../../AppContext";

const AddContainer = (props) => {
  const { isOpen, onClose } = props;
  const { cases, groups } = useAppContext();

  console.log("Cases:", cases);
  console.log("Groups:", groups);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader> Agregar </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Tabs size={"sm"}>
            <TabList>
              <Tab> Caso </Tab>
              <Tab> Grupo </Tab>
              {/* <Tab> Multiples casos </Tab> */}
            </TabList>

            <TabPanels>
              <TabPanel>
                {/* <AddCase onClose={onClose} /> */}
              </TabPanel>

              <TabPanel>
                <AddGroup onClose={onClose} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddContainer;
