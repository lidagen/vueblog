## 部署对象和流程定义相关的表
+ act_re_deployment 部署对象表
+ act_re_procdef 流程定义表
+ act_ge_bytearray 资源文件表
+ act_ge_property 主键生成策略表
::: tip
+ 先获取流程对象，在创建时自动加载classpath下的activiti.cfg.xml
+ 首先获取默认的流程引擎，通过流程引擎获取一个RepositoryService仓库对象
+ 由仓库的服务对象产生一个部署配置对象，用来封装部署操作的相关配置
+ 这是一个链式编程，在部署配置对象中设置显示名，上传流程定义规则文件
+ 向数据库表中存放流程定义的规则信息
  - 这一步将操作三张表
    - `act_re_deployment` 部署对象表  
  存放流程定义的显示名和部署时间，每部署一次增加一条记录  
    - `act_re_procdef` 流程定义表  
  存放流程定义的属性信息，部署每个新的流程定义都会在此表增加一条记录  
  当流程定义key相同时，会增加version字段
    - `act_ge_bytearray` 资源文件表  
  流程定义相关的部署信息，既流程定义的资源存放地，每部署一次增加两条记录，一条关于bpmn文件的，一条关于
  png的。以二进制形式存储在数据库中

:::

## 流程定义表操作 *act_re_procdef*
 + 表字段

字段名称 | 字段 |  备注  
- | :-: | :-: | :-: | -:
ID | ID_ |  主键ID
乐观锁 | REV_ |  默认值 NULL，version版本
类别 | CATEGORY_ |  流程定义的Namespace就是类别
名称 | NAME_ |   	名称
KEY | KEY_ |  	流程定义的ID 
版本 | VERSION_ |   版本
部署表ID | DEPLOYMENT_ID_ | 	部署表ID
bpmn文件名称 | RESOURCE_NAME_ | 流程bpmn文件名称
png图片名称 | DGRM_RESOURCE_NAME_ |  流程图片名称
描述 | DESCRIPTION_ |
是否存在开始节点formKey | HAS_START_FORM_KEY_ | start节点是否存在formKey（0：否、1：是）
角色ID | HAS_GRAPHICAL_NOTATION_ |
是否挂起 | SUSPENSION_STATE_ |
租户ID | TENANT_ID_ |

### 查询流程定义
````java
/**查询流程定义**/
@Test
public void findProcess(){
    /***act_re_procdef 流程定义表 **/
    ProcessDefinition processDefinition = processEngine.getRepositoryService()
                        .createProcessDefinitionQuery()//创建一个流程定义查询
                        .deploymentId("2501")//部署对象deployment_id查询
            //			.processDefinitionId("myProcess_1:1:4")//流程定义ID查询
            //			.processDefinitionKey()//根据Key查询，返回集合

            //			.list();//集合
                        .singleResult();//单个对象
            //			.count();//count

    System.out.println(processDefinition.getCategory());
    System.out.println(processDefinition.getName()); //对应.bpmn中的name属性值
	processDefinition.getKey();//对应.bpmn中的id属性值
}
````

### 删除流程定义
````java
/**删除流程定义**/
	@Test
	public void deleteProcess() {
		String deploymentId = "1";
		processEngine.getRepositoryService()
				//.deleteDeployment(deploymentId);//不带级联的删除,只能删除没有启动的流程，
                //如果流程启动，就会抛出异常
				.deleteDeployment(deploymentId,true);//级联删除，启动也能删除
	}
````

### 查看流程图
````java
/**查看流程图**/
	@Test
	public void viewPic()throws Exception{
		String deploymentId = "2501";//act_ge_bytearray 的deploymentId值
		String name = "diagrams/hello.png"; //act_ge_bytearray 的name值
		/**将生成文件放到文件夹下**/
		InputStream in = processEngine.getRepositoryService()
				.getResourceAsStream(deploymentId, name);
		/**写入D盘下**/
		File file = new File("D:/"+name);
        //commons-io jar
        FileUtils.copyInputStreamToFile(in,file);
	}
````

### 查询最新流程定义
````java
/**查询最新版本的流程定义**/
@Test
public void findLastVersion(){
/***act_re_procdef key相同的最新version **/
List<ProcessDefinition> list = processEngine.getRepositoryService()
                                    .createProcessDefinitionQuery()
                                    .orderByProcessDefinitionVersion()//version
                                    .asc()//使用流程定义的升序排序
                                    .list();

Map<String,ProcessDefinition> processDefinitionMap = new LinkedHashMap<>();
if (!CollectionUtils.isEmpty(list)){
    for (ProcessDefinition pd : list) {
        processDefinitionMap.put(pd.getKey(),pd);
    }
}
List<ProcessDefinition> arrayList = new ArrayList<>(processDefinitionMap.values());
for (ProcessDefinition processDefinition : arrayList) {
    System.out.println(processDefinition.getId());
}
}
````

### 批量删除流程定义
````java
 /**删除key相同的不同版本流程定义**/
@Test
public void deleteByKey(){
    /***act_re_procdef key相同的最新**/
    List<ProcessDefinition> list = processEngine.getRepositoryService()
                                    .createProcessDefinitionQuery()
                                    .processDefinitionKey("key")
                                    .list();
    if (!CollectionUtils.isEmpty(list)){
        for (ProcessDefinition pd : list) {
            String deploymentId = pd.getDeploymentId();
            processEngine.getRepositoryService().deleteDeployment(deploymentId,true);
        }
    }
}
````

:::tip
+ 流程定义是不能修改的
+ 控制修改(使用流程定义的key相同的情况下,版本升级)
:::

### 总结
+ <font color=#A23400 >Deployment 部署对象</font>
  - 一次部署多个文件的信息,对于不需要的流程可以删除和修改
  - 对应的表 
    - `act_re_deployment` 部署对象表
    - `act_re_procdef` 流程定义表
    - `act_ge_bytearray` 资源文件表
    - `act_ge_property` 主键生成策略表

+ <font color=#A23400 >ProcessDefinition 部署对象</font>
  - 解析.bpmn后得到的流程定义规则的信息,工作流系统就是安装流程定义的规则执行的。