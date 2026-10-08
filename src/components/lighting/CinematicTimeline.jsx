import { useRef, useEffect, useState } from 'react';
import './cinematic-timeline.css';

export default function CinematicTimeline({ progress, onSeek, stages }) {
  const timelineRef = useRef(null);
  const progressRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSeek = (e) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, x / rect.width));
    onSeek(newProgress);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleSeek(e);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleSeek(e);
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e) => {
    const step = 0.01;
    let newProgress = progress;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      newProgress = Math.max(0, progress - step);
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      newProgress = Math.min(1, progress + step);
      e.preventDefault();
    } else if (e.key === 'Home') {
      newProgress = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      newProgress = 1;
      e.preventDefault();
    }

    if (newProgress !== progress) {
      onSeek(newProgress);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const getCurrentStage = () => {
    for (const stage of stages) {
      if (progress >= stage.start && progress <= stage.end) {
        return stage;
      }
    }
    return null;
  };

  const currentStage = getCurrentStage();

  return (
    <div className="cinematic-timeline">
      <div className="timeline-header">
        <span className="timeline-label">TIMELINE</span>
        <span className="timeline-time">{Math.round(progress * 100)}%</span>
        {currentStage && (
          <span className="current-stage">{currentStage.title}</span>
        )}
      </div>
      
      <div
        ref={timelineRef}
        className="timeline-track"
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-label="Timeline progress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round(progress * 100)}
        tabIndex="0"
      >
        <div className="timeline-ruler">
          {Array.from({ length: 11 }, (_, i) => (
            <div key={i} className="ruler-mark" style={{ left: `${i * 10}%` }} />
          ))}
          <div className="ruler-mark" style={{ left: '100%' }} />
        </div>
        
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`timeline-marker ${currentStage?.id === stage.id ? 'active' : ''}`}
            style={{ left: `${stage.start * 100}%` }}
            title={stage.title}
          >
            <div className="marker-dot" />
            <div className="marker-label">{stage.title}</div>
          </div>
        ))}
        
        <div
          ref={progressRef}
          className="timeline-progress"
          style={{ width: `${progress * 100}%` }}
        >
          <div className="progress-handle" />
        </div>
      </div>
      
      <div className="timeline-footer">
        <div className="timeline-info">
          <span className="info-label">KEY</span>
          <span className={`info-value ${progress > 0.15 ? 'active' : ''}`}>KEYLIGHT</span>
        </div>
        <div className="timeline-info">
          <span className="info-label">FILL</span>
          <span className={`info-value ${progress > 0.45 ? 'active' : ''}`}>FILL</span>
        </div>
        <div className="timeline-info">
          <span className="info-label">RIM</span>
          <span className={`info-value ${progress > 0.6 ? 'active' : ''}`}>RIM</span>
        </div>
      </div>
    </div>
  );
}
