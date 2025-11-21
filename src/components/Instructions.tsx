import React from 'react';

export function Instructions() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '10px',
        borderRadius: '5px',
      }}
    >
      <h1>Cubic 2048</h1>
      <p>Use arrow keys and WASD to move the cubes.</p>
      <p>Merge cubes with the same number to score points.</p>
    </div>
  );
}