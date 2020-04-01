module.exports = {
    title: 'GENDALI',
    description: '积跬步。',
    head: [
        ['link', { rel: 'icon', href: `/favicon.ico` }]// 增加一个自定义的 favicon(网页标签的图标)
      ],
    base: '/lidagen.github.io/',
    plugins: [
        [
            '@vuepress/register-components',
            {
                componentsDir: './components'
            }
        ]
    ],
    themeConfig: {
        logo: '/img/1.jpg',
        sidebarDepth: 2,
       // lastUpdated: 'Last Updated',
        nav:[
            { text: '主页', link: '/' }, // 导航条
            { text: 'vuepress', link: '/nav/vuepress' },
            { text: '杂',
            items:[
                {text:'GIT命令',  link: '/knowledge/git'},
                {text:'python+django',  link: '/knowledge/django'},
                {text:'vue cli搭建项目',  link: '/knowledge/vuecli'},
                {text:'babel es6转换es5',  link: '/knowledge/es6Trnsferes5'},
                {text:'npm 配置',  link: '/knowledge/npm'},
                {text:'linux 常用命令',  link: '/knowledge/linux'},
                {text:'Ubuntu 下Linux 命令',  link: '/knowledge/ubuntu'},
            ]
             },
            { text: 'link',        // 这里是下拉列表展现形式。
              items: [
                { text: 'github', link: 'https://github.com/lidagen' },
                { text: 'gitee', link: 'https://gitee.com/GENDALI' },
                { text: 'csdn', link: 'https://blog.csdn.net/ws346348183' },
                {text:'关于我',  link: '/knowledge/aboutMe'},
              ]
            }
        ],
        sidebar: [
           
            {
                title:'JAVA基础',
                collapsable: true, // 可折叠
                children:[
                    ['/collection/','JDK8 函数式编程'],
                    ['/collection/time','JDK8 新特性之Date-Time'],
                    ['/collection/ServletSourceCode','Servlet 源码分析'],
                    ['/collection/ArrayList','ArrayList 源码'],
                    ['/collection/LinkedList','LinkedList 源码'],
                    ['/collection/HashMap','HashMap 源码'],
                    ['/collection/String','String 源码'],
                    ['/collection/BigDecimal','BigDecimal 源码'],
                    ['/collection/classloader','java 类的加载'],
                    ['/collection/reflect','Class 源码'],
                    ['/collection/CAS','CAS'],
                   
                ]
            },
            {
                title:'JAVA WEB',
                collapsable: true, // 可折叠
                children:[
                    ['/javaweb/servlet','Java Servlet'],
                    ['/javaweb/权限设计','权限设计'],
                    ['/javaweb/logback','logback日志的链路追踪'],
                    
                ]
            },
            {
                title:'DATABASE',
                collapsable: true, // 可折叠
                children: [ 
                    ['/mysql/explain', 'MySQL EXPLAIN详解'], 
                    ['/mysql/mysqlIndex', 'MySQL 索引'], 
                    ['/mysql/mysqlLock', 'MySQL 表锁、行锁'], 
                    ['/mysql/transcation', 'MySQL ACID与transcation'], 
                    ['/mysql/mvcc', 'MySQL MVCC机制'], 
                    ['/mysql/lock', 'Mysql 乐观锁与悲观锁'],
                    ['/mysql/数据库分布式锁', '分布式锁1 数据库分布式锁'],
                    ['/mysql/Redis分布式锁', '分布式锁2 Redis分布式锁'],
                    ['/mysql/ZK分布式锁', '分布式锁3 ZK分布式锁'],
                    
                ]
            },
            {
                title:'Spring',
                collapsable: true, // 可折叠
                children:[
                    ['/spring/springcloud1','SpringCloud服务注册中心之Eureka'],
                    ['/spring/springcloud2','SpringCloud服务注册中心之Zookeeper'],
                    ['/spring/springcloud3','SpringCloud服务调用之Ribbon'],
                    ['/spring/springcloud4','SpringCloud服务调用之OpenFeign'],
                    ['/spring/springcloud5','SpringCloud服务降级之Hystrix'],
                    ['/spring/springcloud6','SpringCloud服务网关之Gateway'],
                    ['/spring/springcloud7','SpringCloud Config分布式配置中心'],
                    ['/spring/springcloud8','SpringCloud服务总线之Bus'],
                    ['/spring/springcloud9','SpringCloud消息驱动之Stream'],
                    ['/spring/springcloud10','SpringCloud链路追踪之Sleuth'],
                    ['/spring/springAlibaba1','SpringCloud Alibaba Nacos'],
                    ['/spring/springAlibaba2','SpringCloud Alibaba Sentinel'],
                    ['/spring/springcloudms','SpringCloud面试题'],
                    ['/spring/dispatcherServlet','dispatcherServlet 源码分析'],
                ]
            },
            {
                title:'中间件',
                collapsable: true, // 可折叠
                children:[
                    ['/middleware/zookeeper','分布式协调服务器Zookeeper'],
                    ['/middleware/dubbo','服务治理Dubbo'],
                    ['/middleware/elasticJob','分布式调度平台ElasticJob'],
                    ['/middleware/apollo','分布式配置管理平台Apollo'],
                    ['/middleware/kafka','消息中间件框架Kafka'],
                ]
            },
            {
                title:"环境部署",
                classloader:true,
                children:[
                    ['/build/docker','应用容器引擎Docker'],
                    ['/build/dockerCompose','DockerCompose服务编排'],
                    ['/build/nginx','负载均衡Nginx'],
                    ['/build/nginx1','Nginx的安装配置'],
                ]
            },
            {
                title:'代码片段',
                collapsable: true, // 可折叠
                children:[
                    ['/mode/listener','listener 监听模式'],
                    ['/mode/springbootRedis','spingboot 整合redis'],
                    ['/mode/xss','XSS过滤'],
                    ['/mode/profile','profile的使用'],
                
                ]
            },
            {
                title:'设计模式',
                collapsable: true, // 可折叠
                children:[
                   
                    ['/design/factory','工厂模式'],
                    ['/design/singleton','单例模式'],
                    ['/design/decorator','装饰者模式'],
                    ['/design/adapter','适配器模式'],
                    ['/design/template','模板方法模式'],
                  
                ]
            },
            {
                title:'杂',
                collapsable: true, // 可折叠
                children:[
                    ['/book/springInAction','《Spring in Action 4》 读书笔记'],
                    ['/book/heapStackMethod','堆、栈、方法区'],
                    ['/knowledge/高性能MYSQL', '《高性能mysql》 读书笔记'],
                    ['/knowledge/MySQL与InnoDB', '《MYSQL内幕技术与InnoDB存储引擎》 读书笔记'],
                ]
            },
             {
                title: 'VUE', // 侧边栏名称
                collapsable: true, // 可折叠
                children: [
                ['/guide/base', 'vue基础'],
                ['/guide/vuerouter', 'vue router'],
                ['/guide/vuex', 'Vuex'],
                ['/guide/axios', 'Axios 跨域'],
                ['/guide/vue/vue1', 'dialog 弹出框使用'],// 你的md文件地址,后一个为标题
                ['/guide/vue/vue2', 'vue 动态刷新页面'],
                ['/guide/vue/vue3', 'vue 封装分页组件'],
                ['/guide/vue/vue4', 'vue 动态菜单'],
                ['/guide/vue/byValue', 'vue 常用传值'],
               
                ]
            },
            {
                title:'REDIS',
                collapsable: true, // 可折叠
                children:[
                    ['/nosql/redis1', 'Redis基础 '],
                    ['/nosql/redis2', 'Redis高级'],
                    ['/nosql/redis3', 'Redis应用'],
                ]
            },
            {
                title:'JUC',
                collapsable: true, // 可折叠
                children:[
                    ['/juc/volatile', 'Valatile关键字'],
                ]
            },
            {
                title:'Activiti',
                collapsable: true,
                children:[
                    ['/activiti/act1','IDEA下的Activiti HelloWord'],
                    ['/activiti/actDB','流程定义的CRUD'],
                    ['/activiti/actControl','流程实例的执行'],
                    ['/activiti/actVariable','流程变量'],
                ] 
            },
        ]
    }
}
