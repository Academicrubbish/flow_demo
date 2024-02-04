<template>
  <div class="container">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item>
        <el-select size="mini" v-model="form.cnName" filterable placeholder="搜索项目">
          <el-option v-for="item in dictList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select size="mini" class="relationship" v-model="form.relation" placeholder="关系">
          <el-option v-for="item in relaList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input class="dict_item" size="mini" v-model="form.values" placeholder="对比值" />
      </el-form-item>
      <el-form-item>
        <el-button size="mini" style="margin-left: 10px" @click="onSubmit">取消</el-button>
        <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  nam: 'Condition',
  inject: ["getGraph", "getNode"],
  data() {
    return {
      dictList: [
        {
          value: '年龄',
          label: '年龄'
        },
        {
          value: '性别',
          label: '性别'
        }
      ],
      relaList: [],
      form: {
        cnName: null,
        relation: null,
        values: null,
      },
    }
  },
  methods: {
    onSubmit() {
      const node = this.getNode();
      const { complete, form } = node.getData();
      node.setData({
        complete: true,
        form: this.form
      });
      // console.log(node);
      // console.log(node.trigger("change:condition", node));
      // // node.on("change:condition", ({ current }) => {
      // //   console.log(current);
      // // });
    }
  },
  watch: {
    'form.cnName': {
      handler(val) {
        if (val) {
          switch (val) {
            case '年龄':
              this.relaList = [
                {
                  value: '大于',
                  label: '大于'
                },
                {
                  value: '小于',
                  label: '小于'
                },
                {
                  value: '等于',
                  label: '等于'
                }
              ]
              break;
            case '性别':
              this.relaList = [
                {
                  value: '包含',
                  label: '包含'
                }
              ]
              break;
          }
          this.form.relation = this.relaList.length == 1 ? this.relaList[0].value : null;
          this.form.values = null;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: inline-block;
  padding: 5px;
  background-color: #ebedfc;
  border-radius: 5px;

  .el-form-item {
    margin: 0;

    ::v-deep .el-form-item__content {
      line-height: 0;
    }
  }

  .dict_item {
    ::v-deep .el-input-group__append {
      padding: 0 10px;
    }
  }

  .relationship {
    ::v-deep .el-input__inner {
      width: 100px;
    }
  }
}
</style>