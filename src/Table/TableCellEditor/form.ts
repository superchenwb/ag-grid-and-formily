import { createSchemaField } from "@formily/react";
export type { ISchema } from "@formily/react";
import {
  Form,
  FormItem,
  Input,
  NumberPicker,
  Select,
  Radio,
  Checkbox,
  Switch,
  Password,
  Submit,
  Reset,
} from "@formily/antd-v5";

export const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    NumberPicker,
    Radio,
    Checkbox,
    Switch,
    Select,
    Password,
  },
}) as any;

export { Form, Submit, Reset };
