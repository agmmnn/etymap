import React from "react"
import langData from "@/data/langData.json"
import { useTheme } from "next-themes"
import Map, { FullscreenControl, Marker, NavigationControl } from "react-map-gl"

import { SvgSpinners3DotsScale } from "./icons"
import { MarkerCard } from "./marker-card"
import { SearchComponent } from "./search"

export function MapComponent({
  mapRef,
  nodes,
  word,
  loading,
  setSearchValue,
  searchValue,
  getSearch,
  getrandom,
  preWord,
}) {
  const { theme } = useTheme()

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: 18.5,
        latitude: 48.5,
        zoom: 4,
        bearing: 8.4,
        pitch: 24.5,
      }}
      mapboxAccessToken={
        theme === "dark"
          ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN_DARK
          : process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      }
      mapStyle={
        theme === "dark"
          ? process.env.NEXT_PUBLIC_MAPBOX_STYLE_DARK
          : process.env.NEXT_PUBLIC_MAPBOX_STYLE
      }
      projection={{ name: "globe" }}
      attributionControl={false}
      // onDrag={(e) =>
      //   console.log(
      //     e.viewState.longitude,
      //     e.viewState.latitude,
      //     e.viewState.zoom,
      //     e.viewState.bearing,
      //     e.viewState.pitch,
      //     mapRef.current.getCanvasContainer()
      //   )
      // }
    >
      <FullscreenControl />
      <NavigationControl />
      <SearchComponent
        word={word}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        getSearch={getSearch}
        getrandom={getrandom}
        preWord={preWord}
      />

      {!loading &&
        nodes.map((item) => (
          <Marker
            key={item.id}
            draggable={true}
            anchor="bottom"
            longitude={
              item.longitude ||
              (langData.hasOwnProperty(item.language)
                ? langData[item.language].longitude
                : 19)
            }
            latitude={
              item.latitude ||
              (langData.hasOwnProperty(item.language)
                ? langData[item.language].latitude
                : 50)
            }
          >
            <MarkerCard item={item} />
          </Marker>
        ))}
      {loading && (
        <div className="absolute flex h-full w-full select-none flex-row items-center justify-center text-sky-500">
          <SvgSpinners3DotsScale width="5.5em" height="5.5em" />
        </div>
      )}
    </Map>
  )
}
