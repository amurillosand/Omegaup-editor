import { languages } from "./codeLanguages";

const host = "judge0-ce.p.rapidapi.com";
const key = "fe7a7756f3msh3411c39d31e2e5bp17ff1cjsna0cc3b86c16f";

export async function run(code, language, input) {
  console.log("Code:", code);
  console.log("Language:", language);
  console.log("Input:", input);

  const languageId = languages.find((element) => {
    return element.extension === language;
  }).id;

  // console.log("Creating submission ...");

  return await fetch(
    "https://judge0-ce.p.rapidapi.com/submissions",
    {
      method: "POST",
      headers: {
        "x-rapidapi-host": host,
        "x-rapidapi-key": key,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        source_code: code,
        stdin: input,
        language_id: languageId,
      }),
    }
  ).then((submission) => {
    // console.log("Submission created ...");
    return submission.json();
  }).then(async (response) => {
    let solution = {
      status: {
        description: "Queue",
      },
      stderr: null,
      compile_output: null,
      message: null,
    };

    // console.log("Token", response.token);

    if (response.token) {
      let url = `https://judge0-ce.p.rapidapi.com/submissions/${response.token}?base64_encoded=false`;

      const getSolution = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-host": host,
          "x-rapidapi-key": key,
          "content-type": "application/json",
        },
      });

      solution = await getSolution.json();;
    } else {
      console.log("I don't know what happened :c");
    }

    return solution;
  }).then(async (solution) => {
    // console.log(solution);

    if (solution.stdout) {
      solution.message = solution.stdout;
      // console.log("Results: ", solution.stdout);
      // console.log("Execution time: ", solution.time, "secs");
      // console.log("Memory used: ", solution.memory, "bytes");

    } else if (solution.stderr) {
      solution.message = solution.stderr;
      // console.log("Error:", solution.stderr);
    } else {
      solution.message = solution.compile_output;
      // console.log("Compilation error:", solution.compile_output);
    }

    return solution;
  });
}