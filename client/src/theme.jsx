import { createTheme } from '@mui/material/styles';

export const theme = {
  colors: {
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f3f4f6',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
    },
  },
  animations: {
    fadeIn: 'fadeIn 0.5s ease-in-out',
    slideIn: 'slideIn 0.5s ease-in-out',
    scaleIn: 'scaleIn 0.3s ease-in-out',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
};

export const keyframes = {
  fadeIn: {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  slideIn: {
    '0%': { transform: 'translateY(20px)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 },
  },
  scaleIn: {
    '0%': { transform: 'scale(0.95)', opacity: 0 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
};

export const tailwindConfig = {
  theme: {
    extend: {
      colors: theme.colors,
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-in-out',
      },
      keyframes: keyframes,
      boxShadow: theme.shadows,
    },
  },
}; 