import React from 'react';
import './PieChart.css';

interface PieChartProps {
  value: number;
  label: string;
  icon: React.ReactNode;
}

const PieChart: React.FC<PieChartProps> = ({ value, label, icon }) => {
  const maxValue = 5;
  const percentage = (value / maxValue) * 100;
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="pie-chart">
      <div className="chart-container">
        <svg width="100" height="100" className="chart-svg">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(139, 92, 246, 0.2)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="progress-circle"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
        </svg>
        <div className="chart-content">
          <div className="chart-icon">{icon}</div>
          <div className="chart-value">{value}</div>
        </div>
      </div>
      <div className="chart-label">{label}</div>
    </div>
  );
};

export default PieChart;