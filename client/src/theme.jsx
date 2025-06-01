export const theme = {
  colors: {
    primary: {
      main: '#1A2930',     // DENIM
      light: '#C5C1C0',    // SCREEN
      dark: '#0A1612',     // STEEL
    },
    secondary: {
      main: '#F7CE3E',     // MARIGOLD
      light: '#FFFBEA',    // lightened background version (optional)
      dark: '#B29100',     // deeper version of marigold (optional)
    },
    background: {
      default: '#C5C1C0',  // SCREEN
      paper: '#FFFFFF',    // white
    },
    text: {
      primary: '#0A1612',  // STEEL for high contrast text
      secondary: '#1A2930' // DENIM for secondary text
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
