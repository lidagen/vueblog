## Spring - profile动态加载properties使用

+ profile可以实现不改动代码的情况下动态加载不同环境参数。

### sprignboot 配置
+ 新建两个环境的properties,`application-dev.properties`和`application-prd.properties`,设置不同端口号
````properties
#dev
server.port=8787
````

````properties
#prd
server.port=8778
````

+ 修改pom.xml
````xml
<!--新增profiles配置-->
<profiles>
    <profile>
        <id>dev</id>
        <!--默认打包环境-->
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
        <properties>
            <package.env>dev</package.env>
        </properties>
    </profile>
    <profile>
        <id>prd</id>
        <properties>
            <package.env>prd</package.env>
        </properties>
    </profile>
</profiles>

 <build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
    <!--新增resources配置，排除新增的两个properties,根据动态加载-->
    <resources>
        <resource>
            <filtering>true</filtering>
            <directory>src/main/resources</directory>
            <!--打包时，指不要这些文件-->
            <excludes>
                <exclude>application-dev.properties</exclude>
                <exclude>application-prd.properties</exclude>
            </excludes>
        </resource>
        <resource>
            <filtering>true</filtering>
            <directory>src/main/resources</directory>
            <includes>
                <include>application.properties</include>
                <include>application-${package.env}.properties</include>
            </includes>
        </resource>
    </resources>
</build>
````

+ 主 `application.properties`配置

````properties
# package.env 对应pom文件中profile中定义的名称
spring.profiles.active=@package.env@
````

### maven 打包
+ 两个不同命令会加载不同配置文件
````
mvn clean install -Pdev
mvn clean install -Pprd
````
