## Spring Cloud Alibaba 服务注册以及配置中心Nacos
+ spring cloud alibaba 官网 `https://spring.io/projects/spring-cloud-alibaba`

### Nacos 简介
+ Nacos : Dynamic Naming  And Configuration   Service的缩写，字面意思就是**注册中心+ 配置中心**的组合。 
+ Nacos等价于 Euraka + Spring Config + Bus

### Nacos 安装
+ 官网手册 `https://nacos.io/zh-cn/`

+ 下载 `https://github.com/alibaba/nacos/releases/`    

+ linux 单机版解压进入bin,运行 `bash -f ./startup.sh -m standalone`

+ 访问  `http://localhost:8848/nacos/`

### Nacos 之 服务提供者注册
+ 总pom增加alibaba的依赖
````xml
 <!--alibaba springcloud-->
      <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-alibaba-dependencies</artifactId>
        <version>2.1.0.RELEASE</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
````

+ 新增一个9001、9002的服务提供者Module
````xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>cloud2020</artifactId>
        <groupId>com.ws.springcloud</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-provider-payment9001</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.ws.springcloud</groupId>
            <artifactId>api</artifactId>
            <version>${project.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
````

+ yml
````yml
server:
  port: 9001
spring:
  application:
    name: nacos-provider
  cloud:
      nacos:
        discovery:
          server-addr: localhost:8848 #单机版nacos的IP
management:
  endpoints:
    web:
      exposure:
        include: '*' #暴露要监控的内容

````

+ 入口类
````java
package com.ws.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * USER: wang_s
 * DATE：2020/3/22
 * DESC：
 **/
@SpringBootApplication
@EnableDiscoveryClient
public class ProviderAlibabaPayment9001 {
    public static void main(String[] args) {
        SpringApplication.run(ProviderAlibabaPayment9001.class,args);
    }
}

````

+ controller
````java
package com.ws.springcloud.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * USER: wang_s
 * DATE：2020/3/22
 * DESC：
 **/
@RestController
@Slf4j
public class NacosPaymentController {
    @Value("${server.port}")
    private String serverPort;

        @GetMapping(value = "/echo/{string}")
    public String echo(@PathVariable String string) {
        return "Hello Nacos Discovery " + string + "==>serverPort:"+serverPort;
    }
}
````

+ nacos 界面服务管理中可以查看


### Nacos 之 服务消费者注册与负载
+ 新建一个80的客户端，用于请求访问9001、9002
+ pom.xml
````xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>cloud2020</artifactId>
        <groupId>com.ws.springcloud</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-consumer-order80</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.ws.springcloud</groupId>
            <artifactId>api</artifactId>
            <version>${project.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
````

+ yml
````yml
server:
  port: 8000

spring:
  application:
    name: nacos-order
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848

#消费者将要去访问的微服务名称
server-url:
  nacos-user-service: http://nacos-provider
````

+ 入口类
```` java
package com.ws.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * USER: wang_s
 * DATE：2020/3/22
 * DESC：
 **/
@SpringBootApplication
@EnableDiscoveryClient
public class NacosOrder80 {
    public static void main(String[] args) {
        SpringApplication.run(NacosOrder80.class, args);
    }
}

````
+ RestTemplate 配置
````java
@Configuration
public class RestTemplateConfig {

    @Bean
    @LoadBalanced
    public RestTemplate getRest(){
        return new RestTemplate();
    }
}
````

+ controller
````java
@RestController
public class NacosOrderController {
    @Autowired
    private RestTemplate restTemplate;

    @Value("${server-url.nacos-user-service}")
    private String serverURL;

    @GetMapping("/order/{name}")
    public String getPayment(@PathVariable("name") String name){
        String forObject = restTemplate.getForObject(serverURL + "/echo/" + name, String.class);
        return forObject;
    }
}
````

+ 访问验证调用是以及负载均衡否成功


### Nacos   之 服务配置中心

####  3377配置中心
+ 新增一个3377的配置中心Module

+ pom.xml
````xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>cloud2020</artifactId>
        <groupId>com.ws.springcloud</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-config-nacos3377</artifactId>
    <dependencies>
        <dependency>
            <groupId>com.ws.springcloud</groupId>
            <artifactId>api</artifactId>
            <version>${project.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
````

+ 新增bootstrap.yml 和 application.yml (bootstrap 启动优先级高，先加载)
  - bootstrap
````yml
  server:
  port: 3377

spring:
  application:
    name: nacos-config
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
      config:
        server-addr: localhost:8848
        file-extension: yaml


# nacos的文件格式 ${prefix}-${spring.profile.active}.${file-extension}
# prefix -> spring.application.name | spring.profile.active 环境 | 格式 yml properties

# nacos-config-dev.yaml
````
- application
````yml
  spring:
  profiles:
    active: dev

````
+ 入口类
````java
@SpringBootApplication
@EnableDiscoveryClient
public class ConfigNacos3377 {
    public static void main(String[] args) {
        SpringApplication.run(ConfigNacos3377.class,args);
    }
}
````

+ controller
````java
@RestController
@RefreshScope //刷新配置中心
public class NacosConfigController {
    @Value("${config.info}")//config.info是配置中心中yml中定义的
    private String configInfo;


    @GetMapping(value = "/nacos/config")
    public String getConfig(){
        return configInfo;
    }
}   
````
+ 在`localhost:8848/nacos`配置中心中增加 `nacos-config-dev.yaml` 添加config.info的值

+ `localhost:3377/nacos/config` 获取值

### Nacos 集群、持久化配置

####   Nacos 架构图
<img :src="$withBase('/springcloud/7.png')" alt="dock">

+ 默认的Nacos使用的是嵌入式数据库实现数据的存储，所以如果启动多个Nacos集群，存储的数据存在一致性的问题，为了解决这个问题，  Nacos采用了**集中式存储方式来支持集群化配置，目前只支持mysql**

+ Nacos支持三种部署模式
  - 单机模式-用于测试和单机试用
  - 集群模式-用于生产，确保高可用
  - 多集群模式-用于多数据中心场景
  
  #### Nacos集群以及持久配置 
  + 单机集群配置可参照文档`https://nacos.io/zh-cn/docs/deployment.html`
  
  + 需要1个Nginx、3个Nacos注册中心、1个MySQL数据库

#### 集群配置步骤
##### **MySQL 表初始化**
- 执行mysql脚本`nacos/conf/nacos-mysql.sql`到数据库nocos_config中

- vim修改`nacos/conf/application.properties`，增加mysql连接信息
````sh
spring.datasource.platform=mysql

db.num=1
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config?useUnicode=true&characterEncoding=utf-8&useSSL=false
db.user=root
db.password=root

```` 
##### **Nacos 配置修改**
  - vim拷贝`nacos/conf/cluster.conf.example`为`nacos/conf/cluster.conf`，修改
````sh
# 获取nacos所在机器的IP，然后制定三个不同的端口号
# 用ip add 查看ip,不能用127.0.0.1
ip:3333
ip:4444
ip:5555
````  
  - vim 修改`startup.sh`
````sh
#":m:f:s:p:"中p:新加的代表port
#p)
#           PORT=$OPTARE;; 新加的
while getopts ":m:f:s:p:" opt
do
    case $opt in
        m)
            MODE=$OPTARG;;
        f)
            FUNCTION_MODE=$OPTARG;;
        s)
            SERVER=$OPTARG;;
        p)
            PORT=$OPTARE;;
        ?)
        echo "Unknown parameter"
        exit 1;;
    esac
done

# -Dserver.port=${PORT} 新加的
nohup $JAVA -Dserver.port=${PORT} ${JAVA_OPT} nacos.nacos >> ${BASE_DIR}/logs/start.out 2>&1 &

````  
+ 启动三个端口Nacos
````sh
# bin目录下启动
bash -f ./startup.sh -p 3333
bash -f ./startup.sh -p 4444
bash -f ./startup.sh -p 5555

````
+ 查看启动情况
````sh
ps -ef|grep nacos|grep -v grep |wc -l
````

  ##### **Nginx配置**
    - 修改nginx下`conf/nginx.conf`  
 ````sh
 #新加
 upstream cluster {
        server 127.0.0.1:3333
        server 127.0.0.1:4444
        server 127.0.0.1:5555
        }
    server {
        listen       1111; #改为111
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
             proxy_pass http://cluster #新加
           # root   html;
        }
 ````     






