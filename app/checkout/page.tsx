"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/products";

type Step = "info" | "address" | "payment" | "success";
type ViaCEP = { logradouro: string; bairro: string; localidade: string; uf: string; erro?: boolean };

function formatCep(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 8);
  return n.length > 5 ? `${n.slice(0, 5)}-${n.slice(5)}` : n;
}

const STEPS: Step[] = ["info", "address", "payment"];
const STEP_LABELS: Record<Step, string> = { info: "Dados Pessoais", address: "Endereço", payment: "Pagamento", success: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, count, removeItem } = useCart();
  const { user, address: savedAddress, updateUser, saveAddress, addOrder, updateOrder } = useAuth();
  const [step, setStep] = useState<Step>("info");
  const [payMethod, setPayMethod] = useState<"pix" | "card">("pix");
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<{ id: string } | null>(null);

  // Info form
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [cpf, setCpf] = useState(user?.cpf ?? "");

  // Address form
  const [cep, setCep] = useState(savedAddress?.cep ?? "");
  const [street, setStreet] = useState(savedAddress?.street ?? "");
  const [number, setNumber] = useState(savedAddress?.number ?? "");
  const [complement, setComplement] = useState(savedAddress?.complement ?? "");
  const [neighborhood, setNeighborhood] = useState(savedAddress?.neighborhood ?? "");
  const [city, setCity] = useState(savedAddress?.city ?? "");
  const [uf, setUf] = useState(savedAddress?.state ?? "");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  // Parcelas
  const [installments, setInstallments] = useState(1);

  const shipping = total >= 300 ? 0 : 15;
  const orderTotal = total + shipping;

  // pre-fill from auth when user loads
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.cpf) setCpf(user.cpf);
    }
    if (savedAddress) {
      setCep(savedAddress.cep);
      setStreet(savedAddress.street);
      setNumber(savedAddress.number);
      setComplement(savedAddress.complement ?? "");
      setNeighborhood(savedAddress.neighborhood);
      setCity(savedAddress.city);
      setUf(savedAddress.state);
    }
  }, [user, savedAddress]);

  async function lookupCep(value: string) {
    const clean = value.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setCepLoading(true);
    setCepError("");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data: ViaCEP = await res.json();
      if (data.erro) { setCepError("CEP não encontrado."); return; }
      setStreet(data.logradouro);
      setNeighborhood(data.bairro);
      setCity(data.localidade);
      setUf(data.uf);
    } catch { setCepError("Erro ao consultar CEP."); }
    finally { setCepLoading(false); }
  }

  function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = formatCep(e.target.value);
    setCep(v);
    if (v.replace(/\D/g, "").length === 8) lookupCep(v);
  }

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (step === "info") {
      updateUser({ phone, cpf });
      setStep("address");
    } else if (step === "address") {
      saveAddress({ cep, street, number, complement, neighborhood, city, state: uf });
      setStep("payment");
    } else if (step === "payment") {
      setSubmitting(true);
      try {
        const orderItems = items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          size: i.size,
          image: i.product.image,
        }));

        const newOrder = addOrder({
          total: orderTotal,
          items: orderItems,
          address: { cep, street, number, complement, neighborhood, city, state: uf },
          payMethod: payMethod === "pix" ? "PIX" : `Cartão (${installments}x)`,
        });

        // Generate shipping label automatically
        try {
          const res = await fetch("/api/shipping/label", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerName: name,
              customerEmail: email,
              customerPhone: phone,
              address: { street, number, district: neighborhood, city, state: uf, cep },
              serviceId: 1, // PAC
              insuranceValue: total,
              items: items.map((i) => ({
                name: i.product.name,
                quantity: i.quantity,
                price: i.product.price,
              })),
            }),
          });
          if (res.ok) {
            const { trackingCode, labelUrl, meOrderId } = await res.json();
            updateOrder(newOrder.id, { trackingCode, labelUrl, meOrderId });
          }
        } catch {
          // Label generation is non-critical — admin can regenerate from the panel
        }

        items.forEach((i) => removeItem(i.product.id, i.size));
        setOrder(newOrder);
        setStep("success");
      } finally {
        setSubmitting(false);
      }
    }
  }

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <span className="material-symbols-outlined text-6xl text-outline">shopping_cart</span>
        <p className="font-title font-semibold text-xl text-on-surface-variant">Seu carrinho está vazio</p>
        <Link href="/" className="bg-flame-orange text-black font-title font-bold px-8 py-4 rounded-full uppercase">
          Explorar a Loja
        </Link>
      </div>
    );
  }

  if (step === "success" && order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-flame-orange/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-flame-orange">check_circle</span>
        </div>
        <h1 className="font-headline text-4xl md:text-5xl uppercase text-on-surface">Pedido Confirmado!</h1>
        <p className="font-body text-lg text-on-surface-variant max-w-sm">
          Seu pedido <span className="text-flame-orange font-bold">#{order.id}</span> foi recebido e está sendo preparado.
        </p>
        <div className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/20 w-full max-w-sm space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-title font-semibold text-on-surface-variant uppercase">Total pago</span>
            <span className="font-headline text-xl text-flame-orange">{formatPrice(orderTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-title font-semibold text-on-surface-variant uppercase">Entrega estimada</span>
            <span className="font-body text-on-surface">5–8 dias úteis</span>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/account" className="bg-flame-orange text-black font-title font-bold px-8 py-4 rounded-full uppercase">
            Ver Meus Pedidos
          </Link>
          <Link href="/" className="border border-outline-variant/40 text-on-surface font-title font-bold px-8 py-4 rounded-full uppercase hover:border-outline transition-all">
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-16 py-12">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-title font-bold shrink-0 transition-all ${i <= stepIndex ? "bg-flame-orange text-black" : "bg-surface-container-high text-on-surface-variant border border-outline-variant/40"}`}>
              {i < stepIndex ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
            </div>
            <span className={`text-xs font-title font-semibold uppercase tracking-wide hidden sm:block ${i === stepIndex ? "text-flame-orange" : "text-on-surface-variant"}`}>
              {STEP_LABELS[s]}
            </span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < stepIndex ? "bg-flame-orange" : "bg-outline-variant/30"}`} />}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-grow">
          <h2 className="font-headline text-3xl md:text-4xl uppercase mb-8">{STEP_LABELS[step]}</h2>

          <form onSubmit={handleNext} className="space-y-5">
            {step === "info" && (
              <>
                <Field label="Nome completo" value={name} onChange={setName} placeholder="Seu nome" required />
                <Field label="E-mail" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" required />
                <Field label="Telefone" type="tel" value={phone} onChange={setPhone} placeholder="(11) 99999-9999" required />
                <Field label="CPF" value={cpf} onChange={setCpf} placeholder="000.000.000-00" required />
              </>
            )}

            {step === "address" && (
              <>
                <div>
                  <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">CEP</label>
                  <div className="flex gap-2 items-center">
                    <input type="text" value={cep} onChange={handleCepChange} placeholder="00000-000" maxLength={9} required
                      className="w-48 bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none transition-all" />
                    {cepLoading && <span className="material-symbols-outlined animate-spin text-flame-orange">progress_activity</span>}
                  </div>
                  {cepError && <p className="text-meat-red text-xs mt-1 font-body">{cepError}</p>}
                </div>
                <Field label="Rua" value={street} onChange={setStreet} placeholder="Rua, Av..." required />
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Número" value={number} onChange={setNumber} placeholder="123" required />
                  <Field label="Complemento" value={complement} onChange={setComplement} placeholder="Apto, Bloco..." />
                </div>
                <Field label="Bairro" value={neighborhood} onChange={setNeighborhood} placeholder="Seu bairro" required />
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Cidade" value={city} onChange={setCity} placeholder="Sua cidade" required />
                  <Field label="Estado" value={uf} onChange={setUf} placeholder="UF" required />
                </div>
              </>
            )}

            {step === "payment" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {(["pix", "card"] as const).map((m) => (
                    <button key={m} type="button" onClick={() => setPayMethod(m)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${payMethod === m ? "border-flame-orange bg-flame-orange/10" : "border-outline-variant/40 hover:border-outline"}`}>
                      <span className="material-symbols-outlined text-3xl text-flame-orange">{m === "pix" ? "qr_code_2" : "credit_card"}</span>
                      <span className="font-title font-semibold text-sm uppercase">{m === "pix" ? "PIX" : "Cartão"}</span>
                    </button>
                  ))}
                </div>

                {payMethod === "pix" && (
                  <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/20 flex flex-col items-center gap-4 text-center">
                    <span className="material-symbols-outlined text-6xl text-flame-orange">qr_code_2</span>
                    <div>
                      <p className="font-title font-semibold text-sm">Chave PIX</p>
                      <p className="font-body text-sm text-on-surface-variant font-mono mt-1 select-all">contato@chicogrill.com.br</p>
                    </div>
                    <p className="font-body text-xs text-on-surface-variant">O QR Code será gerado após confirmação do pedido.</p>
                    <div className="bg-surface-container-high text-xs text-on-surface-variant p-3 rounded-lg font-body w-full">
                      💡 Integração PagBank: substitua pela chamada à API PagBank Orders com suas credenciais.
                    </div>
                  </div>
                )}

                {payMethod === "card" && (
                  <div className="space-y-4">
                    <Field label="Número do Cartão" value="" onChange={() => {}} placeholder="0000 0000 0000 0000" required />
                    <Field label="Nome no Cartão" value="" onChange={() => {}} placeholder="NOME SOBRENOME" required />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Validade" value="" onChange={() => {}} placeholder="MM/AA" required />
                      <Field label="CVV" value="" onChange={() => {}} placeholder="000" required />
                    </div>
                    <div>
                      <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">Parcelas</label>
                      <select value={installments} onChange={(e) => setInstallments(Number(e.target.value))}
                        className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none">
                        {[1, 2, 3, 6, 12].map((n) => (
                          <option key={n} value={n}>
                            {n}x de {formatPrice(orderTotal / n)}{n === 1 ? " sem juros" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="bg-surface-container-high text-xs text-on-surface-variant p-3 rounded-lg font-body">
                      💡 Integração PagBank: conecte via PagBank Charges API com suas chaves de produção.
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {stepIndex > 0 && (
                <button type="button" onClick={() => setStep(STEPS[stepIndex - 1])}
                  className="border border-outline-variant/40 text-on-surface font-title font-semibold text-sm px-6 py-3 rounded-full uppercase hover:border-outline transition-all">
                  Voltar
                </button>
              )}
              <button type="submit" disabled={submitting}
                className="flex-1 bg-flame-orange hover:bg-secondary-container text-black font-title font-bold text-base py-4 rounded-full uppercase tracking-wide transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting ? (
                  <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span>Processando...</>
                ) : step === "payment" ? "Confirmar Pedido" : "Continuar"}
              </button>
            </div>
          </form>
        </div>

        {/* Order summary */}
        <div className="lg:w-80 shrink-0">
          <div className="sticky top-24 bg-surface-container-high p-6 rounded-2xl border border-outline-variant/20">
            <h3 className="font-headline text-2xl mb-6 uppercase">Resumo</h3>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-surface-container rounded-lg shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-title font-semibold text-xs text-on-surface uppercase truncate">{item.product.name}</p>
                    <p className="font-body text-xs text-on-surface-variant">{item.size} · Qtd: {item.quantity}</p>
                  </div>
                  <span className="font-headline text-base text-flame-orange shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-outline-variant/20 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-title font-semibold text-on-surface-variant uppercase">Subtotal ({count})</span>
                <span className="font-body text-on-surface">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-title font-semibold text-on-surface-variant uppercase">Frete</span>
                <span className="font-body text-on-surface">{shipping === 0 ? "Grátis" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20">
                <span className="font-headline text-2xl">TOTAL</span>
                <span className="font-headline text-3xl text-flame-orange">{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, placeholder, required }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string; required?: boolean;
}) {
  return (
    <div>
      <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none transition-all" />
    </div>
  );
}
