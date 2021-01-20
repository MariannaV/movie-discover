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
