import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  candidateSchema,
  type CandidateFormData,
} from "../../schemas/candidate.schema";
import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  CheckCircleOutline,
  Star,
  Upload,
} from "@mui/icons-material";
import useRegisterCandidate from "./hooks/use-candidate";
import { useNavigate } from "react-router-dom";
import { AuthenticationService } from '../../api';

const CandidateRegister = () => {
  const registerCandidate = useRegisterCandidate();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const methods = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      position: "",
      experience: "",
      skills: "",
      cv: null,
      selectedPlan: undefined,
    },
  });

  const handleSubmit = async () => {
    const isValid = await methods.trigger();
    if (!isValid || !selectedPlan) return;
    const formValues = methods.getValues();
    const payload = {
      ...formValues,
      selectedPlan,
      paymentStatus: "unpaid" as const,
    };
    registerCandidate.mutate(payload, {
      onSuccess: () => {
        navigate("/payment");
      },
      onError: (err) => {
        console.error("Failed to register candidate:", err);
      },
    });
  };

  return (
    <div className="min-h-screen bg-black pt-4">
      <div className="mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-yellow-300 uppercase tracking-wide">
              Candidate Registration
            </span>
            <span className="text-sm text-white font-bold uppercase tracking-wide">
              Football Candidate
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-extrabold text-black mb-2 uppercase">Create Candidate Account</h2>
                <p className="text-gray-700">Register as a football candidate and get discovered by top teams</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <TextField
                    id="firstName"
                    label="First Name"
                    {...methods.register("firstName")}
                    placeholder="Enter your first name"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                  />
                  {methods.formState.errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <TextField
                    id="lastName"
                    label="Last Name"
                    {...methods.register("lastName")}
                    placeholder="Enter your last name"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                  />
                  {methods.formState.errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <TextField
                  id="email"
                  label="Email Address"
                  type="email"
                  {...methods.register("email")}
                  placeholder="Enter your email"
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
                  placeholder="Enter your secure password"
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
              <div className="space-y-2">
                <Controller
                  name="position"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel id="rolePreference-label">Role Preference</InputLabel>
                      <Select
                        labelId="rolePreference-label"
                        id="rolePreference"
                        value={field.value}
                        label="Role Preference"
                        onChange={field.onChange}
                      >
                        <MenuItem value="marketing">Marketing & Communications</MenuItem>
                        <MenuItem value="operations">Operations & Administration</MenuItem>
                        <MenuItem value="finance">Finance & Accounting</MenuItem>
                        <MenuItem value="sales">Sales & Business Development</MenuItem>
                        <MenuItem value="analytics">Data Analytics & Performance</MenuItem>
                        <MenuItem value="media">Media & Broadcasting</MenuItem>
                        <MenuItem value="legal">Legal & Compliance</MenuItem>
                        <MenuItem value="hr">Human Resources</MenuItem>
                        <MenuItem value="it">IT & Technology</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                      {fieldState.error && (
                        <FormHelperText>{fieldState.error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Controller
                  name="experience"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel id="experience-label">Experience Level</InputLabel>
                      <Select
                        labelId="experience-label"
                        id="experience"
                        value={field.value}
                        label="Experience Level"
                        onChange={field.onChange}
                      >
                        <MenuItem value="entry">Entry Level (0-2 years)</MenuItem>
                        <MenuItem value="mid">Mid Level (3-5 years)</MenuItem>
                        <MenuItem value="senior">Senior Level (6-10 years)</MenuItem>
                        <MenuItem value="executive">Executive Level (10+ years)</MenuItem>
                      </Select>
                      {fieldState.error && (
                        <FormHelperText>{fieldState.error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>
              <div className="space-y-2">
                <InputLabel htmlFor="qualifications">Key Qualifications</InputLabel>
                <TextField
                  id="qualifications"
                  multiline
                  minRows={4}
                  {...methods.register("skills")}
                  placeholder="List your key qualifications, certifications, and skills..."
                  fullWidth
                  variant="outlined"
                  sx={{ background: 'white', borderRadius: 2, borderColor: 'black' }}
                />
              </div>
              <div className="space-y-2">
                <Controller
                  name="cv"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <InputLabel htmlFor="cv">Upload CV</InputLabel>
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
                            const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
                            const validExts = [".pdf", ".doc", ".docx"];
                            const fileName = file.name.toLowerCase();
                            const isValid = validTypes.includes(file.type) || validExts.some(ext => fileName.endsWith(ext));
                            if (!isValid) {
                              setFileError("Only PDF, DOC, DOCX files are allowed.");
                              return;
                            }
                            setFileError(null);
                            field.onChange(file);
                          }
                        }}
                      >
                        <input
                          type="file"
                          id="cv"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (file) {
                              const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
                              const validExts = [".pdf", ".doc", ".docx"];
                              const fileName = file.name.toLowerCase();
                              const isValid = validTypes.includes(file.type) || validExts.some(ext => fileName.endsWith(ext));
                              if (!isValid) {
                                setFileError("Only PDF, DOC, DOCX files are allowed.");
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
                        <label htmlFor="cv" className="cursor-pointer p-6 block">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">
                            {field.value?.name
                              ? field.value.name
                              : "Click or drag and drop your CV (PDF, DOC, DOCX)"}
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
                <h3 className="font-semibold text-black mb-4 uppercase">Choose Your Membership</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Box
                    className={`cursor-pointer transition-all duration-75 p-4 hover:shadow-lg ${selectedPlan === "basic" ? "ring-2 ring-yellow-400 shadow-lg" : "hover:shadow-lg"}`}
                    onClick={() => setSelectedPlan("basic")}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="bg-yellow-100 text-yellow-800 border rounded-2xl px-3 border-yellow-100 text-xs font-bold uppercase">Most Popular</span>
                      </div>
                      <div className="text-xl">Basic Plan</div>
                      <div className="text-3xl font-bold text-yellow-400">
                        $5<span className="text-sm text-gray-500">/month</span>
                      </div>
                      <Typography className="text-[12px] text-gray-400 py-3">Perfect for getting started</Typography>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Profile visible to teams</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Apply to unlimited jobs</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Basic profile analytics</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Email notifications</span>
                      </div>
                    </div>
                  </Box>
                  <Box
                    className={`cursor-pointer transition-all duration-300 p-4 ${selectedPlan === "pro" ? "ring-2 ring-yellow-400 shadow-lg" : "hover:shadow-lg"}`}
                    onClick={() => setSelectedPlan("pro")}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="bg-yellow-100 text-yellow-800 border rounded-2xl px-2 text-xs font-bold uppercase">Pro</span>
                      </div>
                      <div className="text-xl">Pro Plan</div>
                      <div className="text-3xl font-bold text-yellow-400">
                        $10<span className="text-sm text-gray-500">/month</span>
                      </div>
                      <Typography className="text-[12px] text-gray-400 py-3">For serious professionals</Typography>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Everything in Basic</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Priority profile visibility</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Advanced analytics</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Direct messaging with teams</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Career consultation calls</span>
                      </div>
                    </div>
                  </Box>
                </div>
                {selectedPlan && (
                  <div className="bg-white p-4 rounded-lg border border-black mt-4">
                    <h4 className="font-semibold mb-2">Payment Summary</h4>
                    <div className="flex justify-between items-center">
                      <span>{selectedPlan === "basic" ? "Basic Plan" : "Pro Plan"}</span>
                      <span className="font-bold">${selectedPlan === "basic" ? "5" : "10"}/month</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Your subscription will begin immediately after payment confirmation.</p>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!selectedPlan}
                className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-lg px-6 py-3 flex items-center justify-center mt-4 transition disabled:opacity-50"
              >
                Complete Registration <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidateRegister;
