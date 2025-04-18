import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

if (!process.env.R2_BUCKET) throw new Error("R2_BUCKET is not set");
if (!process.env.R2_ACCESS_KEY_ID)
  throw new Error("R2_ACCESS_KEY_ID is not set");
if (!process.env.R2_SECRET_ACCESS_KEY)
  throw new Error("R2_SECRET_ACCESS_KEY is not set");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const uploadParams: PutObjectCommandInput = {
  Bucket: process.env.R2_BUCKET,
  Key: "",
  Body: undefined,
};

async function uploadDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath);
    uploadParams.Body = fileContent;
    uploadParams.Key = filePath.replace(dir, "");
    await s3.send(new PutObjectCommand(uploadParams));
    console.log(`Uploaded ${uploadParams.Key}`);
  }
}

uploadDir("stars");
