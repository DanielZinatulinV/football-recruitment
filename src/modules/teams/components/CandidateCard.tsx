import React from "react";
import { useNavigate } from "react-router-dom";
import type { Candidate } from "../types/team-dashboard.types";

type CandidateCardProps = {
  candidate: Candidate;
  inShortlist: boolean;
  onToggleShortlist: (id: number) => void;
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, inShortlist, onToggleShortlist }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-center gap-6">
      <div className="flex-1 min-w-[200px]">
        <div className="font-semibold text-lg text-black">{candidate.firstName} {candidate.lastName}</div>
        <div className="text-yellow-400 font-medium">{candidate.position}</div>
        <div className="text-gray-500 text-sm">{candidate.location} • {candidate.experience} years • {candidate.selectedPlan === 'pro' ? 'Pro' : 'Basic'} plan</div>
        <div className="mt-2 text-black">Skills: {candidate.skills}</div>
      </div>
      <div className="flex flex-col gap-2 text-right min-w-[140px]">
        <button
          className={`rounded-lg px-5 py-2 font-semibold transition border-2 ${inShortlist ? 'bg-yellow-300 text-black border-yellow-400' : 'bg-white text-yellow-400 border-yellow-300 hover:bg-yellow-50'}`}
          onClick={() => onToggleShortlist(candidate.id)}
        >
          {inShortlist ? 'In shortlist ✓' : 'Add to shortlist'}
        </button>
        <button
          className="rounded-lg px-5 py-2 bg-yellow-300 text-black font-bold hover:bg-yellow-400 transition"
          onClick={() => navigate(`/team/candidate/${candidate.id}`)}
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default CandidateCard; 