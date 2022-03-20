import JSZip from "jszip";
import { saveAs } from "file-saver";
import { runMultiple, getLanguageId } from "../coding/runCodeApi";

/* 
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

export async function generateProblem(data, toast) {
  const { generator, solution, writing, title, groups, setGroups } = data;

  function toastBasicError(message, description = undefined, errorFunction) {
    if (errorFunction()) {
      toast({
        title: message,
        description: description,
        status: "error",
        isClosable: true,
      });
      return true;
    }
    return false;
  }

  function getTestPlan(groups) {
    let testPlan = "";
    let sum = 0;
    groups.forEach((group) => {
      if (group.name === "sin_grupo") {
        group.cases.forEach((testCase) => {
          testPlan += `${group.name}.${testCase.name} ${testCase.points}\n`;
          sum += testCase.points;
        });
      } else {
        sum += group.points;
        group.cases.forEach((testCase, index) => {
          testPlan += `${group.name}.${testCase.name} ${index === 0 ? group.points : 0}\n`;
        });
      }
    });

    return ({
      error: toastBasicError(
        "Puntaje incorrecto",
        `La suma de los puntos da ${sum}, debe de dar 100.`,
        () => sum + 0.00001 < 100),
      testPlan
    });
  };

  function checkErrors(results) {
    // Check for errors D:, one error at a time
    if (results.error) {
      return ({
        title: "Error interno vuelva más tarde :(",
        description: results.error,
      });
    }

    for (const result of results.submissions)
      if (result.status.id !== 3) {
        return ({
          title: result.status.description,
          description: result.stderr ? result.stderr : result.compile_output,
        });
      }

    return undefined;
  }

  async function generateInput() {
    const all = [];
    const languageId = getLanguageId(generator.language);
    for (const group of groups) {
      for (const testCase of group.cases) {
        all.push({
          language_id: languageId,
          source_code: generator.code,
          stdin: `${group.name} ${testCase.name}`,
        });
      }
    }

    const result = await runMultiple(all);
    console.log("Result: ", result);

    const error = checkErrors(result);
    console.log("Error: ", error);

    return ({
      error: toastBasicError(error?.title, error?.description, () => error),
      input: result.submissions
    });
  }

  async function generateOutput(input) {
    const languageId = getLanguageId(solution.language);
    const all = input.map((input) => ({
      language_id: languageId,
      source_code: solution.code,
      stdin: input.stdout,
    }));

    const result = await runMultiple(all);
    console.log("Result: ", result);

    const error = checkErrors(result);
    console.log("Error: ", error);

    return ({
      error: toastBasicError(error?.title, error?.description, () => error),
      output: result.submissions
    });
  }

  // if (
  //   toastBasicError("No hay título del problema", undefined, () => title.length === 0) ||
  //   toastBasicError("No hay generador de casos", undefined, () => generator.code.length === 0) ||
  //   toastBasicError("No hay solución", undefined, () => solution.code.length === 0) ||
  //   toastBasicError("No descripción del problema", undefined, () => writing.length === 0)
  // ) {
  //   return;
  // }

  let zip = new JSZip();

  const statements = zip.folder("statements");
  const solutions = zip.folder("solutions");
  const cases = zip.folder("cases");

  let anyError = false;
  const { testPlanError, testPlan } = getTestPlan(groups);

  if (!testPlanError) {
    zip.file("testplan", testPlan);
    statements.file("es.markdown", writing);

    solutions.file("es.markdown", solution.text);
    solutions.file(`solution.${solution.language}`, solution.code);
    solutions.file(`generator.${generator.language}`, generator.code);

    const { inputError, input } = await generateInput();

    if (!inputError) {
      console.log(input);
      const { outputError, output } = await generateOutput(input);

      if (!outputError) {
        let i = 0;
        const results = new Map();
        for (const group of groups) {
          for (const testCase of group.cases) {
            cases.file(`${group.name}.${testCase.name}.in`, input[i].stdout);
            cases.file(`${group.name}.${testCase.name}.out`, output[i].stdout);

            results.set(testCase.caseId, {
              input: input[i].stdout,
              output: output[i].stdout,
            });

            i++;
          }
        }

        // Update groups with input/output
        setGroups((prevGroups) => prevGroups.map((group) => ({
          ...group,
          cases: group.cases.map((testCase) => ({
            ...testCase,
            input: results.get(testCase.caseId).input,
            output: results.get(testCase.caseId).output,
          }))
        })));
      } else {
        anyError = true;
      }
    } else {
      anyError = true;
    }
  } else {
    anyError = true;
  }

  // It doesn't matter if it fails, we generate the zip
  return zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, `${title}.zip`);
  }).then(() => {
    if (!anyError) {
      toast({
        title: "Problema generado exitosamente",
        description: `El problema \"${title}\" ya está listo para ser subido a omegaup; revise que todo esté como usted esperaba.`,
        status: "success",
        isClosable: true,
      });
    } else {
      toast({
        title: "Hay un problema interno, regrese luego :)",
        description: `Probablemente el juez que corre el código está caido :(`,
        status: "warning",
        isClosable: true,
      });
    }
  });
};


// compile_output: "Compilation time limit exceeded."
// memory: null
// message: null
// status: {id: 6, description: 'Compilation Error'}