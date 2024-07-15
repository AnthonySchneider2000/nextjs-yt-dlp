import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold">Nextjs Shadcn Template</h1>
      <ThemeToggle />
    </header>
  );
}