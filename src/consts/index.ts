export const routes = {
  home: "/",
};

export default {
  get isDev(): boolean {
    return process.env.NODE_ENV === "development";
  },
  get isProd(): boolean {
    return process.env.NODE_ENV === "production";
  },
};

export const MOVIE_API_KEY = "4237669ebd35e8010beee2f55fd45546";
