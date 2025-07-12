import { CircleNotifications, Home, LockClock, Mail } from "@mui/icons-material";
import { Badge, Box, Button, Card } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const PendingApproval = () => {
  const navigate = useNavigate();
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="min-h-screen bg-black pt-16 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mb-6">
              <LockClock className="w-8 h-8 text-black" />
            </div>
            <span className="mb-4 text-yellow-300 text-xl font-bold uppercase tracking-wide">Pending Review</span>
            <h1 className="text-3xl font-extrabold text-black mb-4 uppercase">Registration Submitted Successfully!</h1>
            <p className="text-lg text-gray-700 mb-8">Thank you for registering your football team. Your application is now under review by our admin team.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-black">
            <h3 className="font-semibold text-black mb-4 uppercase">What happens next?</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-black text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-black">Verification Process</p>
                  <p className="text-sm text-gray-700">Our team will verify your club information and credentials</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-black text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-black">Email Notification</p>
                  <p className="text-sm text-gray-700">You'll receive an email confirmation once approved</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-black text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-black">Account Activation</p>
                  <p className="text-sm text-gray-700">Start posting vacancies and searching for candidates</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-black">
              <div className="flex items-center space-x-2 mb-2">
                <LockClock className="w-4 h-4 text-yellow-400" />
                <span className="font-medium text-black">Review Time</span>
              </div>
              <p className="text-sm text-gray-700">Typically 1-2 business days</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-black">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span className="font-medium text-black">Email Updates</span>
              </div>
              <p className="text-sm text-gray-700">Check your inbox regularly</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-black">
            <div className="flex items-start space-x-3">
              <CircleNotifications className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="text-left">
                <h4 className="font-semibold text-black uppercase">Important Notes</h4>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li>• Keep your email notifications enabled</li>
                  <li>• Ensure all provided information is accurate</li>
                  <li>• Contact support if you don't hear back within 3 business days</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-lg px-6 py-3 flex items-center justify-center transition"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Homepage
            </button>
            <button
              className="w-full sm:w-auto bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-lg px-6 py-3 flex items-center justify-center transition"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
