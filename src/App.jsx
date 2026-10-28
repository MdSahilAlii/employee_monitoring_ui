import { useCallback, useEffect, useState } from "react";
import { Button, Input, Popconfirm, Select, Table, Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import { deleteEmployee, errorText, getEmployees, getStats, patchEmployee } from "./api";
import EmployeeForm from "./components/EmployeeForm";
import StatsBar from "./components/StatsBar";

const STATUS_COLOR = { Active: "green", "On Leave": "gold", Resigned: "default" };

export default function App() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "", department: undefined, status: undefined });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, summary] = await Promise.all([getEmployees(filters), getStats()]);
      setEmployees(list);
      setStats(summary);
    } catch (err) {
      message.error(errorText(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const openForm = (employee = null) => {
    if (!employee) {
      navigate("/add-employee");
      return;
    }
    setEditing(employee);
    setFormOpen(true);
  };

  async function remove(id) {
    try {
      await deleteEmployee(id);
      message.success("Employee deleted");
      load();
    } catch (err) {
      message.error(errorText(err));
    }
  }

 
  async function markResigned(id) {
    try {
      await patchEmployee(id, { status: "Resigned" });
      load();
    } catch (err) {
      message.error(errorText(err));
    }
  }

  const columns = [
    {
      title: "Employee",
      render: (_, e) => (
        <div>
          <div className="font-medium">{e.name}</div>
          <div className="text-xs text-slate-500">{e.email}</div>
        </div>
      ),
    },
    { title: "Department", dataIndex: "department" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Salary",
      dataIndex: "salary",
      align: "right",
      render: (v) => v.toLocaleString("en-IN"),
    },
    { title: "Joined", dataIndex: "join_date" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={STATUS_COLOR[s]}>{s}</Tag>,
    },
    {
      title: "",
      align: "right",
      render: (_, e) => (
        <div className="flex gap-1 justify-end">
          <Button size="small" onClick={() => openForm(e)}>Edit</Button>
          {e.status !== "Resigned" && (
            <Popconfirm title="Mark as resigned?" onConfirm={() => markResigned(e.id)}>
              <Button size="small">Resign</Button>
            </Popconfirm>
          )}
          <Popconfirm title="Delete this record permanently?" okButtonProps={{ danger: true }} onConfirm={() => remove(e.id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Employee tracker</h1>
        <Button type="primary" onClick={() => openForm()}>Add employee</Button>
      </div>

      <StatsBar stats={stats} />

      <div className="flex flex-wrap gap-3">
        <Input.Search
          allowClear
          placeholder="Search name, email or role"
          className="w-72!"
          onSearch={(search) => setFilters((f) => ({ ...f, search }))}
        />
        <Select
          allowClear
          placeholder="Department"
          className="w-44!"
          options={(stats?.departments ?? []).map((d) => ({ value: d, label: d }))}
          onChange={(department) => setFilters((f) => ({ ...f, department }))}
        />
        <Select
          allowClear
          placeholder="Status"
          className="w-36!"
          options={Object.keys(STATUS_COLOR).map((s) => ({ value: s, label: s }))}
          onChange={(status) => setFilters((f) => ({ ...f, status }))}
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={employees}
        loading={loading}
        pagination={{ pageSize: 8, hideOnSinglePage: true }}
        locale={{ emptyText: "No employees match. Add one or clear the filters." }}
        scroll={{ x: 800 }}
      />

      <EmployeeForm
        open={formOpen}
        editing={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          load();
        }}
      />
    </div>
  );
}
