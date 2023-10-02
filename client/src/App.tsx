import React, { useEffect, useState } from "react";
import "./App.scss";
import { get } from "./api";
import { IMeteor, MeteorsRequestParams, MeteorsResponse } from "../../server/types";
import { useDebouncedCallback } from "./hooks/useDebounce";

function App() {
  const [meteorsData, setMeteorsData] = useState<IMeteor[]>([]);
  const [searchYear, setSearchYear] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchMass, setSearchMass] = useState<string>("");
  
  // TODO: remove from anywhere i think
  const [totalPages, setTotalPages] = useState<number>(1);

  const delayedFetchData = useDebouncedCallback((params) => {
    console.log("fetching data");
    fetchData(params)
  }, 800);

  const fetchData = async ({page = currentPage, year = searchYear, mass, perPage}: MeteorsRequestParams) => {
    const currentParams: MeteorsRequestParams = {
      page: page,
      year: year || undefined,
      mass: mass || undefined,
    };

    const data: MeteorsResponse = await get("meteors", currentParams);

    setMeteorsData(data?.meteors ?? []);
    setCurrentPage(data?.currentPage ?? 1);
  };

  useEffect(() => {
    fetchData({page: 1});
  }, []);

  const onYearSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchYear(Number(e.target.value));
    delayedFetchData({ year: Number(e.target.value) });
  };

  return (
    <div className="App">
      <button onClick={() => fetchData({page: 1})}>fetch</button>
      <div className="headers">
        <div className="header">name</div>
        <div className="header">recClass</div>
        <div className="header">mass</div>
        <div className="header">year</div>
        <input type="number" onChange={onYearSearch}></input>
      </div>
      <div className="content">
        {meteorsData.length ? (
          meteorsData?.map((meteor) => {
            return (
              <div className="row">
                <div className="row-data">{meteor.name}</div>
                <div className="row-data">{meteor.recClass}</div>
                <div className="row-data">{meteor?.mass ?? "Unknown"}</div>
                <div className="row-data">{meteor.year}</div>
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
