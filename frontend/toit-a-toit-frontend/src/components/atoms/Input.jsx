const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink shadow-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/30 ${className}`}
      {...props}
    />
  );
};

export default Input;
