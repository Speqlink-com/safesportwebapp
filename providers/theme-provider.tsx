import { ThemeProvider as NextThemes } from "next-themes";
export default function Theme_Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemes attribute={"class"} defaultTheme="system" enableSystem>
      {children}
    </NextThemes>
  );
}
