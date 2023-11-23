import React, { useCallback, useRef, useState } from "react";
import cls from "classnames";
import { Button, Space } from "antd";
import { useGridApi, useTableEvent } from "../context";
import "./styles.css";
import { CellValueChangedEvent } from "ag-grid-community";

interface ToolbarProps {
  children?: React.ReactNode;
}

export const Toolbar = (props: ToolbarProps) => {
  return <Space className="toolbar-container">{props.children}</Space>;
};

interface EditToolbarProps {
  onEdit?: () => void;
  save?: (data: any[]) => void;
  children?: React.ReactNode;
}

export const EditToolbar = (props: EditToolbarProps) => {
  const api = useGridApi();
  const event = useTableEvent();
  const [isEditing, setEditing] = useState(false);
  const [undoDisabled, setUndoDisabled] = useState(true);
  const [redoDisabled, setRedoDisabled] = useState(true);
  const originalDatas = useRef<any[]>([]);
  const [modifiedValues, setModifiedValues] = useState<Record<string, any>[]>(
    []
  );
  const toggleEditing = () => {
    if (isEditing) {
      if (!undoDisabled) {
        // const confirmExit = window.confirm("您有未保存的修改，确定要退出吗？");
        // if (!confirmExit) {
        //   return;
        // }
        console.log("--退出编辑", originalDatas.current, api);
        // 退出编辑模式后，刷新所有可见的单元格
        api?.setRowData(originalDatas.current);
        // 清空撤销和重做的记录
        // (api as any)?.undoRedoService.clearStacks();
        setUndoDisabled(true);
        setRedoDisabled(true);
      }
    } else {
      console.log("--进入编辑", originalDatas.current);
      // 进入编辑时，将原始数据保存
      api?.forEachNode((node) => {
        originalDatas.current.push({ ...node.data });
      });
    }
    setEditing(!isEditing);
    props.onEdit?.();
  };
  const save = useCallback(() => {
    console.log("--save", modifiedValues);
    setEditing(false);
    setUndoDisabled(true);
    setRedoDisabled(true);
    props.onEdit?.();
    props.save?.(modifiedValues.filter(Boolean));
  }, [modifiedValues]);

  event?.useSubscription((params: CellValueChangedEvent<any>) => {
    const { data, colDef, newValue, node } = params;
    if (!api || !colDef.field) return;
    console.log("---change params", params);
    var undoSize = api.getCurrentUndoSize();
    var redoSize = api.getCurrentRedoSize();

    console.log("---change", undoSize, redoSize);
    setUndoDisabled(undoSize < 1);
    setRedoDisabled(redoSize < 1);
    setModifiedValues((prevValues) => {
      const index = node.rowIndex || 0;
      const currentRow = prevValues[index];

      if (currentRow) {
        prevValues[index] = {
          ...currentRow,
          [colDef.field!]: newValue,
        };
      } else {
        prevValues[node.rowIndex || 0] = {
          id: data.id,
          [colDef.field!]: newValue,
        };
      }
      return [...prevValues];
    });
  });
  const undo = useCallback(() => {
    api?.undoCellEditing();
  }, [api]);

  const redo = useCallback(() => {
    api?.redoCellEditing();
  }, [api]);

  return (
    <div
      className={cls("edit-toolbar-container", {
        editing: isEditing,
      })}
    >
      <Space className="editor-options">
        {props.children}
        <Button disabled={undoDisabled} onClick={undo}>
          撤销
        </Button>
        <Button disabled={redoDisabled} onClick={redo}>
          重做
        </Button>
        <Button onClick={save}>保存</Button>
      </Space>
      <Space>
        <Button type="primary" onClick={toggleEditing}>
          {isEditing ? "退出编辑" : "进入编辑"}
        </Button>
      </Space>
    </div>
  );
};
