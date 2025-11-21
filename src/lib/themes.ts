export type Theme = {
  name: string;
  tileColors: { [key: number]: string };
  backgroundColor: string;
  textColor: string;
  gridColor: string;
};

export const themes: { [key: string]: Theme } = {
  default: {
    name: 'Default',
    tileColors: {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    },
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    gridColor: '#3b3b3b',
  },
  forest: {
    name: 'Forest',
    tileColors: {
      2: '#dcedc8',
      4: '#c5e1a5',
      8: '#aed581',
      16: '#9ccc65',
      32: '#8bc34a',
      64: '#7cb342',
      128: '#689f38',
      256: '#558b2f',
      512: '#33691e',
      1024: '#1b5e20',
      2048: '#1b5e20',
    },
    backgroundColor: '#3e2723',
    textColor: '#ffffff',
    gridColor: '#4e342e',
  },
  synthwave: {
    name: 'Synthwave',
    tileColors: {
      2: '#ff00ff',
      4: '#ff40ff',
      8: '#ff80ff',
      16: '#ffbfff',
      32: '#00ffff',
      64: '#40ffff',
      128: '#80ffff',
      256: '#bffff',
      512: '#ff0000',
      1024: '#ff4000',
      2048: '#ff8000',
    },
    backgroundColor: '#0d0221',
    textColor: '#ffffff',
    gridColor: '#240046',
  },
  custom: {
    name: 'Custom',
    tileColors: {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    },
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    gridColor: '#3b3b3b',
  },
};
