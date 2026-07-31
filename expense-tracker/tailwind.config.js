/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit_400Regular", "sans-serif"],
        thin: ["Outfit_100Thin", "sans-serif"],
        extralight: ["Outfit_200ExtraLight", "sans-serif"],
        light: ["Outfit_300Light", "sans-serif"],
        normal: ["Outfit_400Regular", "sans-serif"],
        medium: ["Outfit_500Medium", "sans-serif"],
        semibold: ["Outfit_600SemiBold", "sans-serif"],
        bold: ["Outfit_700Bold", "sans-serif"],
        extrabold: ["Outfit_800ExtraBold", "sans-serif"],
        black: ["Outfit_900Black", "sans-serif"],
      },
    },
  },
  // RN can't combine a weighted custom font name (e.g. Outfit_700Bold) with
  // fontWeight — it causes a fallback to the system font. So we disable the
  // default fontWeight plugin and let `font-bold` etc. map purely to the
  // exact Outfit weight font family instead.
  corePlugins: {
    fontWeight: false,
  },
  plugins: [],
}