export const TASK_STATUSES = [
  "pending",
  "in_progress",
  "completed",
  "problem",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type VerificationStatus = "not_started" | "in_progress" | "completed";

export type OperationalEmailEvent = "started" | "problem" | "completed";

export type OperationalActivity = {
  id: string;
  type: "started" | "saved" | "task_completed" | "problem" | "completed";
  message: string;
  createdAt: string;
};

export type OperationalTask = {
  id: string;
  title: string;
  status: TaskStatus;
  note: string;
  actionTaken: string;
  relatedItem: string;
  elapsedSeconds: number;
  timerStartedAt: string | null;
  completedAt: string | null;
  problemNotifiedAt: string | null;
};

export type OperationalVerification = {
  id: string;
  date: string;
  status: VerificationStatus;
  responsible: string;
  startedAt: string | null;
  finishedAt: string | null;
  elapsedSeconds: number;
  timerStartedAt: string | null;
  lastSavedAt: string | null;
  tasks: OperationalTask[];
  activities: OperationalActivity[];
};

export type OperationalHistoryFile = {
  verifications: OperationalVerification[];
};
