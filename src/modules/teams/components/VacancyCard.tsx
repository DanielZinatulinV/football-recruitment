import React from "react";
import type { Vacancy } from "../types/team-dashboard.types";

interface VacancyCardProps {
  vacancy: Vacancy;
  onEdit: (vac: Vacancy) => void;
  onClose: (id: string) => void;
  onOpen: (id: string) => void;
  onDraft: (id: string) => void;
  onRestore: (id: string) => void;
  onActivate: (id: string) => void;
}

const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy, onEdit, onClose, onOpen, onDraft, onRestore, onActivate }) => {
  let salaryStr = "";
  if (vacancy.salaryFrom && vacancy.salaryTo) salaryStr = `from ${vacancy.salaryFrom} to ${vacancy.salaryTo}`;
  else if (vacancy.salaryFrom) salaryStr = `from ${vacancy.salaryFrom}`;
  else if (vacancy.salaryTo) salaryStr = `to ${vacancy.salaryTo}`;
  let locationStr = vacancy.anyLocation ? "Any location (Remote)" : (vacancy.location || "");

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-wrap items-center gap-6">
      <div className="flex-1">
        <div className="font-semibold text-lg">{vacancy.role}</div>
        <div className="text-gray-600 text-sm">{vacancy.requirements}</div>
        <div className="text-gray-500 text-xs mt-1">
          {salaryStr && <>Salary: {salaryStr} | </>}
          {locationStr && <>Location: {locationStr} | </>}
          Expiry: {vacancy.expiry}
        </div>
        <div className="text-xs mt-1">
          Статус: <span className="font-bold">{vacancy.status}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 rounded bg-yellow-300 text-black font-bold hover:bg-yellow-400 transition" onClick={() => onEdit(vacancy)}>Edit</button>
        {vacancy.status !== 'draft' && (
          vacancy.status === 'active' ? (
            <button className="px-4 py-2 rounded bg-black text-yellow-300 font-bold hover:bg-yellow-400 hover:text-black transition" onClick={() => onClose(vacancy.id)}>Close</button>
          ) : (
            <button className="px-4 py-2 rounded bg-green-500 text-white font-bold hover:bg-green-600 transition" onClick={() => onActivate(vacancy.id)}>Открыть</button>
          )
        )}
        {vacancy.status !== 'draft' ? (
          <button className="px-4 py-2 rounded bg-gray-400 text-white font-bold hover:bg-gray-500 transition" onClick={() => onDraft(vacancy.id)}>Archive</button>
        ) : (
          <button className="px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 transition" onClick={() => onRestore(vacancy.id)}>Restore</button>
        )}
      </div>
    </div>
  );
};

export default VacancyCard; 