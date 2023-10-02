import React, { useEffect, useState } from "react";
import "./App.scss";
import { get } from "./api";
import { IMeteor, MeteorsRequestParams, MeteorsResponse } from "../../server/types";
import { useDebouncedCallback } from "./hooks/useDebounce";
import CommonInput from "./components/Common/Input/Input";

function App() {
  const [meteorsData, setMeteorsData] = useState<IMeteor[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchYear, setSearchYear] = useState<number | undefined>();
  const [searchMass, setSearchMass] = useState<number | undefined>();

  // TODO: remove from anywhere i think
  const [meteorsCount, setMeteorsCount] = useState<number>(1);

  const delayedFetchData = useDebouncedCallback((params: MeteorsRequestParams) => {
    console.log("fetching data");
    fetchData(params);
  }, 800);

  const fetchData = async ({ page = currentPage, year = searchYear, mass = searchMass, perPage }: MeteorsRequestParams) => {
    const currentParams: MeteorsRequestParams = {
      page: page,
      year: year || undefined,
      mass: mass || undefined,
    };

    console.log("currentParams", currentParams);

    const data: MeteorsResponse = await get("meteors", currentParams);

    if (data?.currentYear && data.currentYear != searchYear) {
      // TODO: display error message
      setSearchYear(new Date(data.currentYear).getFullYear());
    }

    setMeteorsData(data?.meteors ?? []);
    setCurrentPage(data?.currentPage ?? 1);
    setMeteorsCount(data?.totalMeteors ?? 0);
  };

  useEffect(() => {
    fetchData({ page: 1 });
  }, []);

  const onYearSearch = async (year: number) => {
    setSearchYear(year);
    delayedFetchData({ year });
  };

  const onMassSearch = async (mass: string) => {
    let value: number | undefined = parseInt(mass);
    if (isNaN(value)) {
      value = undefined;
    }
    setSearchMass(value);
    delayedFetchData({ mass: value });
  };

  return (
    <div className="App">
      <button onClick={() => fetchData({ page: 1 })}>fetch</button>
      <div className="input">
        year search
        <CommonInput
          type="number"
          placeholder="Year"
          value={searchYear?.toString() || ""}
          onChange={(val) => onYearSearch(parseInt(val))}
        />
      </div>
      <div className="input">
        mass bigger than -
        <CommonInput placeholder="Mass" value={searchMass?.toString() || ""} onChange={(val) => onMassSearch(val)} />
      </div>
      <div className="total-meteors">meteors count: {meteorsCount}</div>
      <div className="headers">
        <div className="header">name</div>
        <div className="header">recClass</div>
        <div className="header">mass</div>
        <div className="header">year</div>
      </div>
      <div className="content">
        {meteorsData.length ? (
          meteorsData?.map((meteor) => {
            return (
              <div className="row">
                <div className="row-data">{meteor.name}</div>
                <div className="row-data">{meteor.recClass}</div>
                <div className="row-data">{meteor?.mass ?? "Unknown"}</div>
                <div className="row-data">{new Date(meteor?.year || "").getFullYear()}</div>
              </div>
            );
          })
        ) : (
          <div> No data </div>
        )}
      </div>
    </div>
  );
}

export default App;
