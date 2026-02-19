import React from "react";
import "./StatsCard.scss";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  iconBgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  value,
  iconBgColor,
}) => {
  return (
    <div className="stats-card">
      <div
        className="stats-card__icon"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
      <div className="stats-card__content">
        <p className="stats-card__title">{title}</p>
        <h3 className="stats-card__value">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
