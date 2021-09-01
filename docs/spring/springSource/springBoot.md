## SpringBoot 

### 启动流程
#### SpringBoot主启动类启动流程 

<img :src="$withBase('/springcloud/spe1.png')" alt="dock">

+ 1.调用SpringApplication.run()方法，构造一个spring应用
+ 2.会在构造方法中初始化一些模块
  - 配置source
  - 配置环境是否为WEB环境
  - 加载初始化器
  - 加载监听器
  - 设置程序运行主类
+ 3.其中的`加载初始化器`和`加载监听器`会调用 **getSpringFactoriesInstances()** 方法，根据传入类的集合，通过类加载器读取spring.factory文件获取类全限定名，反射实例化对象
+ 4.执行run()方法，启动应用，里面进行了一系列操作
  - 启动应用计时器
  - 启动应用监听器模块   
  - 配置环境模块environment
  - 配置Banner打印
  - 配置应用上下文
  - 准备上下文环境
    + 监听配置
    + 设置环境变量
    + 初始化操作
    + load对应资源
  - 调用refresh()方法
    + 自动装配
    + tocat配置   


##### refresh()方法
+ AbstractApplicationContext.refresh() 方法
  - AbstractApplicationContext.refresh() 在上图中，走的是第9步refresh 
````java
public void refresh() throws BeansException, IllegalStateException {
    synchronized(this.startupShutdownMonitor) {
        StartupStep contextRefresh = this.applicationStartup.start("spring.context.refresh");
        this.prepareRefresh();
        //获取当前工厂对象
        ConfigurableListableBeanFactory beanFactory = this.obtainFreshBeanFactory();
        //设置工厂属性操作
        this.prepareBeanFactory(beanFactory);

        try {
            //设置属性值
            this.postProcessBeanFactory(beanFactory);
            StartupStep beanPostProcess = this.applicationStartup.start("spring.context.beans.post-process");
            //*BeanFactoryPostProcessor操作,修改bean定义信息
            this.invokeBeanFactoryPostProcessors(beanFactory);
            this.registerBeanPostProcessors(beanFactory);
            beanPostProcess.end();
            this.initMessageSource();
            this.initApplicationEventMulticaster();
            this.onRefresh();
            this.registerListeners();
            this.finishBeanFactoryInitialization(beanFactory);
            this.finishRefresh();
        } catch (BeansException var10) {
            if (this.logger.isWarnEnabled()) {
                this.logger.warn("Exception encountered during context initialization - cancelling refresh attempt: " + var10);
            }

            this.destroyBeans();
            this.cancelRefresh(var10);
            throw var10;
        } finally {
            this.resetCommonCaches();
            contextRefresh.end();
        }

    }
}   
````



### 自动装配  

<img :src="$withBase('/springcloud/spr.png')" alt="dock">

::: tip
+ BeanFactory 和 FactoryBean
  - BeanFactory:负责生产和管理Bean的一个工厂接口，提供一个Spring Ioc容器规范
  - FactoryBean: 一种Bean创建的一种方式，对Bean的一种扩展。对于复杂的Bean对象初始化创建使用其可封装对象的创建细节。
:::

+ 项目启动run方法时，扫描@Component往上找会找到我们主启动类@SpringBootApplication，
+ 自动装配，实质是启动类注解@EnableAutoConfiguration中的@Import注解去找AutoConfigurationImportSelector
+ 类里面会调用SpringFactoriesLoader.loadFactoryNames方法
+ 去查找META-INF目录下的spring.factorys文件，里面定义了一系列的自动装配类全限定名，之后会把这些自动装配类的bean定义，加载到BeanDefinitionMap中
+ 之后BeanFactory就会从BeanDefinition拿到自动装配的Bean信息，进行实例化
 
