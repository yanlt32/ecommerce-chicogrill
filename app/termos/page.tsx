import Link from "next/link";

const SECTIONS = [
  {
    title: "1. Aceitação dos Termos",
    content:
      "Ao acessar e utilizar o site da Chico Grill, você concorda com estes Termos de Uso em sua totalidade. Caso não concorde com qualquer disposição, por favor, não utilize nossos serviços.",
  },
  {
    title: "2. Produtos e Preços",
    content:
      "Os preços exibidos em nosso site podem ser alterados a qualquer momento sem aviso prévio. As fotografias dos produtos são meramente ilustrativas — podem existir variações de cor, textura ou detalhes em relação ao produto final entregue.",
  },
  {
    title: "3. Compra e Pagamento",
    content:
      "As compras podem ser realizadas via PIX ou cartão de crédito/débito. Os pagamentos são processados por parceiros certificados, garantindo a segurança das suas transações. A Chico Grill não armazena dados de cartão.",
  },
  {
    title: "4. Entrega",
    content:
      "Os prazos de entrega são estimados e realizados via Correios. Atrasos podem ocorrer por fatores externos como greves, condições climáticas ou sobrecargas operacionais. Nesses casos, nos comprometemos a informar o cliente o mais brevemente possível.",
  },
  {
    title: "5. Trocas e Devoluções",
    content: null,
    custom: (
      <p className="font-body text-sm text-on-surface-variant leading-relaxed">
        Aceitamos trocas e devoluções em até 30 dias corridos após o recebimento
        do produto, conforme o Código de Defesa do Consumidor (CDC). Para mais
        detalhes sobre o processo, acesse nossa{" "}
        <Link href="/trocas" className="text-flame-orange hover:underline">
          Política de Trocas
        </Link>
        .
      </p>
    ),
  },
  {
    title: "6. Propriedade Intelectual",
    content:
      "A marca Chico Grill, logotipos, estampas, fotografias e todo o conteúdo do site são protegidos por direitos autorais e de propriedade intelectual. É proibida a reprodução total ou parcial sem autorização expressa.",
  },
  {
    title: "7. Limitação de Responsabilidade",
    content:
      "A Chico Grill não se responsabiliza por danos indiretos, incidentais ou consequenciais decorrentes do uso ou impossibilidade de uso de nossos produtos ou serviços, incluindo, mas não se limitando a, perda de dados ou lucros cessantes.",
  },
  {
    title: "8. Contato",
    content: null,
    custom: (
      <p className="font-body text-sm text-on-surface-variant leading-relaxed">
        Para dúvidas sobre estes termos, entre em contato pelo e-mail{" "}
        <a
          href="mailto:contato@chicogrill.com.br"
          className="text-flame-orange hover:underline"
        >
          contato@chicogrill.com.br
        </a>{" "}
        ou acesse nossa{" "}
        <Link href="/contato" className="text-flame-orange hover:underline">
          página de contato
        </Link>
        .
      </p>
    ),
  },
];

export default function TermosPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-16 py-20">
      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <span className="inline-block bg-flame-orange text-black font-title font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
          Legal
        </span>
        <h1 className="font-headline text-5xl md:text-7xl uppercase text-on-surface leading-none mb-4">
          TERMOS DE USO{" "}
          <span className="text-flame-orange">CHICO GRILL</span>
        </h1>
        <p className="font-body text-sm text-on-surface-variant">
          Última atualização: Maio de 2026
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
