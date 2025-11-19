type GameOverProps = {
  onRestart: () => void;
};

export function GameOver({ onRestart }: GameOverProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: '4em', margin: 0 }}>Game Over</h1>
      <button
        onClick={onRestart}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '1.5em',
          backgroundColor: '#8bc34a',
          border: 'none',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Restart
      </button>
    </div>
  );
}
