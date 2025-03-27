import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({


  title: 'GEN',
  description: '积跬步。',

  theme: defaultTheme({
    logo: 'https://vuejs.press/images/hero.png',

    navbar: [
      { text: '主页', link: '/' },
      { text: 'vuepress', link: '/nav/vuepress' },
      {
        text: '杂',
        children: [
          { text: 'GIT命令', link: '/knowledge/git' },
          { text: 'python+django', link: '/knowledge/django' },
          { text: 'vue cli搭建项目', link: '/knowledge/vuecli' },
          { text: 'babel es6转换es5', link: '/knowledge/es6Trnsferes5' },
          { text: 'docker aliyun配置', link: '/build/dockerAliyun' },
          { text: 'npm 配置', link: '/knowledge/npm' },
          { text: 'linux 常用命令', link: '/knowledge/linux' },
          { text: 'Ubuntu 下Linux 命令', link: '/knowledge/ubuntu' },
        ]
      },
      {
        text: 'link',
        children: [
          { text: 'github', link: 'https://github.com/lidagen' },
          { text: 'gitee', link: 'https://gitee.com/GENDALI' },
          { text: 'csdn', link: 'https://blog.csdn.net/ws346348183' },
          { text: '关于我', link: '/knowledge/aboutMe' },

        ]
      }
    ],
    sidebar: [
      {
        text: "java基础",
        collapsible: true,
        children: [
          { text: 'JDK8 函数式编程', link: '/collection/' },
          { text: 'JDK8 新特性之Date-Time', link: '/collection/time' },
          { link: '/collection/ServletSourceCode', text: 'Servlet 源码分析' },
          { link: '/collection/ArrayList', text: 'ArrayList 源码' },
          { link: '/collection/LinkedList', text: 'LinkedList 源码' },
          { link: '/collection/HashMap', text: 'HashMap 源码' },
          { link: '/collection/String', text: 'String 源码' },
          { link: '/collection/BigDecimal', text: 'BigDecimal 源码' },
          { link: '/collection/classloader', text: 'java 类的加载' },
          { link: '/collection/reflect', text: 'Class 源码' },
          { link: '/collection/SynchronizedLock', text: 'Synchronized锁升级' },
          { link: '/collection/Propagation', text: '事务的传播机制' },
          { link: '/knowledge/0421go', text: 'knowledge' },
        ]

      },
      {
        text: 'JAVA WEB',
        collapsible: true, // 可折叠
        children: [
          { text: 'Java Servlet', link: '/javaweb/servlet' },
          { text: '权限设计', link: '/javaweb/权限设计' },
          { text: 'logback日志的链路追踪', link: '/javaweb/logback' },

        ]
      },
      {
        text: 'DATABASE',
        collapsible: true, // 可折叠
        children: [
          { link: '/mysql/explain', text: 'MySQL EXPLAIN详解' },
          { link: '/mysql/mysqlIndex', text: 'MySQL 索引' },
          { link: '/mysql/mysqlLock', text: 'MySQL 表锁、行锁' },
          { link: '/mysql/transcation', text: 'MySQL ACID与transcation' },
          { link: '/mysql/dis_transcation', text: '分布式事务' },
          { link: '/mysql/mvcc', text: 'MySQL MVCC机制' },
          { link: '/mysql/lock', text: 'Mysql 乐观锁与悲观锁' },
          { link: '/mysql/数据库分布式锁', text: '分布式锁1 数据库分布式锁' },
          { link: '/mysql/Redis分布式锁', text: '分布式锁2 Redis分布式锁' },
          { link: '/mysql/ZK分布式锁', text: '分布式锁3 ZK分布式锁' },
        ]
      },
      {
        text: 'SpringCloud',
        collapsible: true, // 可折叠
        children: [
          { link: '/spring/springcloud1', text: 'SpringCloud服务注册中心之Eureka' },
          { link: '/spring/springcloud2', text: 'SpringCloud服务注册中心之Zookeeper' },
          { link: '/spring/springcloud3', text: 'SpringCloud服务调用之Ribbon' },
          { link: '/spring/springcloud4', text: 'SpringCloud服务调用之OpenFeign' },
          { link: '/spring/springcloud5', text: 'SpringCloud服务降级之Hystrix' },
          { link: '/spring/springcloud6', text: 'SpringCloud服务网关之Gateway' },
          { link: '/spring/springcloud7', text: 'SpringCloud Config分布式配置中心' },
          { link: '/spring/springcloud8', text: 'SpringCloud服务总线之Bus' },
          { link: '/spring/springcloud9', text: 'SpringCloud消息驱动之Stream' },
          { link: '/spring/springcloud10', text: 'SpringCloud链路追踪之Sleuth' },
          { link: '/spring/springAlibaba1', text: 'SpringCloud Alibaba Nacos' },
          { link: '/spring/springAlibaba2', text: 'SpringCloud Alibaba Sentinel' },
        ]
      },
      {
        text: 'Spring',
        collapsible: true, // 可折叠
        children: [
          { link: '/spring/springSource/springBoot', text: 'SpringBoot' },
          { link: '/spring/springDataJpa', text: 'Spring-data-jpa入门' },
          { link: '/spring/springcloudms', text: 'SpringCloud问题' },
          { link: '/spring/dispatcherServlet', text: 'dispatcherServlet 源码分析' },
          { link: '/spring/springBootApplication', text: '@SpringBootApplication注解内部实现与原理' },
          { link: '/spring/springInit', text: 'spring启动初始化初始化' },

        ]
      },
      {
        text: '中间件',
        collapsible: true, // 可折叠
        children: [
          { link: '/middleware/zookeeper', text: '分布式协调服务器Zookeeper' },
          { link: '/middleware/dubbo', text: '服务治理Dubbo' },
          { link: '/middleware/apollo', text: '分布式配置管理平台Apollo' },
          { link: '/middleware/kafka', text: '消息中间件框架Kafka' },
          { link: '/elk/elasticJob', text: '分布式调度平台ElasticJob' },
          { link: '/elk/kibana', text: '可视化分析工具Kibana' },
          { link: '/elk/es0', text: 'ElacticSearch 基础' },
          { link: '/elk/es1', text: 'ElacticSearch进阶' },
          { link: '/elk/es2', text: 'ElacticSearch集成' },
        ]
      },
      {
        text: "环境部署",
        collapsible: true,
        children: [
          { link: '/build/docker', text: '应用容器引擎Docker' },
          { link: '/build/dockerCompose', text: 'DockerCompose服务编排' },
          { link: '/build/nginx', text: '负载均衡Nginx' },
          { link: '/build/nginx1', text: 'Nginx的安装配置' },
          { link: '/k8s/k8s基础', text: 'K8S基础' },
        ]
      },
      {
        text: '代码片段',
        collapsible: true, // 可折叠
        children: [
          { link: '/mode/listener', text: 'listener 监听模式' },
          { link: '/mode/springbootRedis', text: 'spingboot 整合redis' },
          { link: '/mode/xss', text: 'XSS过滤' },
          { link: '/mode/profile', text: 'profile的使用' },
          { link: '/mode/configurationProperties', text: 'ConfigurationProperties注解' },

        ]
      },
      {
        text: '设计模式',
        collapsible: true, // 可折叠
        children: [

          { link: '/design/factory', text: '工厂模式' },
          { link: '/design/singleton', text: '单例模式' },
          { link: '/design/decorator', text: '装饰者模式' },
          { link: '/design/adapter', text: '适配器模式' },
          { link: '/design/template', text: '模板方法模式' },
          { link: '/design/observer', text: '观察者模式' },

        ]
      },
      {
        text: '读书笔记',
        collapsible: true, // 可折叠
        children: [
          { link: '/book/springInAction', text: '《Spring in Action 4》 读书笔记' },
          { link: '/knowledge/高性能MYSQL', text: '《高性能mysql》 读书笔记' },
        ]
      },
      {
        text: 'NoSQL',
        collapsible: true, // 可折叠
        children: [
          { link: '/nosql/redis1', text: 'Redis基础 ' },
          { link: '/nosql/redis2', text: 'Redis高级' },
          { link: '/nosql/redis3', text: 'Redis集群' },
          { link: '/nosql/redis4', text: 'Redis应用' },
        ]
      },
      {
        text: 'MQ',
        collapsible: true, // 可折叠
        children: [
          { link: '/rabbitmq/rb1', text: 'rabbitMQ基础' },
          { link: '/rabbitmq/rb2', text: 'rabbitMQ高级' },
          { link: '/rabbitmq/rb3', text: 'rabbitMQ集群' },
        ]
      },
      {
        text: 'JVM',
        collapsible: true, // 可折叠
        children: [
          { link: '/jvm/jvm1', text: 'JVM体系架构概述 ' },
          { link: '/jvm/jvm2', text: '堆参数调整' },
          { link: '/jvm/jvm3', text: 'GC 分代收集算法' },
          { link: '/jvm/jvm5', text: 'JVM 垃圾回收器' },
          { link: '/jvm/jvm4', text: 'JVM 相关问题' },
        ]
      },
      {
        text: 'JUC',
        collapsible: true, // 可折叠
        children: [
          { link: '/juc/juc', text: 'JUC总览' },
          { link: '/juc/volatile', text: 'volatile关键字' },
          { link: '/juc/CAS', text: 'CAS' },
          { link: '/juc/aba', text: 'ABA问题' },
          { link: '/juc/collections', text: 'collections包下线程安全的集合类' },
          { link: '/juc/lock', text: 'Lock 锁' },
          { link: '/juc/lockSupport', text: 'LockSupport' },
          { link: '/juc/AQS', text: 'AQS' },
          { link: '/juc/fork', text: 'Fork/Join分支框架' },
          { link: '/juc/tool', text: 'JUC tools' },
          { link: '/juc/blockingQueue', text: 'BlockingQueue 阻塞队列' },
          { link: '/juc/executor', text: 'Executor 线程池' },
          { link: '/juc/completableFuture', text: 'CompletableFuture' },
          { link: '/juc/deadLock', text: '死锁以及问题定位分析' },
        ]
      },
      {
        text: 'Shell',
        collapsible: true,
        children: [
          { link: 'shell/shell', text: 'shell命令' },
          { link: 'shell/shell1', text: 'shell基础' },

        ]
      },
      {
        text: 'Activiti',
        collapsible: true,
        children: [
          { link: '/activiti/act1', text: 'IDEA下的Activiti HelloWord' },
          { link: '/activiti/actDB', text: '流程定义的CRUD' },
          { link: '/activiti/actControl', text: '流程实例的执行' },
          { link: '/activiti/actVariable', text: '流程变量' },
        ]
      },
      {
        text: 'VUE', // 侧边栏名称
        collapsible: true, // 可折叠
        children: [
          { link: '/guide/base', text: 'vue基础' },
          { link: '/guide/vuerouter', text: 'vue router' },
          { link: '/guide/vuex', text: 'Vuex' },
          { link: '/guide/axios', text: 'Axios 跨域' },
          { link: '/guide/vue/vue1', text: 'dialog 弹出框使用' },// 你的md文件地址,后一个为标题
          { link: '/guide/vue/vue2', text: 'vue 动态刷新页面' },
          { link: '/guide/vue/vue3', text: 'vue 封装分页组件' },
          { link: '/guide/vue/vue4', text: 'vue 动态菜单' },
          { link: '/guide/vue/byValue', text: 'vue 常用传值' },
        ]
      },
      {
        text: 'Solidity 智能合约',
        collapsible: true,
        children: [
          { link: '/solidity/solidity_foundation', text: 'Solidity 基础' },
        ]
      }

    ]
  }),

  bundler: viteBundler(),
})
