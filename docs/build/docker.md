## 应用容器引擎-Docker

### Docker 概述

#### docker是什么

+ Docker作为一个软件集装箱化平台，可以让开发者构建应用程序时，将它与其依赖环境一起打包到一个容器中，然后很容易地发布和应用到任意平台中。在操作系统上，提供一个额外的软件抽象层，以及操作系统层虚拟化的自动管理机制。

+ 上面说的比较官方，简单来说，docker是一个能让应用运行的容器，类似虚拟机。

:::tip
**Docker与传统虚拟机比较**
+ docker 启动快速属于秒级别。虚拟机通常需要几分钟去启动
+ docker 需要的资源更少， docker 在操作系统级别进行虚拟化， docker 容器和内核交互，几乎没有性能损耗，性能优于通过 Hypervisor 层与内核层的虚拟化
+ docker 更轻量， docker 的架构可以共用一个内核与共享应用程序库，所占内存极小。同样的硬件环境， Docker 运行的镜像数远多于虚拟机数量，对系统的利用率非常高
+ 与虚拟机相比， docker 隔离性更弱， docker 属于进程之间的隔离，虚拟机可实现系统级别隔离
+ 安全性： docker 的安全性也更弱。 Docker 的租户 root 和宿主机 root 等同，一旦容器内的用户从普通用户权限提升为root权限，它就直接具备了宿主机的root权限，进而可进行无限制的操作。虚拟机租户 root 权限和宿主机的 root 虚拟机权限是分离的，并且虚拟机利用如 Intel 的 VT-d 和 VT-x 的 ring-1 硬件隔离技术，这种隔离技术可以防止虚拟机突破和彼此交互，而容器至今还没有任何形式的硬件隔离，这使得容器容易受到攻击
+ 可管理性： docker 的集中化管理工具还不算成熟。各种虚拟化技术都有成熟的管理工具，例如 VMware vCenter 提供完备的虚拟机管理能力
高可用和可恢复性： docker 对业务的高可用支持是通过快速重新部署实现的。虚拟化具备负载均衡，高可用，容错，迁移和数据保护等经过生产实践检验的成熟保障机制， VMware 可承诺虚拟机 99.999% 高可用，保证业务连续性
+ 快速创建、删除：虚拟化创建是分钟级别的， Docker 容器创建是秒级别的， Docker 的快速迭代性，决定了无论是开发、测试、部署都可以节约大量时间
+ 交付、部署：虚拟机可以通过镜像实现环境交付的一致性，但镜像分发无法体系化。 Docker 在 Dockerfile 中记录了容器构建过程，可在集群中实现快速分发和快速部署
:::

### Docker 核心

#### docker 三个基本概念:

+ **Images (镜像)** : 镜像可以看作一个文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。

+ **Container (容器)** : 容器是放置，运行镜像的地方，里面运行着我们指定的应用。

+ **Repository (仓库)** : 仓库可以看作存放镜像的地方，当镜像构建完成后，我们需要一个集中存储，分发管理的服务。仓库类似于我们之前常用的代码仓库。

### Docker 的优势
+ 容器就可以实现方便快速并且与平台解耦的自动化部署方式，无论你部署时的环境如何，容器中的应用程序都会运行在同一种环境下,简单来说，docker的标准化让快速扩展，弹性伸缩变得简单。

+ 举个例子：小明写了一个系统，该系统的技术栈非常广，需要依赖于各种开源库和中间件。如果按照纯手动的部署方式，小明需要安装各种开源软件，还需要写好每个开源软件的配置文件。如果只是部署一次，这点时间开销还是可以接受的，但如果小明每隔几天就需要换个服务器去部署他的程序，那么这些繁琐的重复工作无疑是会令人发狂的。这时候，Docker的用处就派上场了，小明只需要根据应用程序的部署步骤编写一份Dockerfile文件（将安装、配置等操作交由Docker自动化处理），然后构建并发布他的镜像，这样，不管在什么机器上，小明都只需要拉取他需要的镜像，然后就可以直接部署运行了，这正是Docker的魅力所在。

### docker安装

+ 根据自己的系统下载安装docker

+ 登陆 `https://cr.console.aliyun.com/`，按照操作文档配置阿里云镜像

### docker命令

#### 镜像命令
````sh
#拉取一个 docker 镜像,不指定版本默认最新:latest
docker pull java

# 拉取一个指定版本
docker pull java:8

# 查看镜像
docker images
````
#### 容器命令
+ 启动容器

````sh
#启动容器
docker run [OPTION]  IMAGE [COMMAND] [ARG...]
# OPTION 说明
<!--
    --name 为容器起一个新名称
    -d 后台启动容器，守护线程的方式，返回id
    -i  交互式模式启动容器，通常与-t一起使用
    -t  为容器重新分配一个伪输入终端
    -P 随即端口启动
    -p 指定端口映射，有以下四种格式：
      ip:hostPort:containerPort
      ip::containerPort
      hostPort:containerPort
      containerPort
 -->
# 运行一个镜像，并对其指定端口映射(springboot_web的 8080端口映射为80)
docker run -d -p 80:8080 springboot_web
# 运行这个容器中的镜像的话，并且调用镜像里面的 bash
docker run -it container_name/container_id /bin/bash
````
+ 退出容器

````sh
exit 停止容器
ctrl+p+q 不停止容器退出容器终端
````

+ 列出所以正在运行的容器
````sh

# 查看哪些容器运行
docker ps  [OPTION]

# OPTION说明
<!--
-a 正在运行和历史运行的容器
-l  显示最近创建的容器
-n 显示最近n个创建的容器
-q  静默模式，只显示容器id
--no-trunc 不截断输出 
-->
````
+ 启动容器、 重启、停止容器
````sh

# 启动、重启、停止容器
docker start container_name/container_id
docker restart container_name/container_id
docker stop container_name/container_id

# 如果我们需要删除某个镜像，需要先停止容器，然后删除容器，最后删除镜像
docker ps
docker stop container_name/container_id
docker rm container_name/container_id
docker rmi image_name

# 强制停止容器
docker kill container_name/container_id

#删除多个容器
docker rm -f  ${docker -a -q}
````

#### 容器重要命令

+ 启动守护式容器
````sh
docker run -d container_name/container_id
````

+ 查看容器日志
````sh
# -t 加入时间戳  -f不停的追加（动态） -tail linux命令 尾巴
docker logs -f -t --tail container_id
````

+ 查看容器运行的线程
````sh
docker top container_id
````

+ 查看容器内部细节
````sh
docker inspect container_id
````

+ 进入正在运行的容器并以命令交互
````sh
# 对容器进行bashShell操作，得到结果回到宿主机
docker exec -t container_id bashShell 

# 直接进入容器并启动终端
docker attach container_id
````

+ 从容器内拷贝数据到主机
````sh
docker cp container_id:容器内路径 目的主机路径
````


+ 这里罗列是常用命令，更多命令参照:
````sh
docker --help
````

### 镜像原理


### Dockerfile
+ Dockerfile 简单来说是构建镜像内容的一组命令。通过Dockerfile我们可以自定义镜像，让其能够运行在容器中。

**Dockerfile 包括：**

+ **基础镜像(父镜像)信息指令 FROM**
+ **维护者信息指令 MAINTAINER**
+ **镜像操作指令 RUN 、 EVN 、 ADD 和 WORKDIR 等**
+ **容器启动指令 CMD 、 ENTRYPOINT 和 USER 等**

例子：
````sh
FROM java:8
MAINTAINER jason<wal365@126.com>
VOLUME /tmp
ADD docker_hello_world-0.0.1-SNAPSHOT.jar app.jar
RUN sh -c 'touch /app.jar'
ENV JAVA_OPTS=""
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar" ]
````

我们分析一下上面这个过程：
+ 从 Docker Hub 上 pull 下jdk 8 的基础镜像
+ 显示维护者的信息
+ 数据卷，容器中的进程操作的数据持久化都是保存在容器的可写层上。这里的 /tmp 目录就会在运行时自动挂载为匿名卷，即使容器删除了，数据还在。
+ 把 docker_hello_world-0.0.1-SNAPSHOT.jar改名为app.jar添加进镜像中
+ 指定 docker build 过程中运行的程序
+ 指定app.jar的参数（此处为空）
+ 类似 CMD 指令的功能，用于为容器指定默认运行程序，从而使得容器像是一个单独的可执行程序。

:::tip
具体参数参考文档
:::

#### 利用DockerFile构建一个web项目镜像

+ 新建一个web工程，端口为默认的8080，编辑controller，返回”hello docker!“,启动`localhost:8080/hi`访问能成功显示。

+ 停止项目，运行mvn package打包为spring-web.jar

+ 在jar包目录新建Dockerfile,并复制上面的构建过程，更改docker_hello_world-0.0.1-SNAPSHOT.jar为自己打包的jar名称

+ 运行 命令构建镜像
````sh
#-t 是为新镜像设置仓库和名称，其中 ws 为仓库名， docker_spring_web 为镜像名 ，注意后面的 .
docker build -t ws/docker_spring_web .
````

+ docker images 查看镜像

+ 启动，访问9999端口访问
````sh
#8080端口映射为9999
docker run -d -p 9999:8080 ws/docker_spring_web
````