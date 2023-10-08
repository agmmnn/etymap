import { Language } from "./language"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export function SearchComponent({
  word,
  setSearchValue,
  searchValue,
  getSearch,
  getrandom,
}) {
  return (
    <div className="absolute flex w-full flex-row justify-center space-x-1 p-2">
      <Input
        placeholder={word}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? getSearch() : null)}
        className="bg-background w-fit rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />

      <Button type="submit" onClick={searchValue ? getSearch : null}>
        Search
      </Button>

      <Button type="submit" onClick={getrandom}>
        Random
      </Button>

      <ModeToggle />
      <Language />
    </div>
  )
}
