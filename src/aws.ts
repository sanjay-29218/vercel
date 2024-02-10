import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
  accessKeyId: "57bb9a79735bc75e8cb4a481aadacee8",
  secretAccessKey:
    "d70e104fa239679cb6ee85c9785eaf0e3a6fcfa56197bad58b6506073092b768",
  endpoint: "https://1783b6098998d87c4500c4602dd62b05.r2.cloudflarestorage.com",
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: "vercel",
      Key: fileName,
    })
    .promise();

  console.log("response", response);
};
