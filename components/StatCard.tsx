import { StatCardProps } from "@/types";
import React from "react";

const StatCard = ({ icon, title, value, color }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div
      className={`${color} p-4 text-gray-600 flex justify-between items-center`}
    >
      <div>{icon}</div>
      <div className="text-right">
        <p className="text-sm ">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default StatCard;
