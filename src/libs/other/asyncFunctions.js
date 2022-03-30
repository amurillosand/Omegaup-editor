import JSZip from "jszip";

export const readJSON = async (JSONFile) => {
  const JSONData = await JSONFile.async("string");
  return JSON.parse(JSONData);
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export async function asyncTimeout(callback, timeout = 0) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const result = await callback();
      resolve(result);
    }, timeout);
  });
}