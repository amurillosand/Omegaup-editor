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

export async function generateProblem(data, toast, updateProblemStatus, closeProblemStatus) {
  const { generator, solution, writing, title, groups, setGroups } = data;

  function toastError(message, description = undefined, valid) {
    if (valid()) {
      console.log("Toast error: ", message);
      toast({
        title: message,
        description: description,
        status: "error",
        isClosable: true,
      });
      return true;
    }
    console.log("All good", message);
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
      error: toastError(
        "Puntaje incorrecto",
        `El puntaje no cuadra, la suma de los puntos da ${sum}, debería de dar 100 puntos.`,
        () => sum + 0.00001 < 100),
      testPlan: testPlan
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
      error: toastError(error?.title, error?.description, () => error),
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
      error: toastError(error?.title, error?.description, () => error),
      output: result.submissions
    });
  }

  if (
    toastError("Problema sin título", "No hay título para identificar el problema.", () => title.length === 0) ||
    toastError("Problema sin generador de casos", "No hay forma de generar casos para el problema.", () => generator.code.length === 0) ||
    toastError("Problema sin solución", "Debe de existir una solución modelo para poder generar las soluciones a los casos.", () => solution.code.length === 0) ||
    toastError("Problema sin descripción", "No hay historia que describa qué hay que hacer en el problema.", () => writing.length === 0)
  ) {
    return;
  }


  let zip = new JSZip();

  const statements = zip.folder("statements");
  const solutions = zip.folder("solutions");
  const cases = zip.folder("cases");

  updateProblemStatus({
    title: `Revisando los puntajes de los casos`,
    description: "La suma de los puntajes de todos los casos debe ser 100.",
    status: "success",
  });

  let anyError = true;
  const { testPlanError, testPlan } = getTestPlan(groups);

  if (!testPlanError) {
    zip.file("testplan", testPlan);
    statements.file("es.markdown", writing);

    solutions.file("es.markdown", solution.text);
    solutions.file(`solution.${solution.language}`, solution.code);
    solutions.file(`generator.${generator.language}`, generator.code);

    updateProblemStatus({
      title: `Generando los casos de prueba`,
      description: "Se ejecutará tu generador de casos múltiples veces.",
      status: "success",
    });

    const { inputError, input } = await generateInput();

    if (!inputError) {
      updateProblemStatus({
        title: `Generando respuestas`,
        description: "Se ejecutará tu solución con los casos de prueba obtenidos anteriormente.",
        status: "success",
      });

      const { outputError, output } = await generateOutput(input);

      if (!outputError) {
        updateProblemStatus({
          title: `Generando zip`,
          description: "Todo salió bien, se está generando el zip, por favor espere.",
          status: "success",
        });

        anyError = false;
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
      }
    }
  }

  // It doesn't matter if it fails, we generate the zip
  return zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, `${title}.zip`);
  }).then(() => {
    if (anyError) {
      updateProblemStatus({
        title: "Problema generado exitosamente",
        description: `El problema \"${title}\" ya está listo para ser subido a omegaup; revise que todo esté como usted esperaba.`,
        status: "success",
      });
    } else {
      updateProblemStatus({
        title: "Hay un problema interno, regrese luego :)",
        description: `Probablemente el servidor está caido :(, suba el zip generado`,
        status: "warning",
        isClosable: true,
      });
    }
  });

  setTimeout(() => {
    closeProblemStatus({
      title: "Hasta luego",
      description: "",
    });
  }, 5000);
};


// compile_output: "Compilation time limit exceeded."
// memory: null
// message: null
// status: {id: 6, description: 'Compilation Error'}