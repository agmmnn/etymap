import { NextResponse } from "next/server"
import langData from "@/data/langData.json"

const fetchEtyexpData = async (id: number) => {
  const etyexpResp = await fetch(
    `https://api.etymologyexplorer.com/prod/get_trees?ids[]=${id}`
  )
  const etyexpData = await etyexpResp.json()
  return etyexpData
}

const fetchLangLocation = async (lang: string) => {
  const resp = await fetch(
    `https://glottolog.org/glottolog?search=${lang.replace("Proto-", "")}`,
    {
      method: "GET",
      redirect: "manual",
    }
  )

  const headers = resp.headers
  const location = headers.get("location")
  return location
}

const fetchGlottoData = async (url) => {
  try {
    const resp = await fetch(`${url}.json`)
    const data = await resp.json()
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
    const etyexpData = await fetchEtyexpData(id)

    const langNames = Object.keys(etyexpData[1].words).map(
      (item) => etyexpData[1].words[item].language_name
    )
    const uniqueLangNames = Array.from(new Set(langNames))

    const langsGlotto = await Promise.all(
      uniqueLangNames.map(fetchLangLocation)
    )
    const langsLoc = await Promise.all(
      langsGlotto.map((url, index) => fetchGlottoData(url))
    ).then((results) =>
      results.reduce((acc, data, index) => {
        const lang = uniqueLangNames[index]
        acc[lang] = {
          url: langsGlotto[index],
          latitude: data.latitude || (langData[lang]?.latitude ?? null),
          longitude: data.longitude || (langData[lang]?.longitude ?? null),
        }
        return acc
      }, {})
    )

    return NextResponse.json({ data: etyexpData, lang_data: langsLoc })
  } catch (error) {
    return NextResponse.error()
  }
}
