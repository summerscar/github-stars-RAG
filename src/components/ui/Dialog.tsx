import { useAppContext } from "@/context/AppContext";
import { getOctokit } from "@/services/github-login";
import { setSettings } from "@/services/setting";
import { IsUnsyncedFile, tagSyncedFile, uploadFile } from "@/services/upload";
import { Setting } from "@/types";
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

export const Dialog = ({
  ref,
}: {
  ref: React.RefObject<HTMLDialogElement | null>;
}) => {
  const { dispatch, state } = useAppContext();
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(0);

  const syncFiles = async () => {
    const repos = state.repositories;
    const octokit = getOctokit();
    setIsSyncing(true);
    for (const [index, repo] of Object.entries(repos)) {
      const fileName = repo.full_name + ".md";
      if (
        !IsUnsyncedFile({
          unSyncedFileName: fileName,
          bucket: state.settings?.R2_BUCKET,
          r2_account_id: state.settings?.R2_ACCOUNT_ID,
        })
      )
        continue;

      const response = await octokit.request(
        `GET /repos/${repo.full_name}/readme`,
      );
      const content = atob(response.data.content);
      const fileContent = `---
project: ${repo.name}
stars: ${repo.stargazers_count}
description: |-
    ${repo.description}
url: ${repo.html_url}
---

${content}
`;
      try {
        console.log(fileName, "Syncing files...");
        await uploadFile({
          bucket: state.settings?.R2_BUCKET,
          fileKey: fileName,
          file: fileContent,
          r2_account_id: state.settings?.R2_ACCOUNT_ID,
          access_key_id: state.settings?.R2_ACCESS_KEY_ID,
          secret_access_key: state.settings?.R2_SECRET_ACCESS_KEY,
        });

        tagSyncedFile({
          r2_account_id: state.settings?.R2_ACCOUNT_ID!,
          bucket: state.settings?.R2_BUCKET!,
          fileName: fileName,
        });
        console.log(
          `[${Number(index) + 1}/${repos.length}] `,
          fileName,
          "Syncing files done",
        );
        setProgress(Math.floor(((Number(index) + 1) / repos.length) * 100));
      } catch (error) {
        console.error("Error syncing file:", error);
      } finally {
      }
    }
    setIsSyncing(false);
    console.log("Syncing files done");
  };

  return (
    <dialog
      ref={ref}
      className="w-96 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-lg fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
        Settings
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Configure your preferences here.
      </p>
      <form className="space-y-3">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="R2_ACCOUNT_ID"
          >
            R2_ACCOUNT_ID
          </label>
          <Input
            id="R2_ACCOUNT_ID"
            name="R2_ACCOUNT_ID"
            defaultValue={state.settings?.R2_ACCOUNT_ID || ""}
            required
            type="text"
            className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="R2_ACCESS_KEY_ID"
          >
            R2_ACCESS_KEY_ID
          </label>
          <Input
            id="R2_ACCESS_KEY_ID"
            name="R2_ACCESS_KEY_ID"
            required
            type="text"
            defaultValue={state.settings?.R2_ACCESS_KEY_ID || ""}
            className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="R2_SECRET_ACCESS_KEY"
          >
            R2_SECRET_ACCESS_KEY
          </label>
          <Input
            id="R2_SECRET_ACCESS_KEY"
            name="R2_SECRET_ACCESS_KEY"
            required
            type="password"
            defaultValue={state.settings?.R2_SECRET_ACCESS_KEY || ""}
            className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="R2_BUCKET"
          >
            R2_BUCKET
          </label>
          <Input
            id="R2_BUCKET"
            name="R2_BUCKET"
            type="text"
            required
            defaultValue={state.settings?.R2_BUCKET || ""}
            className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="AUTO_RAG_NAME"
          >
            AUTO_RAG_NAME
          </label>
          <Input
            id="AUTO_RAG_NAME"
            name="AUTO_RAG_NAME"
            type="text"
            required
            defaultValue={state.settings?.AUTO_RAG_NAME || ""}
            className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="AUTO_RAG_TOKEN"
          >
            AUTO_RAG_TOKEN
          </label>
          <Input
            id="AUTO_RAG_TOKEN"
            name="AUTO_RAG_TOKEN"
            type="password"
            defaultValue={state.settings?.AUTO_RAG_TOKEN || ""}
            required
            className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        {!!state.settings && (
          <div>
            <Button
              type="button"
              variant="outline"
              disabled={isSyncing}
              onClick={(e) => {
                e.preventDefault();
                syncFiles();
              }}
            >
              {isSyncing ? `Syncing... ${progress}%` : "Sync Files"}
            </Button>
          </div>
        )}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              const form = (e.target as HTMLElement).closest("form");
              if (form && !form.checkValidity()) {
                form.reportValidity();
                return;
              }
              if (!form) return;
              const data = Object.fromEntries(
                new FormData(form) as any,
              ) as Setting;
              setSettings(data);
              dispatch({
                type: "SET_SETTINGS",
                payload: data,
              });
              ref.current?.close();
            }}
          >
            Save
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              ref.current?.close();
            }}
          >
            Close
          </Button>
        </div>
      </form>
    </dialog>
  );
};
