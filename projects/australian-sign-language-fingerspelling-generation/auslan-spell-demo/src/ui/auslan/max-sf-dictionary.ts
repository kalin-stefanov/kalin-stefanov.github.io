import { type MaxSFDictionary } from "auslan-spell";

export async function fetch_max_sf_dictionary(
  path: string,
): Promise<MaxSFDictionary> {
  const res = await fetch(path);
  const json = await res.json();
  return parse_max_sf_dictionary(json);
}

export function parse_max_sf_dictionary(json: {
  [key: string]: unknown;
}): MaxSFDictionary {
  const keys = Object.keys(json);
  for (const key of keys) {
    if (typeof json[key] !== "number") {
      throw new Error("Invalid max SF dictionary.");
    }
  }
  return json as MaxSFDictionary;
}
