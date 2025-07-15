// components/Footer.tsx
const Footer = () => (
  <footer className="w-full bg-black border-t border-yellow-300 py-8 mt-auto">
    <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-white text-lg font-bold">Football Recruitment</div>
      <div className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} All rights reserved.</div>
      <div className="flex gap-4">
        <a href="/about" className="text-yellow-300 hover:underline">About</a>
        <a href="/jobs" className="text-yellow-300 hover:underline">Jobs</a>
        <a href="/register" className="text-yellow-300 hover:underline">Sign Up</a>
      </div>
    </div>
  </footer>
);

export default Footer;
