const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[32px] bg-white/90 p-8 shadow-lift ring-1 ring-ink/5 md:p-10">
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        <p className="mt-3 text-sm text-ink/70">{subtitle}</p>
        <div className="mt-8">{children}</div>
        {footer ? <div className="mt-6 text-sm text-ink/70">{footer}</div> : null}
      </div>
      <aside className="relative hidden overflow-hidden rounded-[32px] bg-sky/80 p-8 shadow-soft ring-1 ring-ink/5 lg:block">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sun/80" />
        <div className="absolute left-6 top-16 h-20 w-20 rounded-full bg-rose/50" />
        <div className="absolute bottom-12 left-10 h-24 w-24 rounded-full bg-teal/60" />
        <div className="relative mt-12 rounded-3xl bg-white/90 p-6 text-sm text-ink/70 shadow-soft">
          Trouve des colocataires qui partagent tes envies, dans une ambiance douce et lumineuse.
        </div>
        <div className="relative mt-6 rounded-3xl bg-white/80 p-6 text-sm text-ink/70 shadow-soft">
          Active les notifications pour ne rater aucune nouvelle conversation.
        </div>
      </aside>
    </div>
  );
};

export default AuthLayout;
