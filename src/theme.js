export function parseTheme(rawTheme) {
  const theme = rawTheme?.trim().toLowerCase();

  if (theme === "dark" || theme === "light") {
    return theme;
  }

  return null;
}
