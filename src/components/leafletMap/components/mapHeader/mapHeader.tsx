/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import styles from "./mapHeader.module.css";

import { Input } from "reactivus";
import { IoSearchSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function MapHeader({
  setSelectedLocation,
  selectedLocation,
}: {
  setSelectedLocation: React.Dispatch<React.SetStateAction<any>>;
  selectedLocation: any;
}) {
  const [locationsList, setLocationsList] = useState([]);

  const [showLocationsList, setShowLocationsList] = useState(false);

  const router = useRouter();

  const search = useSearchParams().get("search");

  const [searchParam, setSearchParam] = useState<string>("");

  useEffect(() => {
    if (search && search.length > 0) {
      setSearchParam(search);
      handleGeocodeLocation(search);
    }
  }, []);

  async function handleGeocodeLocation(value: string) {
    router.push(`?search=${value}`);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}&limit=10`,
        {
          method: "GET",
          headers: {
            "User-Agent": "YourApp",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLocationsList(data ?? []);
        setShowLocationsList(data.length > 0);
      } else {
        console.error("Geocoding request failed");
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
    }
  }

  return (
    <section>
      <section className={styles.mapHeaderMainBox}>
        <div className={styles.mapHeaderSearchBox}>
          <Input
            type={"text"}
            icon={<IoSearchSharp />}
            value={searchParam ?? ""}
            iconPosition="right"
            placeholder="Search in Ccorgz Map"
            onKeyDown={(e: any) => {
              if (e.key == "Enter") {
                handleGeocodeLocation(e.target?.value);
              }
            }}
            onChange={(e: any) => {
              setSearchParam(e.target.value ?? "");
              if (e.target.value == "") {
                setLocationsList([]);
                setShowLocationsList(false);
              }
            }}
            onClick={() => {
              if (!showLocationsList) {
                setShowLocationsList(true);
              }
            }}
          />
        </div>
        <div
          className={
            styles.locationsListBox +
            " " +
            (showLocationsList && locationsList.length > 0 ? styles.locationsListBoxOpen : "")
          }
        >
          {showLocationsList &&
            locationsList.map((loc: any) => {
              return (
                <div
                  key={Math.random()}
                  className={
                    styles.locationCard +
                    (selectedLocation &&
                    loc.lat == selectedLocation.lat &&
                    loc.lon == selectedLocation.lon
                      ? " " + styles.selectedCard
                      : "")
                  }
                  onClick={() => {
                    if (
                      selectedLocation &&
                      loc.lat == selectedLocation.lat &&
                      loc.lon == selectedLocation.lon
                    ) {
                      setSelectedLocation(null);
                    } else {
                      setSelectedLocation(loc);
                    }
                  }}
                >
                  <span>{loc.name}</span>
                  <span className={styles.locationCardDescription}>
                    {loc.display_name.slice(0, 110)}{" "}
                    {loc.display_name.length > 110 ? "..." : ""}
                  </span>
                </div>
              );
            })}
        </div>
      </section>
      {showLocationsList && (
        <div
          className={styles.locationsListBackLayer}
          onClick={() => setShowLocationsList(false)}
        />
      )}
    </section>
  );
}
