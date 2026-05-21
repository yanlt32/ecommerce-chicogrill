import Link from "next/link";

const UNIDADES = [
  {
    name: "Chico Grill Pinheiros",
    address: "Rua dos Pinheiros, 850",
    neighborhood: "Pinheiros",
    city: "São Paulo — SP",
    hours: "Seg–Sex 10h–20h · Sáb 10h–18h",
    phone: "(11) 3456-7890",
  },
  {
    name: "Chico Grill Vila Madalena",
    address: "Rua Harmonia, 420",
    neighborhood: "Vila Madalena",
    city: "São Paulo — SP",
    hours: "Seg–Sex 11h–21h · Sáb 10h–19h",
    phone: "(11) 3456-7891",
  },
  {
    name: "Chico Grill Moema",
    address: "Av. Ibirapuera, 2120",
    neighborhood: "Moema",
    city: "São Paulo — SP",
    hours: "Ter–Dom 10h–20h",
    phone: "(11) 3456-7892",
  },
];

export default function UnidadesPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-16 py-20">
      <div className="mb-16">
        <span className="inline-block bg-flame-orange text-black font-title font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
          Onde nos encontrar
        </span>
        <h1 className="font-headline text-5xl md:text-7xl uppercase text-on-surface leading-none">
          NOSSAS<br />
          <span className="text-flame-orange">UNIDADES</span>
        </h1>
        <p className="font-body text-base text-on-surface-variant mt-4 max-w-md">
          Visite uma de nossas lojas em São Paulo e sinta a experiência Chico Grill ao vivo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {UNIDADES.map((u) => (
          <div
            key={u.name}
            className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-8 space-y-4 hover:border-flame-orange/40 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-flame-orange/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-flame-orange">storefront</span>
            </div>
            <div>
              <h2 className="font-headline text-2xl text-on-surface uppercase leading-tight">
                {u.name}
              </h2>
              <p className="font-body text-sm text-flame-orange mt-1">{u.neighborhood}</p>
            </div>
            <div className="space-y-2 border-t border-outline-variant/20 pt-4">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-flame-orange text-base mt-0.5">pin_drop</span>
                <div>
                  <p className="font-body text-sm text-on-surface">{u.address}</p>
                  <p className="font-body text-xs text-on-surface-variant">{u.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-flame-orange text-base">schedule</span>
                <p className="font-body text-xs text-on-surface-variant">{u.hours}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-flame-orange text-base">call</span>
                <p className="font-body text-sm text-on-surface">{u.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-flame-orange text-black font-title font-bold px-8 py-4 rounded-full uppercase tracking-wide hover:bg-secondary-container transition-all active:scale-95"
        >
          Comprar Online
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
