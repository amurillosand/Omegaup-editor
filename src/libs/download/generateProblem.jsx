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

export async function generateProblem(data, toast, updateProblemStatus) {
  const { generator, solution, writing, title, groups, setGroups } = data;

  function showError(title, description = undefined, valid) {
    if (valid()) {
      console.log("Toast error: ", description);
      toast({
        title: title,
        description: description,
        status: "error",
        isClosable: true,
        duration: null,
      });
      return true;
    }
    return false;
  }

  function getTestPlan() {
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
      error: showError(
        "Puntaje incorrecto",
        `El puntaje no cuadra, la suma de los puntos da ${sum}, debería de dar 100.`,
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
    const encodedGeneratorCode = encode(generator.code);

    for (const group of groups) {
      for (const testCase of group.cases) {
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
      error: showError(error?.title, error?.description, () => error),
      input: result.submissions
    });
  }

  async function generateOutput(input) {
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
      error: showError(error?.title, error?.description, () => error),
      output: result.submissions
    });
  }

  function basicError() {
    return (
      showError(
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
        () => writing.length === 0)
    );
  }

  let zip = new JSZip();

  const statements = zip.folder("statements");
  const solutions = zip.folder("solutions");
  const cases = zip.folder("cases");

  if (!basicError()) {
    statements.file("es.markdown", writing);
    solutions.file("es.markdown", solution.text + `\n\n{{solution.${solution.language}}}`);
    solutions.file(`solution.${solution.language}`, solution.code);
    solutions.file(`generator.${generator.language}`, generator.code);

    const anyError = await asyncTimeout(async () => {
      updateProblemStatus({
        title: `Revisando puntaje`,
        description: "La suma de los puntajes de todos los casos de prueba debe dar 100.",
        status: "success",
      });

      const { testPlanError, testPlan } = getTestPlan(groups);
      console.log(testPlanError);

      if (!testPlanError) {
        zip.file("testplan", testPlan);

        return await asyncTimeout(async () => {
          updateProblemStatus({
            title: `Generando casos de prueba`,
            description: "El generador se está ejecutando para generar los casos de prueba",
            status: "success",
          });

          const { inputError, input } = await generateInput();
          console.log(inputError);

          if (!inputError) {
            return await asyncTimeout(async () => {
              updateProblemStatus({
                title: `Generando respuestas`,
                description: "Se está ejecutando tu solución con los casos de prueba obtenidos anteriormente.",
                status: "success",
              });

              const { outputError, output } = await generateOutput(input);
              console.log(outputError);

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

                // Update groups with generated input/output
                setGroups((prevGroups) => prevGroups.map((group) => ({
                  ...group,
                  cases: group.cases.map((testCase) => ({
                    ...testCase,
                    input: results.get(testCase.caseId).input,
                    output: results.get(testCase.caseId).output,
                  }))
                })));
              }

              return outputError;
            }, 5000);
          }

          return inputError;
        }, 5000);
      }

      return testPlanError;
    }, 3000);


    if (!anyError) {
      await asyncTimeout(async () => {
        // It doesn't matter if it fails, we generate the zip
        zip.generateAsync({
          type: "blob"
        }).then((content) => {
          saveAs(content, `${title}.zip`);
        }).then(() => {
          console.log("Any error", anyError);
          if (anyError) {
            updateProblemStatus({
              title: "Problema interno, regrese luego :)",
              description: `Probablemente el servidor está caido :(, suba el zip generado nuevamente al regresar.`,
              status: "warning",
              isClosable: true,
            });
          } else {
            updateProblemStatus({
              title: "Problema generado exitosamente",
              description: `El problema \"${title}\" ya está listo para ser subido a omegaup; revise que todo esté como usted esperaba.`,
              status: "success",
            });
          }
        });
      }, 5000);
    }
  }
};