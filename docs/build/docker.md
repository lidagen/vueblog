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
docker rm $(docker ps -a -q)
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
+ 镜像就像一层层的嵌套，比如一个tomcat,它下面依赖jdk,jdk又依赖centos。层都是只读的，只有最上面一层是可写。

### 容器数据卷

**容器卷能干什么：**
+ 用来持久花容器中运行产生的数据。

+ 容器之间希望可以共享数据（一边修改另一边也改变）

+ 容器和宿主机之间共享数据（一边修改另一边也改变）

**容器卷的特点：**
+ 数据卷可以在容器之间共享或者重用数据

+ 卷中的更改可以直接生效

+ 数据卷的更改不会包含在镜像的更新中

+ 数据卷的生命周期一直持续到没有容器使用它为止

**容器中添加容器卷**
+ **直接命令添加**
````sh
docker run -it -v /宿主机绝对路径:/容器内目录    镜像名
# centos 宿主机/media/ws/disk1/下生成myVolume，镜像中根目录生成volume目录
docker run -it -v /media/ws/disk1/myVolume:/volume centos

# 只允许宿主机单项写入，容器内只读
docker run -it -v /media/ws/disk1/volume:/volume:ro centos

#  tips 容器停止后，主机修改数据，容器重启仍然会同步
````

+ **Dockerfile添加**

+  Dockerfile 简单来说是构建镜像内容的一组命令。通过Dockerfile我们可以自定义镜像，让其能够运行在容器中。
+ 比喻：
````sh
Hello.java =====> Hello.class

Docker images ======> Dockerfile
````
+ 步骤
  - 目录下新建Dockerfile
    - Dockerfile新建VOLUME来个容器创建一个或多个容器卷
  - File构建
  ````sh
  # mkdir一个mydocker文件夹
  # touch一个Dockerfile
  # vi 编辑以下内容:wq!
  # 创建两个容器卷dataVolumeContainer1 dataVolumeContainer2
  FROM centos
  VOLUME ["/dataVolumeContainer1","/dataVolumeContainer2"]
  CMD echo "finished,--------------success"
  CMD /bin/bash

  ````
  - build后生成镜像
````sh
docker build -f /mydocker/Dockerfile -t ws/mycentos .
````
  - run容器
  ````sh
  docker run -it ws/centos /bin/bash
  ````
  - 如何跟宿主机关联？
  ````sh
  # 重开终端或者var/bin/docker/volumes中查找
  docker inspect ws/centos
  ````

  ### DOCKERFILE

#### Dockerfile是什么
  + Dockerfile是用来构建docker镜像的构建文件，是由一系列命令和参数构成的脚本
  
  + 构建三步骤:
    -  Dockerfile
    -  docker build
    -  docker run   


#### Dockerfile的构建过程

**Dockerfile内容的基础知识：**
+ 每条保留指令都必须大写，并且后面必须跟随至少一个参数
+ 指令从上到下顺序执行
+ #表示注释
+ 每条指令会创建一个新的镜像层，并对镜像进行提交

**docker执行Dockerfile大致流程：**
+ docker从基础镜像运行一个容器
+ 执行一条指令对容器作出修改
+ 执行类似docker commit的命令提交一个新的镜像层
+ docker再基于刚提交的镜像运行一个新容器
+ 执行Dockerfile中的下一条指令直到所有执行执行完成


#### Dockerfile的体系结构（保留字指令）
+ **FROM**
  - 当前镜像是基于哪个镜像（scratch是最上层的镜像，类似java中的Object）

+ **MAINTAINER**
  - 镜像维护者以及邮箱

+ **RUN**
  - 构建时需要运行的命令

+ **EXPOSE**
  - 对外暴露的端口

+ **WORKDIR**
  - 指定在创建容器后，终端进入(-it)后默认的工作目录

+ **ENV**
  - 用来在构建镜像过程中设置环境变量

+ **ADD**
  - 将宿主机目录下的文件拷贝进镜像，且命令会自动处理URL和解压tar包 

+ **COPY**
  -  类似ADD，拷贝文件到镜像，

+ **VOLUME**
  - 数据容器卷，用来保存容器数据到宿主机 

+ **CMD**
  - 指定一个容器运行时要执行的命令
  - Dockerfile中可以有多个CMD命令，但只有最后一个生效，CMD会被docker run之后的参数替换

+ **ENTRYPOINT**
  - 指定一个容器运行时要执行的命令
  - ENTRYPOINT和CMD一样，都是在指定容器启动程序和参数

+ **ONBUILD**
  - 当构建一个被继承的Dockerfile时运行命令，父镜像在被子镜像继承后，父镜像的ONBUILD会被触发


#### 案例

+ **Base镜像scratch**
  - docker hub中99%的镜像都是通过在base镜像中安装和配置需要的软件构建出来的

+ **自定义镜像mycentos**
  - 假设我们下载的centos以及不满足使用的，我需要一个能运行vim的centos.
  - 构建Dockerfile
  ````sh
  FROM centos
  #定义/tmp别名mypath
  ENV mypath /tmp
  #默认工作目录为mypath
  WORKDIR $mypath
  RUN yum -y install vim

  #暴露的端口
  EXPOSE 80
  CMD /bin/bash
  ````
  - build
  ````sh
  docker build -f /media/ws/disk1/docker/mydocker/Dockerfile  -t vim/centos .

  ````
  - run
  ````sh
  docker run -it vim/centos /bin/bash
  ````
  - test
  ````sh
  # 可以看到直接进的是/tmp目录
  #目录下 touch 1.md
  # vim 进入测试vim安装是否成功
  ````

+ **CMD/ENTRYPOINT镜像案例**
  - 假设一个场景，我们做一个镜像，需要crul来获取`https://ip.cn/`中的ip信息。首先考虑CMD命令版本的
  ````sh
  FROM centos
  #如果centos中没有curl安装一个
  RUN yum install -y curl
  #相当于命令 curl -s https://ip.cn
  CMD ["curl","-s","https://ip.cn"]
  ```
- 
  - 之后我们build（myip）镜像然后run（docker run -it myip)，成功返回ip
  
  - 这时我们需要链接返回更多的信息，比如链接的请求头，类似于命令 `curl -s -i https://ip.cn`返回报文头加ip，这时候在run上追加 -i
  ````sh
  docker run -it myip -i
  ````
  
  - 这时候会报错，相当于后一个-i的CMD命令覆盖了Dockerfile中的CMD命令。这时候需要ENTRYPOINT命令。
  ````sh
  FROM centos
  #如果centos中没有curl安装一个
  RUN yum install -y curl
  #相当于命令 curl -s https://ip.cn
  ENTRYPOINT ["curl","-s","https://ip.cn"]
  ````

  - 之后重复上面步骤，完成！

:::tip
+ CMD 和 ENTRYPOINT都是执行命令，不同点是ENTRYPOINT是追加，CMD是覆盖。类似StringBuilder和String
+ curl 命令参考文档
:::



+ **自定义镜像tomcat9**
  - 准备工作：
    + 选择一个路径mkdir一个mytomcat9文件夹
    + 文件夹下准备jdk8和tomcat9的tar包
    + touch一个cp.txt文件
    + touch一个Dockerfile文件
    ````sh
    #vim进入Dockerfile
    FROM centos
    MAINTAINER gendali<wal365@126.com>
    #copy宿主机的cp.txt到镜像为container.txt
    COPY cp.txt /usr/local/container.txt
    #把jdk和tomcat添加容器中
    ADD jdk-8u221-linux-x64.tar.gz /usr/local/
    ADD apache-tomcat-9.0.30.tar.gz /usr/local/
    #安装VIM
    RUN yum install -y vim
    #设置登陆落脚点
    ENV MYPATH /usr/local
    WORKDIR $MYPATH
    #配置jdk和tomcat环境变量
    ENV JAVA_HOME /usr/local/jdk1.8.0_221
    ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
    ENV CATALINA_HOME /usr/local/apache-tomcat-9.0.30
    ENV CATALIAN_BASE /usr/local/apache-tomcat-9.0.30
    ENV PATH $PATH:$JAVA_HOME/bin:$CATALINA_HOME/lib:$CATALINA_HOME/bin
    #容器运行时的监听端口
    EXPOSE 8080
    #启动时运行tomcat
    #ENTRYPOINT ["/usr/local/apache-tomcat-9.0.30/bin/startup.sh"]
    #CMD ["/usr/local/apache-tomcat-9.0.30/bin/catanlina.sh","run"]
    CMD /usr/local/apache-tomcat-9.0.30/bin/startup.sh && tail -F /usr/local/apache-tomcat-9.0.30/bin/logs/catalina.out
    ````
  + 用-v命令run 这个镜像，添加容器卷
  ````sh
  # 这个长命令分解来看，-p对外端口映射为8090，--name 名字叫mytom9 
  # -v绑定两个数据卷到宿主机，方便部署项目和看日志
  # --privileged=true 防止写权限不够
  # mytomcat9是镜像名
  docker run -d -p 8090:8080 --name mytom9 -v /media/ws/disk3/dockersoftware/tomcat9DataVolume:/usr/local/apache-tomcat-9.0.30/webapps/test -v /media/ws/disk3/dockersoftware/tocat9logs/:/usr/local/apache-tomcat-9.0.30/logs --privileged=true mytomcat9
  ````   
  + exec查看
  ````sh
  # docker ps查看id
  # exec查看运行镜像bash
  docker exec aa241d0d95e5 ls -l
  #访问localhost:8090
  ````
+  **在宿主机容器卷部署应用，同步到tomcat的webapps/test目录下**
  - cd进入  tomcat9DataVolume目录 mkdir WEB-INF
  - cd WEB-INF/
  - touch web.xml
  ````xml
 <web-app xmlns="http://java.sun.com/xml/ns/j2ee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd"
    version="2.4">
    <display-name>test</display-name>
  </web-app>

  ````
  - cd .. 之后touch 个a.jsp
  ````jsp
  <%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>mytomcat9 index</title>
      </head>
      <body>
          <%="i am docker tomcat self"%>
          <br>
          <br>
          <% System.out.println("===============docker start!");%>
      </body>
</html>
  ````

  - 创建完成保存退出，查看运行的tomcat9容器中是否生成文件
  ````sh
  docker exec aa241d0d95e5 ls -l /usr/local/apache-tomcat-9.0.30/webapps/test
  ````

  - 访问jsp,`http://localhost:8090/test/a.jsp`
  - 访问宿主机的/tocat9logs下sudo cat catalina.out 查看jsp中的===============docker start!打印

### 推送镜像到ailiyun

#### 创建镜像仓库
+ `https://cr.console.aliyun.com/cn-hangzhou/instances/repositories` 创建镜像仓库
+ 选择本地仓库
+ 点击管理，查看推送命令
````sh
sudo docker login --username=xxx@126.com registry.cn-hangzhou.aliyuncs.com
sudo docker tag [ImageId] registry.cn-hangzhou.aliyuncs.com/gendali/mytomcat:[镜像版本号]
sudo docker push registry.cn-hangzhou.aliyuncs.com/gendali/mytomcat:[镜像版本号]
````
