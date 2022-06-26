import React from "react";
import { Container, HStack, Kbd } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { BiCodeBlock as CodeIcon } from "react-icons/bi";
import { BsPencil as EditIcon } from "react-icons/bs";
import { FiCheckSquare } from "react-icons/fi";
import { GrTest as CheckIcon } from "react-icons/gr";

import SolutionWindow from "./solution/SolutionWindow";
import WritingWindow from "./writing/WritingWindow";
import GeneratorWindow from "./generator/GeneratorWindow";
import CasesWindow from "./cases/CasesWindow";
import ValidatorWindow from "./validator/ValidatorWindow";

const MainWindow = () => {
  const [tabIndex, setTab] = React.useState(0);

  React.useEffect(() => {
    window.addEventListener("keyup", handleShorcuts);
    return () => {
      window.removeEventListener("keyup", handleShorcuts);
    };
  }, []);

  function handleShorcuts(key) {
    // console.log(key.which);
    if (key.ctrlKey) {
      if (49 <= key.which && key.which <= 53) {
        setTab(key.which - 49);
      }
    }
  }

  return (
    <>
      <Container maxW={"container.xl"} mt={3} h={"80vh"} padding={"0"}>
        <Tabs
          variant={"enclosed"}
          size={"sm"}
          index={tabIndex}
          onChange={(e) => setTab(e)}
        >
          <TabList>
            <Tab>
              <HStack>
                <CodeIcon />
                <p>Solución</p>
                <span>
                  <Kbd>Ctrl</Kbd>+<Kbd>1</Kbd>
                </span>
              </HStack>
            </Tab>

            <Tab>
              <HStack>
                <EditIcon />
                <p>Redacción</p>
                <span>
                  <Kbd>Ctrl</Kbd>+<Kbd>2</Kbd>
                </span>
              </HStack>
            </Tab>

            <Tab>
              <HStack>
                <CodeIcon />
                <p>Generador de casos</p>
                <span>
                  <Kbd>Ctrl</Kbd>+<Kbd>3</Kbd>
                </span>
              </HStack>
            </Tab>

            <Tab>
              <HStack>
                <CheckIcon />
                <p>Casos de prueba</p>
                <span>
                  <Kbd>Ctrl</Kbd>+<Kbd>4</Kbd>
                </span>
              </HStack>
            </Tab>

            <Tab>
              <HStack>
                <FiCheckSquare />
                <p>Validador</p>
                <span>
                  <Kbd>Ctrl</Kbd>+<Kbd>5</Kbd>
                </span>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SolutionWindow />
            </TabPanel>

            <TabPanel>
              <WritingWindow />
            </TabPanel>

            <TabPanel>
              <GeneratorWindow />
            </TabPanel>

            <TabPanel>
              <CasesWindow />
            </TabPanel>

            <TabPanel>
              <ValidatorWindow />
            </TabPanel>
          </TabPanels>

        </Tabs>
      </Container>
    </>
  );
};

export default MainWindow;
