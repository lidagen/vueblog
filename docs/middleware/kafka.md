## Kafka-消息中间件框架运用
+ 官方文档 `http://kafka.apache.org/`

### 与springboot 2.2.2.RELEASE 整合 

#### 生产者-消费者模式
+ 下载kafka `http://kafka.apache.org/downloads`,本文选择二进制版本 `kafka-2.4.0-src.tgz (asc, sha512)`

+ 解压修改config目录下`server.properties`中的**log.dirs**日志输出位置以及配置ZK地址，默认为本地**zookeeper.connect**

+ 启动ZK后，在Kafka安装bin目录下window目录下CMD，输入`.\bin\windows\kafka-server-start.bat .\config\server.properties`启动kafka

+ 创建一个聚合项目，分别包含生产者和消费者模块，参照dubbo

+ 生产者和消费者引入同样依赖 2.2.2.RELEASE
````xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
````

#### 生产方
+ `application.properties`中配置kafka
````properties
server.port=8787

#============== kafka ===================
# 指定kafka server的地址，集群配多个，中间，逗号隔开
spring.kafka.bootstrap-servers=127.0.0.1:9092

# 写入失败时，重试次数。当leader节点失效，一个repli节点会替代成为leader节点，此时可能出现写入失败，
# 当retris为0时，produce不会重复。retirs重发，此时repli节点完全成为leader节点，不会产生消息丢失。
spring.kafka.producer.retries=0
# 每次批量发送消息的数量,produce积累到一定数据，一次发送
spring.kafka.producer.batch-size=16384
# produce积累数据一次发送，缓存大小达到buffer.memory就发送数据
spring.kafka.producer.buffer-memory=33554432

#procedure要求leader在考虑完成请求之前收到的确认数，用于控制发送记录在服务端的持久化，其值可以为如下：
#acks = 0 如果设置为零，则生产者将不会等待来自服务器的任何确认，该记录将立即添加到套接字缓冲区并视为已发送。在这种情况下，无法保证服务器已收到记录，并且重试配置将不会生效（因为客户端通常不会知道任何故障），为每条记录返回的偏移量始终设置为-1。
#acks = 1 这意味着leader会将记录写入其本地日志，但无需等待所有副本服务器的完全确认即可做出回应，在这种情况下，如果leader在确认记录后立即失败，但在将数据复制到所有的副本服务器之前，则记录将会丢失。
#acks = all 这意味着leader将等待完整的同步副本集以确认记录，这保证了只要至少一个同步副本服务器仍然存活，记录就不会丢失，这是最强有力的保证，这相当于acks = -1的设置。
#可以设置的值为：all, -1, 0, 1
spring.kafka.producer.acks=1

# 指定消息key和消息体的编解码方式
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.apache.kafka.common.serialization.StringSerializer
````

+ 创建一个发送kafka的类 KafkaUtil.java
````java
@Component
public class KafkaUtil {
    /**kafka模板依赖直接提供**/
    @Autowired
    private KafkaTemplate<String,Object> kafkaTemplate;

    public void send(String topic,String message){
        ListenableFuture<SendResult<String, Object>> future = kafkaTemplate.send(topic,message);
        RecordMetadata recordMetadata = null;
        try {
            recordMetadata = future.get().getRecordMetadata();
        } catch (InterruptedException| ExecutionException e) {
            e.printStackTrace();
            System.out.println("发送失败");
        }
        System.out.println("发送成功");
        System.out.println("partition:"+recordMetadata.partition());
        System.out.println("offset:"+recordMetadata.offset());
        System.out.println("topic:"+recordMetadata.topic());
    }
}
````

+ 创建一个controller用于测试
````java
@RestController
public class KafkaController {
    @Autowired
    private KafkaUtil kafkaUtil;

    @GetMapping("/message/send")
    public boolean send(String message){
        kafkaUtil.send("testTopic",message);
        return Boolean.TRUE;
    }
    
}
````

#### 消费方

+ `application.properties`中配置kafka
````properties
server.port=7878
#=============== consumer  =======================
spring.kafka.bootstrap-servers=127.0.0.1:9092
# 指定默认消费者group id --> 由于在kafka中，同一组中的consumer不会读取到同一个消息，依靠groud.id设置组名
spring.kafka.consumer.group-id=testGroup
# smallest和largest才有效，如果smallest重新0开始读取，如果是largest从logfile的offset读取。一般情况下我们都是设置smallest
spring.kafka.consumer.auto-offset-reset=earliest
# enable.auto.commit:true --> 设置自动提交offset
spring.kafka.consumer.enable-auto-commit=true
#如果'enable.auto.commit'为true，则消费者偏移自动提交给Kafka的频率（以毫秒为单位），默认值为5000。
spring.kafka.consumer.auto-commit-interval=100

# 指定消息key和消息体的编解码方式
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer
````

+ listener监听
````java
@Component
public class ConsumerListener {

    @KafkaListener(topics = {"testTopic"})
    public void onMessage(String message){
        System.out.println(message);
    }

}
````

**到这里简单demo完成**

#### 测试
+ 启动一个生产方和两个消费方

+ 浏览器中输入 `http://localhost:8787/message/send/?message=hello`

+ 查看消费方只有一台控制台打印出hello

#### 组订阅模式

+ 在上述基础上，Consumer增加config配置类
````java
public class kafkatemplateConfig {
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id}")
    private String groupId;

    @Bean
    public KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<String, String>> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<String, String>();
        factory.setConsumerFactory(consumerFactory1());
        factory.setConcurrency(4);
        factory.getContainerProperties().setPollTimeout(4000);
        return factory;
    }


    public Map<String, Object> getCommonPropertis() {
        Map<String, Object> properties = new HashMap<String, Object>();
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        properties.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        properties.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "100");
        properties.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "15000");
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        properties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
        return properties;
    }


    public ConsumerFactory<String, String> consumerFactory1() {
        Map<String, Object> properties = getCommonPropertis();
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        return new DefaultKafkaConsumerFactory<String, String>(properties);
    }
    
}
````

+ 增加两个监听 `KafkaReceiverOne.java`和 `KafkaReceiverTwo.java`
````java
@Component
public class KafkaReceiverOne {

    @KafkaListener(id = "1",topics = {"groupTest"}, containerFactory="kafkaListenerContainerFactory")
    public void listen(ConsumerRecord<?, ?> record) {
        Optional<?> kafkaMessage = Optional.ofNullable(record.value());
        if (kafkaMessage.isPresent()) {
            Object message = kafkaMessage.get();
            System.out.println("ONE:"+message.toString());
        }
    }

}
````

````java
@Component
public class KafkaReceiverTwo {

    @KafkaListener(id = "2",topics = {"groupTest"}, containerFactory="kafkaListenerContainerFactory")
    public void listen(ConsumerRecord<?, ?> record) {
        Optional<?> kafkaMessage = Optional.ofNullable(record.value());
        if (kafkaMessage.isPresent()) {
            Object message = kafkaMessage.get();
            System.out.println("Two:"+message.toString());
        }
    }
}
````

+ 生产者新增一个controller 测试
````java
@GetMapping("/message/group")
    public Boolean group(String message){
        kafkaUtil.send("groupTest",message);

        return Boolean.TRUE;
    }
````


#### 测试

+ 浏览器输入 `http://localhost:8787/message/group/?message=helloworld1`

+ 消费方控制台打印,两个listener同时消费消息
````
ONE:helloworld1
Two:helloworld1
````

+ 同时起两台consumer,只有一台打印消费信息


##### github 地址
+ `https://github.com/lidagen/kafka_parent.git
`


