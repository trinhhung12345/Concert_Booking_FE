import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="text-muted-foreground hover:text-foreground"
      title={`Chuyển sang theme ${theme === "light" ? "tối" : "sáng"}`}
    >
      <FontAwesomeIcon
        icon={theme === "light" ? faMoon : faSun}
        className="h-4 w-4"
      />
    </Button>
  );
}
