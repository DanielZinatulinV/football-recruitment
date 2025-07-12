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
import { teamSchema, type TeamRegisterSchema } from "../../schemas/team.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import LocationSearch from "../../components/LocationSearch";
import useRegisterTeam from "./hooks/use-register-team";
import { useState } from "react";

const accountInformation: (keyof TeamRegisterSchema)[] = ["email", "password"];

const teamInformation: (keyof TeamRegisterSchema)[] = [
  "teamName",
  "website",
  "location",
];

const TeamRegister = () => {
  const navigate = useNavigate();
  const registerTeam = useRegisterTeam();
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState<string | null>(null);

  const methods = useForm<TeamRegisterSchema>({
    resolver: zodResolver(teamSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      teamName: "",
      location: "",
      description: "",
      logo: null,
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
    registerTeam.mutate(formData, {
      onSuccess: () => {
        navigate("/team/pending");
      },
      onError: (err) => {
        console.error("Failed to register team:", err);
      },
    });
    console.log("Team Registration Data:", formData);
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
                    id="email"
                    label="Email Address"
                    {...methods.register("email")}
                    placeholder="Enter your email address"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                  />
                  {methods.formState.errors.email && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <TextField
                    id="password"
                    label="Password"
                    {...methods.register("password")}
                    type="password"
                    placeholder="Enter your password"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                  />
                  {methods.formState.errors.password && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <TextField
                  id="teamName"
                  label="Club Name"
                  {...methods.register("teamName")}
                  placeholder="Enter your club name"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                />
                {methods.formState.errors.teamName && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.teamName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <TextField
                  id="website"
                  label="Website"
                  {...methods.register("website")}
                  placeholder="Enter your website"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                />
                {methods.formState.errors.website && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.website.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <LocationSearch
                  onSelect={(value) => methods.setValue("location", value)}
                />
                {methods.formState.errors.location && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.location.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <TextField
                  id="description"
                  label="Description"
                  {...methods.register("description")}
                  placeholder="Enter your description"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                />
                {methods.formState.errors.description && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.description.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Controller
                  name="logo"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <InputLabel htmlFor="logo" className="text-black font-semibold">Upload Logo</InputLabel>
                      <div
                        className={`border-2 border-dashed border-black rounded-lg text-center transition-colors cursor-pointer ${isDragOver ? "border-yellow-400 bg-yellow-50" : "hover:border-yellow-400"}`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragOver(true);
                        }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragOver(false);
                          const file = e.dataTransfer.files && e.dataTransfer.files[0];
                          if (file) {
                            const validTypes = ["image/png", "image/jpeg", "image/jpg"];
                            const validExts = [".png", ".jpg", ".jpeg"];
                            const fileName = file.name.toLowerCase();
                            const isValid = validTypes.includes(file.type) || validExts.some(ext => fileName.endsWith(ext));
                            if (!isValid) {
                              setFileError("Only PNG, JPG, JPEG files are allowed.");
                              return;
                            }
                            setFileError(null);
                            field.onChange(file);
                          }
                        }}
                      >
                        <input
                          type="file"
                          id="logo"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (file) {
                              const validTypes = ["image/png", "image/jpeg", "image/jpg"];
                              const validExts = [".png", ".jpg", ".jpeg"];
                              const fileName = file.name.toLowerCase();
                              const isValid = validTypes.includes(file.type) || validExts.some(ext => fileName.endsWith(ext));
                              if (!isValid) {
                                setFileError("Only PNG, JPG, JPEG files are allowed.");
                                return;
                              }
                              setFileError(null);
                              field.onChange(file);
                            } else {
                              setFileError(null);
                              field.onChange(null);
                            }
                          }}
                          className="hidden"
                        />
                        <label htmlFor="logo" className="cursor-pointer p-6 block">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">
                            {field.value?.name
                              ? field.value.name
                              : "Click or drag and drop your Logo (PNG, JPG, JPEG)"}
                          </p>
                        </label>
                      </div>
                      {fileError && (
                        <p className="text-red-500 text-sm mt-1">{fileError}</p>
                      )}
                    </div>
                  )}
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
