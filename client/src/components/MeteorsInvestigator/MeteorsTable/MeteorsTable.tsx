import React from "react";
import { IMeteor } from "../../../../../server/types";
import "./MeteorsTable.scss";
import { MagnifyingGlass } from "react-loader-spinner";

interface IMeteorsTable {
  data: IMeteor[];
  tableRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
}

const MeteorsTable = ({ data, tableRef, isLoading }: IMeteorsTable) => {
  return (
    <div className="meteors-table">
      <TableHeaders/>
      {isLoading ? (
        <div className="loader">
          <MagnifyingGlass
            visible={true}
            height="100"
            width="100"
            ariaLabel="MagnifyingGlass-loading"
            wrapperClass="MagnifyingGlass-wrapper"
            glassColor="#c0efff"
            color="#28bbf1"
          />
        </div>
      ) : (
        <div className="meteors-table-data-container" ref={tableRef}>
          {data.length ? (
            data.map((meteor) => {
              return (
                <div className="row" key={meteor.id}>
                  <div className="row-data">{meteor.name}</div>
                  <div className="row-data">{meteor.recClass}</div>
                  <div className="row-data">{meteor?.mass ?? "Unknown"}</div>
                  <div className="row-data">{new Date(meteor?.year || "").getFullYear()}</div>
                </div>
              );
            })
          ) : (
            <div>No data found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MeteorsTable;


const TableHeaders = () => (
  <div className="table-headers">
    <div className="header">Meteor Name</div>
    <div className="header">Meteor Class</div>
    <div className="header">Meteor Mass</div>
    <div className="header">Meteor Year</div>
  </div>
);
