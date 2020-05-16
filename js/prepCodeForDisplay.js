function seperateCodeIntoLines(code) {
  const splitCode = code.split(/\n/);
  let codeString = removeLineNumbers(splitCode);
  let completedLines = mergeIndexes(splitCode);
  return [completedLines, codeString];
}

function removeLineNumbers(code) {
  let justWords = [];
  for (let i = 1; i < code.length; i += 2) {
    justWords.push(code[i]);
  }
  return justWords.join("");
}

const mergeIndexes = (arr) => {
  let completedLines = [];
  for (let i = 0; i < arr.length - 1; i += 2) {
    completedLines.push(arr[i] + arr[i + 1]);
  }
  return completedLines;
};

export function prepCodeForDisplay(code) {
  return seperateCodeIntoLines(code);
}
