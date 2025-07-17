import { Star, Group, EmojiEvents } from '@mui/icons-material';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

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
      <section className="relative h-[800px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/mainpage.jpg')" }}>
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold uppercase text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Build Your <span className="text-yellow-300">Football</span> Career
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-white mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            The #1 platform for football jobs and talent. Find your next role or discover top professionals for your club.
          </motion.p>
          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
          >
            <a href="/jobs" className="px-8 py-4 rounded-lg bg-yellow-300 text-black font-bold text-lg uppercase shadow hover:bg-yellow-400 transition">Find Jobs</a>
            <a href="/register" className="px-8 py-4 rounded-lg bg-black text-yellow-300 font-bold text-lg uppercase border-2 border-yellow-300 hover:bg-yellow-300 hover:text-black transition">Sign Up</a>
          </motion.div>
        </div>
      </section>
      {/* Divider */}
      <div className="w-full h-6 bg-yellow-300" style={{ transform: 'skewY(-3deg)' }}></div>

      {/* Why Join Section */}
      <section className="w-full max-w-4xl mx-auto py-16 px-4">
        <motion.h2
          className="text-3xl font-bold text-yellow-300 mb-10 uppercase text-center tracking-wide"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Why Join?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{
            icon: <Star className="text-yellow-300 mb-2" style={{ fontSize: 40 }} />,
            title: 'Elite Network',
            desc: 'Connect with top clubs, teams, and professionals in the football industry.'
          }, {
            icon: <Group className="text-yellow-300 mb-2" style={{ fontSize: 40 }} />,
            title: 'Career Growth',
            desc: 'Access exclusive job opportunities and grow your career in sport.'
          }, {
            icon: <EmojiEvents className="text-yellow-300 mb-2" style={{ fontSize: 40 }} />,
            title: 'Showcase Talent',
            desc: 'Build your profile or club page and get noticed by the best in the game.'
          }].map((card, i) => (
            <motion.div
              key={card.title}
              className="bg-white rounded-xl shadow p-8 flex flex-col items-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 + i * 0.15 }}
            >
              {card.icon}
              <div className="font-bold text-black text-lg mb-1">{card.title}</div>
              <div className="text-gray-700 text-sm text-center">{card.desc}</div>
            </motion.div>
          ))}
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
