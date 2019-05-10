<template>
    <view-page>
        <!-- 左按钮区 -->
        <template slot="left-field">
            <el-button type="danger" icon="el-icon-circle-plus-outline">添加</el-button>
        </template>
        <!-- 搜索框 -->
        <template slot="search-field">
            <el-input suffix-icon="el-icon-search" placeholder="请输入搜索内容"></el-input>
        </template>
        <!-- 过滤条件区 -->
        <template slot="filter-field">
            <el-select v-model="filterType" placeholder="选择类型"></el-select>
            <el-date-picker type="daterange" start-placeholder="起始时间"></el-date-picker>
        </template>
        <!-- 右按钮区 -->
        <template slot="right-field">
            <el-button type="primary" icon="el-icon-refresh">刷新</el-button>
            <el-button type="warning" icon="el-icon-upload2">导入</el-button>
            <el-button type="success" icon="el-icon-download">导出</el-button>
        </template>
        <!-- 表格区 -->
        <el-table :data="data">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-card header="书籍内容简介">
                        {{scope.row.content}}
                    </el-card>
                </template>
            </el-table-column>
            <el-table-column label="学习书籍" prop="name"></el-table-column>
            <el-table-column label="作者">
                <template slot-scope="scope">
                    {{scope.row.author.join(',')}}
                </template>
            </el-table-column>
            <el-table-column label="学习完成时间">
                <template slot-scope="scope">
                    {{new Date(scope.row.completeDate).toLocaleDateString()}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="warning" icon="el-icon-edit"></el-button>
                    <el-button size="small" type="danger" icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </view-page>
</template>

<script>
import ViewPage from './ViewPage'
export default {
    components:{
        ViewPage
    },
    data(){
        return{
            data:[],
            filterType:'',
            status:['未开始','进行中','搁置','完成']
        }
    },
    mounted(){
        this.update()
    },
    methods:{
        update(){
            this.$ajax.get('todos').then((res)=>{
                if(res.data){
                    this.data = res.data
                }
            }).catch(err=>this.$notify({
                type:'error',
                message:err
            }))
        }
    }
}
</script>

<style>

</style>
