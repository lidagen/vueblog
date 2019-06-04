## 流程变量
### 流程变量的作用
  + 用来传递业务参数
  + 指定连线完成任务(同意/拒绝)
  + 动态指定任务的办理人

### 表
+ `act_ru_variable` 正在执行的流程变量表
+ `act_hi_varinst` 历史的流程变量表
### 部署、启动
  + 略 参见 [helloWord](act1.html#流程流转过程) 部署启动部分
### 设置\获取流程变量
````java
/**设置流程变量**/
	@Test
	public void setVariables() {
		// act_ru_variable 正在执行的流程变量表
		TaskService taskService = processEngine.getTaskService();
		//taskService.setVariableLocal();与任务ID task_id 绑定
		taskService.setVariable("15008","请假天数",3);
		taskService.setVariable("15008","请假日期",new Date());
	}
	/**获取流程变量**/
	@Test
	public void getVariables() {
		TaskService taskService = processEngine.getTaskService();
		String taskKey ="15008";
		Integer days = (Integer)taskService.getVariable(taskKey,"请假天数");
		Date date = (Date)taskService.getVariable(taskKey,"请假日期");
	}

	/**模拟设置好获取流程变量场景**/
	@Test
	public void setAndGetVariables() {
		/**与流程实例，执行对象（正在执行）相关**/
		RuntimeService runtimeService = processEngine.getRuntimeService();
		/**与任务（正在执行）相关**/
		TaskService taskService = processEngine.getTaskService();
		/**设置流程变量**/
		//表示使用执行对象ID(executionId为act_ru_task的 ID_)，流程变量名称设置变量的值（一次设置一个值）
		//runtimeService.setVariable(executionId,variableName,value);
		//设置多个,variables为map,map的key为流程变量名称,value 就是流程变量的值
		//runtimeService.setVariables(executionId,variables);

		//taskService.setVariable(taskId,variableName,value);//表示使用执行任务ID，流程变量名称设置变量的值（一次设置一个值）
		//taskService.setVariables(taskId,variables);//设置多个
		/**启动时设置变量**/
		//runtimeService.startProcessInstanceByKey(processDefinitionKey,variables)
		/**完成任务时设置变量**/
		//taskService.complete(taskId,variables);

		//runtimeService.getVariable(executionId,variableName)//执行变量ID和流程变量名称
		//runtimeService.getVariables(executionId);//执行变量ID获取所有的流程变量,得到map
	}
````
::: warning
+ 当一个javabean(序列化)放置到流程变量中,要求javabean属性(注意：**属性发生变化不是属性值**)不能发生变化,如果发生变化,获取时会抛出异常
+ 序列化并生成固定的ID,不会有上述问题
:::


