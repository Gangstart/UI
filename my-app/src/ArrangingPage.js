import React, {PureComponent} from 'react';
import {Form, Table, Row, Col, Input, Button, Switch, Select,message} from 'antd';
import ApplicationTeacher from './ApplicationTeacher';
import axios from "axios";
import './static/arrangePage.css'
import './CollegeRole.css'
import  * as XLSX from 'xlsx'
import "./setupProxy"

const FormItem = Form.Item;

const columns = [
    {title: '序号', dataIndex: 'id',},
    {title: '年级', dataIndex: 'collegeno',},
    {title: '班级', dataIndex: 'classno',},
    {title: '课程', dataIndex: 'courseno',},
    {title: '课程属性', dataIndex: 'courseattr',},
    {title: '上课次数', dataIndex: 'weekssum',},
    {title: '是否固定', dataIndex: 'isfix',},
    {title: '固定时间', dataIndex: 'classtime',},
];

class ArrangingPage extends PureComponent {
    state = {tableData:[],semesterList:[]};

    componentWillMount() {
        axios.post('/querySemester').then((res) => {
            if (res.data.code === '1') {
                this.setState({semesterList:res.data.data})
            }
        }); //获得开课学期
        this.getTableData({})
    }

    getTableData=(data)=>{
        axios.post('/queryClassTask',data ).then((res) => {
            if (res.data.code === '1') {
                res.data.data.forEach(a=>{
                    if (a.isfix === '1') {
                        a.isfix = '否'
                    } else {
                        a.isfix = '是'
                    }
                });
                this.setState({tableData:res.data.data}); //获得开课计划
            }
        });
    };

    //读取数据
    readExcelData = (e) => {
        //数据存成数组
        let files = e.target.files;
        let fileReader = new FileReader();
        let workbook = '';
        let classtaskData = '';

        fileReader.onload = function (ev) {

                let data = ev.target.result;
                workbook = XLSX.read(data, { type: 'binary' });
            classtaskData = []; // 存储获取到的数据


            // 表格的表格范围，可用于判断表头是否数量是否正确
            let fromTo = '';
            // 遍历每张表读取
            for (let sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    classtaskData = classtaskData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    break; // 如果只取第一张表，就取消注释这行
                }
            }
            console.log(classtaskData);
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
        axios.post("/uploadExcel",{file:classtaskData}).
            then(res=>{
                console.log(res);
        })
    };

    arrangeClick=()=>{
        const {form} = this.props;
        axios.post('/classScheduling').then((res) => {
            if (res.data.code === '1') {
                message.success('排课成功');
                this.props.history.push({pathname: 'allCollegeRole'});
            }else{
                message.error('排课失败！')
            }
        });
    };

    render() {
        const {form} = this.props;
        const {tableData,semesterList}=this.state;

        const options=(
            semesterList.map(a=><Select.Option key={a}>{a}</Select.Option>)
        );
        return (
            <ApplicationTeacher>
                <Form
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}
                >
                    <Row gutter={24}>
                        <Col span={8}>
                            <FormItem label='选择学年'>
                                {form.getFieldDecorator('semester', {})(<Select allowClear style={{width:200}}>{options}</Select>)}
                            </FormItem>
                        </Col>
                        <FormItem>
                            <Button type='primary' onClick={this.arrangeClick}>开始排课</Button>
                            <Button className="classTaskButton" icon="plus"> 上传开课计划
                                <input type="file" className="fileInput" onChange={this.readExcelData} />
                            </Button>
                        </FormItem>

                    </Row>
                    <Table columns={columns} dataSource={tableData} bordered/>
                </Form>
            </ApplicationTeacher>
        )
    }
}

const ArrangPage = Form.create()(ArrangingPage);

export default ArrangPage;
