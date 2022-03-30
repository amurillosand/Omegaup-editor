import JSZip from "jszip";
import { readJSON } from "../other/asyncFunctions";

export const loadProblem = async (zip) => {
  const zipData = await JSZip.loadAsync(zip);
  
};
