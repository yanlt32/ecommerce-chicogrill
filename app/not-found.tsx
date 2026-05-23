import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <span className="material-symbols-outlined text-6xl text-flame-orange mb-2 block">
          error
        </span>

        <p className="font-headline text-[120px] leading-none text-flame-orange">
          404
        </p>

        <h1 className="font-headline text-4xl text-on-surface uppercase mb-4">
          PÁGINA NÃO ENCONTRADA
        </h1>

        <p className="font-body text-base text-on-surface-variant mb-10 max-w-md mx-auto">
          A página que você procura não existe ou foi movida.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-flame-orange text-black font-title font-bold px-8 py-4 rounded-full uppercase tracking-wide hover:bg-secondary-container transition-all active:scale-95"
          >
            Voltar para a Loja
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 border-2 border-outline-variant/40 text-on-surface font-title font-bold px-8 py-4 rounded-full uppercase tracking-wide hover:border-flame-orange hover:text-flame-orange transition-all active:scale-95"
          >
            Ver Meu Carrinho
          </Link>
        </div>
      </div>
    </div>
  );
}
