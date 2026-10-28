import React from 'react';

interface CircularProgressProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  valueText?: string;
  subLabel?: string;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 130,
  strokeWidth = 7,
  color = '#10B981', // Mint emerald default
  trackColor = '#E8DFD5',
  valueText,
  subLabel,
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 origin-center"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
        />
        {/* Animated foreground track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.65s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.3s ease',
          }}
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none px-2">
        {valueText && (
          <span className="text-2xl font-extrabold text-[#27272A] tracking-tight tabular-nums leading-none">
            {valueText}
          </span>
        )}
        {subLabel && (
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#716E69] mt-1 leading-none">
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
};
