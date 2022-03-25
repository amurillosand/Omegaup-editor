import React, { useEffect } from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Navbar from "./pages/Navbar";
import Header from "./pages/Header";
import MainWindow from "./pages/MainWindow";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import useStateCallback from "./components/useStateCallback";

import { v4 as uuid } from "uuid";
import { fileToString } from "./libs/other/toString"
import writingTemplate from "./pages/writing/template.txt"
import solutionTemplate from "./pages/solution/solution.cpp"
import generatorTemplate from "./pages/generator/generator.cpp"

export const AppContext = React.createContext(null);

export function useAppContext() {
  return React.useContext(AppContext);
}

export const App = () => {
  const [generator, setGenerator] = useState({
    code: "",
    language: "cpp",
  });

  const [solution, setSolution] = useState({
    code: "",
    language: "",
    text: ""
  });

  const [writing, setWriting] = useState("");
  const [title, setTitle] = useState("");
  const [groups, setGroups] = useStateCallback([]);

  useEffect(() => {
    fileToString(solutionTemplate).then((data) => {
      setSolution((prevState) => ({
        ...prevState,
        code: data,
        language: "cpp",
      }));
    });

    fileToString(writingTemplate).then((data) => {
      setWriting(data);
    });

    fileToString(generatorTemplate).then((data) => {
      setGenerator({
        code: data,
        language: "cpp",
      });
    });

    setGroups([{
      groupId: uuid(),
      name: "sin_grupo",
      points: 100,
      defined: false,
      cases: [],
    }]);
  }, []);

  function maxPointsAvailable(groups) {
    let maxPoints = 100;
    let notDefinedCount = 0;

    groups.forEach((group) => {
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

    return { maxPoints, individualPoints };
  }

  function calculatePoints(groups) {
    const { individualPoints } = maxPointsAvailable(groups);

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

  function addCase(newCase, callback = undefined) {
    setGroups(prevGroups => {
      return prevGroups.map(group => {
        if (group.groupId === newCase.groupId) {
          // Modify group by adding the newCase
          return {
            ...group,
            cases: [...group.cases, newCase]
          }
        }
        return group;
      });
    }, callback);
  }

  function addGroup(newGroup) {
    setGroups(prevGroups => [...prevGroups, newGroup]);
  }

  function eraseCase(caseToErase, callback = undefined) {
    setGroups(prevGroups => {
      return prevGroups.map(group => {
        if (group.groupId === caseToErase.groupId) {
          // Modify group by erasing this caseToErase
          return {
            ...group,
            cases: group.cases.filter(testCase => testCase.caseId !== caseToErase.caseId)
          }
        }
        return group;
      });
    }, callback);
  }

  function eraseGroup(groupId) {
    setGroups(prevGroups => prevGroups.filter(group => group.groupId !== groupId));
  }

  function eraseAllGroupCases(groupId) {
    setGroups(prevGroups => {
      return prevGroups.map(group => {
        if (group.groupId === groupId) {
          return {
            ...group,
            cases: [],
          }
        }
        return group;
      });
    });
  }

  function editCase(caseModified, callback = undefined) {
    eraseCase({
      ...caseModified.info,
      groupId: caseModified.lastGroupId
    }, () => {
      addCase(caseModified, callback);
    });
  }

  function editGroup(groupModified) {
    // console.log(groupModified);

    setGroups(prevGroups => {
      return prevGroups.map(group => {
        if (group.groupId === groupModified.groupId) {
          return groupModified;
        }
        return group;
      });
    });
  }

  return (
    <ChakraProvider theme={theme}>
      <AppContext.Provider
        value={{
          generator, setGenerator,
          solution, setSolution,
          writing, setWriting,
          title, setTitle,
          groups, setGroups,
          addCase, addGroup,
          eraseCase, eraseGroup, eraseAllGroupCases,
          editCase, editGroup,
          calculatePoints, maxPointsAvailable
        }}>
        <>
          <Navbar />

          <BrowserRouter>
            <Routes>
              <Route path="/editor" element={
                <>
                  <Header />
                  <MainWindow />
                </>
              } />

              {/* <Route path="/">
                <MainPage />
              </Route> */}
            </Routes>
          </BrowserRouter>
        </>
      </AppContext.Provider>
    </ChakraProvider>
  );
};