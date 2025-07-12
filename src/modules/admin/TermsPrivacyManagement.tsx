import { useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultTerms = `1. Use of the platform is subject to these terms.\n2. ...`;
const defaultPrivacy = `1. We respect your privacy.\n2. ...`;

const TermsPrivacyManagement = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');
  const [terms, setTerms] = useState(defaultTerms);
  const [privacy, setPrivacy] = useState(defaultPrivacy);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Terms & Privacy Management</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold transition border-b-2 ${tab === 'terms' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 bg-blue-50'}`}
            onClick={() => setTab('terms')}
          >
            Terms of Service
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold transition border-b-2 ${tab === 'privacy' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 bg-blue-50'}`}
            onClick={() => setTab('privacy')}
          >
            Privacy Policy
          </button>
        </div>
        <div className="bg-white rounded-b-xl shadow p-6">
          {tab === 'terms' ? (
            <>
              <label className="block text-gray-700 font-medium mb-2">Terms of Service</label>
              <textarea
                className="w-full min-h-[200px] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                value={terms}
                onChange={e => setTerms(e.target.value)}
              />
            </>
          ) : (
            <>
              <label className="block text-gray-700 font-medium mb-2">Privacy Policy</label>
              <textarea
                className="w-full min-h-[200px] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                value={privacy}
                onChange={e => setPrivacy(e.target.value)}
              />
            </>
          )}
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
          >
            Save
          </button>
          {saved && <div className="text-green-600 mt-3 font-semibold">Saved!</div>}
        </div>
      </div>
    </div>
  );
};

export default TermsPrivacyManagement; 