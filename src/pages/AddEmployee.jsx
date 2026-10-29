import { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { createEmployee, errorText } from "../api";

const STATUSES = ["Active", "On Leave", "Resigned"].map((status) => ({
  value: status,
  label: status,
}));

export default function AddEmployee() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(values) {
    setSaving(true);
    try {
      await createEmployee(values);
      message.success("Employee added");
      navigate("/");
    } catch (err) {
      message.error(errorText(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/")}
        className="mb-4!"
      >
        Back to employees
      </Button>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-6">Add employee</h1>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "Active" }}
          onFinish={handleSubmit}
        >
          <Form.Item name="name" label="Full name" rules={[{ required: true, min: 2 }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Work email"
            rules={[{ required: true }, { type: "email", message: "Enter a valid email" }]}
          >
            <Input />
          </Form.Item>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="department" label="Department" rules={[{ required: true, min: 2 }]}>
              <Input />
            </Form.Item>
            <Form.Item name="role" label="Role" rules={[{ required: true, min: 2 }]}>
              <Input />
            </Form.Item>
            <Form.Item name="salary" label="Monthly salary (INR)" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full!" />
            </Form.Item>
            <Form.Item name="join_date" label="Joining date" rules={[{ required: true }]}>
              <Input type="date" max={new Date().toISOString().slice(0, 10)} />
            </Form.Item>
          </div>
          <Form.Item name="status" label="Status">
            <Select options={STATUSES} />
          </Form.Item>
          <div className="flex justify-end gap-3">
            <Button onClick={() => navigate("/")}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              Add employee
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}