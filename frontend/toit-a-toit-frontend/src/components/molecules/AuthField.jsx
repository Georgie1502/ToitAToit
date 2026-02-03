import Input from '../atoms/Input';

const AuthField = ({ label, className = '', ...props }) => {
  return (
    <label className={`flex flex-col gap-2 text-sm font-semibold text-ink ${className}`}>
      {label}
      <Input {...props} />
    </label>
  );
};

export default AuthField;
