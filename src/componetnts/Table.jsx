import React, { useState, useEffect, useCallback } from "react";
import "./Table.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ReactComponent as ArrowDown } from "../icons/expand_less-black-18dp.svg";
import { ReactComponent as ArrowUp } from "../icons/expand_more-black-18dp.svg";
import { ReactComponent as EmptyCheckbox } from "../icons/check_box_empty.svg";
import { ReactComponent as Checkbox } from "../icons/check_box.svg";
import { ReactComponent as Visibility } from "../icons/visibility.svg";

import { connect } from "react-redux";
import { setAllselectedRows, unselectedRows } from "../redux/action";

import {
  defaultSizeFirstColumn,
  marginTable,
  // defaultPageIndex,
  // defaultPageIndex,
  // defaultPageSize,
} from "../const";

import {
  useTable,
  useSortBy,
  usePagination,
  useBlockLayout,
  useResizeColumns,
  useFilters,
  useColumnOrder,
} from "react-table";

// import { applyMiddleware } from "redux";

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

const getDraggableStyles = (
  { isDragging, isDropAnimating },
  draggableStyle
) => ({
  ...draggableStyle,
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: "5px",

  // change background colour if dragging
  background: isDragging ? "#ddd" : "#eee",

  ...(!isDragging && { transform: "translate(0,0)" }),
  ...(isDropAnimating && { transitionDuration: "0.001s" }),

  // styles we need to apply on draggables
});

let firstEntry = 0;

function Table({
  columns,
  data,
  allSelectedRows,
  setAllselectedRows,
  unselectedRows,
}) {
  const widthEveryColumn =
    (window.innerWidth - defaultSizeFirstColumn - marginTable * 2) /
    (columns.length - 1);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const [controlledPageIndex, setControlledPageIndex] = useState(0);
  const [sortingColumns, setSortingColumns] = useState([]);

  const {
    state,
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    allColumns,
    setColumnOrder,
    setHiddenColumns,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        pageIndex: controlledPageIndex,
        pageSize: 10,
        sortBy: sortingColumns,
      },
      autoResetSortBy: true,
    },
    useBlockLayout,
    useFilters,
    useSortBy,
    usePagination,
    useResizeColumns,
    useColumnOrder
  );

  const setResizeColumns = useCallback(
    (obj) => {
      columns.forEach((column) => {
        for (let key in obj) {
          if (key === column.accessor) state.columnResizing.columnWidths = obj;
        }
      });
    },
    [columns, state.columnResizing.columnWidths]
  );

  // console.log(">>>", sortingColumns);

  useEffect(() => {
    const getSettingTable = () => {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify({
          firstEntry: firstEntry,
          pageSize: state.pageSize,
          columnOrder: state.columnOrder,
          hiddenColumns: state.hiddenColumns,
          columnResizing: state.columnResizing.columnWidths,
          pageIndex: state.pageIndex,
          sorting: state.sortBy,
        }),
      };

      fetch("http://localhost:5000/table/", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("Server", data);
          if (data.pageSize >= 0) setPageSize(data.pageSize);
          if (data.columnOrder && data.columnOrder.length)
            setColumnOrder(data.columnOrder);
          if (data.hiddenColumns && data.hiddenColumns.length)
            setHiddenColumns(data.hiddenColumns);
          if (Object.keys(data.columnResizing).length > 0)
            setResizeColumns(data.columnResizing);
          if (data.pageIndex > -1) setControlledPageIndex(data.pageIndex);
          if (data.sorting && data.sorting.length > 0)
            setSortingColumns(data.sorting);
        })
        .catch((err) => console.log(err));
      firstEntry++;
    };
    getSettingTable();
  }, [
    columns,
    state.pageSize,
    state.columnOrder,
    setPageSize,
    setColumnOrder,
    state.hiddenColumns,
    setHiddenColumns,
    state.columnResizing.columnWidths,
    setResizeColumns,
    state.pageIndex,
    state.sortBy,
  ]);

  const selectedRows = (row) => {
    const idx = allSelectedRows.findIndex((el) => el.id === row.id);
    if (idx === -1) {
      setAllselectedRows(Object.assign({}, { id: row.id }, row.values)); //!!!
    } else {
      unselectedRows(idx);
    }
  };

  const showCheckbox = (row) => {
    const idx = allSelectedRows.findIndex((el) => el.id === row.id);
    if (allSelectedRows.length !== 0 && idx !== -1) {
      return <Checkbox />;
    }
    return <EmptyCheckbox />;
  };

  let [isVisible, setisVisible] = useState(false);

  const currentColOrder = React.useRef();

  return (
    <div className="wrap" style={{ margin: marginTable }}>
      <div className="wrap__tableSettings">
        <div
          className="settingsIconVisibleHeader"
          onClick={() => setisVisible(!isVisible)}
        >
          Результаты <Visibility />
        </div>

        {isVisible && (
          <div className="settingsVisibleHeader">
            {allColumns.map((column) => (
              <div key={column.id}>
                {column.Header && (
                  <label>
                    <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
                    {column.Header}
                  </label>
                )}
              </div>
            ))}
            <br />
          </div>
        )}
      </div>

      <div className="wrap__alltable">
        <div className="filter">
          {headerGroups.map((headerGroup) => (
            <div
              {...headerGroup.getHeaderGroupProps()}
              className="filter__group"
            >
              {headerGroup.headers.map((column, i) => (
                <div key={column.id} className="filter__item">
                  {i !== 0 && column.canFilter ? (
                    <div style={{ width: widthEveryColumn }}>
                      {column.render("Filter")}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="tableWithPagination">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup, i) => (
                // HERE IS DND
                <DragDropContext
                  key={headerGroup.headers[i].id}
                  onDragStart={() => {
                    // console.log("HEADERGROUP:", i);
                    currentColOrder.current = allColumns.map((o) => o.id);
                  }}
                  onDragEnd={(dragUpdateObj) => {
                    // console.log("dragUpdateObj", dragUpdateObj);
                    const colOrder = [...currentColOrder.current];
                    const sIndex = dragUpdateObj.source.index;
                    const dIndex =
                      dragUpdateObj.destination &&
                      dragUpdateObj.destination.index;

                    if (
                      typeof sIndex === "number" &&
                      typeof dIndex === "number" &&
                      dragUpdateObj.destination.index !== 0 // disable drop 1st column
                    ) {
                      colOrder.splice(sIndex, 1);
                      colOrder.splice(dIndex, 0, dragUpdateObj.draggableId);
                      setColumnOrder(colOrder);
                    }
                  }}
                >
                  <Droppable droppableId="droppable" direction="horizontal">
                    {(droppableProvided, snapshot) => (
                      <tr
                        {...headerGroup.getHeaderGroupProps()}
                        ref={droppableProvided.innerRef}
                        className="row header-group"
                      >
                        {headerGroup.headers.map((column, i) => {
                          // console.log("COLUMN>>>", column)
                          return (
                            <Draggable
                              key={column.id}
                              draggableId={column.id}
                              index={i}
                              isDragDisabled={i === 0 ? true : false} // disable drag 1st column
                            >
                              {(provided, snapshot) => {
                                return (
                                  <th
                                    {...column.getHeaderProps(
                                      // i(index Column) disable sorting  in first column
                                      i !== 0 && column.getSortByToggleProps()
                                    )}
                                  >
                                    <div
                                      title={column.Header}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      // {...extraProps}
                                      ref={provided.innerRef}
                                      className="table__header"
                                      style={{
                                        ...getDraggableStyles(
                                          snapshot,
                                          provided.draggableProps.style
                                        ),
                                        // ...style   /////////////////////////
                                      }}
                                    >
                                      <div title="Сортировать несколько +Shift">
                                        {column.render("Header")}
                                        &nbsp;
                                        {i !== 0 && ( // i(index Column) hide sorting Arrows in first column
                                          <span>
                                            {column.isSorted ? (
                                              <ArrowDown />
                                            ) : (
                                              <ArrowUp />
                                            )}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* div Resizer */}
                                    <div
                                      onClick={(e) => {
                                        e.preventDefault(); // Disable sorting while resize
                                        e.stopPropagation();
                                      }}
                                      {...column.getResizerProps()}
                                      className={`resizer ${
                                        column.isResizing ? "isResizing" : ""
                                      }`}
                                    />
                                    {provided.placeholder}
                                  </th>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                      </tr>
                    )}
                  </Droppable>
                </DragDropContext>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onClick={(e) => selectedRows(row)} ///
                    id={i}
                  >
                    {row.cells.map((cell, i) => {
                      return i === 0 ? (
                        <td {...cell.getCellProps()}>{showCheckbox(row)}</td>
                      ) : (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pagination">
            <div className="pagination__button">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {"<<"}
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {"<"}
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage}>
                {">"}
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {">>"}
              </button>
            </div>
            <span>
              Страница &nbsp;
              <strong>
                {pageIndex + 1} из {pageOptions.length}
              </strong>
            </span>
            <span>
              | &nbsp; Перейти:&nbsp;
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: "50px" }}
              />
            </span>{" "}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[2, 5, 10, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Показать {pageSize} рядов &nbsp;
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { allSelectedRows: state.selected };
};

const mapDispatchToProps = {
  setAllselectedRows,
  unselectedRows,
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);
