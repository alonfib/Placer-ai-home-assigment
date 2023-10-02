import { Meteors } from "./db/collections/meteors";

export type IMeteor = typeof Meteors[number];

export interface MeteorsRequestParams {
  page?: number;
  perPage?: number;
  year?: number;
  mass?: number;
}

export interface MeteorsResponse {
  meteors: IMeteor[];
  totalMeteors: number;
  currentPage: number;
  totalPages: number;
  currentYear: number;
}
