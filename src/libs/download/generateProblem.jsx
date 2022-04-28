import JSZip from "jszip";
import { saveAs } from "file-saver";
import { runMultiple, getLanguageId, encode, decode } from "../coding/runCodeApi";
import { asyncTimeout } from "../other/asyncFunctions";

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

const waitingTime = {
  testPlan: 3000,
  input: 5000,
  output: 5000,
  generateZip: 5000,
  closeToast: 8000,
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
    if (result.status.id > 3) {
      return ({
        title: result.status.description,
        description: result.stderr ? result.stderr : result.compile_output,
      });
    }

  return undefined;
}

async function getTestPlan(groups, showError) {
  return await asyncTimeout(() => {
    let testPlan = "";
    let sum = 0;
    groups.forEach((group) => {
      if (group.name === "sin_grupo") {
        group.cases.forEach((testCase) => {
          testPlan += `${testCase.name} ${testCase.points}\n`;
          sum += testCase.points;
        });
      } else {
        sum += group.points;
        group.cases.forEach((testCase, index) => {
          testPlan += `${group.name}.${testCase.name} ${index === 0 ? group.points : 0}\n`;
        });
      }
    });

    console.log("Test plan result: ");

    return ({
      hasError: showError(
        "Puntaje incorrecto",
        `El puntaje no cuadra, la suma de los puntos da ${sum}, debería de dar 100.`,
        () => sum + 0.00001 < 100),
      data: testPlan
    })
  }, 0);
};

async function generateInput(generator, groups, showError, checkErrors) {
  return await asyncTimeout(async () => {
    const all = [];
    const languageId = getLanguageId(generator.language);
    const encodedGeneratorCode = encode(generator.code);

    // Check if group has input/output
    for (const group of groups) {
      for (const testCase of group.cases) {
        if (testCase.input.length > 0 && testCase.output.length > 0) {
          continue;
        }

        all.push({
          language_id: languageId,
          source_code: encodedGeneratorCode,
          stdin: encode(`${group.name} ${testCase.name}`),
        });
      }
    }

    const result = await runMultiple(all);
    console.log("Input result: ", result);

    const error = checkErrors(result);
    console.log("Input error: ", error);

    return ({
      error: error,
      hasError: showError(error?.title, error?.description, () => error),
      data: result.submissions
    })
  }, 0);
}

async function generateOutput(solution, input, showError, checkErrors) {
  return await asyncTimeout(async () => {
    const languageId = getLanguageId(solution.language);
    const encodedSolutionCode = encode(solution.code);
    const all = input.map((input) => ({
      language_id: languageId,
      source_code: encodedSolutionCode,
      stdin: encode(input.stdout),
    }));

    const result = await runMultiple(all);
    console.log("Output result: ", result);

    const error = checkErrors(result);
    console.log("Output error: ", error);

    return ({
      error: error,
      hasError: showError(error?.title, error?.description, () => error),
      data: result.submissions
    })
  }, 0);
}

export async function generateProblem(data, toast, updateProblemStatus) {
  const {
    generator, solution, writing, title, groups, generateCases,
    setGroups, setGeneratorError, setSolutionError,
  } = data;

  function showError(title, description = undefined, valid) {
    if (valid()) {
      console.log("Toast error: ", description);
      updateProblemStatus({
        title: title,
        // description: description,
        status: "error",
        isClosable: true,
      });
      return true;
    }
    return false;
  }

  // Check basic errors
  if (showError(
    "Problema sin título",
    "No hay título para identificar el problema.",
    () => title.length === 0) ||
    showError(
      "Problema sin generador de casos",
      "No hay forma de generar casos para el problema.",
      () => generator.code.length === 0) ||
    showError(
      "Problema sin solución",
      "Debe de existir una solución modelo para poder generar las soluciones a los casos.",
      () => solution.code.length === 0) ||
    showError(
      "Problema sin descripción",
      "No hay historia que describa qué hay que hacer en el problema.",
      () => writing.length === 0)) {
    return;
  }

  setGeneratorError(null);
  setSolutionError(null);

  let zip = new JSZip();

  const statements = zip.folder("statements");
  const solutions = zip.folder("solutions");
  const cases = zip.folder("cases");

  statements.file("es.markdown", writing);
  solutions.file("es.markdown", solution.text + `\n\n{{solution.${solution.language}}}`);
  solutions.file(`solution.${solution.language}`, solution.code);
  solutions.file(`generator.${generator.language}`, generator.code);

  await asyncTimeout(async () => {
    updateProblemStatus({
      title: `Revisando puntaje`,
      description: "La suma de los puntajes de todos los casos de prueba debe dar 100.",
      status: "success",
    });

    const testPlan = await getTestPlan(groups, showError);
    console.log(testPlan);

    if (!testPlan.hasError) {
      zip.file("testplan", testPlan.data);
      zip.file(`generateCases.py`, generateCases.code);

      /*
      // Works but it's limited :c
      return await asyncTimeout(async () => {
        updateProblemStatus({
          title: `Generando casos de prueba`,
          description: "El generador se está ejecutando para generar los casos de prueba",
          status: "success",
        });

        const input = await generateInput(generator, groups, showError, checkErrors);
        console.log(input);

        if (!input.hasError) {
          return await asyncTimeout(async () => {
            updateProblemStatus({
              title: `Generando respuestas`,
              description: "Se está ejecutando tu solución con los casos de prueba obtenidos anteriormente.",
              status: "success",
            });

            const output = await generateOutput(solution, input.data, showError, checkErrors);
            console.log(output);

            if (!output.hasError) {
              let i = 0;
              const results = new Map();
              for (const group of groups) {
                for (const testCase of group.cases) {
                  if (testCase.input.length > 0 && testCase.output.length > 0) {
                    continue;
                  }

                  cases.file(`${group.name}.${testCase.name}.in`, input.data[i].stdout);
                  cases.file(`${group.name}.${testCase.name}.out`, output.data[i].stdout);

                  results.set(testCase.caseId, {
                    input: input.data[i].stdout,
                    output: output.data[i].stdout,
                  });

                  i++;
                }
              }

              // Update groups with generated input/output
              setGroups((prevGroups) => prevGroups.map((group) => ({
                ...group,
                cases: group.cases.map((testCase) => ({
                  ...testCase,
                  input: results.get(testCase.caseId).input,
                  output: results.get(testCase.caseId).output,
                }))
              })));
            } else {
              setSolutionError(output.error);
              return output.hasError;
            }
          }, waitingTime.output);
        } else {
          setGeneratorError(input.error);
          return input.hasError;
        }
      }, waitingTime.input);
      */
    } else {
      return testPlan.hasError;
    }
  }, waitingTime.testPlan).then(async (anyError) => {
    console.log("any error:", anyError);
    await asyncTimeout(async () => {
      // It doesn't matter if it fails, we generate the zip
      zip.generateAsync({
        type: "blob"
      }).then((content) => {
        saveAs(content, `${title}.zip`);
      }).then(() => {
        if (!anyError) {
          updateProblemStatus({
            title: "Problema generado exitosamente",
            description: `El problema \"${title}\" ya está configurado para ser subido a omegaup; revise que todo esté como usted esperaba y corra localmente generateCases.py.`,
            status: "success",
            isClosable: true,
            duration: waitingTime.closeToast,
          });
        }
      });
    }, waitingTime.generateZip);
  });
};