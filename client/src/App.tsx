import React, { useEffect, useState } from "react";
import "./App.scss";
import { get } from "./api";
import { IMeteor, MeteorsRequest, MeteorsResponse } from "../../server/types";
import { useDebouncedCallback } from "./hooks/useDebounce";

function App() {
  const [meteorsData, setMeteorsData] = useState<IMeteor[]>([]);
  const [searchYear, setSearchYear] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const delayedFetchData = useDebouncedCallback(() => fetchData(), 500);

  const fetchData = async () => {
    const request: MeteorsRequest = {
      year: searchYear,
      page: currentPage
    };

    const data: MeteorsResponse = await get("", request);

    console.log("data",data);

    setTotalPages(data.totalPages);
    setMeteorsData(data.meteors ?? []);
    setCurrentPage(data.currentPage);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onYearSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchYear(Number(e.target.value));
    delayedFetchData();
  }

  return (
    <div className="App">
      <div className="headers">
        <div className="header">name</div>
        <div className="header">recClass</div>
        <div className="header">mass</div>
        <div className="header">year</div>
        <input></input>
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
