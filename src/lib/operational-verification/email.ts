import "server-only";

import nodemailer from "nodemailer";

import { formatSeconds, getVerificationStats } from "@/lib/operational-verification/tasks";
import type {
  OperationalEmailEvent,
  OperationalTask,
  OperationalVerification,
} from "@/lib/operational-verification/types";

type EmailResult =
  | { ok: true; skipped: false; messageId: string }
  | { ok: false; skipped: true; error: string }
  | { ok: false; skipped: false; error: string };

export async function sendOperationalEmail({
  event,
  verification,
  task,
}: {
  event: OperationalEmailEvent;
  verification: OperationalVerification;
  task?: OperationalTask;
}): Promise<EmailResult> {
  const config = getSmtpConfig();

  if (!config) {
    return {
      ok: false,
      skipped: true,
      error: "SMTP não configurado. Progresso salvo sem envio de e-mail.",
    };
  }

  try {
    const transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: config.user && config.pass ? { user: config.user, pass: config.pass } : undefined,
    });
    const content = buildEmailContent(event, verification, task);
    const result = await transport.sendMail({
      from: config.from,
      to: config.to,
      subject: content.subject,
      text: content.text,
    });

    return {
      ok: true,
      skipped: false,
      messageId: result.messageId,
    };
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      error: error instanceof Error ? error.message : "Falha desconhecida no envio de e-mail.",
    };
  }
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_TO;

  if (!host || !port || !from || !to) return null;

  return {
    host,
    port,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from,
    to,
  };
}

function buildEmailContent(
  event: OperationalEmailEvent,
  verification: OperationalVerification,
  task?: OperationalTask,
) {
  if (event === "started") {
    return {
      subject: `Verificação operacional iniciada - ${formatDate(verification.date)}`,
      text: [
        "Verificação operacional iniciada.",
        "",
        `Data: ${formatDate(verification.date)}`,
        `Horário de início: ${formatDateTime(verification.startedAt)}`,
        `Responsável: ${verification.responsible || "Não informado"}`,
        "",
        "Tarefas do dia:",
        ...verification.tasks.map((item, index) => `${index + 1}. ${item.title}`),
      ].join("\n"),
    };
  }

  if (event === "problem") {
    return {
      subject: `Problema encontrado - ${task?.title ?? "Verificação operacional"}`,
      text: [
        "Problema encontrado durante a verificação operacional.",
        "",
        `Tarefa: ${task?.title ?? "Não informada"}`,
        `Observação: ${task?.note || "Sem observação"}`,
        `Ação tomada: ${task?.actionTaken || "Não informada"}`,
        `Horário: ${formatDateTime(new Date().toISOString())}`,
        `Tempo decorrido: ${formatSeconds(task?.elapsedSeconds ?? 0)}`,
      ].join("\n"),
    };
  }

  const stats = getVerificationStats(verification);
  const problemTasks = verification.tasks.filter((item) => item.status === "problem");
  const actions = verification.tasks
    .filter((item) => item.actionTaken.trim())
    .map((item) => `- ${item.title}: ${item.actionTaken}`);

  return {
    subject: `Verificação operacional concluída - ${formatDate(verification.date)}`,
    text: [
      "Verificação operacional concluída.",
      "",
      `Data: ${formatDate(verification.date)}`,
      `Horário de início: ${formatDateTime(verification.startedAt)}`,
      `Horário de fim: ${formatDateTime(verification.finishedAt)}`,
      `Tempo total: ${formatSeconds(stats.totalElapsed)}`,
      `Tarefas concluídas: ${stats.completed}`,
      `Tarefas com problema: ${problemTasks.length}`,
      "",
      "Resumo das ações tomadas:",
      ...(actions.length ? actions : ["Nenhuma ação tomada registrada."]),
    ].join("\n"),
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function formatDateTime(value: string | null) {
  if (!value) return "Não informado";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
