import React, { useEffect } from "react";
import "./App.scss";
import { get } from "./api";
import { IMeteor } from "../../server/types";

function App() {
  const [meteorsData, setMeteorsData] = React.useState<IMeteor[]>([]);
  console.log("meteorsData", meteorsData)

  const fetchData = async () => {
    const data: IMeteor[] = await get("");
    setMeteorsData(data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        {meteorsData.length ? meteorsData?.map((meteor) => {
          return (
            <div className="row">
              <div className="row-data">{meteor.name}</div>
              <div className="row-data">{meteor.recClass}</div>
              <div className="row-data">{meteor?.mass  ?? "Unknown"}</div>
              <div className="row-data">{meteor.year}</div>
            </div>
          );
        }) : <div> No data </div>}
      </div>
    </div>
  );
}

export default App;
