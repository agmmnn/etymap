"use client"

import { useEffect, useRef, useState } from "react"

import { MapComponent } from "@/components/map"

const preWords = [
  { word: "amphora", id: 3788 },
  { word: "ancient", id: 1022 },
  { word: "galaxy", id: 61512 },
  { word: "horse", id: 1315 },
  { word: "microbe", id: 98323 },
  { word: "planet", id: 14346 },
  { word: "diamond", id: 46840 },
]

export default function Home() {
  const [wordId, setWordId] = useState<number | undefined>()
  const [word, setWord] = useState("")
  const [preWord, setPreWord] = useState<string | undefined>()
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
    let firstNode, firstWord
    setLoading(true) // Set loading to true before fetching data
    fetchData(`/api/word/${wordId}`, (data: DataObject) => {
      firstNode = Object.keys(data.data[2])[0]
      firstWord = data.data[1].words[firstNode].word
      setWord(firstWord)
      setData(data)
      setLoading(false)
    })
  }

  const getrandom = () => {
    fetchData(
      `https://api.etymologyexplorer.com/prod/random_etymology?language=English`,
      (data) => {
        console.log(data.word)
        setWordId(data.id)
        setWord(data.word)
        setPreWord(null)
      }
    )
  }

  const getSearch = () => {
    const searchUrl = `https://api.etymologyexplorer.com/prod/autocomplete?word=${searchValue.trim()}&language=English`
    fetchData(searchUrl, (data) => {
      const autoCompleteData = data.auto_complete_data[0]
      setWordId(autoCompleteData["_id"])
      setWord(autoCompleteData["word"])
      setPreWord(null)
      console.log(autoCompleteData["_id"], autoCompleteData["word"])
      console.log(
        `https://api.etymologyexplorer.com/prod/get_trees?ids[]=${autoCompleteData["_id"]}`
      )
    })
  }

  useEffect(() => {
    const preWord = preWords[Math.floor(Math.random() * preWords.length)]
    setWordId(preWord.id)
    setWord(preWord.word)
    setPreWord(preWord.word)
  }, [])

  useEffect(() => {
    if (wordId) {
      getData()
    }
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
            preWord={preWord}
          />
        </div>
      </main>
    </div>
  )
}
