import { useAppContext } from "../../AppContext";
import JSZip from "jszip";
// import { getCaseContent } from "./downloadOut";
import { saveAs } from "file-saver";

const data = useAppContext();

/* 

La estructura del zip debe de ser

cases/
  case1.in
  case1.out
  easy.case1.in
  easy.case1.out

statements/
  es.markdown

solutions/
  solution.language
  generator.language
  es.markdown

testplan
  easy.case1 puntos
  easy.case2 0
  ...
  sin_grupo.case1 puntos1
  sin_grupo.case2 puntos2
  ...
 */

const getStatements = (zip) => {
  const folder = zip.folder("statements");
  folder.file("es.markdown", data.writing);
};

const getSolution = (zip) => {
  // const folder = zip.folder("solutions");

  // folder.file("es.markdown", Store.getState().solution.text);
  // folder.file(`solution.${Store.getState().solution.language}`, Store.getState().solution.code);
};

const getGenerator = (zip) => {
  // const folder = zip.folder("solutions");

  // folder.file(`generator.${Store.getState().generator.language}`, Store.getState().generator.code);
};

// const getGroupFromId = (groupId) => {
//   return Store.getState().cases.data.find(
//     (groupElement) => groupElement.groupId === groupId
//   );
// };

// const getCaseFromId = (caseId, groupData) => {
//   return groupData.cases.find((caseElement) => caseElement.caseId === caseId);
// };

const getCasesAndTestPlan = (zip) => {
  //   const folder = zip.folder("cases");
  //   let testplanData = "";
  //   const groupsDefined = new Set();

  //   const casesInputData = Store.getState().input.data;
  //   casesInputData.forEach((caseElement) => {
  //     const groupData = getGroupFromId(caseElement.id.groupId);
  //     if (groupData === undefined) {
  //       return;
  //     }
  //     const caseData = getCaseFromId(caseElement.id.caseId, groupData);
  //     if (caseData === undefined) {
  //       return;
  //     }

  //     const groupName = groupData.name;
  //     const caseName = caseData.name;
  //     const fileName = groupName + "." + caseName;

  //     const lineData = getCaseContent(caseElement.lines);
  //     const outData = caseElement.outData;

  //     folder.file(fileName + ".in", lineData);
  //     folder.file(fileName + ".out", outData);

  //     // Testplan calculation

  //     // Si es sin_grupo, simplemente paso al segundo, porque nunca estará definido
  //     if (
  //       !(groupData.name === "sin_grupo") &&
  //       !groupsDefined.has(groupData.groupId)
  //     ) {
  //       groupsDefined.add(groupData.groupId);
  //       testplanData += fileName + " " + groupData.points + "\n";
  //     } else {
  //       testplanData += fileName + " " + caseData.points + "\n";
  //     }
  //   });

  //   zip.file("testplan", testplanData);
};

export const generateProblem = () => {
  let zip = new JSZip();

  getStatements(zip);
  getSolution(zip);
  getGenerator(zip);
  getCasesAndTestPlan(zip);

  // const storeData = sessionStorage.getItem("[EasyPeasyStore][0]");
  // if (storeData !== null) {
  //   zip.file("cdp.data", storeData);
  // }

  // const problemName = Store.getState().title.titleName;
  // zip.generateAsync({ type: "blob" }).then((content) => {
  //   saveAs(content, problemName.toLowerCase().replaceAll(" ", "_") + ".zip");
  // });
};
