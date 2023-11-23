import { GridApi } from "ag-grid-community";
import {
  useContext,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import { useEventEmitter } from "ahooks";
import { EventEmitter } from "ahooks/lib/useEventEmitter";

interface ITableContext<TData extends any> {
  api: null | GridApi<TData>;
  setGridApi: null | ((api: GridApi<TData>) => void);
  event: null | EventEmitter<any>;
  deletedRows: Set<any> | null;
  setDeletedRows?: Dispatch<SetStateAction<Set<unknown>>>;
}

const TableContext = createContext<ITableContext<any>>({
  api: null,
  setGridApi: null,
  event: null,
  deletedRows: null,
});

interface TableProivderProps {
  children?: React.ReactNode;
}

export const useTableContext = () => {
  return useContext(TableContext);
};

export const useGridApi = () => {
  return useContext(TableContext).api;
};

export const useSetGridApi = () => {
  return useContext(TableContext).setGridApi;
};

export const useTableEvent = () => {
  return useContext(TableContext).event;
};

export const TableProivder = ({ children }: TableProivderProps) => {
  const [deletedRows, setDeletedRows] = useState(new Set());
  const [api, setGridApi] = useState<GridApi<any> | null>(null);
  const event = useEventEmitter<any>();
  return (
    <TableContext.Provider
      value={{ api, setGridApi, event, deletedRows, setDeletedRows }}
    >
      {children}
    </TableContext.Provider>
  );
};
