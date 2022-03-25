export async function fileToString(file) {
  // A dirty trick, call fileToString and callback to do something with the stuff 
  return await fetch(file).then((response) => response.text())
}
