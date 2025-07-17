import React from "react";
import type { Vacancy } from "../types/team-dashboard.types";

type VacancyCardProps = {
  vacancy: Vacancy;
  onEdit: (vac: Vacancy) => void;
  onDelete: (id: string) => void;
};

const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy, onEdit, onDelete }) => {
  let salaryStr = "";
  if (vacancy.salaryFrom && vacancy.salaryTo) salaryStr = `from ${vacancy.salaryFrom} to ${vacancy.salaryTo}`;
  else if (vacancy.salaryFrom) salaryStr = `from ${vacancy.salaryFrom}`;
  else if (vacancy.salaryTo) salaryStr = `to ${vacancy.salaryTo}`;
  let locationStr = vacancy.anyLocation ? "Any location (Remote)" : (vacancy.location || "");

  return (
    <div className="bg-white border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-2">
      <div className="flex-1">
        <div className="font-semibold text-lg">{vacancy.role}</div>
        <div className="text-gray-600 text-sm">{vacancy.requirements}</div>
        <div className="text-gray-500 text-xs mt-1">
          {salaryStr && <>Salary: {salaryStr} | </>}
          {locationStr && <>Location: {locationStr} | </>}
          Expiry: {vacancy.expiry}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 rounded bg-yellow-300 text-black text-sm font-bold hover:bg-yellow-400 transition"
          onClick={() => onEdit(vacancy)}
        >
          Edit
        </button>
        <button
          className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
          onClick={() => onDelete(vacancy.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default VacancyCard; 