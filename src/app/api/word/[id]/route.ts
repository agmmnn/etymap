import { NextResponse } from "next/server"
import langData from "@/data/langData.json"

// Function to fetch etymology data based on ID
const fetchEtymologyData = async (id: number) => {
  const response = await fetch(
    `https://api.etymologyexplorer.com/prod/get_trees?ids[]=${id}`
  )
  const data = await response.json()
  return data
}

// Function to fetch Glottolog location URL for a language
const fetchLanguageLocationURL = async (language: string) => {
  const response = await fetch(
    `https://glottolog.org/glottolog?search=${language.replace("Proto-", "")}`,
    {
      method: "GET",
      redirect: "manual",
    }
  )

  const headers = response.headers
  const locationURL = headers.get("location")
  return locationURL
}

// Function to fetch Glottolog data
const fetchGlottologData = async (url: string) => {
  try {
    const response = await fetch(`${url}.json`)
    const data = await response.json()
    return data
  } catch (error) {
    return { latitude: null, longitude: null }
  }
}

export async function GET(request: Request, { params }) {
  const { id } = params

  if (!id) {
    return NextResponse.error()
  }

  try {
    // Fetch etymology data
    const etymologyData = await fetchEtymologyData(id)

    // Extract unique language names from etymology data
    const languageNames = Object.keys(etymologyData[1].words).map(
      (item) => etymologyData[1].words[item].language_name
    )
    const uniqueLanguageNames = Array.from(new Set(languageNames))

    // Fetch Glottolog location URLs for each language
    const languageLocationURLs = await Promise.all(
      uniqueLanguageNames.map(fetchLanguageLocationURL)
    )

    // Fetch Glottolog data for each language location and map to language_data
    const languageData = await Promise.all(
      languageLocationURLs.map((url, index) => fetchGlottologData(url))
    ).then((results) =>
      results.reduce((acc, data, index) => {
        const language = uniqueLanguageNames[index]
        acc[language] = {
          url: languageLocationURLs[index],
          latitude: data.latitude || (langData[language]?.latitude ?? null),
          longitude: data.longitude || (langData[language]?.longitude ?? null),
        }
        return acc
      }, {})
    )

    // Return etymology data and language location data
    return NextResponse.json({ data: etymologyData, lang_data: languageData })
  } catch (error) {
    return NextResponse.error()
  }
}
