## @ConfigurationProperties获取配置文件值
+ 在编写项目代码时，我们要求更灵活的配置，更好的模块化整合。在 Spring Boot 项目中，为满足以上要求，我们将大量的参数配置在 application.properties 或 application.yml 文件中，通过 @ConfigurationProperties 注解，我们可以方便的获取这些参数值

### 编写配置类
````java
/**
 * @author wang.song
 * @date 2020-12-09 14:54
 * @Desc  获取properties中 spring.private.redis前缀的值
 */
@ConfigurationProperties(prefix = "spring.private.redis")
@Component
@Data
public class MyRedisProperties {
    /**
     * 模式
     */
    private Integer mode;
    /**
     * 密码
     */
    private String password;
    /**
     * 单机HOST:PORT
     */
    private String hostPort;
    /**
     * 单机port
     */
    private String port;
    /**
     * 哨兵名称
     */
    private String sentinelName;
    /**
     * 哨兵节点
     */
    private String sentinelnodes;
}
````

## @EnableConfigurationProperties 进行注册
````java
/**
 * @author wang.song
 * @date 2020-12-09 11:50
 * @Desc redisson 配置
 */
@Slf4j
@Configuration
@EnableConfigurationProperties(MyRedisProperties.class)
public class RedissonConfiguration {
    /**
     * 构建前缀
     */
    private static final String SENTINEL_PREFIX = "redis://";

    private static Config config = new Config();

    private static  Redisson redisson;


    @Bean
    @ConditionalOnMissingBean(RedissonClient.class)
    MyRedisProperties getProperties(MyRedisProperties myRedisProperties) {
        createRedisson(myRedisProperties);
        return myRedisProperties;
    }


    private void createRedisson(MyRedisProperties myRedisProperties) {
        Integer mode = myRedisProperties.getMode();
        setConfig(mode, myRedisProperties);
        redisson=(Redisson) Redisson.create(config);
    }

    public static Redisson getRedisson(){
        return redisson;
    }


    /**
     * 根据配置文件获取redis模式
     *
     * @param type
     * @param myRedisProperties
     */
    private void setConfig(Integer type, MyRedisProperties myRedisProperties) {
        switch (type) {
            case 1:
                //单机redis
                config.useSingleServer().setAddress(SENTINEL_PREFIX + myRedisProperties.getHostPort()).setPassword(myRedisProperties.getPassword());
                break;
            case 2:
                //哨兵
                String[] split = myRedisProperties.getSentinelnodes().split(",");
                List<String> arrayList = Lists.newArrayList();
                for (String sp : split) {
                    arrayList.add(SENTINEL_PREFIX + sp);
                }
                String[] strings = arrayList.toArray(new String[arrayList.size()]);
                config.useSentinelServers().addSentinelAddress(strings)
                        .setMasterName(myRedisProperties.getSentinelName()).setPassword(myRedisProperties.getPassword()).setDatabase(0);
                break;
            case 3:
                //TODO 集群
                config.useClusterServers().addNodeAddress(
                        "redis://172.29.3.245:6375", "redis://172.29.3.245:6376", "redis://172.29.3.245:6377",
                        "redis://172.29.3.245:6378", "redis://172.29.3.245:6379", "redis://172.29.3.245:6380")
                        .setPassword("a123456").setScanInterval(5000);
                break;
            default:
                //默认单机
                config.useSingleServer().setAddress("redis://172.0.0.1:6379");
        }
    }

}
````