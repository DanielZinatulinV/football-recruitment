import { Star, Group, EmojiEvents } from '@mui/icons-material';
import Footer from '../../components/Footer';

const mockJobs = [
  { title: "Scout Assistant", club: "FC Academy" },
  { title: "Video Analyst", club: "United Youth" },
  { title: "Technical Director", club: "Premier SC" },
  { title: "Team Administrator", club: "Lions FC" },
  { title: "Sports Psychologist", club: "Galaxy FC" },
  { title: "Recruitment Manager", club: "City Stars" },
  { title: "Fitness Coach", club: "Fit United" },
  { title: "Goalkeeping Coach", club: "Red Warriors" },
  { title: "Nutrition Expert", club: "Powerhouse FC" },
  { title: "Medical Assistant", club: "White Eagles" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[480px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/football.svg')" }}>
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-white mb-6 drop-shadow-lg">
            Build Your <span className="text-yellow-300">Football</span> Career
          </h1>
          <p className="text-lg md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            The #1 platform for football jobs and talent. Find your next role or discover top professionals for your club.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="/jobs" className="px-8 py-4 rounded-lg bg-yellow-300 text-black font-bold text-lg uppercase shadow hover:bg-yellow-400 transition">Find Jobs</a>
            <a href="/register" className="px-8 py-4 rounded-lg bg-black text-yellow-300 font-bold text-lg uppercase border-2 border-yellow-300 hover:bg-yellow-300 hover:text-black transition">Sign Up</a>
          </div>
        </div>
      </section>
      {/* Divider */}
      <div className="w-full h-6 bg-yellow-300" style={{ transform: 'skewY(-3deg)' }}></div>

      {/* Why Join Section */}
      <section className="w-full max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-yellow-300 mb-10 uppercase text-center tracking-wide">Why Join?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <Star className="text-yellow-300 mb-2" style={{ fontSize: 40 }} />
            <div className="font-bold text-black text-lg mb-1">Elite Network</div>
            <div className="text-gray-700 text-sm text-center">Connect with top clubs, teams, and professionals in the football industry.</div>
          </div>
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <Group className="text-yellow-300 mb-2" style={{ fontSize: 40 }} />
            <div className="font-bold text-black text-lg mb-1">Career Growth</div>
            <div className="text-gray-700 text-sm text-center">Access exclusive job opportunities and grow your career in sport.</div>
          </div>
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <EmojiEvents className="text-yellow-300 mb-2" style={{ fontSize: 40 }} />
            <div className="font-bold text-black text-lg mb-1">Showcase Talent</div>
            <div className="text-gray-700 text-sm text-center">Build your profile or club page and get noticed by the best in the game.</div>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="w-full max-w-4xl mx-auto pb-16 px-4">
        <h2 className="text-2xl font-bold text-white mb-8 uppercase text-center tracking-wide">Latest Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockJobs.slice(0, 6).map((job, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
              <div className="font-bold text-lg text-black">{job.title}</div>
              <div className="text-yellow-400 font-semibold">{job.club}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <a href="/jobs" className="px-8 py-3 rounded-lg bg-yellow-300 text-black font-bold text-lg uppercase shadow hover:bg-yellow-400 transition">See All Jobs</a>
        </div>
      </section>
    </div>
  );
}
