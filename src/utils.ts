import fs from "fs";
import path from "path";
export function generate() {
  const MAX_LENGTH = 5;
  const alphabets = "abcdefghijklmnopqrstwxyz1234567890";
  let random = "";
  for (let i = 0; i < MAX_LENGTH; i++) {
    random += alphabets[Math.floor(Math.random() * alphabets.length)];
  }
  return random;
}

export function getAllFiles(folderPath: string) {
  let response: string[] = [];
  const allFilesAndFolder = fs.readdirSync(folderPath);
  allFilesAndFolder.forEach((file) => {
    const filePath = path.join(folderPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      response = response.concat(getAllFiles(filePath));
    } else {
      response.push(filePath);
    }
  });
  return response;
}
