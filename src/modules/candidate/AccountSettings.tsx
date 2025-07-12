import React, { useEffect, useState } from 'react';

const PROFILE_KEY = 'candidate_profile';

const AccountSettings: React.FC = () => {
  const [subscription, setSubscription] = useState('Basic');
  const [email, setEmail] = useState('user@email.com');

  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      const profile = JSON.parse(saved);
      setSubscription(profile.subscription || 'Basic');
      if (profile.email) setEmail(profile.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  const handleChangePassword = () => {
    alert('Password change feature is not available yet (stub)');
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb] py-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h2 className="font-bold text-2xl mb-6">Account Settings</h2>
        <div className="mb-5"><b>Email:</b> {email}</div>
        <div className="mb-5"><b>Subscription:</b> {subscription}</div>
        <div className="mb-5">
          <button onClick={handleChangePassword} className="rounded-lg px-5 py-2 bg-gray-200 text-gray-900 font-medium hover:bg-gray-300 transition">Change Password</button>
        </div>
        <div>
          <button onClick={handleLogout} className="rounded-lg px-5 py-2 bg-red-500 text-white font-semibold hover:bg-red-700 transition">Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 