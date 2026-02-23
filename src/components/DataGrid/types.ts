export type Column<T> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  editable?: boolean;
};