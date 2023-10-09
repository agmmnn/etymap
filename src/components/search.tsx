import { useEffect, useState } from "react"
import { IBM_Plex_Sans } from "next/font/google"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { EmojioneV1WorldMap, GiDiceTwentyFacesOne } from "./icons"
import { Language } from "./language"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

const ibmPlexSans = IBM_Plex_Sans({ weight: ["600"], subsets: ["latin"] })

export function SearchComponent({
  word,
  setSearchValue,
  searchValue,
  getSearch,
  getrandom,
  preWord,
}) {
  return (
    <div className="absolute flex w-full flex-row items-center justify-center space-x-1 p-2">
      <Link
        href="/"
        className="flex select-none flex-row items-center text-2xl"
      >
        {preWord ? (
          <Image
            src={`/assets/${preWord}.svg`}
            width={42}
            height={42}
            alt="EtyMap"
          />
        ) : (
          <EmojioneV1WorldMap width={42} height={42} />
        )}
        <h1
          className={cn(
            ibmPlexSans.className,
            "flex select-none flex-row text-2xl"
          )}
        >
          <span className="text-primary">Ety</span>
          <span>Map</span>
        </h1>
      </Link>

      <Input
        placeholder={word}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? getSearch() : null)}
        className="w-fit rounded-md border-gray-300 bg-background focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />

      <Button type="submit" onClick={searchValue ? getSearch : null}>
        Search
      </Button>

      <Button
        variant="secondary"
        className="rounded-2xl"
        type="submit"
        onClick={getrandom}
      >
        <GiDiceTwentyFacesOne />
      </Button>

      {/* <ModeToggle />
      <Language /> */}
    </div>
  )
}
