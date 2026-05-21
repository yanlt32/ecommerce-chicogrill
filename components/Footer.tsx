export default function Footer() {
  const quickLinks = ["Shop", "Minha Conta", "Meus Pedidos"];
  const helpLinks = ["Envio e Entrega", "Trocas e Devoluções", "Contato"];

  return (
    <footer className="bg-charcoal-deep border-t-2 border-primary-container/20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-16 py-24 w-full max-w-screen-2xl mx-auto">
        <div className="space-y-4">
          <div className="font-headline text-5xl text-flame-orange opacity-50 uppercase">
            CHICO GRILL
          </div>
          <p className="font-body text-base text-on-surface-variant italic">
            Quality cuts, artisan craftsmanship, and a commitment to the flame.
          </p>
        </div>

        <div className="space-y-4">
          <h5 className="font-title font-semibold text-sm text-bone-white uppercase tracking-wider">
            Links Rápidos
          </h5>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-on-surface-variant hover:text-bone-white transition-colors text-xs font-body"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h5 className="font-title font-semibold text-sm text-bone-white uppercase tracking-wider">
            Ajuda
          </h5>
          <ul className="space-y-2">
            {helpLinks.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-on-surface-variant hover:text-bone-white transition-colors text-xs font-body"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h5 className="font-title font-semibold text-sm text-bone-white uppercase tracking-wider">
            Newsletter
          </h5>
          <div className="flex">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="bg-surface-container-high border border-outline-variant/30 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-flame-orange text-on-surface text-sm"
            />
            <button className="bg-flame-orange text-black px-4 py-2 rounded-r-lg hover:bg-secondary-container transition-all">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-16 py-8 border-t border-outline-variant/10 text-center">
        <p className="font-body text-xs text-on-surface-variant">
          © 2024 CHICO GRILL. RAW QUALITY. UNAPOLOGETIC STYLE.
        </p>
      </div>
    </footer>
  );
}
