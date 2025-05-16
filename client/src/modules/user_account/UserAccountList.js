import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Radio, Tooltip, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SortAscendingOutlined, SortDescendingOutlined, SearchOutlined } from '@ant-design/icons';
import UserAccountForm from './UserAccountForm';
import UserAccountService from './UserAccountService';

const { Search } = Input;

const UserAccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [sortField, setSortField] = useState('username');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for A-Z
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await UserAccountService.getUserAccounts();
      setAccounts(data);
    } catch (error) {
      message.error('Failed to fetch accounts');
    }
    setLoading(false);
  };

  const handleEdit = (record) => {
    setSelectedAccount(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await UserAccountService.deleteUserAccount(id);
      message.success('Account deleted successfully');
      fetchAccounts();
    } catch (error) {
      message.error('Failed to delete account');
    }
  };

  const handleSort = (field) => {
    const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
  };

  const getFilteredAndSortedAccounts = () => {
    let filteredAccounts = [...accounts];

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredAccounts = filteredAccounts.filter(account => 
        account.username.toLowerCase().includes(searchLower) ||
        account.fullName.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (selectedRole !== 'all') {
      filteredAccounts = filteredAccounts.filter(account => 
        account.role === selectedRole
      );
    }

    // Apply sorting
    return filteredAccounts.sort((a, b) => {
      let compareA = a[sortField];
      let compareB = b[sortField];

      if (typeof compareA === 'string') {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
  };

  // Get unique roles from accounts
  const getRoles = () => {
    const roles = [...new Set(accounts.map(account => account.role))];
    return ['all', ...roles];
  };

  const columns = [
    {
      title: (
        <Space>
          Username
          <Tooltip title="Sort by username">
            <Button
              type="text"
              icon={sortField === 'username' && sortOrder === 'desc' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
              onClick={() => handleSort('username')}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: (
        <Space>
          Full Name
          <Tooltip title="Sort by full name">
            <Button
              type="text"
              icon={sortField === 'fullName' && sortOrder === 'desc' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
              onClick={() => handleSort('fullName')}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const sortOptions = [
    { label: 'Username (A-Z)', value: 'usernameAsc', field: 'username', order: 'asc' },
    { label: 'Username (Z-A)', value: 'usernameDesc', field: 'username', order: 'desc' },
    { label: 'Full Name (A-Z)', value: 'fullNameAsc', field: 'fullName', order: 'asc' },
    { label: 'Full Name (Z-A)', value: 'fullNameDesc', field: 'fullName', order: 'desc' },
  ];

  const handleQuickSort = (option) => {
    setSortField(option.field);
    setSortOrder(option.order);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
        >
          Add New Account
        </Button>
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => {
            const option = sortOptions.find(opt => opt.value === e.target.value);
            if (option) handleQuickSort(option);
          }}
          value={`${sortField}${sortOrder === 'desc' ? 'Desc' : 'Asc'}`}
        >
          {sortOptions.map(option => (
            <Radio.Button key={option.value} value={option.value}>
              {option.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Space>

      <Space style={{ marginBottom: 16, width: '100%' }}>
        <Search
          placeholder="Search by username or full name"
          allowClear
          enterButton={<SearchOutlined />}
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          style={{ width: 200 }}
          value={selectedRole}
          onChange={setSelectedRole}
          placeholder="Filter by role"
        >
          {getRoles().map(role => (
            <Select.Option key={role} value={role}>
              {role === 'all' ? 'All Roles' : role}
            </Select.Option>
          ))}
        </Select>
      </Space>
      
      <Table
        columns={columns}
        dataSource={getFilteredAndSortedAccounts()}
        loading={loading}
        rowKey="id"
      />
      
      <Modal
        title={selectedAccount ? 'Edit Account' : 'Add New Account'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedAccount(null);
        }}
        footer={null}
      >
        <UserAccountForm
          account={selectedAccount}
          onSuccess={() => {
            setIsModalVisible(false);
            setSelectedAccount(null);
            fetchAccounts();
          }}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedAccount(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default UserAccountList; 