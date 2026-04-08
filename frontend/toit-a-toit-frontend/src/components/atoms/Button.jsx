const base =
  'inline-flex items-center justify-center rounded-full font-semibold transition duration-200 ease-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryContainer focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
  primary:
    'bg-cta-gradient text-inverse shadow-soft hover:scale-[1.02] hover:shadow-lift active:scale-[0.98]',
  secondary:
    'bg-surface text-primary border border-primary/20 shadow-soft hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98]',
  ghost:
    'text-ink bg-transparent hover:bg-surfaceContainer hover:scale-[1.02] active:scale-[0.98]',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const Button = ({ as: Component = 'button', variant = 'primary', size = 'md', className = '', ...props }) => {
  return <Component className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
};

export default Button;
