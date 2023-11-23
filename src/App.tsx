import { useCallback, useMemo, useRef, useState } from "react";

import { Table, TableProivder } from "./Table";
import { EditToolbar, Toolbar } from "./Table/Toolbar";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import "./App.css";
import { BatchDeleteButton } from "./Table/Toolbar/DeleteButton";

interface TData {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  age?: number;
  mood: string;
  address: string;
  country: string;
  bool?: boolean;
}

const createRowData = () => {
  const students: TData[] = [];
  for (let index = 0; index < 1000; index++) {
    students.push({
      id: `id_${index}`,
      first_name: "Bob",
      last_name: "Harrison",
      gender: "Male",
      age: Math.ceil(Math.random() * 100),
      address:
        "1197 Thunder Wagon Common, Cataract, RI, 02987-1016, US, (401) 747-0763",
      mood: "Happy",
      country: "Ireland",
      bool:
        Math.random() < 0.5 ? false : Math.random() < 0.5 ? true : undefined,
    });
  }

  return students;
};

function App() {
  const [editable, setEditable] = useState(false);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
    }),
    []
  );

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState<
    (ColDef<TData> | ColGroupDef<TData>)[]
  >([
    {
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      pinned: "left",
    },
    {
      field: "first_name",
      headerName: "First Name",
      filter: true,
      type: ["editableColumn"],
      editable: true,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      filter: true,
      type: ["editableColumn"],
      editable: true,
    },
    {
      field: "gender",
      width: 100,
      filter: true,
      type: ["editableColumn"],
      editable: true,
    },
    {
      field: "bool",
      width: 100,
      filter: true,
      type: ["editableColumn"],
      editable: true,
      cellRenderer: "BooleanCellRenderer",
    },
    {
      field: "age",
      width: 80,
      filter: true,
      type: ["editableColumn"],
      editable: (params) => params.data?.age > 22,
      // cellRenderer: (params) => {
      //   console.log('cellRenderer', params)
      //   // 在这里自定义渲染该列的内容
      //   return params.value ? 'Enabled' : 'Disabled';
      // },
      // cellRendererParams: {
      //   disabled: true, // 禁用复选框
      // },
    },
    {
      field: "mood",
      width: 90,
      filter: true,
      type: ["editableColumn"],
      editable: true,
    },
    {
      field: "country",
      width: 110,
      filter: true,
      type: ["editableColumn"],
      editable: true,
    },
    {
      field: "address",
      minWidth: 502,
      filter: true,
      type: ["editableColumn"],
      editable: true,
    },
  ]);

  const handleEditable = useCallback(() => {
    setEditable((editable) => !editable);
  }, []);
  const handleSave = useCallback((data: TData[]) => {
    console.log("handleSave", data);
  }, []);
  const [rowData, setRowData] = useState<TData[]>(); // Set rowData to Array of Objects, one Object per Row
  const gridApi = useRef<GridApi<TData>>();
  const onGridReady = useCallback((event: GridReadyEvent<TData>) => {
    gridApi.current = event.api;
    setTimeout(() => {
      setRowData(createRowData());
    }, 1000);
    // fetch("https://www.ag-grid.com/example-assets/row-data.json")
    //   .then((result) => result.json())
    //   .then((rowData) => setRowData(rowData));
  }, []);

  return (
    <TableProivder>
      <Toolbar>
        <BatchDeleteButton />
        <EditToolbar onEdit={handleEditable} save={handleSave} />
      </Toolbar>
      <Table
        editable={editable}
        defaultColDef={defaultColDef}
        columns={columnDefs}
        onGridReady={onGridReady}
        rowData={rowData}
        rowSelection="multiple"
      />
    </TableProivder>
  );
}

export default App;
