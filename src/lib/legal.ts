export type LegalSection = {
  title: string;
  body: string[];
};

export const privacyPolicySections: LegalSection[] = [
  {
    title: "1. Quem somos",
    body: [
      "A MV2 Temporada opera um portal digital para hospedes, proprietarios e equipe administrativa, com foco em check-in, comunicados, regras, guias locais, servicos extras e suporte durante a estadia.",
    ],
  },
  {
    title: "2. Dados que coletamos",
    body: [
      "Podemos coletar nome, e-mail, telefone, dados da reserva, dados de check-in, documentos informados pelo hospede, placa de veiculo, observacoes operacionais, aceite de regras e registros tecnicos de seguranca.",
      "No cadastro administrativo, coletamos nome, e-mail, senha criptografada pelo provedor de autenticacao e registros de aceite desta politica e dos termos.",
    ],
  },
  {
    title: "3. Finalidades",
    body: [
      "Usamos dados para validar reservas, realizar check-in digital, cumprir regras do condominio, prestar suporte, melhorar a experiencia, vender servicos extras, proteger o sistema e atender obrigacoes legais ou regulatórias aplicaveis.",
    ],
  },
  {
    title: "4. Compartilhamento",
    body: [
      "Dados podem ser compartilhados com operadores autorizados, prestadores tecnicos, plataformas de hospedagem, condominios quando necessario para controle de acesso e autoridades competentes quando houver obrigacao legal.",
      "Nao vendemos dados pessoais.",
    ],
  },
  {
    title: "5. Seguranca",
    body: [
      "Aplicamos controles de acesso, HTTPS, cookies HttpOnly, politicas de seguranca no navegador, separacao entre areas publicas e administrativas e restricao de contas autorizadas para reduzir exposicao indevida.",
    ],
  },
  {
    title: "6. Direitos do titular",
    body: [
      "Nos termos da LGPD, voce pode solicitar confirmacao de tratamento, acesso, correcao, anonimização, portabilidade, informacao sobre compartilhamentos e eliminacao quando aplicavel.",
    ],
  },
  {
    title: "7. Retencao",
    body: [
      "Mantemos dados pelo tempo necessario para operacao da reserva, defesa de direitos, cumprimento legal e auditoria operacional. Dados sem necessidade operacional podem ser removidos ou anonimizados.",
    ],
  },
  {
    title: "8. Contato",
    body: [
      "Para exercer direitos ou tirar duvidas sobre privacidade, entre em contato pelos canais oficiais informados no portal.",
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    title: "1. Uso do portal",
    body: [
      "O portal deve ser usado para consultar informacoes da estadia, realizar check-in, acessar instrucoes do imovel, solicitar suporte e contratar servicos extras quando disponiveis.",
    ],
  },
  {
    title: "2. Conta administrativa",
    body: [
      "Contas criadas no sistema nao recebem acesso automatico ao painel administrativo. A liberacao depende de autorizacao interna, politicas de acesso e configuracao do provedor de autenticacao.",
    ],
  },
  {
    title: "3. Responsabilidade pelas informacoes",
    body: [
      "O usuario deve informar dados verdadeiros, manter seus dados de acesso sob sigilo e avisar imediatamente caso identifique uso indevido, erro de reserva ou informacao incorreta.",
    ],
  },
  {
    title: "4. Regras da hospedagem",
    body: [
      "As regras do apartamento, do condominio e da reserva fazem parte da experiencia de hospedagem. O descumprimento pode gerar restricoes de acesso, cobrancas, cancelamentos ou outras medidas previstas na reserva.",
    ],
  },
  {
    title: "5. Servicos extras",
    body: [
      "Servicos extras, mimos e indicacoes locais podem depender de disponibilidade, preco, horario, confirmacao por WhatsApp ou outro canal oficial.",
    ],
  },
  {
    title: "6. Disponibilidade",
    body: [
      "Buscamos manter o portal disponivel e atualizado, mas interrupcoes podem ocorrer por manutencao, falhas de terceiros, internet local ou eventos fora do controle operacional.",
    ],
  },
  {
    title: "7. Alteracoes",
    body: [
      "Estes termos podem ser atualizados para refletir mudancas operacionais, legais ou tecnicas. A versao publicada no portal sera a referencia vigente.",
    ],
  },
];
