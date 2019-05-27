### vue+ elementUI 自封装分页插件
::: tip
elementUI提供了一套很好的分页解决方案，但是项目中很多地方使用，每次要写重复代码，不够解耦合，于是考虑把分页单独提出来作为一个公共模块，使用时直接调用，代码更简洁好看
:::

+ 封装Pagination
  - 新建一个Pagination.vue页面，代码如下
 ``` html{4}
 <template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[5, 10, 20, 40]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  ></el-pagination>
</template>
<script>
export default {
  name: "Pagination",
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      total: 0,
      pagesize: 5,
      currentPage: 1
    };
  },
  mounted() {
    this.reload();
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size;
      this.reload();
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.reload();
    },
    reload() {
      this.$Axios.post(
        this.url,
        { page: this.currentPage, size: this.pagesize },
        res => {
          if (res.data.success) {
            this.$emit("childByValue", res.data.data);
            this.total = res.data.count;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        }
      );
    }
  }
};
</script>

 ```

 ::: tip
 说明如下：
          
          1.JS中this.$Axios.post换成你自己的访问后台api方法

          2.参数page,size也是你自己后台定义的接受分页参数名称

          3.返回类型res结构相应要改成你自己返回数据的格式
 :::

 + 页面处调用
   - 引入Pagination.vue
   ``` js{4}
   import Pagination from "@/components/Pagination.vue";
   components: {
    Pagination
   }

   ```
   - 调用
   ``` html{4}
   <Pagination url="user/query" v-on:childByValue="childByValue"/>
   ```
   ::: tip
   调用说明：

            1.url对你的你请求后台的路径

            2.v-on接受 Pagination传递过来的childByValue值
   :::
   - 定义方法，接受childByValue值
   ``` js{4}
   childByValue(childValue) {
      this.usersData = childValue;
    }
   ```
   ::: tip
   此处userData是你页面接受展示table页面是数组
   :::