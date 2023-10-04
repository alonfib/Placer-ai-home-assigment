import { useEffect, useRef, useState } from "react";
import "./MeteorInvestigator.scss";
import { IMeteor, MeteorsRequestParams, MeteorsResponse } from "../../../../server/types";
import { useDebouncedCallback } from "../../hooks/useDebounce";
import CommonInput from "../Common/Input/Input";
import { get } from "../../api";
import MeteorsTable from "./MeteorsTable/MeteorsTable";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { fetchAutoComplete } from "../../utils";

function MeteorsInvestigator() {
  const [meteorsData, setMeteorsData] = useState<IMeteor[]>([]);
  const [searchYear, setSearchYear] = useState<string>("");
  const [searchMass, setSearchMass] = useState<string>("");
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const [meteorsCount, setMeteorsCount] = useState<number>(1);

  const tableRef = useRef<HTMLDivElement | null>(null);

  const { resetBottomScrollFlag, currentPage, resetPageCount } = useInfiniteScroll(tableRef, 1, () => {
    if (!!meteorsData.length) {
      delayedFetchData({ page: currentPage + 1 });
    }
  });

  useEffect(() => {
    fetchData({ page: 1 });
  }, []);

  const delayedFetchData = useDebouncedCallback((params: MeteorsRequestParams) => {
    fetchData(params);
  }, 300);

  const handleUserMessage = (message: string) => {
    setUserMessage(message);
    setTimeout(() => {
      setUserMessage("");
    }, 5000);
  };

  const fetchData = async ({ page = currentPage, year = searchYear, mass = searchMass }: MeteorsRequestParams) => {
    if (meteorsCount <= meteorsData.length) return;
    setIsLoading(true);

    const currentParams: MeteorsRequestParams = { page, year, mass };
    const data: MeteorsResponse = await get("meteors", currentParams);

    if (!data) {
      handleUserMessage(`Could not load meteors data. Please try to search again or reload page`);
      return;
    }

    if (data?.currentYear && data.currentYear !== year && !!mass) {
      handleUserMessage(
        `There is no data of meteors with mass above ${mass} for year ${year} - Showing data for ${data.currentYear}`
      );
      setSearchYear(data.currentYear);
      await setTimeout(() => null, 2000);
    }

    setMeteorsData(data?.meteors ?? []);
    setMeteorsCount(data?.totalMeteors ?? 0);

    resetBottomScrollFlag();
    setTimeout(() => {
      // Just making it looks like it loading :)
      setIsLoading(false);
    }, 1000);
  };

  const onYearSearch = async (year: string) => {
    const suggestions = await fetchAutoComplete(year);
    setAutoCompleteSuggestions(suggestions);
    setSearchYear(year);
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
          value={searchMass}
          onChange={(val) => onMassSearch(val)}
        />
      </div>
      <div className="user-message">{userMessage}</div>
      <MeteorsTable isLoading={isLoading} tableRef={tableRef} data={meteorsData} />
    </div>
  );
}

export default MeteorsInvestigator;
