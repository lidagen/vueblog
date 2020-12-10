## @SpringBootApplication 内部实现与原理
+ @SpringBootApplication是springBoot项目的核心注解，目的是开启自动配置

+ **@SpringBootApplication** 注解，其实主要由 **@ComponentScan**、**@EnableAutoConfiguration**、**@SpringBootConfiguration**组成
````java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication {
    @AliasFor(
        annotation = EnableAutoConfiguration.class
    )
    Class<?>[] exclude() default {};

    @AliasFor(
        annotation = EnableAutoConfiguration.class
    )
    String[] excludeName() default {};

    @AliasFor(
        annotation = ComponentScan.class,
        attribute = "basePackages"
    )
    String[] scanBasePackages() default {};

    @AliasFor(
        annotation = ComponentScan.class,
        attribute = "basePackageClasses"
    )
    Class<?>[] scanBasePackageClasses() default {};
}
````

### @ComponentScan
+ @ComponentScan告诉Spring 哪个packages 的用注解标识的类 会被spring自动扫描并且装入bean容器。
+ spring里有四大注解：@Service,@Repository,@Component,@Controller用来定义一个bean.@ComponentScan注解就是用来自动扫描被这些注解标识的类，最终生成ioc容器里的bean．
+ 可以通过设置@ComponentScan　basePackages，includeFilters，excludeFilters属性来动态确定自动扫描范围，类型已经不扫描的类型．
+ 默认情况下:它扫描所有类型，并且扫描范围是@ComponentScan注解所在配置类包及子包的类

### @SpringBootConfiguration
+ @SpringBootConfiguration继承自@Configuration，二者功能也一致，标注当前类是配置类，并会将当前类内声明的一个或多个以@Bean注解标记的方法的实例纳入到spring容器中，并且实例名就是方法名。

### @EnableAutoConfiguration
+ @EnableAutoConfiguration 简单概括一下就是，借助@Import的支持，收集和注册特定场景相关的bean定义。
+ 通过@Import(AutoConfigurationImportSelector.class)，借助AutoConfigurationImportSelector，@EnableAutoConfiguration可以帮助SpringBoot应用将所有符合条件的@Configuration配置都加载到当前SpringBoot创建并使用的IoC容器。
:::tip
@EnableAutoConfiguration自动配置:
+ 从classpath中搜寻所有的META-INF/spring.factories配置文件，并将其中org.springframework.boot.autoconfigure.EnableutoConfiguration对应的配置项通过反射（Java Refletion）实例化为对应的标注了@Configuration的JavaConfig形式的IoC容器配置类，然后汇总为一个并加载到IoC容器。
:::


