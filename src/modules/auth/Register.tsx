import React, { useState } from "react";
import CandidateRegister from "../candidate/CandidateRegister";
import TeamRegister from "../teams/TeamRegister";
import { SportsSoccer, Star, Group, EmojiEvents } from "@mui/icons-material";

const Register = () => {
  const [role, setRole] = useState<'candidate' | 'team'>('candidate');

  return (
    <div className="min-h-screen bg-black pt-5 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-3xl mx-auto text-center py-10 relative">
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-white leading-tight">
          Join the <span className="text-yellow-300">Football</span> Network
        </h1>
        <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
          Register as a <span className="text-yellow-300 font-bold">Candidate</span> or <span className="text-yellow-300 font-bold">Team</span> and unlock new career opportunities in sport.
        </p>
      </section>
      {/* Decorative Divider */}
      <div className="w-full h-6 bg-yellow-300 mb-8" style={{ transform: 'skewY(-3deg)' }}></div>

      {/* Why Join Section */}
      <section className="w-full max-w-3xl mx-auto mb-10">
        <h2 className="text-2xl font-bold text-yellow-300 mb-6 uppercase tracking-wide text-center">Why Join?</h2>
        <div className="grid px-4 grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <Star className="text-yellow-300 mb-2" style={{ fontSize: 36 }} />
            <div className="font-bold text-black text-lg mb-1">Elite Network</div>
            <div className="text-gray-700 text-sm">Connect with top clubs, teams, and professionals in the football industry.</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <Group className="text-yellow-300 mb-2" style={{ fontSize: 36 }} />
            <div className="font-bold text-black text-lg mb-1">Career Growth</div>
            <div className="text-gray-700 text-sm">Access exclusive job opportunities and grow your career in sport.</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <EmojiEvents className="text-yellow-300 mb-2" style={{ fontSize: 36 }} />
            <div className="font-bold text-black text-lg mb-1">Showcase Talent</div>
            <div className="text-gray-700 text-sm">Build your profile or club page and get noticed by the best in the game.</div>
          </div>
        </div>
      </section>

      {/* Role Switcher Card */}
      <div className="mb-8 flex items-center gap-4 bg-white rounded-xl shadow-lg px-8 py-4">
        <button
          className={`px-6 py-2 rounded-lg font-bold uppercase transition text-lg ${role === 'candidate' ? 'bg-yellow-300 text-black shadow' : 'bg-white text-gray-700 border border-black'}`}
          onClick={() => setRole('candidate')}
        >
          Candidate
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-bold uppercase transition text-lg ${role === 'team' ? 'bg-yellow-300 text-black shadow' : 'bg-white text-gray-700 border border-black'}`}
          onClick={() => setRole('team')}
        >
          Team
        </button>
      </div>

      {/* Registration Form */}
      <div className="w-full max-w-2xl mb-16">
        {role === 'candidate' ? <CandidateRegister /> : <TeamRegister />}
      </div>
    </div>
  );
};

export default Register;