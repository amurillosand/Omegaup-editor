import React, { useEffect } from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Navbar from "./pages/Navbar";
import Header from "./pages/Header";
import MainWindow from "./pages/MainWindow";
import MainPage from "./pages/MainPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import useStateCallback from "./libs/other/useStateCallback";

import { v4 as uuid } from "uuid";
import { fileToString } from "./libs/other/toString"
import writingTemplate from "./pages/writing/template.txt"
import solutionTemplate from "./pages/solution/solution.cpp"
import generatorTemplate from "./pages/generator/generator.cpp"
import generateCasesTemplate from "./pages/generator/generateCases.py"

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

  const [solutionError, setSolutionError] = useState(null);
  const [generatorError, setGeneratorError] = useState(null);

  const [writing, setWriting] = useState("");
  const [title, setTitle] = useState("");
  const [groups, setGroups] = useStateCallback([]);

  const [generateCases, setGenerateCases] = useState({});

  useEffect(() => {
    fileToString(solutionTemplate).then((data) => {
      setSolution((prevState) => ({
        ...prevState,
        code: data,
        language: "cpp",
      }));
    });

    fileToString(generateCasesTemplate).then((data) => {
      setGenerateCases({
        code: data,
        language: "py"
      });
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
      points: 0,
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

  function editCase(caseModified) {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (caseModified.groupId === group.groupId) {
          return ({
            ...group,
            cases: group.cases.map((testCase) => {
              if (testCase.caseId === caseModified.caseId) {
                return ({
                  ...testCase,
                  ...caseModified
                });
              }
              return testCase;
            })
          });
        }
        return group;
      }));
  }

  function sortGroups() {
    console.log("Sort");

    const numbersFirst = (a, b) => {
      let numA = Number(a);
      let numB = Number(b);

      if (Number.isInteger(numA) && Number.isInteger(numB)) {
        // Both are numbers
        return numA < numB ? -1 : 1;
      }

      return a < b ? -1 : 1;
    };

    setGroups((prevGroups) => prevGroups.map((group) => {
      return ({
        ...group,
        cases: group.cases.sort((a, b) => {
          return numbersFirst(a.name, b.name);
        })
      })
    }).sort((a, b) => {
      if (a.name === "sin_grupo")
        return -1;
      if (b.name === "sin_grupo")
        return -1;
      return numbersFirst(a.name, b.name);
    }));
  }

  function editGroup(groupModified) {
    // console.log(groupModified);

    setGroups((prevGroups) => {
      return prevGroups.map((group) => {
        if (group.groupId === groupModified.groupId) {
          return ({
            ...group,
            ...groupModified
          });
        }
        return group;
      });
    });
  }

  function createCase(props) {
    const { name, groupId, points, defined, input, output } = props;
    return ({
      caseId: uuid(),
      name: name,
      groupId: groupId,
      points: points || 0,
      defined: defined || false,
      input: input || "",
      output: output || "",
    });
  }

  function createGroup(props) {
    const { name, groupId, points, defined, cases } = props;
    return ({
      groupId: groupId || uuid(),
      name: name,
      points: points || 0,
      defined: defined || false,
      cases: cases || [],
    });
  }

  return (
    <ChakraProvider theme={theme}>
      <AppContext.Provider
        value={{
          generator, setGenerator, generateCases,
          solution, setSolution,
          writing, setWriting,
          title, setTitle,
          groups, setGroups,
          createCase, createGroup,
          addCase, addGroup,
          eraseCase, eraseGroup, eraseAllGroupCases,
          editCase, editGroup,
          calculatePoints, maxPointsAvailable,
          sortGroups,
          solutionError, setSolutionError,
          generatorError, setGeneratorError
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

              <Route path="/" element={
                <MainPage />
              } />
            </Routes>
          </BrowserRouter>
        </>
      </AppContext.Provider>
    </ChakraProvider >
  );
};