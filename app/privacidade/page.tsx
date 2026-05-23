import Link from "next/link";

const SECTIONS = [
  {
    title: "1. Dados que Coletamos",
    content:
      "Coletamos dados necessários para o funcionamento do serviço, incluindo: nome completo, endereço de e-mail, CPF, endereço de entrega, dados de pagamento (processados por parceiros certificados) e dados de navegação como endereço IP, tipo de navegador e páginas visitadas.",
  },
  {
    title: "2. Como Usamos seus Dados",
    content:
      "Utilizamos seus dados para: processamento e entrega de pedidos, comunicação sobre status de compras e atualizações da conta, envio de ofertas e novidades (com possibilidade de descadastro), análise de tráfego e melhoria contínua do site.",
  },
  {
    title: "3. Compartilhamento",
    content:
      "Seus dados de endereço e entrega são compartilhados com os Correios e/ou Melhor Envio exclusivamente para fins de entrega dos pedidos. Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.",
  },
  {
    title: "4. Cookies",
    content:
      "Utilizamos cookies para garantir o funcionamento do site (cookies essenciais) e para análise de tráfego (cookies analíticos). Você pode recusar cookies não essenciais através do banner de cookies exibido ao acessar o site, sem prejuízo à navegação.",
  },
  {
    title: "5. Seus Direitos (LGPD)",
    content:
      "Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: acessar seus dados pessoais, corrigir dados incompletos ou desatualizados, solicitar a exclusão dos seus dados, portabilidade dos dados a outro fornecedor, e revogar o consentimento a qualquer momento. Para exercer esses direitos, entre em contato conosco.",
  },
  {
    title: "6. Segurança",
    content:
      "Adotamos medidas técnicas e administrativas para proteger seus dados contra acesso não autorizado, perda ou destruição. Os dados são transmitidos com criptografia SSL e o acesso interno é restrito a colaboradores autorizados.",
  },
  {
    title: "7. Contato do DPO",
    content: null,
    custom: (
      <p className="font-body text-sm text-on-surface-variant leading-relaxed">
        Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de
        dados, entre em contato com nosso Encarregado de Dados (DPO) pelo
        e-mail:{" "}
        <a
          href="mailto:contato@chicogrill.com.br"
          className="text-flame-orange hover:underline"
        >
          contato@chicogrill.com.br
        </a>
      </p>
    ),
  },
];

export default function PrivacidadePage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-16 py-20">
      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <span className="inline-block bg-flame-orange text-black font-title font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
          Privacidade
        </span>
        <h1 className="font-headline text-5xl md:text-7xl uppercase text-on-surface leading-none mb-4">
          POLÍTICA DE{" "}
          <span className="text-flame-orange">PRIVACIDADE</span>
        </h1>
        <p className="font-body text-sm text-on-surface-variant mb-1">
          Última atualização: Maio de 2026
        </p>
        <p className="font-body text-xs text-on-surface-variant/60">
          Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei
          13.709/2018).
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10 max-w-3xl">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-headline text-xl text-on-surface uppercase mb-3">
              {section.title}
            </h2>
            {section.custom
              ? section.custom
              : section.content && (
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {section.content}
                  </p>
                )}
          </div>
        ))}
      </div>

      {/* Back link */}
      <div className="mt-16 pt-8 border-t border-outline-variant/20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-flame-orange font-title font-semibold text-sm hover:underline"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Voltar para a Loja
        </Link>
      </div>
    </div>
  );
}
