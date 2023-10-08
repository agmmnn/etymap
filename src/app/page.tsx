"use client"

import { useEffect, useRef, useState } from "react"

import { MapComponent } from "@/components/map"

export default function Home() {
  const [wordId, setWordId] = useState(0)
  const [word, setWord] = useState("word")
  const [data, setData] = useState<DataObject | undefined>()
  const [nodes, setNodes] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [loading, setLoading] = useState(false)
  const mapRef = useRef()

  const fetchData = async (url, callback) => {
    try {
      const response = await fetch(url)
      const responseData = await response.json()
      callback(responseData)
    } catch (error) {
      console.error(error)
    }
  }

  const getData = () => {
    setLoading(true) // Set loading to true before fetching data
    fetchData(`/api/word/${wordId}`, (data: DataObject) => {
      setData(data)
      setLoading(false) // Set loading to false after data is fetched
    })
  }

  const getrandom = () => {
    fetchData(
      `https://api.etymologyexplorer.com/prod/random_etymology?language=English`,
      (data) => {
        console.log(data.word)
        setWordId(data.id)
        setWord(data.word)
      }
    )
  }

  const getSearch = () => {
    const searchUrl = `https://api.etymologyexplorer.com/prod/autocomplete?word=${searchValue.trim()}&language=English`
    fetchData(searchUrl, (data) => {
      const autoCompleteData = data.auto_complete_data[0]
      setWordId(autoCompleteData["_id"])
      setWord(autoCompleteData["word"])
      console.log(autoCompleteData["_id"], autoCompleteData["word"])
      console.log(
        `https://api.etymologyexplorer.com/prod/get_trees?ids[]=${autoCompleteData["_id"]}`
      )
    })
  }

  useEffect(() => {
    getData()
    console.log(mapRef)
  }, [])

  useEffect(() => {
    getData()
  }, [wordId])

  useEffect(() => {
    if (data && data.data && Object.keys(data.data).length > 1) {
      const list_nodes = Object.keys(data.data[1].words).map((item) => {
        const wordItem = data.data[1].words[item]
        const languageName = wordItem.language_name
        const langData = data.lang_data[languageName]

        return {
          id: wordItem._id,
          word: wordItem.word,
          language: languageName,
          longitude: langData.longitude || null,
          latitude: langData.latitude || null,
          definitions:
            (wordItem.entries && wordItem.entries[0].pos[0].definitions[0]) ||
            null,
        }
      })

      console.log(list_nodes)
      setNodes(list_nodes)
    }
  }, [data])

  return (
    <div className="h-screen w-auto">
      <main>
        <div className="h-screen w-auto">
          <MapComponent
            mapRef={mapRef}
            nodes={nodes}
            word={word}
            loading={loading}
            setSearchValue={setSearchValue}
            searchValue={searchValue}
            getSearch={getSearch}
            getrandom={getrandom}
          />
        </div>
      </main>
    </div>
  )
}
