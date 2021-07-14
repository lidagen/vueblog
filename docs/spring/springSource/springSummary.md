## Spring概述
### Spring是什么
+ spring是一个框架，在我们的开发中，所有的框架基本都依赖于spring,spring帮我们起到一个ioc容器的作用，用来承载我们的所有bean对象，它帮我们管理bean从创建到销毁的整个生命周期管理
+ 我们在使用spring的时候，可以通过使用配置文件或者注解方式进行实现，当程序启动了以后，我们会把哪些注解或者配置文件定义的bean转换成BeanDefinition,完成整个BeanDefinition解析和加载过程，在获取这些完整对象的时候会对BeanDefinition实例化操作，实例化最常用的方式是通过反射创建对象。
+ 创建对象，只是在堆里开辟了空间，后面还会实现awre接口、初始化方法操作、执行PostProcessor实现一些AOP的方法，当我们创建对象完成以后，对象就可以直接调用了。


<img :src="$withBase('/springcloud/spring.png')" alt="dock">
