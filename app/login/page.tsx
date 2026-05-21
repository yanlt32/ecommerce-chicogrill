"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const { login } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (tab === "login") {
      // Simulate login — in a real app, call your backend here
      const stored = localStorage.getItem(`cg_user_${email}`);
      if (!stored) {
        setError("E-mail não encontrado. Crie uma conta primeiro.");
        return;
      }
      const user = JSON.parse(stored);
      if (user.password !== password) {
        setError("Senha incorreta.");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        login({ name: user.name, email: user.email, phone: user.phone, cpf: user.cpf });
        setDone(true);
        setTimeout(() => router.push(redirect), 1200);
      }, 800);
    } else {
      // Register
      if (!name.trim()) { setError("Informe seu nome."); return; }
      setLoading(true);
      setTimeout(() => {
        const userData = { name, email, password };
        localStorage.setItem(`cg_user_${email}`, JSON.stringify(userData));
        login({ name, email });
        setDone(true);
        setTimeout(() => router.push(redirect), 1200);
      }, 800);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-headline text-4xl text-flame-orange uppercase tracking-tighter">
            CHICO GRILL
          </Link>
          <p className="font-body text-sm text-on-surface-variant mt-2">
            {redirect === "/checkout"
              ? "Entre ou crie uma conta para finalizar sua compra."
              : "Raw quality. Unapologetic style."}
          </p>
        </div>

        <div className="bg-surface-container-high rounded-2xl border border-outline-variant/20 p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-outline-variant/20">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 pb-3 font-title font-semibold text-sm uppercase tracking-wider transition-all border-b-2 -mb-px ${
                  tab === t
                    ? "border-flame-orange text-flame-orange"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {t === "login" ? "Entrar" : "Cadastrar"}
              </button>
            ))}
          </div>

          {done ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-5xl text-flame-orange mb-4 block">
                check_circle
              </span>
              <p className="font-title font-bold text-lg text-on-surface">
                {tab === "login" ? "Bem-vindo de volta!" : "Conta criada! Você já está logado."}
              </p>
              <p className="font-body text-sm text-on-surface-variant mt-2">
                Redirecionando...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {tab === "register" && (
                <div>
                  <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none transition-all"
                />
              </div>

              <div>
                <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none transition-all"
                />
              </div>

              {error && (
                <p className="text-meat-red font-body text-sm">{error}</p>
              )}

              {tab === "login" && (
                <div className="text-right">
                  <button type="button" className="font-title text-xs text-on-surface-variant hover:text-flame-orange transition-colors">
                    Esqueci minha senha
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-flame-orange hover:bg-secondary-container text-black font-title font-bold text-base py-4 rounded-full uppercase tracking-wide transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                    Aguarde...
                  </>
                ) : tab === "login" ? "Entrar" : "Criar conta"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center font-body text-xs text-on-surface-variant mt-6">
          Ao continuar, você concorda com os{" "}
          <a href="#" className="text-flame-orange hover:underline">Termos de Uso</a>{" "}
          e a{" "}
          <a href="#" className="text-flame-orange hover:underline">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-flame-orange text-4xl">progress_activity</span>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
