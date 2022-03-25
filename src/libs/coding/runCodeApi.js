import { languages } from "./codeLanguages";

const host = "judge0-ce.p.rapidapi.com";
const key = "fe7a7756f3msh3411c39d31e2e5bp17ff1cjsna0cc3b86c16f";

export function getLanguageId(language) {
  return languages.find((element) => {
    return element.extension === language;
  }).id;
}

export async function getConfigInfo() {
  const config = await fetch("https://judge0-ce.p.rapidapi.com/config_info", {
    method: "GET",
    mode: "cors",
    headers: {
      "x-rapidapi-host": host,
      "x-rapidapi-key": key,
      "content-type": "application/json",
    },
  }).then((response) => response.json());

  // console.log(config);

  // allow_enable_network: false
  // allow_enable_per_process_and_thread_memory_limit: true
  // allow_enable_per_process_and_thread_time_limit: true
  // allowed_languages_for_compile_options: []
  // callbacks_max_tries: 3
  // callbacks_timeout: 5
  // cpu_extra_time: 1
  // cpu_time_limit: 5
  // enable_additional_files: true
  // enable_batched_submissions: true
  // enable_callbacks: true
  // enable_command_line_arguments: true
  // enable_compiler_options: true
  // enable_network: false
  // enable_per_process_and_thread_memory_limit: false
  // enable_per_process_and_thread_time_limit: false
  // enable_submission_delete: false
  // enable_wait_result: true
  // maintenance_mode: false
  // max_cpu_extra_time: 5
  // max_cpu_time_limit: 15
  // max_extract_size: 10240
  // max_file_size: 1024
  // max_max_file_size: 20480
  // max_max_processes_and_or_threads: 120
  // max_memory_limit: 512000
  // max_number_of_runs: 20
  // max_processes_and_or_threads: 60
  // max_queue_size: 10000
  // max_stack_limit: 128000
  // max_submission_batch_size: 20
  // max_wall_time_limit: 20
  // memory_limit: 128000
  // number_of_runs: 1
  // redirect_stderr_to_stdout: false
  // stack_limit: 64000
  // submission_cache_duration: 1
  // use_docs_as_homepage: true
  // wall_time_limit: 10
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
  // data is [{language_id, source_code, stdin}, ...]

  data = data.map((element) => ({
    ...element,
    cpu_time_limit: 10,
    cpu_extra_time: 2,
    memory_limit: 300000
  }));

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