const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full rounded-full border border-ink/10 bg-surface px-5 py-3 text-sm text-ink shadow-soft transition duration-150 placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    />
  );
};

export default Input;
