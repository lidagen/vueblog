## 流程实例、任务、执行对象控制流程的执行相关的表 
::: tip
+ `ProcessInstance`**流程实例表示一个流程从开始到结束的最大流程分支**，一个流程中只有一个流程实例。
  对应的表`act_ru_execution` `act_hi_procinst` `act_hi_actinst`
+ `Execution`**流程按照流程定义的规则执行一次的过程，就可以表示执行对象Execution**
+ `Task` **执行到任务环节产生的任务信息**
  对应的表`act_ru_task` `act_hi_taskinst`
:::

+ act_ru_execution 正在执行的对象表

字段名称 | 字段 |  备注  
- | :-: | :-: | :-: | -:
执行对象ID | ID_ |  主键ID
乐观锁 | REV_ |默认值 NULL，version版本
流程实例ID | PROC_INST_ID_ |流程实例ID
业务主键ID | BUSINESS_KEY_ |业务主键ID
父节点实例ID | PARENT_ID_ |父节点实例ID
流程定义ID | PROC_DEF_ID_ |
SUPER_EXEC_| SUPER_EXEC_ |
节点实例ID | ACT_ID_ |节点实例ID即ACT_HI_ACTINST中ID
是否存活 | IS_ACTIVE_ |
是否并行 | IS_CONCURRENT_ |
IS_SCOPE_ | IS_SCOPE_ |
IS_EVENT_SCOPE_ | IS_EVENT_SCOPE_ |
是否挂起 | SUSPENSION_STATE_ |挂起状态（1：激活、2：挂起）
CACHED_ENT_STATE_ | CACHED_ENT_STATE_ |
租户ID	 | TENANT_ID_ |
名称 | NAME_ |
LOCK_TIME_ | LOCK_TIME_ |

+ act_hi_procinst 流程实例历史表

+ act_ru_task 正在执行的任务表
::: tip
+ 只有节点是userTask的时候,该表才会存数据
:::

+ act_hi_taskinst 历史任务表

+ act_hi_actinst 所有活动节点历史表

::: tip
`act_hi_taskinst`保存usertask历史数据  
`act_hi_actinst`保存所有节点历史数据
:::

## 总结
::: tip
+ 如果是单例流程(没有分支、聚合),那么流程实例ID和执行对象ID是相同的 (`ID_` `PROC_INST_ID_`)
+ 一个流程 **流程实例**只有一个,执行对象存在多个(分支、聚合)
:::