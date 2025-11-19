export function Instructions() {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'white',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: '10px 20px',
      borderRadius: '10px',
      fontFamily: 'sans-serif',
      textAlign: 'center',
    }}>
      <p>Use arrow keys to move on the X/Y plane.</p>
      <p>Use 'W' and 'S' keys to move on the Z axis.</p>
    </div>
  );
}
