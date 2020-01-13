## DockerCompose 服务编排

### 概述
+ 使用微服务架构的应用程序一般包含若干个微服务，每个微服务一般都会部署多个实例，如果每个微服务都要手动操作那效率会很低，Docker compose就是用来高效管理容器，提交部署效率。

+ docker-compose 是一个用户定义和运行多个容器的 Docker 应用程序。在 Compose 中你可以使用 .yml 文件来配置你的应用服务。然后，只需要一个简单的命令，就可以创建并启动。


### Docker Compose 管理容器的结构
+ Docker Compose将所管理的容器分为三层，分别是**工程（project）**、**服务（service）**、**容器（container）**

+ Docker Compose运行目录下所有的文件（docker-compose-yml、extends文件或者环境变量文件等）组成一个工程，一个工程可包含多个服务，每个服务中定义了容器运行的镜像，参与以及依赖，一个服务可以包含多个容器实例。

### docker-compose.yml 常用指令

+ **image**
  - 指定镜像名称或者镜像id,如果该镜像不存在，会尝试pull

+ **build**
  - 指定Dockerfile文件的路径，可以是一个路径。例如：
````sh
build: ./dir
````
  - 也可以是一个对象，用于指定Dockerfile和参数。例如：
  ````sh
  build: ./dir
    context: Dockerfile-alternate
    args:
        buildno:1
  ````

+ **command**
  - 覆盖容器启动后的默认执行命令：
  ````sh
  command: bundle exec thin -p 3000
  ````
  - 也可以是个list,类似docker的CMD命令
  ````sh
  command: [bundle,exec,thin,-p,3000]
  ````

+ **links**
  - 链接到其它服务中的容器，可以指定服务名称和链接的别名使用SERVICE：ALIAS
  ````sh
  web:
    links:
        - db
        - db:database
        - redis
  ````

+ **external_links**
  - 表示链接到docker-compose.yml外的容器。甚至非Compose管理的容器
  ````sh
  extenrnal_links:
    - redis_l
    - project_db_1:mysql
    - project_db_2:postgresql
  ````

+ **ports**
  - 暴露的端口号，使用 `宿主机：容器端口` 的格式,或者仅仅指定容器的端口（此时宿主机会随机是指定，类似docker run -P命令）
  ````sh
  ports:
   - "3000"
   - "3000-5000"
   - "8080:8080"
   - "8000-9000":"8000-9000"
   - "49100:22"
   - "127.168.0.0.1:8001:8001"
  ````

+ **expose**
  - 暴露端口，只将端口暴露给连接的服务，而不暴露给宿主机
  ````sh
  expose: 
    - "3000"
  ````

+ **volumes**
  - 卷挂载路径的设置。可以设置宿主机路径或加上访问模式
  ````sh
  volumes:
    - /var/lib/mysql
    - /opt/data:/var/lib/mysql
    - ~/configs:/etc/configs/:ro
  ````

+ **volumes_from**
  - 从另一个服务或者容器挂载卷
  ````sh
  volumes_from:
    - service_name
    - servie_name:ro
    - container:container_name
  ````

+ **environment**
  - 设置环境变量，可以使用数组或者字典两种方式，只有一个key的环境变量可以运行在compose机器上找到对应的
````sh
environment:
    RACK_ENV: development
    SHOW: 'true'
    SESSION_SECRET:
````

+ **env_file**
  - 从文件中获取环境变量，可以为单独的文件路径或者列表
 ````sh
env_file:
    - ./common.env
    - ./apps/web.env
    _ /opt/secrets.env
 ````

+ **extends**
  - 继承另一个服务，基于已有的服务拓展

+ **net**
  - 设置网络模式
  ````sh
  net: "bridge"
  net: "host"
  net: "none"
  net: "container:[service name or container name/id]"
  ````
