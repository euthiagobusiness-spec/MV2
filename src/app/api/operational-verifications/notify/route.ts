import { sendOperationalEmail } from "@/lib/operational-verification/email";
import { saveOperationalVerification } from "@/lib/operational-verification/storage";
import type {
  OperationalEmailEvent,
  OperationalVerification,
} from "@/lib/operational-verification/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    event?: OperationalEmailEvent;
    taskId?: string;
    verification?: OperationalVerification;
  };

  if (!body.event || !body.verification) {
    return Response.json(
      { message: "Evento ou verificação ausente." },
      { status: 400 },
    );
  }

  const saved = await saveOperationalVerification(body.verification);
  const task = body.taskId
    ? saved.tasks.find((item) => item.id === body.taskId)
    : undefined;
  const email = await sendOperationalEmail({
    event: body.event,
    verification: saved,
    task,
  });

  return Response.json({
    verification: saved,
    email,
    message: email.ok ? "E-mail enviado." : email.error,
  });
}
