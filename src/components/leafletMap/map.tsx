"use client";

import styles from "./map.module.css";

import {
  LayersControl,
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import MapHeader from "./components/mapHeader/mapHeader";
import L from "leaflet";

const { BaseLayer } = LayersControl;

export default function Map() {
  const mapRef = useRef<any>();

  const defaultMapCenter = {
    lat: "-15.802620422841109",
    lon: "-47.85130149901443",
  };

  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      const map = mapRef.current;
      if (map) {
        map.flyTo(
          [+selectedLocation.lat ?? 0, +selectedLocation.lon ?? 0],
          12,
          {
            animate: true,
            duration: 1,
          }
        );
      }
    }
    console.log("selectedLocation :", selectedLocation);
  }, [selectedLocation]);

  const customIcon = new L.Icon({
    iconUrl: "/mapMarker.png",
    iconSize: [25, 33],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <main className={styles.mapMainBox}>
      <MapHeader
        setSelectedLocation={setSelectedLocation}
        selectedLocation={selectedLocation}
      />
      <MapContainer
        center={
          selectedLocation
            ? [+selectedLocation.lat ?? 0, +selectedLocation.lon ?? 0]
            : [+defaultMapCenter.lat, +defaultMapCenter.lon]
        }
        zoom={13}
        style={{ width: "100%", height: "100dvh" }}
        zoomControl={false}
        ref={mapRef}
      >
        {selectedLocation && (
          <Marker
            position={[+selectedLocation.lat ?? 0, +selectedLocation.lon ?? 0]}
            icon={customIcon}
          >
            <Popup>
              <div className={styles.mapPopUp}>
              <span>{selectedLocation.name}</span>
              <span>
                {selectedLocation.display_name.slice(0, 110)}{" "}
                {selectedLocation.display_name.length > 110 ? "..." : ""}
              </span>
              <span>
                {selectedLocation.lat}{", "}
                {selectedLocation.lon}
              </span>
              </div>
            </Popup>
          </Marker>
        )}
        <LayersControl position="topright">
          <BaseLayer checked name="CartoDB">
            <TileLayer
              attribution='&copy; <a href="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png">Carto DB</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
          </BaseLayer>
          <BaseLayer name="OpenMaps">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          </BaseLayer>
        </LayersControl>
        <ZoomControl position="topright" />
      </MapContainer>
    </main>
  );
}
