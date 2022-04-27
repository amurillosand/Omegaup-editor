// ids are used for judge0, full list:
// https://github.com/judge0/judge0/blob/master/CHANGELOG.md

export const languages = [
  { id: 54, name: "C++", ace: "c_cpp", extension: "cpp" },
  { id: 48, name: "C", ace: "c_cpp", extension: "c", },
  { id: 71, name: "Python", ace: "python", extension: "py" },
  { id: -1, name: "Java", ace: "java", extension: "java" },
];

export function validExtension(extension) {
  for (let language of languages)
    if (language.extension === extension)
      return true
  return false
}