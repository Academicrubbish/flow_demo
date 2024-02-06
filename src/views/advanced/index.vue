<template>
  <div>
    <div id="advanced" style="height: 600px" />
  </div>
</template>
<script>
import condition from "./components/condition.vue";
import { Graph } from "@antv/x6";
import Hierarchy from "@antv/hierarchy";
import "@antv/x6-vue-shape";
import { OR_SWITCH, AND_SWITCH, ADD_IMAGE, DEL_IMAGE, LINK_IMAGE, EDIT_IMAGE } from '@/utils/SVG_img'
export default {
  data() {
    return {
      graph: null,
      data: {
        id: 1,
        type: "original—add", //根节点
        width: 30,
        height: 30,
        children: [
          {
            id: 2,
            type: "relative", //关系节点
            width: 44,
            height: 44,
            data: {
              relative: "and" //and并且 or或者
            },
            children: [
              {
                id: 3,
                type: "relative", //关系节点
                width: 44,
                height: 44,
                data: {
                  relative: "or" //and并且 or或者
                },
                children: [
                  {
                    id: 4,
                    type: "condition-text", //条件节点
                    width: 90,
                    height: 44,
                    level: 1, //判断它是第几级的条件节点
                    edgeText: "",
                    data: {
                      complate: true,
                      form: {
                        cnName: "性别",
                        relation: "包含",
                        values: "男",
                      } //你的业务数据
                    }
                  },
                  {
                    id: 5,
                    type: "condition-text", //条件节点
                    width: 90,
                    height: 44,
                    level: 1, //判断它是第几级的条件节点
                    edgeText: "",
                    data: {
                      complate: true,
                      form: {
                        cnName: "性别",
                        relation: "包含",
                        values: "女",
                      } //你的业务数据
                    }
                  },
                  {
                    id: 6,
                    type: "condition-text", //条件节点
                    width: 90,
                    height: 44,
                    level: 1, //判断它是第几级的条件节点
                    edgeText: "",
                    data: {
                      complate: true,
                      form: {
                        cnName: "性别",
                        relation: "包含",
                        values: "其他",
                      } //你的业务数据
                    }
                  }
                ]
              },
              {
                id: 7,
                type: "condition-text", //条件节点
                width: 90,
                height: 44,
                level: 1, //判断它是第几级的条件节点
                edgeText: "",
                data: {
                  complate: true,
                  form: {
                    cnName: "年龄",
                    relation: "大于",
                    values: "40",
                  } //你的业务数据
                },
                children: [
                  {
                    id: 9,
                    type: "vue-shape", //自定义组件 业务节点
                    width: 613,
                    height: 38,
                    level: 1,
                    edgeText: "并且",
                    data: {
                      complate: false,
                      form: {
                      }, //你的业务数据
                      isEdit: false,
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    };
  },
  created() {
    let that = this;
    // 注册根节点
    Graph.registerNode(
      'original—add',
      {
        inherit: 'rect',
        width: 30,
        height: 30,
        label: '+',
        attrs: { //样式代码
          body: {
            cursor: 'pointer',
            event: 'add:original' //根节点点击事件
          },
          label: {
            cursor: 'pointer',
            event: 'add:original'//根节点点击事件
          }
        }
      },
      true,
    )

    // 注册《并且 或者》的关系节点
    Graph.registerNode(
      'relative',
      {
        inherit: 'rect',
        markup: [
          {
            tagName: 'rect',
            selector: 'body'
          },
          {
            tagName: 'text',
            selector: 'label_text'
          },
          {
            tagName: 'image',
            selector: 'switch'
          }
        ],
        attrs: { //样式代码
          body: {},
          label_text: {
            x: 0,
            y: -7,
            fontWeight: 'bold',
          },
          switch: {
            cursor: 'pointer',
            width: 16,
            height: 16,
            x: 13,
            y: 22,
            event: 'change:relative' //关系节点 切换 关系事件
          },
          text: { text: '并且' }
        },
        data: { relative: 'and' } //and并且 or或者 默认为 并且
      }
    )

    // 注册条件语句
    Graph.registerNode(
      'condition-text',
      {
        inherit: 'rect',
        markup: [
          {
            tagName: 'rect',
            selector: 'body'
          },
          {
            tagName: 'text',
            selector: 'content'
          },
        ],
        attrs: {}//样式代码
      }
    )
    // 注册vue组件
    Graph.registerNode(
      "condition",
      {
        inherit: "vue-shape",
        component: condition,
      }
    );
    // 注册弯的边
    Graph.registerEdge(
      'mindmap-edge',
      {
        inherit: 'edge',
        router: {
          name: 'manhattan',
          args: {
            startDirections: ['right'],
            endDirections: ['left']
          }
        },
        connector: {
          name: 'rounded'
        },
        attrs: {
          line: {
            strokeWidth: 2,
            stroke: '#A2B1C3',
            sourceMarker: null,
            targetMarker: null,
          },
        }, //样式代码
        zIndex: 0
      },
      true,
    )
    // 注册直的边
    Graph.registerEdge(
      'straight-edge',
      {
        inherit: 'edge',
        attrs: {
          line: {
            strokeWidth: 2,
            stroke: '#A2B1C3',
            sourceMarker: null,
            targetMarker: null,
          },
        }, //样式代码
        zIndex: 0
      },
      true,
    )

    // 注册编辑工具
    Graph.registerNodeTool('edit', {
      inherit: 'button', // 基类名称，使用已经注册的工具名称。
      markup: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            fill: '#296FFF',
            cursor: 'pointer',
            width: 32,
            height: 28
          }
        },
        {
          tagName: 'image',
          selector: 'icon',
          attrs: {
            'xlink:href': EDIT_IMAGE,
            cursor: 'pointer',
            width: 16,
            height: 16,
            x: 8,
            y: 6
          }
        }
      ],
      x: '100%',
      y: '100%',
      offset: { x: -95, y: -72 },
      onClick({ cell }) {
        const dataItem = cell.getData()
        that.setData(that.data, cell.id, { ...dataItem, complate: true, isEdit: true })
        cell.setData({ ...dataItem, complate: true, isEdit: true })

        //打开编辑时，子级元素偏移
        const firstChild = cell.getChildAt(0)
        if (firstChild) {
          const cellWidth = 613
          const x = cellWidth - firstChild.position({ relative: true }).x + 80 //编辑框 - 第一个子级位置 - 连接线宽 = 子级偏移量
          cell.getChildAt(0).translate(x)
        }
      }
    })

    // 注册删除工具
    Graph.registerNodeTool('del', {
      inherit: 'button', // 基类名称，使用已经注册的工具名称。
      markup: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            fill: '#296FFF',
            cursor: 'pointer',
            width: 32,
            height: 28
          }
        },
        {
          tagName: 'image',
          selector: 'icon',
          attrs: {
            'xlink:href': DEL_IMAGE,
            cursor: 'pointer',
            width: 16,
            height: 16,
            x: 8,
            y: 6
          }
        }
      ],
      x: '100%',
      y: '100%',
      offset: { x: -63, y: -72 },
      onClick({ cell }) {
        that.removeNode(cell.id)
      }
    })

    // 注册新增限定条件
    Graph.registerNodeTool('add-condition', {
      inherit: 'button', // 基类名称，使用已经注册的工具名称。
      markup: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            fill: '#296FFF',
            cursor: 'pointer',
            width: 32,
            height: 28
          }
        },
        {
          tagName: 'image',
          selector: 'icon',
          attrs: {
            'xlink:href': LINK_IMAGE,
            cursor: 'pointer',
            width: 16,
            height: 16,
            x: 8,
            y: 6
          }
        }
      ],
      x: '100%',
      y: '100%',
      offset: { x: -31, y: -72 },
      onClick({ cell }) {
        const { id } = cell
        const dataItem = that.findItem(that.data, id).node
        const lastNode = that.lastChild(dataItem)//找到当前node的最后一级，添加
        if (that.addChildNode(lastNode.id, '并且', that.data)) that.render(that.graph)
      }
    })

    //关系节点 点击增加条件事件
    Graph.registerNodeTool('relative:add-condition', {
      inherit: 'button', // 基类名称，使用已经注册的工具名称。
      markup: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            fill: '#296FFF',
            cursor: 'pointer',
            width: 32,
            height: 28
          }
        },
        {
          tagName: 'image',
          selector: 'icon',
          attrs: {
            'xlink:href': LINK_IMAGE,
            cursor: 'pointer',
            width: 16,
            height: 16,
            x: 8,
            y: 6
          }
        }
      ],
      x: '100%',
      y: '100%',
      offset: { x: -31, y: -72 },
      onClick({ cell }) {
        const { id } = cell
        if (that.addChildNode(id, '', that.data)) that.render(that.graph)
      }
    })

    //边增加条件
    Graph.registerEdgeTool('edge:add-condition', {
      inherit: 'button', // 基类名称，使用已经注册的工具名称。
      markup: [
        {
          tagName: 'image',
          selector: 'button',
          attrs: {
            'xlink:href': ADD_IMAGE,
            width: 30,
            height: 30,
            cursor: 'pointer',
          },
        }
      ],
      x: 0,
      y: 0,
      distance: '100%',
      offset: { y: -15, x: -15 },
      onClick({ cell }) {
        const { node, parent } = that.findItem(that.data, cell.target.cell)
        if (node.edgeText) node.edgeText = '';
        const newId = that.getMaxId() + 1;
        const childP = {
          children: [node],
          id: newId,
          type: 'relative',
          width: 44,
          height: 44,
          data: { relative: 'and', type: 'document' }
        }
        const currentIndex = parent.children.findIndex(item => item.id === node.id)
        parent.children[currentIndex] = childP
        if (that.addChildNode(newId, '', that.data)) {
          that.render(that.graph)
        }
      }
    })
  },
  mounted() {
    this.graph = new Graph({
      container: document.getElementById("advanced"),
      connecting: {
        connectionPoint: "anchor",
      },
      //设置拖拽事件
      panning: {
        enabled: true,
        modifiers: 'ctrl' //按下ctrl可以拖动
      },
      //绘制网格
      grid: {
        size: 10,      // 网格大小 10px
        visible: true, // 绘制网格，默认绘制 dot 类型网格
        type: 'doubleMesh',
        args: [
          {
            color: '#eee', // 主网格线颜色
            thickness: 1,     // 主网格线宽度
          },
          {
            color: '#ddd', // 次网格线颜色
            thickness: 1,     // 次网格线宽度
            factor: 4,        // 主次网格线间隔
          },
        ],
      },
      //框选
      // selecting: {
      //   enabled: true,
      //   multiple: true,
      //   rubberband: true,
      //   movable: true,
      //   showNodeSelectionBox: true,
      // },
      //快捷键
      keyboard: {
        enabled: true,
      },
    });
    //根结点添加
    this.graph.on('add:original', this.addOriginal)
    //节点数据变化，vue表单的提交，取消，编辑都会触发它
    this.graph.on('node:change:data', this.nodeDataChange)
    //切换关系节点
    this.graph.on('change:relative', ({ node }) => {
      const { id } = node;
      const res = this.findItem(this.data, id);
      const dataItem = res.node; //拿到当前节点
      if (dataItem.type === 'relative') {
        dataItem.data.relative = dataItem.data.relative === 'and' ? 'or' : 'and';
        this.render(this.graph);
      }
    })
    //鼠标进入节点
    this.graph.on('node:mouseenter', ({ node }) => {
      if (['condition-text', 'relative'].includes(node.shape)) {
        if (node.shape === 'condition-text') {
          node.setAttrs({ body: { fill: '#E9F0FF', stroke: '#296FFF' } })
          node.addTools(['edit', 'del', 'add-condition'])
        } else {
          node.addTools(['del', 'relative:add-condition'])
        }
      }
    })
    //鼠标离开节点
    this.graph.on('node:mouseleave', ({ node }) => {
      if (['condition-text', 'relative'].includes(node.shape)) {
        node.removeTools()
        if (node.shape === 'condition-text') {
          node.setAttrs({ body: { stroke: '#CCC', fill: '#fff' } })
        }
      }
    })
    //鼠标进入边
    this.graph.on('edge:mouseenter', ({ edge }) => {
      const targetNode = this.graph.getCellById(edge.target.cell)
      if (['condition-text', 'relative'].includes(targetNode.shape)) {
        edge.addTools(['edge:add-condition'])
      }
    })
    //鼠标离开边
    this.graph.on('edge:mouseleave', ({ edge }) => {
      edge.removeTools(['edge:add-condition'])
    })
    this.render(this.graph);
  },
  methods: {
    render(graph) {
      const result = Hierarchy.mindmap(this.data, {
        direction: 'H',
        getHeight(d) {
          return d.height
        },
        getWidth(d) {
          return d.width
        },
        getHGap() {
          return 40
        },
        getVGap() {
          return 20
        },
        getSide: () => {
          return 'right'
        }
      })
      const cells = []
      const traverse = (hierarchyItem, parentId) => {
        if (hierarchyItem) {
          const { data, children } = hierarchyItem;
          const node = graph.createNode({
            ...data,
            shape: data.type,
            x: hierarchyItem.x,
            y: hierarchyItem.y,
            component: condition
          })
          if (parentId) {
            //有父级则插入父级
            const parent = graph.getCellById(parentId)
            parent && parent.addChild(node)
          }
          if (data.type === 'condition-text') {
            const { cnName, relation, values } = data.data.form
            const keyText = cnName
            const optText = relation
            const valueText = values
            const width = (keyText.length + optText.length + valueText.length) * 16 + 10
            node.setAttrs({
              body: { stroke: '#EAEAEA', fill: '#FFFFFF' },
              content: { text: `${keyText},${optText},${valueText}` }
            })
            node.resize(width, 44)
            data.width = width
          }
          //关系节点，默认是并且为蓝色，是或者的话，需要切换颜色判断
          if (data.type === 'relative') {
            node.setAttrs(
              data.data.relative === 'or' ? {
                body: { stroke: '#CEE8D9', fill: '#CEE8D9' },
                label_text: { fill: '#008451' },
                switch: { 'xlink:href': OR_SWITCH },
                text: { text: '或者' }
              } : {
                body: { stroke: '#CDDAFF', fill: '#CDDAFF' },
                label_text: { fill: '#1772F6' },
                switch: { 'xlink:href': AND_SWITCH },
                text: { text: '并且' }
              }
            )
          }
          cells.push(node)
          //子节点边
          if (children) {
            children.forEach((item) => {
              const { id, data: itemData } = item
              cells.push(
                graph.createEdge({
                  shape: itemData.edgeText ? 'straight-edge' : 'mindmap-edge',
                  source: {
                    cell: hierarchyItem.id,
                    anchor: {
                      name: itemData.type === 'topic-child' ? 'right' : 'center',
                      args: {
                        dx: itemData.type === 'topic-child' ? -16 : '25%'
                      }
                    }
                  },
                  target: { cell: id, anchor: { name: 'left' } },
                  labels: [{ attrs: { text: { text: itemData.edgeText || '' } } }]
                }),
              )
              traverse(item, node.id)
            })
          }
        }
      }
      traverse(result)
      graph.resetCells(cells)
      // graph.scaleContentToFit({ maxScale: 1 })
      graph.centerContent()
    },
    //点击根节点新增
    addOriginal() {
      const dataItem = this.data;
      let count = this.getMaxId()
      if (dataItem.children && dataItem.children.length > 0) {
        let oldChild = dataItem.children
        dataItem.children = [{
          id: ++count,
          type: "relative", //关系节点
          width: 44,
          height: 44,
          data: {
            relative: "and" //and并且 or或者
          },
          children: [
            oldChild[0],
            {
              id: ++count,
              type: "vue-shape", //自定义组件 业务节点
              width: 613,
              height: 38,
              level: 1,
              edgeText: "",
              data: {
                complate: false,
                form: {},
                isEdit: false
              }
            }
          ]
        }]
      } else {
        dataItem.children = [{
          id: ++count,
          type: "vue-shape", //自定义组件 业务节点
          width: 613,
          height: 38,
          level: 1,
          edgeText: "",
          data: {
            complate: false,
            form: {},
            isEdit: false
          }
        }]
      }
      this.render(this.graph)
    },
    //监听节点数据变化
    nodeDataChange(e) {
      const current = e.current;
      const res = this.findItem(this.data, e.cell.id);
      const dataItem = res.node; //拿到当前节点
      if (dataItem.type === 'condition-text') {  //判断是否为条件节点，如果是则点击编辑
        dataItem.data = current  //赋值
        dataItem.type = 'vue-shape'
        dataItem.width = 613
        this.render(this.graph)
      } else {
        if (current.complate || current.isEdit) { //该节点填写完毕 或在编辑状态下取消填写
          dataItem.data = current  //赋值或还原
          dataItem.type = 'condition-text'
          this.render(this.graph)
        } else { //新增状态下取消填写，删除节点
          this.removeNode(e.cell.id)
        }
      }
    },
    //查找节点的父节点 当前节点，顶级节点的数据
    findItem(obj, id) {
      if (obj.id === id) {
        return {
          parent: null,
          node: obj
        }
      }
      const { children } = obj
      if (children) {
        for (let i = 0, len = children.length; i < len; i++) {
          const res = this.findItem(children[i], id)
          if (res) {
            return {
              parent: res.parent || obj,
              node: res.node,
            }
          }
        }
      }
      return null
    },
    //查找最末级
    lastChild(obj) {
      if (obj.children && obj.children.length) {
        return this.lastChild(obj.children[0])
      } else {
        return obj
      }
    },
    //设置某个节点的data
    setData(obj, id, dataItem) {
      let that = this;
      if (obj.id === id) {
        obj.data = dataItem
        if (['vue-shape', 'condition-text'].includes(obj.type)) {
          obj.type = dataItem.complate ? 'condition-text' : 'vue-shape'
        }
        return
      }
      if (obj.children) {
        obj.children.forEach(child => {
          that.setData(child, id, dataItem)
        })
      }
    },
    //插入节点
    addChildNode(id, edgeText, data) {
      const res = this.findItem(data, id)
      const dataItem = res.node;
      const newId = this.getMaxId() + 1;
      if (dataItem) {
        const item = {
          id: newId,
          type: 'vue-shape',
          width: 613,
          height: 38, //内容宽高 + padding20 + 边框4
          level: dataItem.level === 1 ? dataItem.level + 1 : 1,
          edgeText,
          data: {
            complate: false,
            form: {},
            isEdit: true
          }
        }
        if (dataItem.children) {
          dataItem.children.push(item)
        } else {
          dataItem.children = [item]
        }
        return item
      }
      return null
    },
    //移除节点
    removeNode(id) {
      const res = this.findItem(this.data, id)
      const dataItem = res.parent
      if (dataItem && dataItem.children) {
        const { children } = dataItem
        const index = children.findIndex((item) => item.id === id)
        children.splice(index, 1) //删除当前
        if (children.length && children.length < 2) { //并且或者 只有一个子级时 删除并且或者节点
          const p2 = this.findItem(this.data, dataItem.id).parent //父级的父级
          const p2OtherChildren = p2.children.filter(item => item.id !== dataItem.id)
          p2.children = [...p2OtherChildren, ...children]
        }
        this.render(this.graph)
      }
    },
    //拿到节点中具有最大id值的节点id
    getMaxId() {
      let node = this.data
      return (function getId(node) {
        let maxId = node.id; // 当前节点的id作为初始最大值

        if (node.children && node.children.length > 0) {
          for (let child of node.children) {
            const childMaxId = getId(child); // 递归获取子节点中的最大id值
            maxId = Math.max(maxId, childMaxId); // 更新最大id值
          }
        }

        return maxId;
      }(node))
    }
  },
};
</script>
<style >
.rootNode-image {
  visibility: hidden;
  cursor: pointer;
}

.x6-node:hover .rootNode-image {
  visibility: visible;
}

.x6-node-selected rect {
  stroke-width: 2px;
}
</style>