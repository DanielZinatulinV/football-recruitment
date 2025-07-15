import {
  ArrowRight,
  BadgeOutlined,
  CheckCircle,
  CheckCircleOutline,
  LockClock,
  Shield,
  Upload,
} from "@mui/icons-material";
import { Box, Button, Card, InputLabel, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import LocationSearch from "../../components/LocationSearch";
import useRegisterTeam from "./hooks/use-register-team";
import { useState } from "react";

// Новый тип для формы
interface TeamRegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  club_name: string;
  contact_phone?: string;
  location?: string;
}

const TeamRegister = () => {
  const navigate = useNavigate();
  const registerTeam = useRegisterTeam();
  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState<string | null>(null);

  const methods = useForm<TeamRegisterForm>({
    mode: "onTouched",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      club_name: "",
      contact_phone: "",
      location: "",
    },
  });

  const handleSubmit = async () => {
    setAgreeError(null);
    const isValid = await methods.trigger();
    if (!isValid) return;
    if (!agree) {
      setAgreeError("You must agree to the Terms & Privacy Policy");
      return;
    }
    const formData = methods.getValues();
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      role: 'team',
      password: formData.password,
      club_name: formData.club_name,
      contact_phone: formData.contact_phone || null,
      // location не входит в openapi, если нужно — можно добавить
    };
    registerTeam.mutate(payload, {
      onSuccess: () => {
        navigate("/team/pending");
      },
      onError: (err) => {
        console.error("Failed to register team:", err);
      },
    });
    console.log("Team Registration Data:", payload);
  };

  return (
    <div className="min-h-screen bg-black pt-4">
      <div className="mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-yellow-300 uppercase tracking-wide">
              Team Registration
            </span>
            <span className="text-sm text-white font-bold uppercase tracking-wide">
              Football Team
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-extrabold text-black mb-2 uppercase">Create Team Account</h2>
                <p className="text-gray-700">Register your football club and connect with top talent</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <TextField
                    id="first_name"
                    label="First Name"
                    {...methods.register("first_name", { required: true })}
                    placeholder="Enter first name"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                  />
                  {methods.formState.errors.first_name && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.first_name.message || 'First name is required'}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <TextField
                    id="last_name"
                    label="Last Name"
                    {...methods.register("last_name", { required: true })}
                    placeholder="Enter last name"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                  />
                  {methods.formState.errors.last_name && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.last_name.message || 'Last name is required'}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <TextField
                    id="email"
                    label="Email Address"
                    {...methods.register("email", { required: true })}
                    placeholder="Enter your email address"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                  />
                  {methods.formState.errors.email && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.email.message || 'Email is required'}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <TextField
                    id="password"
                    label="Password"
                    {...methods.register("password", { required: true })}
                    type="password"
                    placeholder="Enter your password"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                  />
                  {methods.formState.errors.password && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.password.message || 'Password is required'}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <TextField
                  id="club_name"
                  label="Club Name"
                  {...methods.register("club_name", { required: true })}
                  placeholder="Enter your club name"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                />
                {methods.formState.errors.club_name && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.club_name.message || 'Club name is required'}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <TextField
                  id="contact_phone"
                  label="Contact Phone (optional)"
                  {...methods.register("contact_phone")}
                  placeholder="Enter contact phone"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                />
              </div>
              {/* location можно оставить как дополнительное поле, если нужно */}
              <div className="space-y-2">
                <LocationSearch
                  onSelect={(value) => methods.setValue("location", value)}
                />
              </div>
              <div className="bg-white rounded-2xl shadow p-6 mt-6">
                <h3 className="font-semibold text-black mb-4 uppercase">
                  What You Get:
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-black">
                        Free registration and setup
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-black">
                        Access to qualified candidates
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-black">Advanced search filters</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-black">
                        Post unlimited job vacancies
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-black">
                        Only pay $50 per successful hire
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-black">Dedicated support team</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 mt-6">
                <div className="flex items-start space-x-3">
                  <LockClock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-black uppercase">
                      Approval Process
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Your team account will be reviewed by our admin team
                      before activation. This typically takes 1-2 business days.
                      You'll receive an email once approved.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                  className="w-4 h-4 border-black rounded"
                />
                <label htmlFor="agree" className="text-sm text-black select-none">
                  I agree to the
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-600 underline ml-1"
                  >
                    Terms & Privacy Policy
                  </a>
                </label>
              </div>
              {agreeError && (
                <p className="text-red-500 text-sm mt-1">{agreeError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-lg px-6 py-3 flex items-center justify-center mt-4 transition disabled:opacity-50"
                disabled={registerTeam.isPending}
              >
                {registerTeam.isPending ? "Submitting..." : <>
                  Submit Registration <ArrowRight className="ml-2 w-4 h-4" />
                </>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamRegister;
