import axios from "axios";
import { env } from "../env";

export const authorsApi = axios.create({
  baseURL: env.AUTHORS_API_URL,
});

export const publicationsApi = axios.create({
  baseURL: env.PUBLICATIONS_API_URL,
});
