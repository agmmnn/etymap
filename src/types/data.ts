interface CommonDescendant {
  progeny: number
  progeny_word: string
  progeny_language: string
  quality: number
}

interface EntryDefinition {
  definitions: string[]
}

interface EntryPos {
  [key: string]: EntryDefinition
}

interface Entry {
  pos: EntryPos
}

interface Word {
  _id: number
  word: string
  language_name: string
  progeny_count: number
  frequencies: number
  common_descendants: { [key: string]: CommonDescendant }
  entries: { [key: string]: Entry }
}

interface LanguageData {
  url: string
  latitude: number
  longitude: number
}

interface Data {
  words: { [key: string]: Word }
  affixes: number[]
}

interface LangData {
  [key: string]: LanguageData
}

interface DataObject {
  data: Data[]
  lang_data: LangData
}
