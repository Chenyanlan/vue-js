computed: {
    filtedData() {
        //...
    },
    sortedData() {
        if (!this.sortOrder || !this.sortProp || !this.filtedData || !this.filtedData.length) return this.filtedData
        var reverse = this.sortOrder == 'descending' ? -1 : 1
        switch (typeof this.filtedData[0][this.sortProp]) {
            case 'number':
                return this.filtedData.sort((a, b) => {
                    return reverse * (a[this.sortProp] - b[this.sortProp])
                })
            case 'string':
                if (JSON.stringify(new Date(this.filtedData[0][this.sortProp])) !== 'null') {
                    return this.filtedData.sort((a, b) => {
                        return reverse * (new Date(a[this.sortProp]) - new Date(b[this.sortProp]))
                    })
                } else {
                    return this.filtedData.sort((a, b) => {
                        var cmp = 0
                        if (a[this.sortProp] > b[this.sortProp]) cmp = 1
                        else if (a[this.sortProp] < b[this.sortProp]) cmp = -1
                        return reverse * cmp
                    })
                }
        }
    }
}
