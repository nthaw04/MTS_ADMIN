import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Be Vietnam Pro'", ...fontFamily.sans],
      },
    },
  },
};
