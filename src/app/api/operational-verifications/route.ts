import { readOperationalHistory, saveOperationalVerification } from "@/lib/operational-verification/storage";
import type { OperationalVerification } from "@/lib/operational-verification/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const history = await readOperationalHistory();

  return Response.json(history);
}

export async function POST(request: Request) {
  const verification = (await request.json()) as OperationalVerification;

  if (!verification?.id || !verification?.date || !Array.isArray(verification.tasks)) {
    return Response.json(
      { message: "Verificação inválida para salvar." },
      { status: 400 },
    );
  }

  const saved = await saveOperationalVerification(verification);

  return Response.json({
    verification: saved,
    message: "Progresso salvo.",
  });
}
