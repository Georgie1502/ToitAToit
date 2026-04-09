const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Form card */}
      <div className="rounded-3xl bg-surface p-8 shadow-lift md:p-12">
        <h1 className="font-display text-4xl text-ink">{title}</h1>
        <p className="mt-3 font-body text-base text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
        {footer ? <div className="mt-6 font-body text-sm text-muted">{footer}</div> : null}
      </div>

      {/* Decorative aside */}
      <aside aria-hidden="true" className="relative hidden overflow-hidden rounded-3xl lg:block"
        style={{ background: 'linear-gradient(135deg, #DDEAF2 0%, #EEF8FF 100%)' }}>
        {/* floating blobs */}
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primaryContainer/20 blur-2xl" />
        <div className="absolute left-4 top-20 h-28 w-28 rounded-full bg-secondaryContainer/40 blur-xl" />
        <div className="absolute bottom-16 right-8 h-36 w-36 rounded-full bg-accentSoft/50 blur-2xl" />

        {/* Story tag */}
        <div className="absolute left-8 top-8 flex flex-col gap-1">
          <span className="rounded-full bg-accentSoft px-4 py-1.5 text-xs font-semibold text-ink">
            Colocation solidaire
          </span>
          <span className="mt-1 font-serif text-xs italic text-ink/60">
            "Un toit, du lien, des règles claires."
          </span>
        </div>

        <div className="relative mt-32 space-y-4 p-8">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-lift">
            <p className="font-body text-sm font-semibold leading-relaxed text-ink">
              Trouve des colocataires qui partagent tes valeurs et ton rythme de vie.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-lift">
            <p className="font-body text-sm font-semibold leading-relaxed text-ink">
              Profils détaillés, règles de vie visibles dès la recherche.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AuthLayout;
