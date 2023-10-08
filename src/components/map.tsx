import React from "react"
import langData from "@/data/langData.json"
import { useTheme } from "next-themes"
import Map, { FullscreenControl, Marker, NavigationControl } from "react-map-gl"

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="5.5em"
            height="5.5em"
            viewBox="0 0 24 24"
          >
            <circle cx="4" cy="12" r="3" fill="currentColor">
              <animate
                id="svgSpinners3DotsScale0"
                attributeName="r"
                begin="0;svgSpinners3DotsScale1.end-0.25s"
                dur="0.75s"
                values="3;.2;3"
              ></animate>
            </circle>
            <circle cx="12" cy="12" r="3" fill="currentColor">
              <animate
                attributeName="r"
                begin="svgSpinners3DotsScale0.end-0.6s"
                dur="0.75s"
                values="3;.2;3"
              ></animate>
            </circle>
            <circle cx="20" cy="12" r="3" fill="currentColor">
              <animate
                id="svgSpinners3DotsScale1"
                attributeName="r"
                begin="svgSpinners3DotsScale0.end-0.45s"
                dur="0.75s"
                values="3;.2;3"
              ></animate>
            </circle>
          </svg>
        </div>
      )}
    </Map>
  )
}
