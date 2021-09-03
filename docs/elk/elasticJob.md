## Elastic-Job-分布式调度框架运用

+ 官方文档：`http://elasticjob.io/docs/elastic-job-lite`

### 分片概念

+ 任务的分布式执行，需要将一个任务拆分为多个独立的任务项，然后由分布式的服务器分别执行某一个或几个分片项。(多个独立进程，分别处理部分数据。)

+ 设置好分片策略，Elastic-Job会将分片项配置各个运行中的作业服务器。开发者需要自行处理分片项与真实数据的对应关系。


### Elastic-Job

+ Elastic-Job 是一个分布式的任务调度平台。Elastic-Job-Lite并无作业调度中心节点，而是基于部署作业框架的程序在到达相应时间点时各自触发调度。注册中心仅用于作业注册和监控信息存储。而主作业节点仅用于处理分片和清理等功能。

+ Elastic-Job会动态的分片分片情况，将分片项设置为大于服务器的数量，最好是大于服务器倍数的数量，作业将会合理的利用分布式资源，动态的分配分片项。当其中一台服务器崩溃，Elastic-Job会重新分配分片。

+ 如果不想执行分片，可以把分片策略设置为1，当使用多余1台服务器执行作业时，Elastic-Job会将以1主n从的方式执行。一旦执行作业的服务器崩溃，等待执行的服务器将会在下次作业启动时替补执行。开启失效转移功能效果更好，可以保证在本次作业执行时崩溃，备机立即启动替补执行。

### 与springboot 2.2.2.RELEASE 整合

#### 引入依赖
````xml
<dependency>
    <groupId>com.dangdang</groupId>
    <artifactId>elastic-job-lite-core</artifactId>
    <version>2.1.5</version>
</dependency>
<dependency>
    <groupId>com.dangdang</groupId>
    <artifactId>elastic-job-lite-spring</artifactId>
    <version>2.1.5</version>
</dependency>
````

#### zk注册中心配置
````java
@Configuration
@ConditionalOnExpression("'${spring.elasticjob.serverList}'.length() > 0")
public class JobRegistryCenterConfig {

    @Bean(initMethod = "init")
    public ZookeeperRegistryCenter regCenter(@Value("${spring.elasticjob.serverList}") final String serverList,
                                             @Value("${spring.elasticjob.namespace}") final String namespace){
        return new ZookeeperRegistryCenter(new ZookeeperConfiguration(serverList, namespace));
    }

}
````

#### application.properties配置
````
server.port=8767
spring.application.name=scheduler-service
#  zookeeper注册中心
spring.elasticjob.serverList = 127.0.0.1:2181
spring.elasticjob.namespace = elastic-job-lite-springboot
````




#### xml配置
````xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:reg="http://www.dangdang.com/schema/ddframe/reg"
       xmlns:job="http://www.dangdang.com/schema/ddframe/job"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd
                        http://www.dangdang.com/schema/ddframe/reg
                        http://www.dangdang.com/schema/ddframe/reg/reg.xsd
                        http://www.dangdang.com/schema/ddframe/job
                        http://www.dangdang.com/schema/ddframe/job/job.xsd
                        ">
    <!--注册中心-->
    <reg:zookeeper id="regCenter1" server-lists="${spring.elasticjob.serverList}" namespace="${spring.elasticjob.namespace}"
                   base-sleep-time-milliseconds="1000" max-sleep-time-milliseconds="3000" max-retries="3" />
    <!--任务bean start-->
    <!--分片模式，两台服务器执行不同的case:-->
    <job:simple id="firstJob" class="com.elastic.job.exc.FirstJob" registry-center-ref="regCenter1" cron="0/5 * * * * ?"
                sharding-total-count="2" sharding-item-parameters="0=A,1=B" />
    <!--配置主从模式，只有一台机器运行-->
    <job:simple id="singleJob" class="com.elastic.job.exc.FirstJob" registry-center-ref="regCenter1" cron="0/5 * * * * ?"
                sharding-total-count="1" sharding-item-parameters="0=single" />

    <!--任务bean end-->
</beans>
````

#### 启动入口引入elasticJob.xml
````java
@SpringBootApplication
@ImportResource(locations = "classpath*:elasticJob.xml")
public class ElasticJobApplication {

    public static void main(String[] args) {
        SpringApplication.run(ElasticJobApplication.class, args);
    }

}
````

#### Simple类型 JOB实现

+ 分片
````java
@Component
public class FirstJob implements SimpleJob {

    @Override
    public void execute(ShardingContext shardingContext) {
        List<String> list;
        switch (shardingContext.getShardingItem()){
            case 0:
                list = Arrays.asList("A1,A2,A3");
                System.out.println(String.format("--Thread ID：%s,任务总篇数：%s,当前分页片：%s,当前参数：%s," +
                                "当前任务名称：%s,当前任务结果：%s",Thread.currentThread().getId(),shardingContext.getShardingTotalCount(),
                        shardingContext.getShardingItem(),shardingContext.getShardingParameter(),shardingContext.getJobName(),
                        JSON.toJSONString(list)));
                break;
            case 1:
                list = Arrays.asList("B1,B2");
                System.out.println(String.format("--Thread ID：%s,任务总篇数：%s,当前分页片：%s,当前参数：%s," +
                                "当前任务名称：%s,当前任务结果：%s",Thread.currentThread().getId(),shardingContext.getShardingTotalCount(),
                        shardingContext.getShardingItem(),shardingContext.getShardingParameter(),shardingContext.getJobName(),
                        JSON.toJSONString(list)));
                break;
            default:
                System.out.println("do nothing!");
        }

    }
}
````

+ 主从
````java
@Component
public class SingleJob implements SimpleJob {
    @Override
    public void execute(ShardingContext shardingContext) {
        System.out.println(String.format("SINGLE-JOB--Thread ID：%s,任务总篇数：%s,当前分页片：%s,当前参数：%s," +
                        "当前任务名称：%s,当前任务结果：%s",Thread.currentThread().getId(),shardingContext.getShardingTotalCount(),
                shardingContext.getShardingItem(),shardingContext.getShardingParameter(),shardingContext.getJobName(),
                shardingContext.getJobParameter()));
    }
}
````

#### Dataflow类型 JOB实现

+ 流式处理数据,实现DataflowJob接口。该接口提供2个方法可供覆盖，分别用于抓取(fetchData)和处理(processData)数据。
+ 流式处理数据只有fetchData方法的返回值为null或集合长度为空时，作业才停止抓取，否则作业将一直运行下去；

````java
@Component
public class MyDataflowJob implements DataflowJob<Person> {
    /**
     * 抓取
     *
     * @param shardingContext
     * @return
     */
    @Override
    public List<Person> fetchData(ShardingContext shardingContext) {
        List<Person> personList = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Person p = new Person();
            p.setAge(i);
            p.setName("w" + i + "s");
            personList.add(p);
        }
        
        return personList;
    }

    /**
     * 处理
     *
     * @param shardingContext
     * @param list
     */
    @Override
    public void processData(ShardingContext shardingContext, List<Person> list) {
        for (Person person : list) {
            System.out.println("获取的姓名：" + person.getName() + "年龄：" + person.getAge());
        }
    }
}
````

+ xml中注册bean
````xml
<job:dataflow  id="myDataflowJob1" class="com.elastic.job.exc.MyDataflowJob" registry-center-ref="regCenter1" cron="0/5 * * * * ?"
                   sharding-total-count="1" sharding-item-parameters="0=person" />
````

### 总结
+ 上面配置，一个简单的分布式调度平台就完成了，启动ZK，修改端口号，分别起两个服务A,B。
+ 从打印可以看出，分片策略的FirstJob,任务分成两部分分别在A,B上运行。
+ 分片策略为主从的SingleJob,只在一台运行，停掉执行SingleJob的A服务，主从的SingleJob转移到B执行，而分片的所有任务也都在B上执行。

#### github demo 
`git remote add origin https://github.com/lidagen/elastic-job.git
git push -u origin master`
