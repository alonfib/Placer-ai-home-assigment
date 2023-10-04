import React, { useCallback, useEffect, useRef, useState } from "react";
import "./MeteorInvestigator.scss";
import { IMeteor, MeteorsRequestParams, MeteorsResponse } from "../../../../server/types";
import { useDebouncedCallback } from "../../hooks/useDebounce";
import CommonInput from "../Common/Input/Input";
import { get } from "../../api";
import MeteorsTable from "./MeteorsTable/MeteorsTable";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { MagnifyingGlass } from "react-loader-spinner";
import { fetchAutoComplete } from "../../utils";

function MeteorsInvestigator() {
  const [meteorsData, setMeteorsData] = useState<IMeteor[]>([]);
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchYear, setSearchYear] = useState<string>("");
  const [searchMass, setSearchMass] = useState<string>("");
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [userMessage, setUserMessage] = useState<string>("");
  const [meteorsCount, setMeteorsCount] = useState<number>(1);
  const tableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchData({ page: 1 });
  }, []);

  const onInfiniteScroll = (page = currentPage) => {
    fetchData({ page: page + 1 });
  };

  // debounced for better looking ui
  const delayedInfiniteScroll = useDebouncedCallback((page) => {
    if (!!meteorsData.length) {
      onInfiniteScroll(page);
    }
  }, 300);

  // debounced for better looking ui and showing loader beside of performance
  const delayedFetchData = useDebouncedCallback((params: MeteorsRequestParams) => {
    fetchData(params);
  }, 800);

  const handleUserMessage = (message: string) => {
    setUserMessage(message);
    setTimeout(() => {
      setUserMessage("");
    }, 5000);
  };

  const { resetBottomScrollFlag, currentPage, resetPageCount } = useInfiniteScroll(tableRef, 1, () => {
      delayedInfiniteScroll(currentPage);
  });

  const fetchData = async ({ 
    page = currentPage, 
    year = searchYear, 
    mass = searchMass 
  }: MeteorsRequestParams) => {
    setIsLoading(true);

    const currentParams: MeteorsRequestParams = {
      page,
      year,
      mass,
    };

    const data: MeteorsResponse = await get("meteors", currentParams);

    if (data?.currentYear && data.currentYear != year && !!mass) {
      handleUserMessage(
        `The is no data of meteors with mass above ${mass} for year ${year}  - Showing data for ${data.currentYear}`
      );
      setSearchYear(data.currentYear);
      await setTimeout(() => null, 2000);
    }

    setMeteorsData(data?.meteors ?? []);
    setMeteorsCount(data?.totalMeteors ?? 0);

    // bottom scroll flag made to prevent infinite scroll from firing lots of requests
    resetBottomScrollFlag();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const onYearSearch = async (year: string) => {
    setSearchYear(year);
    const suggestions = await fetchAutoComplete(year);
    setAutoCompleteSuggestions(suggestions);
    resetPageCount();
    delayedFetchData({ year, page: 1 });
  };

  const onMassSearch = async (mass: string) => {
    setSearchMass(mass);
    resetPageCount();
    delayedFetchData({ mass, page: 1 });
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
