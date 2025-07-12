import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamEditSchema, type TeamEditSchema } from "../../schemas/team.schema";
import { useEffect, useState } from "react";
import LocationSearch from "../../components/LocationSearch";
import { useNavigate } from "react-router-dom";

const TEAM_PROFILE_KEY = "team_profile";

const EditTeamProfile = () => {
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();

  const methods = useForm<TeamEditSchema>({
    resolver: zodResolver(teamEditSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      teamName: "",
      website: "",
      location: "",
      description: "",
      logo: null,
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem(TEAM_PROFILE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      methods.reset({ ...data, password: undefined });
    }
  }, [methods]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await methods.trigger();
    if (!isValid) return;
    const formData = methods.getValues();
    localStorage.setItem(TEAM_PROFILE_KEY, JSON.stringify(formData));
    navigate("/team/dashboard");
  };

  return (
    <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-10">
        <h2 className="font-extrabold text-3xl mb-8 text-black text-center uppercase">
          Edit <span className="text-yellow-300">Team Profile</span>
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-black font-semibold mb-1">Club Name</label>
            <input {...methods.register("teamName")}
              className="w-full rounded-lg border border-black px-3 py-2 text-base mt-1 bg-white placeholder-gray-400"
              placeholder="Enter club name"
            />
            {methods.formState.errors.teamName && <p className="text-red-500 text-sm">{methods.formState.errors.teamName.message}</p>}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Email</label>
            <input {...methods.register("email")}
              className="w-full rounded-lg border border-black px-3 py-2 text-base mt-1 bg-white placeholder-gray-400"
              placeholder="Enter email"
            />
            {methods.formState.errors.email && <p className="text-red-500 text-sm">{methods.formState.errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Website</label>
            <input {...methods.register("website")}
              className="w-full rounded-lg border border-black px-3 py-2 text-base mt-1 bg-white placeholder-gray-400"
              placeholder="Enter website"
            />
            {methods.formState.errors.website && <p className="text-red-500 text-sm">{methods.formState.errors.website.message}</p>}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Location</label>
            <LocationSearch value={methods.watch('location')} onSelect={value => methods.setValue("location", value)} />
            {methods.formState.errors.location && <p className="text-red-500 text-sm">{methods.formState.errors.location.message}</p>}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Description</label>
            <textarea {...methods.register("description")}
              className="w-full rounded-lg border border-black px-3 py-2 min-h-[60px] text-base mt-1 bg-white placeholder-gray-400"
              placeholder="Enter description"
            />
            {methods.formState.errors.description && <p className="text-red-500 text-sm">{methods.formState.errors.description.message}</p>}
          </div>
          <div>
            <Controller
              name="logo"
              control={methods.control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="block text-black font-semibold mb-1">Logo</label>
                  <div
                    className={`border-2 border-dashed border-black rounded-lg text-center transition-colors cursor-pointer ${isDragOver ? "border-yellow-400 bg-yellow-50" : "hover:border-yellow-400"}`}
                    onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={e => {
                      e.preventDefault(); setIsDragOver(false);
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
                      id="logo-input"
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={e => {
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
                    <label htmlFor="logo-input" className="cursor-pointer p-6 block">
                      <span className="text-gray-400">{field.value?.name ? field.value.name : "Click or drag and drop your Logo (PNG, JPG, JPEG)"}</span>
                    </label>
                  </div>
                  {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                </div>
              )}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-6 py-3 rounded-lg bg-white border border-black text-black font-bold hover:bg-yellow-50 transition" onClick={() => navigate('/team/dashboard')}>Cancel</button>
            <button type="submit" className="px-6 py-3 rounded-lg bg-yellow-300 text-black font-bold hover:bg-yellow-400 transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeamProfile; 