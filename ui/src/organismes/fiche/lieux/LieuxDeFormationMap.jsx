import React, { useRef } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import useOnce from "../../../common/hooks/useOnce"; // eslint-disable-line import/no-webpack-loader-syntax
import blue from "./blue.svg";
import red from "./red.svg";
import "mapbox-gl/dist/mapbox-gl.css";
import { Box } from "../../../common/Flexbox";
import Legend from "./Legend";

mapboxgl.accessToken = "pk.eyJ1IjoiYmd1ZXJvdXQiLCJhIjoiY2wwamM5bmMyMGI5cDNrcDZzeGE0Y3RuNyJ9.R3_znqXpyJ8_98pEUYQuwQ";

function addSVGImage(map, name, file) {
  return new Promise((resolve) => {
    let img = new Image(30, 36);
    img.src = file;
    img.onload = () => {
      map.addImage(name, img);
      resolve();
    };
  });
}

function getGeojson(adresse, props = {}) {
  let geojson = adresse.geojson;

  return {
    ...geojson,
    properties: {
      ...geojson.properties,
      ...props,
    },
  };
}

function getCenter(organisme) {
  let adresse = organisme.adresse;
  if (adresse) {
    let geometry = adresse.geojson.geometry;
    return geometry.type === "Polygon" ? geometry.coordinates[0][0] : geometry.coordinates;
  }

  return organisme.lieux_de_formation[0].adresse?.geojson.geometry.coordinates;
}

function buildSource(organisme) {
  let features = [];
  if (organisme.adresse) {
    features.push(
      getGeojson(organisme.adresse, {
        label: organisme.enseigne || organisme.raison_sociale,
        popup: organisme.adresse?.label,
        icon: "poi-red",
        sortKey: 1,
      })
    );
  }

  return {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        ...features,
        ...organisme.lieux_de_formation.map((l) => {
          return getGeojson(l.adresse, {
            popup: l.adresse?.label,
            icon: "poi-blue",
            sortKey: 2,
          });
        }),
      ],
    },
  };
}

function showPopupOnMouseHover(map, layerName) {
  let popup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false });

  map.on("mouseenter", layerName, (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    popup.setLngLat(coordinates).setText(e.features[0].properties.popup).addTo(map);
  });

  map.on("mouseleave", layerName, () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
}

async function onMapLoaded(map, source) {
  await Promise.all([addSVGImage(map, "poi-blue", blue), addSVGImage(map, "poi-red", red)]);

  showPopupOnMouseHover(map, "layer-points");

  map
    .addControl(new mapboxgl.NavigationControl())
    .addSource("ecosysteme", source)
    .addLayer({
      id: "layer-commune",
      source: "ecosysteme",
      filter: ["==", "$type", "Polygon"],
      layout: {},
      type: "fill",
      paint: {
        "fill-color": "#e1000f",
        "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.8, 0.5],
      },
    })
    .addLayer({
      id: "layer-points",
      source: "ecosysteme",
      filter: ["==", "$type", "Point"],
      type: "symbol",
      "symbol-z-order": "source",
      layout: {
        "text-field": ["get", "label"],
        "text-offset": [0, 1.25],
        "text-anchor": "top",
        "icon-image": "{icon}",
        "icon-allow-overlap": true,
      },
    })
    .fitBounds(
      source.data.features.map((f) => {
        return f.geometry.type === "Polygon" ? f.geometry.coordinates[0][0] : f.geometry.coordinates;
      }),
      { padding: 200, maxZoom: 7 }
    );
}

export default function LieuxDeFormationMap({ organisme }) {
  const mapContainer = useRef(null);

  useOnce(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: getCenter(organisme),
      zoom: 7,
    });

    map.on("load", () => {
      let source = buildSource(organisme);
      return onMapLoaded(map, source);
    });
  });

  return (
    <>
      <Box className={"fr-mb-5v"}>
        <Legend color={"#E1000F"}>Organisme</Legend>
        <Legend className={"fr-ml-3w"} color={"#000091"}>
          Lieux de formation
        </Legend>
      </Box>
      <div style={{ height: "620px", width: "100%" }} ref={mapContainer} className="map-container" />
    </>
  );
}
