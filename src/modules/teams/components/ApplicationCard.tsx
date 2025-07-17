import React from "react";
import type { Application } from "../types/team-dashboard.types";

export type ApplicationCardProps = {
  application: Application;
  onStatusChange: (id: number, status: string) => void;
  onProfile: (candidateId: number) => void;
};

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onStatusChange, onProfile }) => {
  return (
    <div className="bg-white border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-2">
      <div className="flex-1">
        <div className="font-semibold text-lg text-black">
          {application.candidate ? `${application.candidate.first_name} ${application.candidate.last_name}` : `Candidate #${application.candidate_id}`}
        </div>
        <div className="text-yellow-400 font-medium">
          Vacancy: {application.vacancy ? application.vacancy.role : application.vacancy_id}
        </div>
        <div className="text-gray-500 text-xs mt-1">
          Status: <span className={
            application.status === 'pending' ? 'text-yellow-400' :
            application.status === 'accepted' ? 'text-green-600' :
            application.status === 'declined' ? 'text-red-500' : 'text-gray-400'
          }>{application.status}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 rounded bg-yellow-300 text-black text-sm font-bold hover:bg-yellow-400 transition"
          onClick={() => onProfile(application.candidate_id)}
        >
          Profile
        </button>
        {application.status === 'pending' && (
          <>
            <button
              className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
              onClick={() => onStatusChange(application.id, 'accepted')}
            >
              Accept
            </button>
            <button
              className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
              onClick={() => onStatusChange(application.id, 'declined')}
            >
              Decline
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard; 