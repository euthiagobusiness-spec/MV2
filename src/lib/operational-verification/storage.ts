import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  OperationalHistoryFile,
  OperationalVerification,
} from "@/lib/operational-verification/types";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIRECTORY, "operational-verifications.json");

const EMPTY_HISTORY: OperationalHistoryFile = {
  verifications: [],
};

export async function readOperationalHistory(): Promise<OperationalHistoryFile> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as OperationalHistoryFile;

    return {
      verifications: Array.isArray(parsed.verifications) ? parsed.verifications : [],
    };
  } catch (error) {
    if (isMissingFile(error)) return EMPTY_HISTORY;
    throw error;
  }
}

export async function saveOperationalVerification(
  verification: OperationalVerification,
) {
  const history = await readOperationalHistory();
  const nextVerification = {
    ...verification,
    lastSavedAt: new Date().toISOString(),
  };
  const existingIndex = history.verifications.findIndex(
    (item) => item.id === nextVerification.id,
  );
  const verifications =
    existingIndex >= 0
      ? history.verifications.map((item, index) =>
          index === existingIndex ? nextVerification : item,
        )
      : [nextVerification, ...history.verifications];

  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify({ verifications }, null, 2),
    "utf8",
  );

  return nextVerification;
}

function isMissingFile(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
