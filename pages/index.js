import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useRef, useEffect, useState } from "react";
import Map, {
  FullscreenControl,
  NavigationControl,
  Marker,
} from "react-map-gl";

import axios from "axios";
import { toGreeklish } from "greek-utils";
import langData2 from "./langData.json";

import "mapbox-gl/dist/mapbox-gl.css";

export default function Home() {
  const [wordId, setWordId] = useState(0);
  const [data, setData] = useState([]);
  const [langData, setLangData] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const mapRef = useRef();

  useEffect(() => {
    getData();
    console.log(mapRef);
  }, []);
  useEffect(() => {
    getData();
  }, [wordId]);

  const getData = () => {
    axios
      .get("/api/data/" + wordId)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.log(error));
  };

  const getrandom = () => {
    axios
      .get(
        `https://api.etymologyexplorer.com/prod/random_etymology?language=English`
      )
      .then((response) => {
        setWordId(response.data.id);
      })
      .catch((error) => console.log(error));
  };

  const getSearch = () => {
    axios
      .get(
        `https://api.etymologyexplorer.com/prod/autocomplete?word=${searchValue.trim()}&language=English`
      )
      .then((r) => {
        setWordId(r.data.auto_complete_data[0]["_id"]);
        console.log(
          r.data.auto_complete_data[0]["_id"],
          r.data.auto_complete_data[0]["word"]
        );
        console.log(
          "https://api.etymologyexplorer.com/prod/get_trees?ids[]=" +
            r.data.auto_complete_data[0]["_id"]
        );
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (Object.hasOwn(data, "data")) {
      console.log(data);
      let list_nodes = [];
      Object.keys(data.data[1]["words"]).map((item) => {
        list_nodes.push({
          id: data.data[1]["words"][item]["_id"],
          word: data.data[1]["words"][item]["word"],
          language: data.data[1]["words"][item]["language_name"],
          longitude:
            data.lang_data[data.data[1]["words"][item]["language_name"]][
              "longitude"
            ],
          latitude:
            data.lang_data[data.data[1]["words"][item]["language_name"]][
              "latitude"
            ],
          definitions:
            data.data[1]["words"][item]["entries"] &&
            data.data[1]["words"][item]["entries"][0]["pos"][0][
              "definitions"
            ][0],
        });
      });
      setNodes(list_nodes);
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <Head>
        <title>etymap</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main>
        <div className={styles.root}>
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: 18.5,
              latitude: 48.5,
              zoom: 4,
              ////
              // longitude: 17,
              // latitude: 49,
              // zoom: 4.2,
              // bearing: 13,
              // pitch: 60,
            }}
            mapStyle="mapbox://styles/mapbox/dark-v10"
            // mapStyle="mapbox://styles/agmmnn/cl4094mje000l14n0utbraa7s"
            mapboxAccessToken="pk.eyJ1IjoiYWdtbW5uIiwiYSI6ImNsNDA4eTVqbDA3ZWszZnIydWQwaXlwMDUifQ.klohJw1mXmjIzTAbfoejpw"
            attributionControl={false}
            onDrag={(e) =>
              console.log(
                e.viewState.longitude,
                e.viewState.latitude,
                e.viewState.zoom,
                e.viewState.bearing,
                e.viewState.pitch,
                mapRef.current.getCanvasContainer()
              )
            }
          >
            <FullscreenControl />
            <NavigationControl />
            <div
              style={{
                position: "absolute",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <input
                placeholder="word"
                style={{
                  padding: "1rem",
                  paddingInlineStart: "2rem",
                  fontSize: "1rem",
                  border: "1px solid #ccc",
                }}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? getSearch() : null)}
              />
              <button type="submit" onClick={searchValue ? getSearch : null}>
                Search
              </button>
              <button type="submit" onClick={getrandom}>
                Random
              </button>
            </div>

            {nodes.map((item) => {
              return (
                <Marker
                  key={item.id}
                  draggable={true}
                  longitude={
                    item.longitude ||
                    (langData2.hasOwnProperty(item.language)
                      ? langData2[item.language].longitude
                      : 19)
                  }
                  latitude={
                    item.latitude ||
                    (langData2.hasOwnProperty(item.language)
                      ? langData2[item.language].latitude
                      : 50)
                  }
                  anchor="bottom"
                  cluster={true}
                >
                  <div
                    className="card"
                    style={{
                      backgroundColor: "white",
                      padding: "6px 6px",
                      width: 130,
                      borderRadius: 4,
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.24)",
                      textAlign: "center",
                      lineHeight: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "2px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontFamily: "Cormorant Infant, serif",
                          padding: "4px 10px",
                          backgroundColor: "#5794c6",
                          color: "white",
                          borderRadius: "10px ",
                        }}
                      >
                        {item.language}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontFamily: "Cormorant Infant, serif",
                        padding: "9px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.word}
                      {item.language === "Ancient Greek"
                        ? " (" + toGreeklish(item.word) + ")"
                        : null}
                    </div>
                    <div
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 11,
                      }}
                    >
                      {item.definitions}
                    </div>
                  </div>
                </Marker>
              );
            })}
          </Map>
        </div>
      </main>
    </div>
  );
}
