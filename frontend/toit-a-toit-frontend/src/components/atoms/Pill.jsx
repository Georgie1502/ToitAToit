const Pill = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-accentSoft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink ${className}`}
    >
      {children}
    </span>
  );
};

export default Pill;
