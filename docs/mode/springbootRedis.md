## Springboot 整合 Redis

### 引入依赖 (2.1.5.RELEASE)
````xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
````

### 增加配置 重写`RedisTemplate`
````java
@Configuration
@EnableCaching
public class RedisAutoConfig {

    @Bean
    public RedisTemplate redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        //使用Jackson2JsonRedisSerializer来序列化和反序列化redis的value值
        Jackson2JsonRedisSerializer serializer = new Jackson2JsonRedisSerializer(Object.class);

        ObjectMapper mapper = new ObjectMapper();
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        mapper.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        serializer.setObjectMapper(mapper);

        template.setValueSerializer(serializer);
        //使用StringRedisSerializer来序列化和反序列化redis的key值
        template.setKeySerializer(new StringRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }
}
````

### `application.properties`配置
````
# REDIS
spring.redis.database=0
spring.redis.host=127.0.0.1
spring.redis.port=6379
#spring.redis.password= # Login password of the redis server.
spring.redis.lettuce.pool.max-active=8
spring.redis.lettuce.pool.max-idle=8
spring.redis.lettuce.pool.max-wait=-1ms
spring.redis.lettuce.pool.min-idle=0
#spring.redis.sentinel.master= # Name of Redis server.
#spring.redis.sentinel.nodes= # Comma-separated list of host:port pairs.
spring.redis.timeout=100ms
````

+ 启动`redis`和项目,单机版的redis整合可以使用了。
````java
@Autowired
RedisTemplate<String,Object> redisTemplate;

@RequestMapping(value = "/")
public String index(HttpServletRequest request) {
    redisTemplate.opsForHash().put("hash","1","a");
    return "index";
}
````