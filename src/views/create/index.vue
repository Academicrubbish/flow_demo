<template>
  <div>
    <div id="advanced" style="height: 400px" />
  </div>
</template>
<script>
import condition from "@/components/condition.vue";
import { Graph } from "@antv/x6";
import Hierarchy from "@antv/hierarchy";
import "@antv/x6-vue-shape";
export default {
  data() {
    return {
      graph: null,
      data: {
        id: "1",
        type: "rootNode",
        label: "添加",
        width: 160,
        height: 50,
      },
    };
  },
  created() {
    // 中心主题或分支主题
    Graph.registerNode(
      "rootNode",
      {
        inherit: "rect",
        markup: [
          {
            tagName: "rect",
            selector: "body",
          },
          {
            tagName: "text",
            selector: "label",
          },
        ],
        attrs: {
          body: {
            rx: 6,
            ry: 6,
            stroke: "#5F95FF",
            fill: "#EFF4FF",
            strokeWidth: 1,
          },
          label: {
            fontSize: 14,
            fill: "#262626",
          },
        },
      },
      true
    );

    // 连接器
    Graph.registerConnector(
      "mindmap",
      (sourcePoint, targetPoint, routerPoints, options) => {
        const midX = sourcePoint.x + 10;
        const midY = sourcePoint.y;
        const ctrX = (targetPoint.x - midX) / 5 + midX;
        const ctrY = targetPoint.y;
        const pathData = `
     M ${sourcePoint.x} ${sourcePoint.y}
     L ${midX} ${midY}
     Q ${ctrX} ${ctrY} ${targetPoint.x} ${targetPoint.y}
    `;
        return pathData;
      },
      true
    );

    // 弯的边
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

    //  注册vue组件
    Graph.registerNode(
      "rootNode-third",
      {
        inherit: "vue-shape",
        x: 200,
        y: 150,
        width: 150,
        height: 100,
        component: condition,
      });
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
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      },
      //快捷键
      keyboard: {
        enabled: true,
      },
    });
    this.graph.on("add:rootNode", ({ node }) => {
      const { id } = node;
      const type = node.prop("type");
      if (this.addChildNode(id, type)) {
        this.render();
      }
    });
    this.graph.bindKey(["backspace", "delete"], () => {
      const selectedNodes = this.graph
        .getSelectedCells()
        .filter((item) => item.isNode());
      if (selectedNodes.length) {
        const { id } = selectedNodes[0];
        if (this.removeNode(id)) {
          this.render();
        }
      }
    });
    this.graph.bindKey("tab", (e) => {
      e.preventDefault();
      const selectedNodes = this.graph
        .getSelectedCells()
        .filter((item) => item.isNode());
      if (selectedNodes.length) {
        const node = selectedNodes[0];
        const type = node.prop("type");
        if (this.addChildNode(node.id, type)) {
          this.render();
        }
      }
    });
    this.render();
  },
  methods: {
    removeNode(id) {
      const res = this.findItem(this.data, id);
      const dataItem = res?.parent;
      if (dataItem && dataItem.children) {
        const { children } = dataItem;
        const index = children.findIndex((item) => item.id === id);
        return children.splice(index, 1);
      }
      return null;
    },
    addChildNode(id, type) {
      //找到当前节以及它的父级节点
      const res = this.findItem(this.data, id);
      const dataItem = res.node; //拿到当前节点
      console.log(dataItem);
      if (dataItem) {
        let item = null;

        const length = dataItem.children ? dataItem.children.length : 0;

        let secondItem = {
          id: `${id}-${length + 1}`,
          type: "rootNode-second",
          label: `条件${length + 1}`,
          width: 100,
          height: 40
        };

        let thirdItem = {
          id: `${id}-${length + 1}`,
          type: "rootNode-third",
          width: 633,
          height: 40,
        };

        //如果当前是根节，就新增2级节点
        if (type === "rootNode") {
          item = length ? secondItem : thirdItem;
        }
        //如果当前是第二级节点，就新增第三级节点
        else if (type === "rootNode-second") {
          item = thirdItem
        }

        if (item) {
          if (dataItem.children) {
            // 如果当前节点的 children 属性已经存在，则 push 新节点到 children 数组中
            dataItem.children.push(item);
          } else {
            // 如果当前节点的 children 属性不存在，则创建 children 属性并赋值给它
            dataItem.children = [item];
          }
          console.log(item);
          return item;
        }
      }
      return null;
    },
    // 查找指定 id 的节点，并返回它的父节点和节点本身
    findItem(obj, id) {
      if (obj.id === id) {
        // 如果当前节点的 id 与指定 id 相同，则返回当前节点和 null（表示没有父节点）
        // 就是如果你点击的是父节点
        return {
          parent: null,
          node: obj,
        };
      }
      const { children } = obj;
      if (children) {
        // 遍历当前节点的子节点
        for (let i = 0, len = children.length; i < len; i++) {
          // 递归调用 findItem 方法，查找子节点中的指定 id
          const res = this.findItem(children[i], id);
          if (res) {
            // 如果找到了指定 id 的节点，则返回它的父节点和节点本身
            // 如果找到的是根节点，则 parent 为 null
            return {
              parent: res.parent || obj,
              node: res.node,
            };
          }
        }
      }
      // 如果未找到指定 id 的节点，则返回 null
      return null;
    },
    render() {
      const result = Hierarchy.mindmap(this.data, {
        direction: "H",
        getHeight(d) {
          return d.height;
        },
        getWidth(d) {
          return d.width;
        },
        getHGap() {
          return 40;
        },
        getVGap() {
          return 20;
        },
        getSide: () => {
          return "right";
        },
      });
      const cells = [];
      const traverse = (hierarchyItem) => {
        if (hierarchyItem) {
          const { data, children } = hierarchyItem;
          cells.push(
            this.graph.createNode({
              id: data.id,
              shape:
                data.type === "rootNode-third" ? "rootNode-third" : "rootNode",
              x: hierarchyItem.x,
              y: hierarchyItem.y,
              width: data.width,
              height: data.height,
              label: data.label,
              type: data.type,
              component: condition,
            })
          );
          if (children) {
            children.forEach((item) => {
              const { id, data } = item;
              cells.push(
                this.graph.createEdge({
                  shape: "mindmap-edge",
                  source: {
                    cell: hierarchyItem.id,
                    anchor: {
                      name: data.type === 'rootNode-third' ? 'right' : 'center',
                      args: {
                        dx: data.type === 'rootNode-third' ? -16 : '25%'
                      }
                    }
                  },
                  target: { cell: id, anchor: { name: 'left' } },
                })
              );
              traverse(item);
            });
          }
        }
      };
      traverse(result);
      console.log(cells);
      this.graph.resetCells(cells);
      this.graph.centerContent();
    },
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