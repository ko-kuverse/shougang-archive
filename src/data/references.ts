import raw from "./references.json";

export type Reference = {
  id: number;
  text: string;
  url: string;
};

export const references = raw as Reference[];
