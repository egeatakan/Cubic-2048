import { Theme } from '../lib/themes';

type ThemeEditorProps = {
  theme: Theme;
  onThemeChange: (newTheme: Theme) => void;
  onClose: () => void;
};

export function ThemeEditor({ theme, onThemeChange, onClose }: ThemeEditorProps) {
  const handleColorChange = (key: keyof Theme, value: any) => {
    const newTheme = { ...theme, [key]: value };
    onThemeChange(newTheme);
  };

  const handleTileColorChange = (tileValue: number, color: string) => {
    const newTileColors = { ...theme.tileColors, [tileValue]: color };
    handleColorChange('tileColors', newTileColors);
  };

  return (
    <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '10px', color: 'white', zIndex: 200, maxHeight: '80vh', overflowY: 'auto' }}>
      <h2>Theme Editor</h2>
      <div>
        <label>Background Color: </label>
        <input type="color" value={theme.backgroundColor} onChange={(e) => handleColorChange('backgroundColor', e.target.value)} />
      </div>
      <div>
        <label>Text Color: </label>
        <input type="color" value={theme.textColor} onChange={(e) => handleColorChange('textColor', e.target.value)} />
      </div>
      <div>
        <label>Grid Color: </label>
        <input type="color" value={theme.gridColor} onChange={(e) => handleColorChange('gridColor', e.target.value)} />
      </div>
      <hr />
      <h3>Tile Colors</h3>
      {Object.keys(theme.tileColors).map((value) => (
        <div key={value}>
          <label>Tile {value}: </label>
          <input type="color" value={theme.tileColors[Number(value)]} onChange={(e) => handleTileColorChange(Number(value), e.target.value)} />
        </div>
      ))}
      <button onClick={onClose} style={{ marginTop: '20px' }}>Close</button>
    </div>
  );
}
