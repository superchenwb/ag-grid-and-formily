import { FormProvider } from "@formily/react";
import React, { forwardRef, memo, useEffect, useImperativeHandle, useMemo } from "react";
import { FormPath, createForm, onFormMount } from "@formily/core";
import { SchemaField } from "./form";

export const TableCellSetter = memo(
  forwardRef((props: any, ref) => {
    console.log("form props", props);
    const fieldName = props.column.colId;
    const form = useMemo(
      () =>
        createForm({
          initialValues: { ...props.data, [fieldName]: props.value },
          effects(form) {
            onFormMount(() => {
              
              form.setFormState(state => {
              
              })
            });
          },
        }),
      []
    );
    useEffect(() => {
      
    }, [form])
    /* Component Editor Lifecycle methods */
    useImperativeHandle(ref, () => {
      return {
        // the final value to send to the grid, on completion of editing
        getValue() {
          const value = FormPath.getIn(form.values, fieldName);
          return value;
        },
        isCancelAfterEnd() {
          return form.errors.length > 0;
        },
      };
    });

    if (!props.schema) return null;

    return (
      <FormProvider form={form}>
        <SchemaField schema={props.schema} scope={{}} />
      </FormProvider>
    );
  })
);
