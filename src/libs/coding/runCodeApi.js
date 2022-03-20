import { languages } from "./codeLanguages";

const host = "judge0-ce.p.rapidapi.com";
const key = "fe7a7756f3msh3411c39d31e2e5bp17ff1cjsna0cc3b86c16f";

export function getLanguageId(language) {
  return languages.find((element) => {
    return element.extension === language;
  }).id;
}

// export async function runSingle(code, language, input) {
//   console.log("Code:", code);
//   console.log("Language:", language);
//   console.log("Input:", input);

//   const languageId = getLanguageId(language);

//   // console.log("Creating submission ...");

//   return await fetch(
//     "https://judge0-ce.p.rapidapi.com/submissions",
//     {
//       method: "POST",
//       headers: {
//         "x-rapidapi-host": host,
//         "x-rapidapi-key": key,
//         "content-type": "application/json",
//         accept: "application/json",
//       },
//       body: JSON.stringify({
//         source_code: code,
//         stdin: input,
//         language_id: languageId,
//       }),
//     }
//   ).then((submission) => {
//     // console.log("Submission created ...");
//     return submission.json();
//   }).then(async (response) => {
//     let solution = {
//       status: {
//         description: "Queue",
//       },
//       stderr: null,
//       compile_output: null,
//       message: null,
//     };

//     // console.log("Token", response.token);

//     if (response.token) {
//       let url = `https://judge0-ce.p.rapidapi.com/submissions/${response.token}?base64_encoded=false`;

//       const getSolution = await fetch(url, {
//         method: "GET",
//         headers: {
//           "x-rapidapi-host": host,
//           "x-rapidapi-key": key,
//           "content-type": "application/json",
//         },
//       });

//       solution = await getSolution.json();;
//     } else {
//       console.log("I don't know what happened :c");
//     }

//     return solution;
//   }).then(async (solution) => {
//     // console.log(solution);

//     if (solution.stdout) {
//       solution.message = solution.stdout;
//       // console.log("Results: ", solution.stdout);
//       // console.log("Execution time: ", solution.time, "secs");
//       // console.log("Memory used: ", solution.memory, "bytes");

//     } else if (solution.stderr) {
//       solution.message = solution.stderr;
//       // console.log("Error:", solution.stderr);
//     } else {
//       solution.message = solution.compile_output;
//       // console.log("Compilation error:", solution.compile_output);
//     }

//     return solution;
//   });
// }

function splitInBatches(array, batchSize) {
  let batches = [];
  while (array.length) {
    batches.push(array.splice(0, batchSize));
  }
  return batches;
}

async function runBatch(data) {
  return await fetch(
    "https://judge0-ce.p.rapidapi.com/submissions/batch",
    {
      method: "POST",
      headers: {
        "x-rapidapi-host": host,
        "x-rapidapi-key": key,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        submissions: data
      }),
    }
  ).then(response => {
    return response.json();
  }).then(async (tokens) => {
    console.log("tokens: ", tokens);

    let tokensStr = ""
    for (let i = 0; i < tokens.length; i++) {
      if (i > 0) tokensStr += ",";
      tokensStr += tokens[i].token;
    }

    const url = `https://judge0-ce.p.rapidapi.com/submissions/batch?tokens=${tokensStr}`;

    let state = {
      status: 0,
      submissions: []
    }

    do {
      const getState = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "x-rapidapi-host": host,
          "x-rapidapi-key": key,
          "content-type": "application/json",
        },
      });

      setTimeout(async () => {
        // Wait 10 seconds for the answer
        state = await getState.json();
        state.status = 1e9;
        for (let submission of state.submissions) {
          state.status = Math.min(state.status, submission.status.id);
          if (state.status <= 2)
            break;
        }
      }, 15000);

    } while (state.status <= 2);

    console.log("State: ", state);

    return state;
  });
}

export async function runMultiple(data) {
  const batches = splitInBatches(data, 20);

  console.log("Batches: ", batches);

  const results = await Promise.all(batches.map(async (data) => {
    const batchResult = await runBatch(data);

    return new Promise((resolve, reject) => {
      if (batchResult.status === 3) {
        resolve(batchResult);
      } else {
        reject(batchResult);
      }
    })
  }));
  console.log("Results: ", results);

  // Merge all batches into one
  const result = results[0];
  for (let i = 1; i < results.length; i++) {
    result.submissions.push(...results[i].submissions);
  }

  return result;
}