import type { Meta, StoryObj } from "@storybook/react";
import { DataGrid } from "./DataGrid";

type Person = {
  id: number;
  name: string;
  age: number;
};

const columns = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "age", header: "Age" },
];

const data: Person[] = Array.from({ length: 50000 }, (_, i) => ({
  id: i + 1,
  name: `Name ${i + 1}`,
  age: 20 + (i % 40),
}));

const meta = {
  title: "Components/DataGrid",
  component: DataGrid,
} satisfies Meta<typeof DataGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Large: Story = {
  render: () => (
    <DataGrid
      data={data}
      columns={columns as any}
      height={600}
      rowHeight={40}
    />
  ),
};