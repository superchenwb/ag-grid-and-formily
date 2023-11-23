import { useRef, useMemo, useCallback } from "react";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import {
  CellValueChangedEvent,
  ColDef,
  ColGroupDef,
  DataTypeDefinition,
  GridReadyEvent,
} from "ag-grid-community";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { TableCellSetter } from "./TableCellEditor";
import { useSetGridApi, useTableContext, useTableEvent } from "./context";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "./styles.css";

export * from "./context";

interface TableProps<TData extends any> extends AgGridReactProps<TData> {
  editable?: boolean;
  columns: (ColDef<TData> | ColGroupDef<TData>)[];
}

const BooleanCellRenderer = (params) => {
  const { value } = params;
  if (value === undefined) return null;
  return value ? <CheckOutlined /> : <CloseOutlined />;
};

export const Table = <TData extends any>(props: TableProps<TData>) => {
  const { editable, columns, ...restProps } = props;
  const gridRef = useRef<AgGridReact<any>>(null); // Optional - for accessing Grid's API

  const columnTypes = useMemo<{
    [key: string]: ColDef<TData>;
  }>(() => {
    return {
      editableColumn: editable
        ? {
            cellEditorSelector(params) {
              const type = params.colDef.cellDataType;
              if (type === "boolean") return undefined;
              let schemaProperties =
                params.colDef.cellEditorParams?.schemaProperties;
              if (!schemaProperties) {
                console.log("-type", params, type);
                switch (type) {
                  case "number":
                  case false:
                    schemaProperties = {
                      type: "number",
                      "x-decorator": "FormItem",
                      "x-decorator-props": {
                        feedbackLayout: "popover",
                      },
                      "x-component": "NumberPicker",
                      required: true,
                    };
                    break;
                  case "text": {
                    schemaProperties = {
                      type: "string",
                      "x-decorator": "FormItem",
                      "x-component": "Input",
                      "x-decorator-props": {
                        feedbackLayout: "popover",
                      },
                      required: true,
                    };
                    break;
                  }
                  case "boolean": {
                    schemaProperties = {
                      type: "boolean",
                      "x-decorator": "FormItem",
                      "x-component": "Switch",
                      "x-decorator-props": {
                        feedbackLayout: "popover",
                      },
                      required: true,
                    };
                    break;
                  }
                  default:
                    break;
                }
              }
              const fieldName = params.colDef.field;
              if (!fieldName) {
                return undefined;
              }
              // console.log('-schemaProperties', schemaProperties)
              return {
                component: "TableCellSetter",
                params: {
                  schema: {
                    type: "object",
                    properties: {
                      [fieldName]: schemaProperties,
                    },
                  },
                },
              };
            },
            cellClass: (params: any) => {
              if (
                typeof params.colDef.editable === "function"
                  ? params.colDef.editable(params)
                  : params.colDef.editable
              ) {
                return "gant-highlight-editable";
              }
            },
          }
        : {},
    };
  }, [editable]);

  const dataTypeDefinitions = useMemo<{
    [cellDataType: string]: DataTypeDefinition<TData>;
  }>(() => {
    return {
      ...restProps.dataTypeDefinitions,
    };
  }, [restProps.dataTypeDefinitions]);

  const components = useMemo(() => {
    return {
      ...restProps.components,
      TableCellSetter,
      BooleanCellRenderer,
    };
  }, []);
  const setGridApi = useSetGridApi();
  const onGridReady = useCallback(
    (event: GridReadyEvent<TData>) => {
      restProps.onGridReady?.(event);
      console.log("gridReady", event);
      setGridApi?.(event.api);
    },
    [setGridApi]
  );
  const event = useTableEvent();
  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent<TData>) => {
      restProps.onCellValueChanged?.(params);
      if (!gridRef.current) return;
      event?.emit(params);
    },
    [restProps.onCellValueChanged]
  );

  const { deletedRows } = useTableContext();

  const getRowClass = (params) => {
    // console.log('getRowClass---params', params, deletedRows?.has(params.node.id))
    // 如果行的id在deletedRows中，则应用删除状态的class
    return deletedRows && deletedRows.has(params.node.id)
      ? "deleted-row"
      : restProps.getRowClass
      ? restProps.getRowClass(params)
      : "";
  };

  return (
    <div className="ag-theme-alpine" style={{ width: "100%", height: 500 }}>
      <AgGridReact
        ref={gridRef} // Ref for accessing Grid's API
        rowHeight={33}
        headerHeight={32}
        undoRedoCellEditing
        undoRedoCellEditingLimit={20}
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        // debounceVerticalScrollbar
        {...restProps}
        dataTypeDefinitions={dataTypeDefinitions}
        // getRowClass={getRowClass}
        onCellValueChanged={onCellValueChanged}
        onGridReady={onGridReady}
        columnDefs={columns} // Column Defs for Columns
        singleClickEdit
        stopEditingWhenCellsLoseFocus
        enterNavigatesVertically
        enterNavigatesVerticallyAfterEdit
        suppressClickEdit={!editable}
        columnTypes={columnTypes}
        components={components}
      />
    </div>
  );
};

// @Bean("undoRedoService")
// export class TableUndoRedoService extends UndoRedoService {
//   public clearUndoRedoStacks(): void {
//     this.clearStacks();
//   }
// }
