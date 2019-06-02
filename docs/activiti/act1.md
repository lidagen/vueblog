## IDEA+Activiti下的helloWorld 

### IDEA 插件安装
+ IDEA 的Plugins搜索 actiBPM安装 重启IDEA

+ IDEA 安装路径下bin目录，**idea.exe.vmoptions** 与 **idea64.exe.vmoptions** 
下,分别加入 `-Dfile.encoding=UTF-8`

### 创建项目，导入依赖
+ 新建springboot 项目,加入maven依赖
````xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
<dependency>
    <groupId>org.activiti</groupId>
    <artifactId>activiti-spring</artifactId>
    <version>5.18.0</version>
</dependency>
<dependency>
    <groupId>org.activiti</groupId>
    <artifactId>activiti-engine</artifactId>
    <version>5.18.0</version>
    <exclusions>
        <exclusion>
            <artifactId>slf4j-api</artifactId>
            <groupId>org.slf4j</groupId>
        </exclusion>
        <exclusion>
            <artifactId>spring-beans</artifactId>
            <groupId>org.springframework</groupId>
        </exclusion>
        <exclusion>
            <artifactId>jackson-core-asl</artifactId>
            <groupId>org.codehaus.jackson</groupId>
        </exclusion>
        <exclusion>
            <artifactId>commons-lang3</artifactId>
            <groupId>org.apache.commons</groupId>
        </exclusion>
        <exclusion>
            <artifactId>commons-lang3</artifactId>
            <groupId>org.apache.commons</groupId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.13</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
````

### 画流程图

+ `resource` 目录下,新建 activiti.cfg.xml
````xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="processEngineConfiguration" class="org.activiti.engine.impl.cfg.StandaloneProcessEngineConfiguration">
        <property name="jdbcDriver" value="com.mysql.jdbc.Driver"></property>
        <property name="jdbcUrl" value="jdbc:mysql://localhost:3306/activiti?useUnicode=true&amp;characterEncoding=utf8"></property>
        <property name="jdbcUsername" value="root"></property>
        <property name="jdbcPassword" value="root"></property>
        <property name="databaseSchemaUpdate" value="true"></property>
    </bean>
</beans>
````

+ 加入 `log4j.properties`

+ 新建 `diagrams`包
  + 右键 `New`  - `BPMN File` 创建一个hello.bpmn的文件
  
  + 画流程图 `StartEvent` - `UserTask` - `UserTask` - `EndEvent`
    - UserTask 分别修改名称为 *学生请假* 与 *老师批准*
  
  + 按流程顺序连线 

  + Rename修改文件后缀名为.xml保存

  + 右键 `Diagrams` - `Show BPMN 2.0 Designer..`   

  + 点击画布上面 `Export to file`,保存路径选取 `diagrams`包下,保存生成PNG文件

  + Rename改回bpmn文件

### 流程引擎对象
````java
 ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
````

::: tip
默认加载类路径下名称为 activiti.cfg.xml 文件
:::

+ 流程引擎创建各个service,这些service调用工作流23张表
  
  + RepositoryService 管理流程定义
  ````java
  RepositoryService repository = processEngine.getRepositoryService();
  ````

  + RuntimeService 执行管理、包括启动、推进、删除流程实例等操作
  ````java
  RuntimeService runtime = processEngine.getRuntimeService();
  ````

  + TaskService 任务管理
  ````java
  TaskService task = processEngine.getTaskService();
  ````

### 流程流转过程
````java
package com.example.activiti;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.ProcessEngines;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.DeploymentBuilder;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.CollectionUtils;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ActivitiApplicationTests {

	ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();

	/**
	 * 部署流程定义	 */
	@Test
	public void deploy() {
		Deployment deployment = processEngine.getRepositoryService()//与流程定义、部署相关service
				.createDeployment()//创建一个部署对象
				.name("helloword 入门")
				.addClasspathResource("diagrams/hello.bpmn")//从classPath加载，一次加载一个
				.addClasspathResource("diagrams/hello.png")
				.deploy();//完成部署
		System.out.println(deployment.getId());
		System.out.println(deployment.getName());
	}

	/***
	 *启动流程实例
	 */
	@Test
	public void runProcess() {
		String processInstanceKey = "myProcess_1";//使用key，默认启动最新的流程定义启动
		ProcessInstance pi = processEngine.getRuntimeService()//与正在执行的流程实例相关
				.startProcessInstanceByKey(processInstanceKey);//使用流程定义的KEY启动实例，key对应bpmn文件中id,或者表act_re_procdef的key
		System.out.println(pi.getId());//流程实例ID
		System.out.println(pi.getProcessDefinitionId());//流程定义ID
	}

	/***
	 * 查询当前人的个人任务
	 */
	@Test
	public void task() {
		//act_ru_task
		String assignee = "张三";
		List<Task> taskList=processEngine.getTaskService()
				.createTaskQuery()
				.taskAssignee(assignee).list();
		if (!CollectionUtils.isEmpty(taskList)){
			for (Task task : taskList) {
				System.out.println("ID:"+task.getId());
				System.out.println("任务名称："+task.getName());
				System.out.println("创建时间："+task.getCreateTime());
				System.out.println("办理人："+task.getAssignee());
			}
		}
	}

	/**
	 * 办理我的任务
	 */
	@Test
	public void myTask() {
		//任务ID 上面task的task.getId()
		String taskId = "7504";
		processEngine.getTaskService().complete(taskId);
		System.out.println("完成任务");
	}
}

````

:::tip
执行完myTask以后，再去执行task查询张三的任务，则查不到了，因为任务流转到了李四哪里，
task()中String assignee 改成 李四,执行，能看到任务,再执行myTask(),李四的任务也执行完了。
这个工作流就执行完end
一个完成的工作流流转过程就执行完成。
:::