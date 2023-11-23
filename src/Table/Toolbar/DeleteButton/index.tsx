import { Button } from "antd";
import { useCallback, useState } from "react";
import { useGridApi, useTableContext } from "../../context";

export const BatchDeleteButton = () => {
  const api = useGridApi();
  const { setDeletedRows } = useTableContext();
  const remove = useCallback(() => {
    if (!api) return;
    const selectedRows = api.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      console.log("No rows selected!");
      return;
    }
    const selectedRowIds = selectedRows.map((node) => node.id);

    api.applyTransaction({
      remove: selectedRows,
    });

    // 将删除的行的id保存到Set中
    // setDeletedRows?.((prevRows) => new Set([...prevRows, ...selectedRowIds]));

    // 示例：在控制台输出选中的数据
    console.log("Selected Data:", selectedRows);

    // 清空选中
    api.deselectAll();
  }, [api]);

  return (
    <Button type="primary" danger onClick={remove}>
      删除
    </Button>
  );
};
