import { Star, Group, EmojiEvents } from '@mui/icons-material';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { VacanciesService } from '../../api/services/VacanciesService';

const JOBS_PER_COLUMN = 3;
const MIN_INTERVAL = 3000;
const MAX_INTERVAL = 5000;

function getRandomInterval() {
  return Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1)) + MIN_INTERVAL;
}

function splitJobs(jobs) {
  const left = [], right = [];
  jobs.forEach((job, idx) => {
    (idx % 2 === 0 ? left : right).push(job);
  });
  return [left, right];
}

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [leftJobs, setLeftJobs] = useState([]);
  const [rightJobs, setRightJobs] = useState([]);
  const [visibleLeft, setVisibleLeft] = useState([]);
  const [visibleRight, setVisibleRight] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(0);
  const [leftAnimating, setLeftAnimating] = useState(false);
  const [rightAnimating, setRightAnimating] = useState(false);
  const leftTimeout = useRef(null);
  const rightTimeout = useRef(null);

  // Загрузка вакансий
  useEffect(() => {
    setLoading(true);
    setError('');
    VacanciesService.listVacanciesV1VacanciesGet(undefined, undefined, undefined, undefined, undefined, undefined, 20, 0)
      .then((res) => {
        let arr = res.items || [];
        if (arr.length > 0 && arr.length < 12) {
          const times = Math.ceil(12 / arr.length);
          arr = Array(times).fill(arr).flat().slice(0, 12);
        }
        setJobs(arr);
        setLoading(false);
      })
      .catch((e) => {
        setError(e?.body?.detail || e?.message || 'Ошибка загрузки вакансий');
        setLoading(false);
      });
  }, []);

  // Делим вакансии на две колонки
  useEffect(() => {
    const [left, right] = splitJobs(jobs);
    setLeftJobs(left);
    setRightJobs(right);
    setVisibleLeft(left.slice(0, JOBS_PER_COLUMN));
    setVisibleRight(right.slice(0, JOBS_PER_COLUMN));
    setLeftIdx(JOBS_PER_COLUMN % left.length || 0);
    setRightIdx(JOBS_PER_COLUMN % right.length || 0);
  }, [jobs]);

  // Карусель для левой колонки
  useEffect(() => {
    if (leftJobs.length <= JOBS_PER_COLUMN) return;
    if (leftTimeout.current) clearTimeout(leftTimeout.current);
    const tick = () => {
      setLeftAnimating(true);
      setTimeout(() => {
        setVisibleLeft((prev) => {
          const nextJob = leftJobs[leftIdx];
          const updated = [nextJob, ...prev.slice(0, JOBS_PER_COLUMN - 1)];
          return updated;
        });
        setLeftIdx((prev) => (prev + 1) % leftJobs.length);
        setLeftAnimating(false);
        leftTimeout.current = setTimeout(tick, getRandomInterval());
      }, 500); // длительность анимации
    };
    leftTimeout.current = setTimeout(tick, getRandomInterval());
    return () => clearTimeout(leftTimeout.current);
  }, [leftJobs, leftIdx]);

  // Карусель для правой колонки
  useEffect(() => {
    if (rightJobs.length <= JOBS_PER_COLUMN) return;
    if (rightTimeout.current) clearTimeout(rightTimeout.current);
    const tick = () => {
      setRightAnimating(true);
      setTimeout(() => {
        setVisibleRight((prev) => {
          const nextJob = rightJobs[rightIdx];
          const updated = [nextJob, ...prev.slice(0, JOBS_PER_COLUMN - 1)];
          return updated;
        });
        setRightIdx((prev) => (prev + 1) % rightJobs.length);
        setRightAnimating(false);
        rightTimeout.current = setTimeout(tick, getRandomInterval());
      }, 500);
    };
    rightTimeout.current = setTimeout(tick, getRandomInterval());
    return () => clearTimeout(rightTimeout.current);
  }, [rightJobs, rightIdx]);

  // Высота одной карточки (px)
  const cardHeight = 110;
  const columnHeight = JOBS_PER_COLUMN * cardHeight + (JOBS_PER_COLUMN - 1) * 24; // 24px gap-6

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
        <motion.h2 
          className="text-2xl font-bold text-white mb-8 uppercase text-center tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Latest Jobs
        </motion.h2>
        
        {loading ? (
          <div className="text-center text-yellow-300 py-8 text-lg">Загрузка вакансий...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-8 text-lg">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-lg">Вакансии не найдены</div>
        ) : (
          <div className="relative">
            {/* Fixed height container to prevent button jumping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ minHeight: `${columnHeight}px` }}>
              {/* Левая колонка - Carousel */}
              <div className="relative">
                <div className="mt-6">
                  <AnimatePresence mode="popLayout">
                    {visibleLeft.map((job, index) => (
                      <motion.div
                        key={`${job.id}-left-${leftIdx}-${index}`}
                        className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 mb-6 border-l-4 border-yellow-300 relative z-0"
                        initial={{ 
                          opacity: 0, 
                          y: index === 0 ? -120 : 0,
                          scale: index === 0 ? 0.9 : 1
                        }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          scale: 1
                        }}
                        exit={{ 
                          opacity: 0, 
                          y: 120,
                          scale: 0.9,
                          transition: { duration: 0.3 }
                        }}
                        transition={{ 
                          duration: 0.5,
                          ease: "easeOut",
                          delay: index * 0.1
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                          zIndex: 10
                        }}
                        style={{ transformOrigin: 'center center' }}
                      >
                        <div className="font-bold text-lg text-black">{job.title}</div>
                        <div className="text-yellow-600 font-semibold flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          {job.team_name || job.club || 'Клуб не указан'}
                        </div>
                        <div className="text-gray-700 text-sm line-clamp-2">{job.location}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          {index === 0 ? 'Just posted' : `${(index + 1) * 2} min ago`}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Правая колонка - Carousel */}
              <div className="relative">
                <div className="mt-6">
                  <AnimatePresence mode="popLayout">
                    {visibleRight.map((job, index) => (
                      <motion.div
                        key={`${job.id}-right-${rightIdx}-${index}`}
                        className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 mb-6 border-l-4 border-yellow-300 relative z-0"
                        initial={{ 
                          opacity: 0, 
                          y: index === 0 ? -120 : 0,
                          scale: index === 0 ? 0.9 : 1
                        }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          scale: 1
                        }}
                        exit={{ 
                          opacity: 0, 
                          y: 120,
                          scale: 0.9,
                          transition: { duration: 0.3 }
                        }}
                        transition={{ 
                          duration: 0.5,
                          ease: "easeOut",
                          delay: index * 0.1
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                          zIndex: 10
                        }}
                        style={{ transformOrigin: 'center center' }}
                      >
                        <div className="font-bold text-lg text-black">{job.title}</div>
                        <div className="text-yellow-600 font-semibold flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          {job.team_name || job.club || 'Клуб не указан'}
                        </div>
                        <div className="text-gray-700 text-sm line-clamp-2">{job.location}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          {index === 0 ? 'Just posted' : `${(index + 1) * 3} min ago`}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            {/* Fixed position button */}
            <div className="flex justify-center mt-8">
              <motion.a 
                href="/jobs" 
                className="px-8 py-3 rounded-lg bg-yellow-300 text-black font-bold text-lg uppercase shadow-lg hover:bg-yellow-400 transition-all duration-200 transform hover:scale-105"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                See All Jobs
              </motion.a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
