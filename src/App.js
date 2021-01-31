import React, { useState, useEffect } from "react";
import "./App.css";
import Table from "./componetnts/Table";
import { defaultSizeFirstColumn } from "./const";
import { apiServer } from "./const";


function App() {
  const [dataTable, setDataTable] = useState([]);
  const [columns, setColumns] = useState([
    {
      Header: "",
      accessor: "col0",
      width: defaultSizeFirstColumn,
      minWidth: 30,
    },
    {
      Header: "Имя",
      accessor: "name",
      // width: 150,
    },
    {
      Header: "Имя польз.",
      accessor: "username",
      // width: 150,
    },
    {
      Header: "email",
      accessor: "email",
      // width: 150,
    },
    {
      Header: "phone",
      accessor: "phone",
      // width: 150,
    },
    {
      Header: "website",
      accessor: "website",
      // width: 150,
    },
    {
      Header: "Street",
      accessor: "address.street",
      // width: 150,
    },
    {
      Header: "Suite",
      accessor: "address.suite",
      // width: 150,
    },
    {
      Header: "Zipcode",
      accessor: "address.zipcode",
      // width: 150,
    },
  ])

  const getData = async () => {
    let response = await fetch(apiServer);
    response = await response.json();
    setDataTable(response);
  };

  useEffect(() => {
    getData();
  }, []);

  const updateColumns = async () => {
    try{
      const response = await fetch('http://localhost:5000/columns')
      const newColumns = await response.json()
      setColumns(newColumns)
    }catch{
      console.error('ОШИБКА')
    }
  }

  return (
    <div className="App">
      <button onClick={() => updateColumns()}>Button</button>
      <Table columns={columns} data={dataTable} pageCount={1} />

      <button style={{ height: 30, color: "red" }} onClick={getData}>
        Request to server
      </button>
    </div>
  );
}

export default App;
