# Portal Digital do Hospede

Sistema web em Next.js + TypeScript + Tailwind + Supabase para operacao de aluguel por temporada.

## Rodar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sem variaveis Supabase, o app roda em modo demonstracao. Acesse:

- `http://localhost:3000`
- `http://localhost:3000/admin/login`
- `http://localhost:3000/portal/demo-maranduba-2026`

No modo demo, o login aceita o exemplo exibido na tela.

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Rode `supabase/schema.sql` no SQL Editor.
3. Rode `supabase/seed.sql` para os dados iniciais.
4. Crie um usuario administrativo em Supabase Auth.
5. Preencha `.env.local` com:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY` server-only

O portal publico usa o token da reserva em `/portal/[token]`, mas a leitura dos dados e o envio do check-in acontecem no servidor com chave server-only. Assim, reservas e documentos nao ficam expostos pela chave publica do navegador.

## Arquitetura

- `src/app/portal/[token]`: portal publico do hospede.
- `src/app/admin/(protected)`: painel administrativo autenticado.
- `src/lib/data`: leitura de dados e protecao do admin.
- `src/lib/actions`: Server Actions para auth, check-in e CRUDs.
- `src/lib/supabase`: clientes browser, server, proxy e admin server-only.
- `src/components/portal`: componentes da experiencia do hospede.
- `src/components/admin`: navegacao, tabelas, upload e formularios.
- `src/lib/integrations/stays`: placeholder para integracao futura.
- `supabase/schema.sql` e `supabase/seed.sql`: banco e dados iniciais.

## Producao

- Usar HTTPS.
- Restringir quem pode criar conta no Supabase Auth.
- Trocar as policies administrativas `authenticated = true` por uma regra de admin usando `app_metadata` ou tabela de perfis.
- Rotacionar e guardar `SUPABASE_SECRET_KEY` apenas no servidor/Vercel.
- Revisar textos LGPD com juridico.
- Validar e limitar uploads de imagem conforme plano Supabase Storage.
- Implementar logs/auditoria para alteracoes administrativas.
