import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './index.less';

const statusMap = ['default', 'processing', 'success', 'error'];
class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading } = this.props;
    const status = ['关闭', '运行中', '已上线', '异常'];

    // const columns = [
    //   {
    //     title: '规则编号',
    //     dataIndex: 'no',
    //   },
    //   {
    //     title: '描述',
    //     dataIndex: 'description',
    //   },
    //   {
    //     title: '服务调用次数',
    //     dataIndex: 'callNo',
    //     sorter: true,
    //     align: 'right',
    //     render: val => `${val} 万`,
    //   },
    //   {
    //     title: '状态',
    //     dataIndex: 'status',
    //     filters: [
    //       {
    //         text: status[0],
    //         value: 0,
    //       },
    //       {
    //         text: status[1],
    //         value: 1,
    //       },
    //       {
    //         text: status[2],
    //         value: 2,
    //       },
    //       {
    //         text: status[3],
    //         value: 3,
    //       },
    //     ],
    //     render(val) {
    //       return <Badge status={statusMap[val]} text={status[val]} />;
    //     },
    //   },
    //   {
    //     title: '更新时间',
    //     dataIndex: 'updatedAt',
    //     sorter: true,
    //     render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    //   },
    //   {
    //     title: '操作',
    //     render: () => (
    //       <Fragment>
    //         <a href="">配置</a>
    //         <Divider type="vertical" />
    //         <a href="">订阅警报</a>
    //       </Fragment>
    //     ),
    //   },
    // ];
    const columns = [
      {
        title: '编号ID',
        dataIndex: 'no',
      },
      {
        title: '所属省市区商圈',
        dataIndex: 'provinceCityAreaTradearea',
      },
      {
        title: '商场',
        dataIndex: 'shopPlace',
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
          {
            text: status[3],
            value: 3,
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '运营人',
        dataIndex: 'operator',
      },
      {
        title: '手机号',
        dataIndex: 'phoneNo',
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a href="">配置</a>
            <Divider type="vertical" />
            <a href="">订阅警报</a>
            <Divider type="vertical" />
            <a href="">编辑</a>
            <Divider type="vertical" />
            <a href="">删除</a>
          </Fragment>
        ),
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                服务调用总计 <span style={{ fontWeight: 600 }}>{totalCallNo}</span> 万
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
