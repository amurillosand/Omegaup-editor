import MarkdownIt from "markdown-it";

// @ts-ignore
import katex from "katex";
// @ts-ignore
import markdownMath from "markdown-it-texmath";

export function splitBetweenTwo(input, startIndex, secondOccurrence, auxOccurrence) {
  const endIndex = input.findIndex((element) => {
    return element.trim() === secondOccurrence || element.trim() === auxOccurrence
  });

  return {
    result: input.slice(startIndex + 1, endIndex),
    range: { startIndex, endIndex },
  };
}

function getTable(lines) {
  let firstGlobalIndex = lines.findIndex((line) => line === "||input");
  let lastGlobalIndex = lines.findIndex((line) => line === "||end");

  const occurrences = [
    { first: "||input", second: "||output" },
    { first: "||output", second: "||description" },
    { first: "||description", second: "||input" },
  ];

  let iterator = 0;
  let row = [];
  let table = [];

  lines = lines.slice(firstGlobalIndex, lastGlobalIndex + 1);

  do {
    const firstOccurrence = occurrences[iterator % 3].first;
    const secondOccurrence = occurrences[iterator % 3].second;
    let { result, range } = splitBetweenTwo(lines, 0, secondOccurrence, "||end");

    if (secondOccurrence === "||description") {
      // Check if there is any ||input in between
      const nextInput = splitBetweenTwo(lines, 0, "||input", "||end");

      if (nextInput.range.endIndex < range.endIndex) {
        result = nextInput.result;
        range = nextInput.range;
      }
    }

    if (range.startIndex === -1 || range.endIndex === -1) break;

    lines = lines.slice(range.endIndex);

    if (iterator !== 0 && iterator % 3 === 0) {
      table.push(row);
      row = [];
    }
    row.push(
      result.reduce((text, line) => (text += "<pre>" + line + "</pre>"), "")
    );

    iterator++;
  } while (iterator < 1000 && lines[0].trim() !== "||end");
  table.push(row);

  return {
    table: table,
    tableRange: { startIndex: firstGlobalIndex, endIndex: lastGlobalIndex + 1 },
  };
}

export const toGFM = (input) => {
  let lines = input.split('\n').map((line) => {
    line = line.trim();
    if (line.startsWith("||")) {
      line = line.replaceAll(" ", "");
    }
    return line;
  });

  let final = [];

  while (true) {
    const { table, tableRange } = getTable(lines);

    if (tableRange.startIndex === -1 || tableRange.startIndex > tableRange.endIndex) {
      final = final.concat([...lines]);
      break;
    } else {
      const finalTableOutput = [];
      table.forEach((row) => {
        finalTableOutput.push("|" + row.join("|") + "|");
      });

      const beforeTable = lines.slice(0, tableRange.startIndex);
      beforeTable.push("| Entrada | Salida | Descripción| ");
      beforeTable.push("| - | - | -| ");

      const afterTable = lines.slice(tableRange.endIndex);

      final = final.concat([...beforeTable, ...finalTableOutput]);

      lines = afterTable;
    }
  }

  const finalString = final.join("\n").replaceAll("$$", "\n$$$$\n");

  return finalString;
};

export const parse = (input) => {
  const parser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  }).use(markdownMath, {
    engine: katex,
    delimiters: "dollars"
  });

  const GFMString = toGFM(input);
  return parser.render(GFMString);
};
