import { Link } from 'react-router-dom';

const Logo = ({ className = '' }) => {
  return (
    <Link to="/" className={`font-display text-2xl text-ink tracking-tight ${className}`}>
      Toit à toit
    </Link>
  );
};

export default Logo;
