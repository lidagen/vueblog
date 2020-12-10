## Spring启动初始化数据
+ 我们用 springboot 搭建项目的时候，有时候会碰到在项目启动时初始化一些操作的需求 ，针对这种需求 spring boot为我们提供了以下几种方案供我们选择:
  - ApplicationRunner 与 CommandLineRunner 接口
  - InitializingBean 接口
  - @PostConstruct 注解

### ApplicationRunner与 CommandLineRunner
+ 我们可以实现 ApplicationRunner 或 CommandLineRunner 接口， 这两个接口工作方式相同，都只提供单一的run方法，该方法在SpringApplication.run(…)完成之前调用
````java
@Component
@Log4j2
@Order(1)
public class MethodApplicationRunner  implements ApplicationRunner {
    @Autowired
    private RequestMappingHandlerMapping requestMappingHandlerMapping;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("MethodApplicationRunner execute ................args:{}", args);
        Map<RequestMappingInfo, HandlerMethod> map = requestMappingHandlerMapping.getHandlerMethods();
        if (map == null || map.isEmpty()) {
            return;
        }

        Map<String, List<String>> methodsMap = map.keySet().stream().filter(requestMappingInfo -> requestMappingInfo.getPatternsCondition() != null &&
                !CollectionUtils.isEmpty(requestMappingInfo.getPatternsCondition().getPatterns()) &&
                requestMappingInfo.getPatternsCondition().getPatterns().stream().findFirst().isPresent())
                .distinct().collect(Collectors.toMap(
                        requestMappingInfo -> requestMappingInfo.getPatternsCondition().getPatterns().stream().findFirst().get(),
                        requestMappingInfo -> requestMappingInfo.getMethodsCondition().getMethods().stream().map(RequestMethod::name).collect(toList()),
                        (v1, v2) -> v2
                ));
        log.info("collector url and method is:{}", JSONObject.toJSONString(methodsMap));
    }
}
````

+ 对于这两个接口而言，我们可以通过Order注解或者使用Ordered接口来指定调用顺序， @Order() 中的值越小，优先级越高,Order值相同ApplicationRunner的实现优先执行

### InitializingBean
+ 在spring初始化bean的时候，如果bean实现了 InitializingBean 接口，在对象的所有属性被初始化后之后才会调用afterPropertiesSet()方法
````java
@Component
@Slf4j
public class SpringInitializing implements InitializingBean {

    @Override
    public void afterPropertiesSet() throws Exception {
       //todo something
    }
}
````
+ spring初始化bean肯定会在 ApplicationRunner和CommandLineRunner接口调用之前。

### @PostConstruct
````java
@Component
@Slf4j
public class PostConstructBean {
  
    @PostConstruct
    private void init() {
        //todo something
    }
}
````
+ @PostConstruct会在实现 InitializingBean 接口的afterPropertiesSet()方法之前执行


