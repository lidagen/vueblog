## 监听模式

### 概述
+ 监听者模式：触发某种行为，执行相应的动作。

+ 监听器模式有三个要素--事件源、事件对象、监听器
  - 事件源：事件发生的源头，属于被监听的对象
  - 监听对象：事件对象是用来包装事件源的
  - 监听器：监听模式的核心，定义事件发生后的动作 

+ 事件监听器方法参数是事件对象，事件对象包含事件源的引用，在方法中可以获取事件源的引用  

### 三要素代码
````java
/**
 * 〈事件对象〉
 */
public class Event {
    /**
     * 事件主题
     */
    private String topic;
    /**
     * 事件源
     */
    private Object source;

    public Event(String topic, Object source) {
        this.topic = topic;
        this.source = source;
    }

    public String getTopic() {
        return topic;
    }

    public Object getSource() {
        return source;
    }
}
````
````java
/**
 * 〈事件监听器〉<br> 
 * 〈要关心的监听处理器需要实现该类〉
 */
public interface EventListener {

    /**
     * 
     * 功能描述: <br>
     * 〈事件处理〉
     */
    void handle(Event event);
}
````
+ 代码中，`Event`对象就是**事件对象**，其中封装了**事件源** `source`.

+ `EventListener` 接口是**监听器**，它的参数是事件对象。

### 完整代码

+ 监听三要素已罗列，现在罗列其它类以及配置

#### 事件引擎

+ **事件引擎**是执行把事件对象push给**监听器**的媒介
````java
//接口
public interface EventEngine {
    /**
     * 
     * 功能描述: <br>
     * 〈事件发布〉
     *
     * @param event
     * @see [相关类/方法](可选)
     * @since [产品/模块版本](可选)
     */
     void publishEvent(Event event);
    
}
````
````java
//实现
public class EventEngineImp implements EventEngine,InitializingBean {
    private static final Map<String, List<SubscribeRule>> EVENT_RULE_MAP = new HashMap<>();
    /**
     * 规则列表
     */
    protected List<SubscribeRule> listEventRule;

    @Override
    public void publishEvent(Event event) {
        List<SubscribeRule> eventRule = EVENT_RULE_MAP.get(event.getTopic());
        if (null == eventRule) {
            throw new RuntimeException("9999");
        }
        for (SubscribeRule subcribeRule : eventRule) {
            subcribeRule.getEventListener().handle(event);
        }

    }
    @Override
    public void afterPropertiesSet() {
        for (SubscribeRule eventRule : listEventRule) {
            String topic = eventRule.getTopic();
            List<SubscribeRule> listRule = EVENT_RULE_MAP.get(topic);
            if (null == listRule) {
                listRule = new ArrayList<>();
                EVENT_RULE_MAP.put(topic, listRule);
            }
            listRule.add(eventRule);
        }
    }

    public void setListEventRule(List<SubscribeRule> listEventRule) {
        this.listEventRule = listEventRule;
    }
}
````

#### 事件规则

+ 事件规则封装了**事件对象**中的`TOPIC`和**监听器**`Listener`接口,由于找寻事件对象和监听器对应关系。
````java
public class SubscribeRule {
    /**
     * 主题
     */
    private String topic;
    /**
     * 事件监听器
     */
    private EventListener eventListener;
    
    public String getTopic() {
        return topic;
    }
    
    public void setTopic(String topic) {
        this.topic = topic;
    }

    public EventListener getEventListener() {
        return eventListener;
    }

    public void setEventListener(EventListener eventListener) {
        this.eventListener = eventListener;
    }
}
````

#### 配置

+ 配置的目的是加载不同的监听实现，然后封装`SubscribeRule` 到**事件引擎**的规则列表中，发布事件后，根据`TOPIC`找寻对应的**监听器**

+ 这里模拟了两个监听器的实现，`AppleListener`、`OrangeListener`,实现了`EventListener`接口
````java
@Component("appleListener")
public class AppleListener implements EventListener {
    @Override
    public void handle(Event event) {
        String source =(String) event.getSource();
        System.out.println(source);
    }
}
````
````java
@Component("appleListener")
public class AppleListener implements EventListener {
    @Override
    public void handle(Event event) {
        String source =(String) event.getSource();
        System.out.println(source);
    }
}
````
+ 配置中，把这两个listener对象封装进`SubscribeRule`中,并设置对应的`TOPIC`

+ 把`SubscribeRule`封装List放入`EventEngineImp`中规则列表
````java
@Configuration
public class ListenerConfig {
    Logger log = LoggerFactory.getLogger(ListenerConfig.class);

    @Bean
    public EventEngineImp publish(){
        log.info("=================publish load==================");
        EventEngineImp eventEngineImp = new EventEngineImp();
        eventEngineImp.setListEventRule(Arrays.asList(getApple(),getOrange()));
        return eventEngineImp;
    }

    @Bean
    public SubscribeRule getApple(){
        SubscribeRule subscribeRule = new SubscribeRule();
        subscribeRule.setTopic("APPLE");
        subscribeRule.setEventListener(new AppleListener());
        return subscribeRule;
    }

    @Bean
    public SubscribeRule getOrange(){
        SubscribeRule subscribeRule = new SubscribeRule();
        subscribeRule.setTopic("ORANGE");
        subscribeRule.setEventListener(new OrangeListener());
        return subscribeRule;
    }
}
````

#### 运用
````java
//注入事件引擎
@Autowired
private EventEngine eventEngine;

@RequestMapping(value = "/")
public String index(HttpServletRequest request) {
    LOG.info("<===============start");
    //发布事件,topic为APPLE source 为字符串123
    eventEngine.publishEvent(new Event("APPLE","123"));
    LOG.info("<===============end");
    return "index";
}
````

### 总结
+ 监听器的好处是解耦，调用方跟接收方没有直接交互，只需要事件引擎设置topic，找寻对应的listener。

+ 在聚合项目中尤其实用，假设项目中有A\B\C三个模块，C依赖A和B，但是A和B直接相互没有依赖关系，这时候A和B直接是无法直接交互的，可以通过监听器的代码，实现A B之间相互调用.

