import Link from "next/link";

const STEPS = [
  {
    icon: "local_shipping",
    title: "1. Solicite a Troca",
    body: "Entre em contato pelo nosso e-mail ou WhatsApp em até 30 dias após o recebimento. Informe seu número de pedido e o motivo.",
  },
  {
    icon: "inventory_2",
    title: "2. Embale o Produto",
    body: "O produto deve estar sem uso, com etiqueta original e na embalagem. Foto do item antes de embalar ajuda no processo.",
  },
  {
    icon: "sync_alt",
    title: "3. Envio Gratuito",
    body: "Geraremos uma etiqueta de postagem gratuita para você. Basta imprimir e levar ao Correios mais próximo.",
  },
  {
    icon: "check_circle",
    title: "4. Receba o Novo",
    body: "Após recebermos e conferirmos o item, enviamos o produto novo em até 5 dias úteis com frete grátis.",
  },
];

const FAQ = [
  {
    q: "Qual o prazo para solicitar troca ou devolução?",
    a: "Até 30 dias corridos após a data de entrega, conforme o Código de Defesa do Consumidor.",
  },
  {
    q: "O produto precisa estar sem uso?",
    a: "Sim. Itens usados, lavados ou com etiqueta removida não são elegíveis para troca ou devolução.",
  },
  {
    q: "Posso trocar por um produto de valor diferente?",
    a: "Sim. Se o novo item for mais caro, você paga a diferença. Se for mais barato, devolvemos o valor restante via PIX.",
  },
  {
    q: "Quanto tempo para receber o estorno?",
    a: "Devoluções de dinheiro são processadas em até 7 dias úteis após confirmação do recebimento do produto.",
  },
  {
    q: "E se o produto chegou com defeito?",
    a: "Produtos com defeito de fabricação têm cobertura de 90 dias. Entre em contato imediatamente com fotos.",
  },
];

export default function TrocasPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-16 py-20">
      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <span className="inline-block bg-flame-orange text-black font-title font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
          Política de Trocas
        </span>
        <h1 className="font-headline text-5xl md:text-6xl uppercase text-on-surface leading-none mb-4">
          TROCAS &<br />
          <span className="text-flame-orange">DEVOLUÇÕES</span>
        </h1>
        <p className="font-body text-base text-on-surface-variant leading-relaxed">
          Compramos qualidade, mas se algo não ficou certo, a gente resolve sem burocracia. Até 30 dias, sem custo.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {STEPS.map((s) => (
          <div key={s.title} className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-flame-orange/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-flame-orange">{s.icon}</span>
            </div>
            <h3 className="font-headline text-xl text-on-surface uppercase">{s.title}</h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      {/* Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-flame-orange text-2xl">check_circle</span>
            <h2 className="font-headline text-2xl uppercase text-on-surface">Aceito para Troca</h2>
          </div>
          <ul className="space-y-3">
            {[
              "Produto sem uso e com etiqueta original",
              "Solicitação em até 30 dias da entrega",
              "Na embalagem original ou equivalente",
              "Produto com defeito de fabricação",
              "Item diferente do pedido",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 font-body text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-flame-orange text-base mt-0.5 shrink-0">check</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-meat-red text-2xl">cancel</span>
            <h2 className="font-headline text-2xl uppercase text-on-surface">Não Aceito</h2>
          </div>
          <ul className="space-y-3">
            {[
              "Produto já lavado ou usado",
              "Etiqueta original removida",
              "Prazo de 30 dias ultrapassado",
              "Danos por mau uso ou acidente",
              "Produtos da categoria Acessórios sob encomenda",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 font-body text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-meat-red text-base mt-0.5 shrink-0">close</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="font-headline text-3xl uppercase text-on-surface mb-8">Dúvidas Frequentes</h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="bg-surface-container-high border border-outline-variant/20 rounded-xl p-6">
              <p className="font-title font-bold text-sm text-on-surface uppercase mb-2">{item.q}</p>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-flame-orange/10 border border-flame-orange/30 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-headline text-2xl uppercase text-on-surface">Precisa de ajuda?</h3>
          <p className="font-body text-sm text-on-surface-variant mt-1">Nossa equipe responde em até 24 horas.</p>
        </div>
        <Link
          href="/contato"
          className="inline-flex items-center gap-2 bg-flame-orange text-black font-title font-bold px-8 py-4 rounded-full uppercase tracking-wide hover:bg-secondary-container transition-all active:scale-95 shrink-0"
        >
          Falar com Suporte
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
