const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 ${className}`}
      {...props}
    />
  );
};

export default Input;
