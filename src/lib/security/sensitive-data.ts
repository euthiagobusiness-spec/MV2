const sensitiveFreeTextPatterns = [
  /\b(?:senha|password|token|api[_ -]?key|secret|chave privada|private key)\b/i,
  /\b(?:\d[ -]*?){13,19}\b/,
  /-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/i,
];

export function containsSensitiveFreeText(value: string | null | undefined) {
  if (!value) return false;
  return sensitiveFreeTextPatterns.some((pattern) => pattern.test(value));
}
