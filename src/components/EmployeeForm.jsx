import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import { createEmployee, errorText, replaceEmployee } from "../api";

const STATUSES = ["Active", "On Leave", "Resigned"].map((s) => ({ value: s, label: s }));


export default function EmployeeForm({ open, editing, onClose, onSaved }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (editing) form.setFieldsValue(editing);
  }, [open, editing, form]);

  async function handleOk() {
    try {
      const values = await form.validateFields(); // stops here if a rule fails
      setSaving(true);
      if (editing) {
        await replaceEmployee(editing.id, values);
        message.success("Employee updated");
      } else {
        await createEmployee(values);
        message.success("Employee added");
      }
      onSaved();
    } catch (err) {
      // validateFields rejects with { errorFields }, API errors have err.response
      if (!err.errorFields) message.error(errorText(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title={editing ? `Edit ${editing.name}` : "Add employee"}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText={editing ? "Save changes" : "Add employee"}
      confirmLoading={saving}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" initialValues={{ status: "Active" }} className="mt-4">
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
      </Form>
    </Modal>
  );
}
