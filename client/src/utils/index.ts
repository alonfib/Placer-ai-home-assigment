import { get } from "../api";

export type Modify<T, R> = Omit<T, keyof R> & R;

export const fetchAutoComplete = async (search: string) => {
  const suggestions = await get("autocomplete", { search });
  return suggestions
};