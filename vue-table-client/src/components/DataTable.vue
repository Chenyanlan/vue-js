<template>
  <view-page>
    <!-- 左按钮区 -->
    <template slot="left-field">
      <el-button type="danger" icon="el-icon-circle-plus-outline" @click= "addTodo">添加</el-button>
    </template>
    <!-- 搜索框 -->
    <template slot="search-field">
      <el-input v-model="searchStr" suffix-icon="el-icon-search" placeholder="请输入搜索内容"></el-input>
    </template>
    <!-- 过滤条件区 -->
    <template slot="filter-field">
      <el-select v-model="filterType" placeholder="选择类型">
        <el-option label="全部" value></el-option>
        <el-option v-for="(status,index) in statuses" :key="status" :label="status" :value="index"></el-option>
      </el-select>
      <el-date-picker
        v-model="filterDates"
        type="daterange"
        start-placeholder="起始时间"
        end-placeholder="结束时间"
      ></el-date-picker>
    </template>
    <!-- 右按钮区 -->
    <template slot="right-field">
      <el-button type="primary" icon="el-icon-refresh">刷新</el-button>
      <el-button type="warning" icon="el-icon-upload2">导入</el-button>
      <el-button type="success" icon="el-icon-download">导出</el-button>
    </template>
    <!-- 表格区 -->
    <el-table :data = "pagedData" @sort-change = "sortChange">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-card header="书籍内容简介">{{scope.row.content}}</el-card>
        </template>
      </el-table-column>
      <!-- sortable 对应列是否可以排序 如果设置成custom 则代表用户希望远程排序,需要监听table的sortChange事件 -->
      <el-table-column label="学习书籍" prop="name" sortable="custom"></el-table-column>
      <el-table-column label="作者">
        <template slot-scope="scope">{{scope.row.author.join(',')}}</template>
      </el-table-column>
     <el-table-column label="学习计划状态" prop="status" sortable="custom">
    <template slot-scope="scope">
        <el-tag :type= "statusColors[scope.row.status]">{{statuses[scope.row.status]}}</el-tag>
    </template>
    </el-table-column>
     <el-table-column label="学习完成时间" prop="completeDate" sortable="custom">
    <template slot-scope="scope">
        {{new Date(scope.row.completeDate).toLocaleDateString()}}
    </template>
    </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 启动学习计划 -->
          <el-button v-if= "scope.row.status==0||scope.row.status==2" @click= "updateStatusAjax(scope.row,1)" size="small" type="primary" icon="el-icon-arrow-right"></el-button>
          <!-- 搁置学习计划 -->
          <el-button v-if= "scope.row.status==1" @click= "updateStatusAjax(scope.row,2)" size="small" type="info" icon="el-icon-loading"></el-button>
          <!-- 完成学习计划 -->
          <el-button v-if= "scope.row.status==1" @click= "updateStatusAjax(scope.row,3)" size="small" type="success" icon="el-icon-check"></el-button>
          <el-button size="small" type="warning" icon="el-icon-edit" @click= "editTodo(scope.row)"></el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" @click= "removeTodoAjax(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :total= "total" 
    :current-page= "currentPage" 
    :page-size= "currentPageSize" 
    :page-sizes= "[3,5]" 
    layout = "total, sizes, prev, pager, next, jumper" 
    @size-change= "pageSizeChange" 
    @current-change = "pageChange">
    </el-pagination>
    <!-- 对话框 -->
    <edit-dialog :show= "editShow" title="编辑学习计划" @close= "closeEditDialog"  @save= "saveTodo">
      <!-- 学习内容表单 -->
      <el-form :model= "currentTodo" ref= "todoEditForm">
        <el-form-item label= "学习书籍" prop= "name" required>
          <el-input v-model= "currentTodo.name"></el-input>
        </el-form-item>
        <el-form-item label="书籍作者" prop= "author">
          <el-tag v-for= "author in currentAuthors" :key= "author" closable @close = "removeAuthor(author)">{{author}}</el-tag>
          <span @keyup.enter= "addAuthor"><el-input v-model= "currentAuthor"></el-input></span>
          <el-button type="primary" size = "small" icon = "el-icon-plus" @click= "addAuthor">添加作者</el-button>
        </el-form-item>
        <el-form-item label="书籍内容" prop ="content" required>
          <el-input v-model= "currentTodo.content" type = "textarea"></el-input>
        </el-form-item>
        <el-form-item label= "完成时间" prop ="completeDate" required>
          <el-date-picker v-model= "currentTodo.completeDate" type = "date"></el-date-picker>
        </el-form-item>
      </el-form>
    </edit-dialog>
  </view-page>
</template>

<script>
import ViewPage from "./ViewPage";
import EditDialog from "./EditDialog";
export default {
  components: {
    ViewPage,EditDialog
  },
  data() {
    return {
      data: [],
      filterType: "",
      filterDates: null,
      searchStr: "",
      statuses: ["未开始", "进行中", "搁置", "完成"],
      statusColors: ["info", "primary", "warning", "success"],
      sortProp: '',
      sortOrder: '',
      currentPage: 1,
      currentPageSize: 3,
      editShow:false,
      currentTodo:{},
      currentAuthor:'',
      currentAuthors:[]
    };
  },
  mounted() {
    this.update();
  },
  methods: {
    update() {
      this.$ajax
        .get("todos")
        .then(res => {
          if (res.data) {
            this.data = res.data;
          }
        })
        .catch(err =>
          this.$notify({
            type: "error",
            message: err
          })
        );
    },
    sortChange(column) {
        this.sortProp = column.prop
        this.sortOrder = column.order
    },
    pageSizeChange(size){
        this.currentPageSize = size
    },
    pageChange(page){
        this.currentPage = page
    },
    closeEditDialog(){
      this.currentTodo = {}
      this.currentAuthor = ''
      this.currentAuthors = []
      this.$refs.todoEditForm.resetFields()
      this.editShow = false
    },
    addTodo(){
      this.currentTodo = {}
      this.editShow = true
    },
    saveTodo(){
      this.$refs.todoEditForm.validate((valid)=>{
        if(valid){
          this.currentTodo.author = this.currentAuthors
          this.currentTodo._id ? this.editAjax() : this.addAjax()
        }
      });
      // this.closeEditDialog()  
    },
    addAuthor(){
      this.currentAuthors.push(this.currentAuthor)
      this.currentAuthor = ""
    },
    removeAuthor(author){
      this.currentAuthors.splice(this.currentAuthors.indexOf(author),1)
    },
    addAjax(){
      this.$ajax.post('todos',this.currentTodo).then((res)=>{
        console.log(res.data)
        if(res.data) this.data.push(res.data)
         this.closeEditDialog()  
      }).catch((err)=>this.$notify({
        type:'error',
        message:err
      }))
     
    },
    editAjax(){
     this.$ajax.put('todos/'+this.currentTodo._id,this.currentTodo).then((res)=>{
       if(res.data){
         var index = this.data.findIndex(item=>item._id == res.data._id)
         this.data.splice(index,1,res.data)
       }
       this.closeEditDialog()
     }).catch((err)=>this.$notify({
       type:'error',
       message:err
     }))
    },
    editTodo(row){
      this.currentTodo = JSON.parse(JSON.stringify(row))
      this.currentAuthors = this.currentTodo.author
      this.editShow = true
    },
    updateStatusAjax(row, status) {
      var todo = { _id: row._id, status }
      this.$ajax.put('todos/' + todo._id, todo).then((res) => {
        if (res.data) {
            var index = this.data.findIndex(item => item._id == res.data._id)
            this.data.splice(index, 1, res.data)
        }
      }).catch((err) => this.$notify({
        type: 'error',
        message: err
     }))
    },
  removeTodoAjax(row) {
    this.$confirm('确定要删除?').then(() => {
        this.$ajax.delete('todos/' + row._id).then((res) => {
            if (res.data) {
                var index = this.data.findIndex(item => item._id == res.data._id)
                this.data.splice(index, 1)
            }
        })
    }).catch((err) => this.$notify({
        type: 'error',
        message: err
    }))
}
  },
  computed: {
    filtedData() {
      return this.data
        .filter(item => {
          var reg = new RegExp(this.searchStr, "i");
          return (
            !this.searchStr ||
            reg.test(item.name) ||
            reg.test(item.author.join(""))
          );
        })
        .filter(item => {
          return this.filterType === "" || item.status === this.filterType;
        })
        .filter(item => {
          return (
            !this.filterDates ||
            (this.filterDates[0] <= new Date(item.completeDate) &&
              this.filterDates[1] >= new Date(item.completeDate))
          );
        });
    },
    sortedData() {
      if (
        !this.sortOrder ||
        !this.sortProp ||
        !this.filtedData ||
        !this.filtedData.length
      )
        return this.filtedData;
      var reverse = this.sortOrder == "descending" ? -1 : 1;
      switch (typeof this.filtedData[0][this.sortProp]) {
        case "number":
          return this.filtedData.sort((a, b) => {
            return reverse * (a[this.sortProp] - b[this.sortProp]);
          });
        case "string":
          if (
            JSON.stringify(new Date(this.filtedData[0][this.sortProp])) !==
            "null"
          ) {
            return this.filtedData.sort((a, b) => {
              return (
                reverse *
                (new Date(a[this.sortProp]) - new Date(b[this.sortProp]))
              );
            });
          } else {
            return this.filtedData.sort((a, b) => {
              var cmp = 0;
              if (a[this.sortProp] > b[this.sortProp]) cmp = 1;
              else if (a[this.sortProp] < b[this.sortProp]) cmp = -1;
              return reverse * cmp;
            });
          }
      }
    },
    total(){
        return this.filtedData.length
    },
    pagedData(){
        return this.sortedData.slice((this.currentPage - 1)*this.currentPageSize,this.currentPage * this.currentPageSize)
    }
  }
};
</script>

<style>
</style>
