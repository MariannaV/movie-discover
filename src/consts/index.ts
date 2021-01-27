export const routes = {
  home: "/",
  card: "/card/:movieId",
};

export const MOVIE_API_KEY = "4237669ebd35e8010beee2f55fd45546";

export const pageSize = 20;

export default {
  get isDev(): boolean {
    return process.env.NODE_ENV === "development";
  },
  get isProd(): boolean {
    return process.env.NODE_ENV === "production";
  },
};
