const base =
  'inline-flex items-center justify-center rounded-full font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
  primary: 'bg-ink text-white shadow-soft hover:-translate-y-0.5',
  accent: 'bg-coral text-white shadow-soft hover:-translate-y-0.5',
  ghost: 'border border-ink/10 bg-white/70 text-ink hover:-translate-y-0.5',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({ as: Component = 'button', variant = 'primary', size = 'md', className = '', ...props }) => {
  return (
    <Component className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
};

export default Button;
