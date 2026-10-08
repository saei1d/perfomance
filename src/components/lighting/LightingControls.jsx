import { useState } from 'react';
import './lighting-controls.css';

const PRESETS = {
  cinematic: {
    keyIntensity: 5,
    fillIntensity: 0.8,
    rimIntensity: 2.5,
    ambient: 0.08,
    keyColor: { r: 1, g: 1, b: 1 },
    keyPosition: { x: -2.8, y: 2.35, z: 3.3 },
  },
  bright: {
    keyIntensity: 6,
    fillIntensity: 1.2,
    rimIntensity: 3,
    ambient: 0.1,
    keyColor: { r: 1, g: 1, b: 1 },
    keyPosition: { x: -3, y: 2.5, z: 4 },
  },
  green: {
    keyIntensity: 5,
    fillIntensity: 1,
    rimIntensity: 2.5,
    ambient: 0.09,
    keyColor: { r: 0.22, g: 1, b: 0.08 },
    keyPosition: { x: -2.8, y: 2.35, z: 3.3 },
  },
  studio: {
    keyIntensity: 5.5,
    fillIntensity: 1,
    rimIntensity: 2.8,
    ambient: 0.09,
    keyColor: { r: 0.9, g: 1, b: 0.9 },
    keyPosition: { x: -3, y: 2.4, z: 3.8 },
  },
  dramatic: {
    keyIntensity: 7,
    fillIntensity: 0.3,
    rimIntensity: 3.5,
    ambient: 0.05,
    keyColor: { r: 1, g: 1, b: 1 },
    keyPosition: { x: -4, y: 2.8, z: 4.5 },
  },
};

export default function LightingControls({ onLightingChange, initialValues }) {
  const [controls, setControls] = useState(
    initialValues || {
      keyIntensity: 5,
      fillIntensity: 0.8,
      rimIntensity: 2.5,
      ambient: 0.08,
      keyColor: { r: 0.97, g: 0.95, b: 0.91 },
      keyPosition: { x: -2.8, y: 2.35, z: 3.3 },
    }
  );

  const handleSliderChange = (key, value) => {
    const newControls = { ...controls, [key]: parseFloat(value) };
    setControls(newControls);
    onLightingChange(newControls);
  };

  const handlePositionChange = (axis, value) => {
    const newControls = {
      ...controls,
      keyPosition: { ...controls.keyPosition, [axis]: parseFloat(value) },
    };
    setControls(newControls);
    onLightingChange(newControls);
  };

  const handleColorChange = (component, value) => {
    const newControls = {
      ...controls,
      keyColor: { ...controls.keyColor, [component]: parseFloat(value) },
    };
    setControls(newControls);
    onLightingChange(newControls);
  };

  const applyPreset = (presetName) => {
    const preset = PRESETS[presetName];
    if (preset) {
      setControls(preset);
      onLightingChange(preset);
    }
  };

  const resetToDefault = () => {
    const defaults = PRESETS.cinematic;
    setControls(defaults);
    onLightingChange(defaults);
  };

  return (
    <div className="lighting-controls">
      <div className="controls-header">
        <h3 className="brutalist-title">LIGHTING</h3>
        <button className="reset-btn brutalist-btn" onClick={resetToDefault} aria-label="Reset to default">
          RESET
        </button>
      </div>

      <div className="presets-section">
        <p className="section-label brutalist-label">SCENE PRESETS</p>
        <div className="preset-buttons">
          {Object.keys(PRESETS).map((preset) => (
            <button
              key={preset}
              className="preset-btn brutalist-btn"
              onClick={() => applyPreset(preset)}
              aria-label={`Apply ${preset} preset`}
            >
              {preset.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="control-group">
        <p className="section-label brutalist-label">INTENSITY</p>
        
        <div className="control-item">
          <label htmlFor="key-intensity">KEY</label>
          <input
            id="key-intensity"
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={controls.keyIntensity}
            onChange={(e) => handleSliderChange('keyIntensity', e.target.value)}
            aria-label="Key light intensity"
            className="brutalist-slider"
          />
          <span className="value-display brutalist-value">{controls.keyIntensity.toFixed(1)}</span>
        </div>

        <div className="control-item">
          <label htmlFor="fill-intensity">FILL</label>
          <input
            id="fill-intensity"
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={controls.fillIntensity}
            onChange={(e) => handleSliderChange('fillIntensity', e.target.value)}
            aria-label="Fill light intensity"
            className="brutalist-slider"
          />
          <span className="value-display brutalist-value">{controls.fillIntensity.toFixed(1)}</span>
        </div>

        <div className="control-item">
          <label htmlFor="rim-intensity">RIM</label>
          <input
            id="rim-intensity"
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={controls.rimIntensity}
            onChange={(e) => handleSliderChange('rimIntensity', e.target.value)}
            aria-label="Rim light intensity"
            className="brutalist-slider"
          />
          <span className="value-display brutalist-value">{controls.rimIntensity.toFixed(1)}</span>
        </div>

        <div className="control-item">
          <label htmlFor="ambient">AMB</label>
          <input
            id="ambient"
            type="range"
            min="0"
            max="0.3"
            step="0.01"
            value={controls.ambient}
            onChange={(e) => handleSliderChange('ambient', e.target.value)}
            aria-label="Ambient light intensity"
            className="brutalist-slider"
          />
          <span className="value-display brutalist-value">{controls.ambient.toFixed(2)}</span>
        </div>
      </div>

      <div className="control-group">
        <p className="section-label brutalist-label">POSITION</p>
        
        <div className="control-item">
          <label htmlFor="pos-x">X</label>
          <input
            id="pos-x"
            type="range"
            min="-6"
            max="6"
            step="0.1"
            value={controls.keyPosition.x}
            onChange={(e) => handlePositionChange('x', e.target.value)}
            aria-label="Key light X position"
            className="brutalist-slider"
          />
          <span className="value-display brutalist-value">{controls.keyPosition.x.toFixed(1)}</span>
        </div>

        <div className="control-item">
          <label htmlFor="pos-y">Y</label>
          <input
            id="pos-y"
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={controls.keyPosition.y}
            onChange={(e) => handlePositionChange('y', e.target.value)}
            aria-label="Key light Y position"
            className="brutalist-slider"
          />
          <span className="value-display brutalist-value">{controls.keyPosition.y.toFixed(1)}</span>
        </div>

        <div className="control-item">
          <label htmlFor="pos-z">Z</label>
          <input
            id="pos-z"
            type="range"
            min="-5"
            max="6"
            step="0.1"
            value={controls.keyPosition.z}
            onChange={(e) => handlePositionChange('z', e.target.value)}
            aria-label="Key light Z position"
            className="brutalist-slider"
          />
          <span className="value-display brutalist-value">{controls.keyPosition.z.toFixed(1)}</span>
        </div>
      </div>

      <div className="control-group">
        <p className="section-label brutalist-label">COLOR</p>
        
        <div className="control-item">
          <label htmlFor="color-r">R</label>
          <input
            id="color-r"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={controls.keyColor.r}
            onChange={(e) => handleColorChange('r', e.target.value)}
            aria-label="Key light red channel"
            className="brutalist-slider"
          />
          <span className="value-display brutalist-value">{controls.keyColor.r.toFixed(2)}</span>
        </div>

        <div className="control-item">
          <label htmlFor="color-g">G</label>
          <input
            id="color-g"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={controls.keyColor.g}
            onChange={(e) => handleColorChange('g', e.target.value)}
            aria-label="Key light green channel"
            className="brutalist-slider"
          />
          <span className="value-display brutalist-value">{controls.keyColor.g.toFixed(2)}</span>
        </div>

        <div className="control-item">
          <label htmlFor="color-b">B</label>
          <input
            id="color-b"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={controls.keyColor.b}
            onChange={(e) => handleColorChange('b', e.target.value)}
            aria-label="Key light blue channel"
            className="brutalist-slider"
          />
          <span className="value-display brutalist-value">{controls.keyColor.b.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
