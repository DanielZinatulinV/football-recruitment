import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  candidateSchema,
  type CandidateFormData,
} from "../../schemas/candidate.schema";
import { useState, useEffect } from "react";
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
import { MembershipsService } from '../../api/services/MembershipsService';

const CandidateRegister = () => {
  const registerCandidate = useRegisterCandidate();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    setPlansLoading(true);
    MembershipsService.getMembershipPlansV1MembershipsPlansGet()
      .then((data) => {
        if (Array.isArray(data)) {
          setPlans(data);
        } else if (data && Array.isArray(data.plans)) {
          setPlans(data.plans);
        } else {
          setPlans([]);
        }
      })
      .catch(() => setPlans([]))
      .finally(() => setPlansLoading(false));
  }, []);

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
      selectedPlan: selectedPlan as "basic" | "premium" | "professional",
      paymentStatus: "unpaid" as const,
    };
    registerCandidate.mutate(payload, {
      onSuccess: () => {
        setError('');
        // Найти выбранный тариф
        const plan = plans.find(p => p.plan === selectedPlan);
        if (plan && plan.price > 0) {
          // Платный тариф — после подтверждения email редирект на Stripe
          navigate(`/verify-email?email=${encodeURIComponent(formValues.email)}&stripe=1`);
        } else {
          // Бесплатный тариф — просто подтверждение email
          navigate(`/verify-email?email=${encodeURIComponent(formValues.email)}`);
        }
      },
      onError: (err: any) => {
        let msg = 'Registration failed';
        if (err?.response?.data) {
          if (typeof err.response.data === 'string') {
            msg = err.response.data;
          } else if (err.response.data.detail) {
            msg = err.response.data.detail;
          } else if (err.response.data.message) {
            msg = err.response.data.message;
          }
        } else if (err?.message) {
          msg = err.message;
        }
        setError(msg);
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
              <div className="bg-white rounded-2xl shadow p-6 mt-6">
                <h3 className="font-semibold text-black mb-4 uppercase">Choose Your Membership</h3>
        {plansLoading ? (
          <div className="text-center text-gray-500">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="text-center text-red-500">No plans available</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Box
                key={plan.plan}
                className={`cursor-pointer transition-all duration-75 p-4 hover:shadow-lg ${selectedPlan === plan.plan ? "ring-2 ring-yellow-400 shadow-lg" : "hover:shadow-lg"}`}
                onClick={() => setSelectedPlan(plan.plan)}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {plan.plan === "basic" && (
                      <span className="bg-yellow-100 text-yellow-800 border rounded-2xl px-3 border-yellow-100 text-xs font-bold uppercase">Most Popular</span>
                    )}
                    {plan.plan === "premium" && (
                      <span className="bg-yellow-100 text-yellow-800 border rounded-2xl px-2 text-xs font-bold uppercase">Premium</span>
                    )}
                    {plan.plan === "professional" && (
                      <span className="bg-yellow-100 text-yellow-800 border rounded-2xl px-2 text-xs font-bold uppercase">Pro</span>
                    )}
                  </div>
                  <div className="text-xl capitalize">{plan.plan} Plan</div>
                  <div className="text-3xl font-bold text-yellow-400">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}<span className="text-sm text-gray-500">/month</span>
                  </div>
                  <Typography className="text-[12px] text-gray-400 py-3">
                    {plan.features && plan.features.length > 0 ? plan.features[0] : ''}
                  </Typography>
                </div>
                <div className="space-y-3">
                  {plan.features && plan.features.map((feature: string, idx: number) => (
                    <div className="flex items-center space-x-2" key={idx}>
                      <CheckCircleOutline className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Box>
            ))}
          </div>
        )}
        {selectedPlan && plans.length > 0 && (
          <div className="bg-white p-4 rounded-lg border border-black mt-4">
            <h4 className="font-semibold mb-2">Payment Summary</h4>
            <div className="flex justify-between items-center">
              <span>{plans.find(p => p.plan === selectedPlan)?.plan || selectedPlan} Plan</span>
              <span className="font-bold">{plans.find(p => p.plan === selectedPlan)?.price === 0 ? 'Free' : `$${plans.find(p => p.plan === selectedPlan)?.price}`}/month</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Your subscription will begin immediately after payment confirmation.</p>
          </div>
        )}
      </div>
              {error && (
                <div className="text-red-500 text-center font-semibold text-base mb-2">{error}</div>
              )}
        <button
                type="submit"
          disabled={!selectedPlan}
                className="w-full cursor-pointer bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-lg px-6 py-3 flex items-center justify-center mt-4 transition disabled:opacity-50"
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
