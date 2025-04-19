const getSignedUrl = async ({
  bucket,
  fileKey,
  r2_account_id,
  access_key_id,
  secret_access_key,
}: {
  bucket: string;
  fileKey: string;
  r2_account_id: string;
  access_key_id: string;
  secret_access_key: string;
}) => {
  const res = await fetch(
    `/api/pre-signed-url?bucket=${bucket}&file_key=${fileKey}&r2_account_id=${r2_account_id}&access_key_id=${access_key_id}&secret_access_key=${secret_access_key}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!res.ok) {
    throw new Error("Failed to get signed URL");
  }
  const { url } = (await res.json()) as { url: string };
  return url;
};

const uploadFile = async ({
  file,
  bucket,
  fileKey,
  r2_account_id,
  access_key_id,
  secret_access_key,
}: {
  file: File | string | Blob;
  bucket?: string;
  fileKey: string;
  r2_account_id?: string;
  access_key_id?: string;
  secret_access_key?: string;
}) => {
  if (!bucket) {
    throw new Error("Bucket name is required");
  }
  if (!r2_account_id) {
    throw new Error("R2 account ID is required");
  }
  if (!access_key_id) {
    throw new Error("Access key ID is required");
  }
  if (!secret_access_key) {
    throw new Error("Secret access key is required");
  }

  const url = await getSignedUrl({
    bucket,
    fileKey,
    r2_account_id,
    access_key_id,
    secret_access_key,
  });
  await fetch(url, { method: "PUT", body: file });
};

const buildTagFileName = ({
  r2_account_id,
  bucket,
  fileName,
}: {
  r2_account_id: string;
  bucket: string;
  fileName: string;
}) => {
  const filePath = `${r2_account_id}/${bucket}/${fileName}`;
  return filePath;
};

const tagSyncedFile = ({
  r2_account_id,
  bucket,
  fileName,
}: {
  r2_account_id: string;
  bucket: string;
  fileName: string;
}) => {
  const prevStatus = localStorage.getItem("synced_files") || JSON.stringify([]);

  const syncedFiles = JSON.parse(prevStatus);
  syncedFiles.push(buildTagFileName({ r2_account_id, bucket, fileName }));
  localStorage.setItem("synced_files", JSON.stringify(syncedFiles));
};

const getSyncedFiles = () => {
  const syncedFiles = localStorage.getItem("synced_files");
  if (!syncedFiles) {
    return [];
  }
  return JSON.parse(syncedFiles) as string[];
};

const IsUnsyncedFile = ({
  r2_account_id,
  bucket,
  unSyncedFileName,
}: {
  r2_account_id?: string;
  bucket?: string;
  unSyncedFileName: string;
}) => {
  if (!r2_account_id || !bucket || !unSyncedFileName) {
    throw new Error("Missing parameters");
  }
  const syncedFiles = getSyncedFiles();
  return !syncedFiles.includes(
    buildTagFileName({
      r2_account_id,
      bucket,
      fileName: unSyncedFileName,
    }),
  );
};

export {
  getSignedUrl,
  getSyncedFiles,
  IsUnsyncedFile,
  tagSyncedFile,
  uploadFile,
};
