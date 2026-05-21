"use client";

import { useState } from "react";

const CHANNELS = [
  {
    icon: "mail",
    title: "E-mail",
    value: "contato@chicogrill.com.br",
    note: "Respondemos em até 24h",
    href: "mailto:contato@chicogrill.com.br",
  },
  {
    icon: "chat",
    title: "WhatsApp",
    value: "(11) 99999-0000",
    note: "Seg–Sex, 9h às 18h",
    href: "https://wa.me/5511999990000",
  },
  {
    icon: "pin_drop",
    title: "Endereço",
    value: "Rua dos Pinheiros, 850 — SP",
    note: "Seg–Sex 10h–20h · Sáb 10h–18h",
    href: "/unidades",
  },
];

export default function ContatoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("duvida");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-16 py-20">
      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <span className="inline-block bg-flame-orange text-black font-title font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
          Fale Conosco
        </span>
        <h1 className="font-headline text-5xl md:text-6xl uppercase text-on-surface leading-none mb-4">
          ENTRE EM<br />
          <span className="text-flame-orange">CONTATO</span>
        </h1>
        <p className="font-body text-base text-on-surface-variant">
          Dúvidas, sugestões ou problemas com pedido — estamos aqui para ajudar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Channels */}
        <div className="space-y-4">
          {CHANNELS.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="block bg-surface-container-high border border-outline-variant/20 rounded-2xl p-6 hover:border-flame-orange/40 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-flame-orange/20 flex items-center justify-center shrink-0 group-hover:bg-flame-orange/30 transition-colors">
                  <span className="material-symbols-outlined text-flame-orange text-base">{c.icon}</span>
                </div>
                <div>
                  <p className="font-title font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-1">{c.title}</p>
                  <p className="font-body text-sm text-on-surface">{c.value}</p>
                  <p className="font-body text-xs text-on-surface-variant mt-0.5">{c.note}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-8">
            {sent ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-5xl text-flame-orange mb-4 block">check_circle</span>
                <h3 className="font-headline text-2xl uppercase text-on-surface mb-2">Mensagem Enviada!</h3>
                <p className="font-body text-sm text-on-surface-variant">
                  Recebemos seu contato e retornaremos em até 24 horas.
                </p>
                <button
                  onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
                  className="mt-6 font-title font-semibold text-sm text-flame-orange hover:underline uppercase"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">Nome</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">E-mail</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">Assunto</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none transition-all"
                  >
                    <option value="duvida">Dúvida sobre produto</option>
                    <option value="pedido">Problema com pedido</option>
                    <option value="troca">Troca ou devolução</option>
                    <option value="entrega">Entrega / Frete</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">Mensagem</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Descreva sua dúvida ou problema..."
                    rows={5}
                    className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-flame-orange hover:bg-secondary-container text-black font-title font-bold text-base py-4 rounded-full uppercase tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Enviar Mensagem
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
