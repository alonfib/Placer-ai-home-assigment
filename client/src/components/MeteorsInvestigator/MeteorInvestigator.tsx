import React, { useEffect, useRef, useState } from "react";
import "./MeteorInvestigator.scss";
import { IMeteor, MeteorsRequestParams, MeteorsResponse } from "../../../../server/types";
import { useDebouncedCallback } from "../../hooks/useDebounce";
import CommonInput from "../Common/Input/Input";
import { get } from "../../api";
import MeteorsTable from "./MeteorsTable/MeteorsTable";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { MagnifyingGlass } from "react-loader-spinner";

function MeteorsInvestigator() {
  const [meteorsData, setMeteorsData] = useState<IMeteor[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchYear, setSearchYear] = useState<string>("");
  const [searchMass, setSearchMass] = useState<string>("");
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [userMessage, setUserMessage] = useState<string>("");
  const [meteorsCount, setMeteorsCount] = useState<number>(1);
  const tableRef = useRef<HTMLDivElement | null>(null);
  
  const resetScrollFlag = useInfiniteScroll(tableRef, () => onInfiniteScroll());

  useEffect(() => {
    fetchData({ page: 1 });
  }, []);

  const delayedFetchData = useDebouncedCallback((params: MeteorsRequestParams) => {
    console.log("fetching data");
    fetchData(params);
  }, 800);

  const handleUserMessage = (message: string) => {
    setUserMessage(message);
    setTimeout(() => {
      setUserMessage("");
    }, 5000);
  };

  const fetchAutoComplete = async (search: string) => {
    const suggestions = await get("autocomplete", { search });
    setAutoCompleteSuggestions(suggestions);
  };

  const fetchData = async ({ page = currentPage, year = searchYear, mass = searchMass, perPage }: MeteorsRequestParams) => {
    setIsLoading(true);
    const currentParams: MeteorsRequestParams = {
      page: page,
      year: year,
      mass: mass || undefined,
    };

    const data: MeteorsResponse = await get("meteors", currentParams);

    console.log("year", year);
    console.log("data.currentYear", data.currentYear);

    if (data?.currentYear && data.currentYear != year && !!mass) {
      handleUserMessage(`The is no data of meteors with mass above ${mass} for year ${year}  - Showing data for ${data.currentYear}`);
      setSearchYear(data.currentYear);
      await setTimeout(() => null, 2000);
    }

    setMeteorsData(data?.meteors ?? []);
    setMeteorsCount(data?.totalMeteors ?? 0);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return data;
  };

  const onYearSearch = async (year: string) => {
    if (isNaN(parseInt(year)) && year !== "") return;

    setSearchYear(year);
    fetchAutoComplete(year);
    setCurrentPage(1);

    delayedFetchData({ year, page: 1 });
  };

  const onMassSearch = async (mass: string) => {
    setSearchMass(mass);
    setCurrentPage(1);
    delayedFetchData({ mass, page: 1 });
  };

  const onInfiniteScroll = () => {
    setCurrentPage(currentPage + 1);
    fetchData({ page: currentPage + 1 }).finally(() => {
      resetScrollFlag();
    });
  };

  return (
    <div className="meteor-investigator">
      <div className="title">
        Meteor Investigator
        <div className="total-meteors">Total Meteors - {meteorsCount}</div>
      </div>
      <div className="inputs">
        <CommonInput
          type="number"
          placeholder="Year"
          value={searchYear}
          onChange={(val) => onYearSearch(val)}
          suggestions={autoCompleteSuggestions}
          title="Search by year"
        />
        <CommonInput
          type="number"
          title="Mass bigger than "
          placeholder="Mass"
          value={searchMass?.toString() || ""}
          onChange={(val) => onMassSearch(val)}
        />
      </div>
      <div className="user-message">{userMessage}</div>
      <MeteorsTable isLoading={isLoading} tableRef={tableRef} data={meteorsData} />
    </div>
  );
}

export default MeteorsInvestigator;
