import { useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

export default function LocationSearch({
  onSelect,
  value,
  inputSx,
}: {
  onSelect: (value: string) => void;
  value?: string;
  inputSx?: object;
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Обновлять inputValue при изменении value (controlled)
  useEffect(() => {
    if (typeof value === "string") setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue.length < 3) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.opencagedata.com/geocode/v1/json",
          {
            params: {
              q: inputValue,
              key: "0dd4f33595e34daba4d29bb6a253ebc5",
              limit: 5,
              language: "en",
            },
          }
        );

        const results = response.data.results.map((r: any) => r.formatted);
        setOptions(results);
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchData();
    }, 400);

    return () => clearTimeout(debounce);
  }, [inputValue]);

  return (
    <Autocomplete
      fullWidth
      freeSolo
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(event, value) => setInputValue(value)}
      value={inputValue}
      onChange={(event, value) => onSelect(value || "")}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Location"
          placeholder="Search for your city"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={inputSx}
        />
      )}
    />
  );
}
