import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LocationSearch from "../../../components/LocationSearch";
import type { CreateVacancySchema } from '../../../api/models/CreateVacancySchema';

type Vacancy = {
  id: string;
  role: string;
  requirements: string;
  salaryFrom?: string;
  salaryTo?: string;
  location?: string;
  anyLocation?: boolean;
  expiry: string;
  description?: string;
  experience_level?: string;
  status?: string;
};

function CreateVacancyForm({ onClose, onAdd, onSave, vacancy }: { onClose: () => void; onAdd?: (vac: CreateVacancySchema) => void; onSave?: (vac: Vacancy) => void; vacancy?: Vacancy }) {
  const isEdit = !!vacancy;
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<{
    role: string;
    description: string;
    requirements: string;
    salaryFrom: string;
    salaryTo: string;
    expiry: string;
    experience_level: string;
    status: string;
  }>({
    defaultValues: isEdit ? {
      role: vacancy?.role || "",
      description: vacancy?.description || "",
      requirements: vacancy?.requirements || "",
      salaryFrom: vacancy?.salaryFrom || "",
      salaryTo: vacancy?.salaryTo || "",
      expiry: vacancy?.expiry || "",
      experience_level: vacancy?.experience_level || "",
      status: vacancy?.status || "active",
    } : { status: "active" }
  });
  const [location, setLocation] = useState(vacancy?.location || "");
  const [anyLocation, setAnyLocation] = useState(!!vacancy?.anyLocation);
  useEffect(() => {
    if (isEdit && vacancy) {
      setValue("role", vacancy.role || "");
      setValue("description", vacancy.description || "");
      setValue("requirements", vacancy.requirements || "");
      setValue("salaryFrom", vacancy.salaryFrom || "");
      setValue("salaryTo", vacancy.salaryTo || "");
      setValue("expiry", vacancy.expiry || "");
      setValue("experience_level", vacancy.experience_level || "");
      setValue("status", vacancy.status || "active");
      setLocation(vacancy.location || "");
      setAnyLocation(!!vacancy.anyLocation);
    }
  }, [isEdit, vacancy, setValue]);
  const onSubmit = (data: { role: string; description: string; requirements: string; salaryFrom: string; salaryTo: string; expiry: string; experience_level: string; status: string }) => {
    const vac: CreateVacancySchema = {
      title: data.role,
      description: data.description,
      requirements: data.requirements,
      location: anyLocation ? 'Remote' : location,
      position_type: data.role,
      experience_level: data.experience_level,
      expiry_date: data.expiry,
      salary_min: data.salaryFrom ? Number(data.salaryFrom) : null,
      salary_max: data.salaryTo ? Number(data.salaryTo) : null,
    };
    if (isEdit && onSave) {
      onSave({
        id: vacancy?.id || Date.now().toString(),
        role: vac.title,
        description: vac.description,
        requirements: vac.requirements,
        salaryFrom: vac.salary_min ? String(vac.salary_min) : '',
        salaryTo: vac.salary_max ? String(vac.salary_max) : '',
        location: vac.location,
        anyLocation: vac.location === 'Remote',
        expiry: vac.expiry_date,
        experience_level: vac.experience_level,
        status: data.status,
      });
    } else if (onAdd) {
      onAdd(vac);
    }
    reset();
    setLocation("");
    setAnyLocation(false);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-2xl shadow-xl p-10 sm:p-8 xs:p-4 w-full max-w-md border-2 border-yellow-300 relative max-h-[80vh] overflow-y-auto">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-yellow-300 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-extrabold text-white mb-8 text-center uppercase">
          {isEdit ? <><span className="text-yellow-300">Edit</span> Vacancy</> : <><span className="text-yellow-300">Create</span> Vacancy</>}
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* ... поля формы ... */}
          <div>
            <label className="block text-white font-semibold mb-1">Role</label>
            <input {...register("role", { required: true })} className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-base mt-1 bg-neutral-800 text-white placeholder-gray-400" placeholder="Enter role" />
            {errors.role && <p className="text-red-500 text-sm">Role is required</p>}
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Description</label>
            <textarea {...register("description", { required: false })} className="w-full rounded-lg border border-yellow-300 px-3 py-2 min-h-[40px] text-base mt-1 bg-neutral-800 text-white placeholder-gray-400" placeholder="Enter description" />
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Requirements</label>
            <textarea {...register("requirements", { required: true })} className="w-full rounded-lg border border-yellow-300 px-3 py-2 min-h-[60px] text-base mt-1 bg-neutral-800 text-white placeholder-gray-400" placeholder="Enter requirements" />
            {errors.requirements && <p className="text-red-500 text-sm">Requirements are required</p>}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-white font-semibold mb-1">Salary from</label>
              <input type="number" min="0" {...register("salaryFrom")}
                className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-base mt-1 bg-neutral-800 text-white placeholder-gray-400"
                placeholder="From"
              />
            </div>
            <div className="flex-1">
              <label className="block text-white font-semibold mb-1">Salary to</label>
              <input type="number" min="0" {...register("salaryTo")}
                className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-base mt-1 bg-neutral-800 text-white placeholder-gray-400"
                placeholder="To"
              />
            </div>
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Location</label>
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" id="anyLocation" checked={anyLocation} onChange={e => setAnyLocation(e.target.checked)} />
              <label htmlFor="anyLocation" className="text-sm text-white">Any location (Remote)</label>
            </div>
            {!anyLocation && (
              <LocationSearch value={location} onSelect={setLocation}
                inputSx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#1a1a1a',
                    color: '#fff',
                    borderRadius: '0.5rem',
                    border: '2px solid #facc15',
                    fontSize: '1rem',
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                    '::placeholder': { color: '#a3a3a3' },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#facc15',
                  },
                  '& label': {
                    color: '#fff',
                  },
                  '& label.Mui-focused': {
                    color: '#facc15',
                  },
                }}
              />
            )}
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Expiry Date</label>
            <input type="date" {...register("expiry", { required: true })}
              value={(() => {
                const val = (isEdit && vacancy?.expiry) ? String(vacancy.expiry) : undefined;
                if (val && val.length >= 10) return val.slice(0, 10);
                return undefined;
              })()}
              onChange={e => setValue("expiry", e.target.value)}
              className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-base mt-1 bg-neutral-800 text-white placeholder-gray-400" />
            {errors.expiry && <p className="text-red-500 text-sm">Expiry date is required</p>}
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Experience Level</label>
            <select {...register("experience_level")}
              className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-base mt-1 bg-neutral-800 text-white">
              <option value="">Not specified</option>
              <option value="Junior">Junior</option>
              <option value="Middle">Middle</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Status</label>
            <select {...register("status")}
              className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-base mt-1 bg-neutral-800 text-white">
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-6 py-3 rounded-lg bg-neutral-800 border border-yellow-300 text-yellow-300 font-bold hover:bg-yellow-900 hover:text-white transition" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-6 py-3 rounded-lg bg-yellow-300 text-black font-bold hover:bg-yellow-400 transition">{isEdit ? "Save" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateVacancyForm; 