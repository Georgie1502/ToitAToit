export const light = {
  primary: '#4A3279',
  primaryHover: '#826CAD',
  secondary: '#60BBEA',
  accent: '#EF6D96',
  accentSoft: '#FEEB8D',
  support: '#8BD1D3',
  background: '#DBE9F4',
  surface: '#FFFFFF',
  ink: '#1B2030',
  inverse: '#FFFFFF',
  muted: '#4B5563',
  border: '#E2E8F0',
  backdrop: '#CFD8E3',
  danger: '#FF586A',
};

export const dark = light; // dark mode not defined yet, mirror light to avoid undefined access

export const status = {
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#FF586A',
};

export default { light, dark, status };
