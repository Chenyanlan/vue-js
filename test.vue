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
},