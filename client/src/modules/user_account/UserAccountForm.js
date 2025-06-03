import React, { useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import UserAccountService from './UserAccountService';

const { Option } = Select;

const UserAccountForm = ({ account, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (account) {
        await UserAccountService.updateUserAccount(account.id, values);
        message.success('Account updated successfully');
      } else {
        await UserAccountService.createUserAccount(values);
        message.success('Account created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
      message.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (account) {
      form.setFieldsValue(account);
    }
  }, [account, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={account || {}}
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          { required: true, message: 'Please input username!' },
          { min: 3, message: 'Username must be at least 3 characters!' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: !account, message: 'Please input password!' },
          { min: 6, message: 'Password must be at least 6 characters!' }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="fullName"
        label="Full Name"
        rules={[
          { required: true, message: 'Please input full name!' },
          { min: 2, message: 'Full name must be at least 2 characters!' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="role"
        label="Role"
        rules={[{ required: true, message: 'Please select role!' }]}
      >
        <Select>
          <Option value="teacher">Teacher</Option>
          <Option value="parents">Parents</Option>
          <Option value="admin">Admin</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Phone Number"
        rules={[
          { required: true, message: 'Please input phone number!' },
          { 
            pattern: /^\+?[1-9]\d{1,14}$/, 
            message: 'Please enter a valid phone number in E.164 format (e.g., +1234567890)!' 
          }
        ]}
        extra="Enter phone number in E.164 format (e.g., +1234567890)"
      >
        <Input placeholder="+1234567890" />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          style={{ marginRight: 8 }}
          loading={loading}
        >
          {account ? 'Update' : 'Create'}
        </Button>
        <Button onClick={onCancel} disabled={loading}>Cancel</Button>
      </Form.Item>
    </Form>
  );
};

export default UserAccountForm; 