import React from "react";
import { Range } from "react-range";

type CandidateFiltersProps = {
  filters: {
    name: string;
    position: string;
    experienceRange: [number, number];
    location: string;
    skills: string;
  };
  onChange: (filters: Partial<CandidateFiltersProps["filters"]>) => void;
  uniquePositions: string[];
  uniqueLocations: string[];
  minExp: number;
  maxExp: number;
};

const CandidateFilters: React.FC<CandidateFiltersProps> = ({
  filters,
  onChange,
  uniquePositions,
  uniqueLocations,
  minExp,
  maxExp,
}) => {
  return (
    <form className="flex flex-wrap gap-4 mb-6 items-center" onSubmit={e => e.preventDefault()}>
      <input
        value={filters.name}
        onChange={e => onChange({ name: e.target.value })}
        placeholder="Name"
        className="flex-1 min-w-[140px] rounded-lg border border-black px-3 py-2 text-base"
      />
      <select
        value={filters.position}
        onChange={e => onChange({ position: e.target.value })}
        className="min-w-[120px] rounded-lg border border-black px-3 py-2 text-base"
      >
        <option value="">Role</option>
        {uniquePositions.map(pos => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </select>
      <select
        value={filters.location}
        onChange={e => onChange({ location: e.target.value })}
        className="min-w-[110px] rounded-lg border border-black px-3 py-2 text-base"
      >
        <option value="">Location</option>
        {uniqueLocations.map(loc => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
      <div className="flex flex-col min-w-[170px]">
        <label className="text-xs text-gray-400 mb-1">Experience (years)</label>
        <Range
          step={1}
          min={minExp}
          max={maxExp}
          values={filters.experienceRange}
          onChange={vals => onChange({ experienceRange: vals as [number, number] })}
          renderTrack={({ props, children }) => (
            <div {...props} className="h-2 w-full rounded bg-yellow-200 flex items-center" style={{ margin: '0 8px' }}>
              <div
                className="h-2 rounded bg-yellow-400"
                style={{
                  width: `${((filters.experienceRange[1] - filters.experienceRange[0]) / (maxExp - minExp) * 100) || 0}%`,
                  marginLeft: `${((filters.experienceRange[0] - minExp) / (maxExp - minExp) * 100) || 0}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props, index }) => {
            const { key, ...rest } = props;
            return (
              <div
                key={key}
                {...rest}
                className="w-5 h-5 bg-yellow-400 rounded-full shadow border-2 border-white flex items-center justify-center focus:outline-none"
                style={{ ...rest.style }}
              >
                <span className="text-xs text-black select-none">{filters.experienceRange[index]}</span>
              </div>
            );
          }}
        />
      </div>
      <input
        value={filters.skills}
        onChange={e => onChange({ skills: e.target.value })}
        placeholder="Skills"
        className="min-w-[110px] rounded-lg border border-black px-3 py-2 text-base"
      />
    </form>
  );
};

export default CandidateFilters; 