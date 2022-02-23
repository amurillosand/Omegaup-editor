export function fileToString(file, callback) {
  // A dirty trick, call fileToString and callback to do something with the stuff 
  return fetch(file)
    .then((response) => response.text())
    .then((data) => callback(data));
}
