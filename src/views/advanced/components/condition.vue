<template>
  <div class="container">
    <el-form :inline="true" :rules="rules" :model="form" ref="ruleForm" class="demo-form-inline">
      <el-form-item prop="cnName">
        <el-select size="mini" v-model="form.cnName" filterable placeholder="搜索项目" @change="aaa">
          <el-option v-for="item in dictList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="relation">
        <el-select size="mini" class="relationship" v-model="form.relation" placeholder="关系">
          <el-option v-for="item in relaList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="values">
        <el-input class="dict_item" size="mini" v-model="form.values" placeholder="对比值" />
      </el-form-item>
      <el-form-item>
        <el-button size="mini" style="margin-left: 10px" @click="clear">取消</el-button>
        <el-button size="mini" type="primary" @click="onSubmit('ruleForm')">确定</el-button>
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
      rules: {
        cnName: [
          { required: true, message: '不可为空', trigger: 'blur' }
        ],
        relation: [
          { required: true, message: '不可为空', trigger: 'blur' }
        ],
        values: [
          { required: true, message: '不可为空', trigger: 'blur' }
        ]
      },
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
      isEdit: false,
      oldForm: null
    }
  },
  mounted() {
    const node = this.getNode();
    if (JSON.stringify(node.getData().form) !== '{}') {
      this.form = JSON.parse(JSON.stringify(node.getData().form));
      this.oldForm = JSON.parse(JSON.stringify(node.getData().form));
      this.isEdit = true;
    }
    // 监听数据改变事件
    node.on("change:data", () => {
      console.log('111');
    });
  },
  // complate: true, isEdit: false   创建 确定 → 保存
  // complate: false, isEdit: false  创建 取消 → 删除
  // complate: true, isEdit: true    编辑 确定 → 保存
  // complate: false, isEdit: true   编辑 取消 → 还原
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const node = this.getNode();
          node.setData({
            complate: true,
            form: this.form,
            isEdit: this.isEdit
          });
        }
      })
    },
    clear() {
      const node = this.getNode();
      node.setData({
        complate: false,
        form: this.isEdit ? this.oldForm : this.form,
        isEdit: this.isEdit
      })
    },
    aaa(val) {
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
  },
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