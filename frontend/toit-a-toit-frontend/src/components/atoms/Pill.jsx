const Pill = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-sun/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink ${className}`}
    >
      {children}
    </span>
  );
};

export default Pill;
