const base =
  'inline-flex items-center justify-center rounded-[12px] font-semibold transition duration-150 ease-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryHover focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65';

const variants = {
  primary: 'bg-primary text-inverse shadow-soft hover:-translate-y-[1px] hover:bg-primaryHover',
  secondary: 'border border-secondary text-secondary bg-transparent hover:bg-secondary/10 hover:-translate-y-[1px] shadow-soft',
  ghost: 'text-ink hover:bg-surface border border-transparent hover:-translate-y-[1px]',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({ as: Component = 'button', variant = 'primary', size = 'md', className = '', ...props }) => {
  return <Component className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
};

export default Button;
