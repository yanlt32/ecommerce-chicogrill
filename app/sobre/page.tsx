import Link from "next/link";

export default function SobrePage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-16 py-20">
      <div className="max-w-2xl">
        <span className="inline-block bg-flame-orange text-black font-title font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
          Nossa História
        </span>
        <h1 className="font-headline text-5xl md:text-7xl uppercase text-on-surface leading-none mb-8">
          SOBRE A<br />
          <span className="text-flame-orange">CHICO GRILL</span>
        </h1>
        <div className="space-y-6 font-body text-base text-on-surface-variant leading-relaxed">
          <p>
            A Chico Grill nasceu das brasas de São Paulo — da cultura do churrasco que vai além da comida e vira um estilo de vida. Somos uma marca de streetwear que carrega a intensidade, a rudeza e a autenticidade da carne na brasa em cada peça.
          </p>
          <p>
            Fundada por quem vive o churrasco de verdade, a Chico Grill reúne design arrojado, materiais premium e uma identidade que não pede desculpa pra ninguém. Qualidade artesanal, estilo sem compromisso.
          </p>
          <p>
            Cada drop é pensado para quem não segue tendência — cria. Para quem não tem medo de se destacar. Para quem sente o fogo.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-outline-variant/20">
          {[
            { value: "2021", label: "Fundação" },
            { value: "2K+", label: "Clientes" },
            { value: "100%", label: "Autêntico" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-headline text-4xl text-flame-orange">{s.value}</p>
              <p className="font-body text-xs text-on-surface-variant uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-flame-orange text-black font-title font-bold px-8 py-4 rounded-full uppercase tracking-wide hover:bg-secondary-container transition-all active:scale-95"
          >
            Ver Coleção
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <Link
            href="/unidades"
            className="inline-flex items-center gap-2 border-2 border-outline-variant/40 text-on-surface font-title font-bold px-8 py-4 rounded-full uppercase tracking-wide hover:border-flame-orange hover:text-flame-orange transition-all active:scale-95"
          >
            Nossas Unidades
          </Link>
        </div>
      </div>
    </div>
  );
}
