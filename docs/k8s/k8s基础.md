## Kubernetes 基础概述

### Kubernetes 是什么
+ Kubernetes是容器集群管理系统，是一个开源的平台，可以实现容器集群的**自动化部署**、**自动扩缩容**、**维护**等功能、

#### Kubernetes 特点
+ 可移植: 支持公有云，私有云，混合云，多重云
+ 可扩展: 模块化, 插件化, 可挂载, 可组合
+ 自动化: 自动部署，自动重启，自动复制，自动伸缩/扩展

#### 为什么要使用容器技术
+ 传统的部署方式是通过插件和脚本来安装应用，这样做的缺点是应用的运行、配置、管理、所有的生存周期都与当前操作系统绑定，不利于系统的升级回滚操作。
+ 容器部署，每个容器相互独立，容器间的进程不会互相影响。而且因为容器存在，应用不依赖生产环境的基础结构，这使得研发、测试，生产提供一致的环境。同时容器比虚拟机更轻量化、更透明，便于监控和管理。

#### 容器的优势
+ 快速创建/部署应用：与VM虚拟机相比，容器镜像的创建更加容易
+ 持续开发、集成和部署：提供可靠且频繁的容器镜像构建/部署，并使用快速和简单的回滚(由于镜像不可变性)。
+ 开发和运行相分离：在build或者release阶段创建容器镜像，使得应用和基础设施解耦。
+ 开发，测试和生产环境一致性：在本地或外网（生产环境）运行的一致性。
+ 云平台或其他操作系统：可以在 Ubuntu、RHEL、 CoreOS、on-prem、Google Container Engine或其它任何环境中运行
+ Loosely coupled，分布式，弹性，微服务化：应用程序分为更小的、独立的部件，可以动态部署和管理。
+ 资源隔离
+ 资源利用：更高效

#### Kubernetes能做什么
+ 多个进程（作为容器运行）协同工作。（Pod）
+ 存储系统挂载
+ Distributing secrets
+ 应用健康检测
+ 应用实例的复制
+ Pod自动伸缩/扩展
+ Naming and discovering
+ 负载均衡
+ 滚动更新
+ 资源监控
+ 日志访问
+ 调试应用程序
+ 提供认证和授权

#### Kubernetes不是什么
+ Kubernetes并不是传统的PaaS（平台即服务）系统
+ Kubernetes不限制支持应用的类型，不限制应用框架。不限制受支持的语言runtimes (例如, Java, Python, Ruby)，满足12-factor applications 。不区分 “apps” 或者“services”。
+ Kubernetes不提供中间件（如message buses）、数据处理框架（如Spark）、数据库(如Mysql)或者集群存储系统(如Ceph)作为内置服务。但这些应用都可以运行在Kubernetes上面
+ Kubernetes不部署源码不编译应用。持续集成的 (CI)工作流方面，不同的用户有不同的需求和偏好的区域，因此，我们提供分层的 CI工作流，但并不定义它应该如何工作
+ Kubernetes允许用户选择自己的日志、监控和报警系统
+ Kubernetes不提供或授权一个全面的应用程序配置 语言/系统（例如，jsonnet）
+ Kubernetes不提供任何机器配置、维护、管理或者自修复系统

### Kubernetes 组件
#### Master 组件
::: tip
+ Master组件提供集群的管理控制中心。
+ Master组件可以在集群中任何节点上运行。但是为了简单起见，通常在一台VM/机器上启动所有Master组件，并且不会在此VM/机器上运行用户容器。
:::

+ **kube-apiserver**
  - kube-apiserver用于暴露Kubernetes API。任何的资源请求/调用操作都是通过kube-apiserver提供的接口进行。

+ **ETCD**  
  - etcd是Kubernetes提供默认的存储系统，保存所有集群数据，使用时需要为etcd数据提供备份计划

+ **kube-controller-manager**
  - kube-controller-manager运行管理控制器，它们是集群中处理常规任务的后台线程。逻辑上，每个控制器是一个单独的进程，但为了降低复杂性，它们都被编译成单个二进制文件，并在单个进程中运行。
  - 这些控制器包括：
    + 节点（Node）控制器。
    + 副本（Replication）控制器：负责维护系统中每个副本中的pod。
    + 端点（Endpoints）控制器：填充Endpoints对象（即连接Services＆Pods）。
    + Service Account和Token控制器：为新的Namespace 创建默认帐户访问API Token。

+ **cloud-controller-manager**
  - 云控制器管理器负责与底层云提供商的平台交互。云控制器管理器是Kubernetes版本1.6中引入的，目前还是Alpha的功能   
  - cloud-controller-manager 具体功能： 
    + 节点（Node）控制器
    + 路由（Route）控制器
    + Service控制器
    + 卷（Volume）控制器 

+ **kube-scheduler**
  - kube-scheduler 监视新创建没有分配到Node的Pod，为Pod选择一个Node。

+ **插件 addons**     
  - 插件（addon）是实现集群pod和Services功能的 。Pod由Deployments，ReplicationController等进行管理。Namespace 插件对象是在kube-system Namespace中创建。
  - DNS
    + 虽然不严格要求使用插件，但Kubernetes集群都应该具有集群 DNS。群集 DNS是一个DNS服务器，能够为 Kubernetes services提供 DNS记录。由Kubernetes启动的容器自动将这个DNS服务器包含在他们的DNS searches中。
  - 用户界面
    + kube-ui提供集群状态基础信息查看
  - 容器资源监测
    + 容器资源监控提供一个UI浏览监控数据。
  - Cluster-level Logging
    + Cluster-level logging，负责保存容器日志，搜索/查看日志。      


#### 节点（Node）组件
::: tip
+ 节点组件运行在Node，提供Kubernetes运行时环境，以及维护Pod。
:::

+ **kubelet**
  - kubelet是主要的节点代理，它会监视已分配给节点的pod，具体功能：
    + 安装Pod所需的volume。
    + 下载Pod的Secrets。
    + Pod中运行的 docker（或experimentally，rkt）容器。
    + 定期执行容器健康检查。
    + Reports the status of the pod back to the rest of the system, by creating a mirror pod if necessary.
    + Reports the status of the node back to the rest of the system.

+ **kube-proxy**
  - kube-proxy通过在主机上维护网络规则并执行连接转发来实现Kubernetes服务抽象。

+ **docker**
  - docker用于运行容器。

+ **RKT**
  - rkt运行容器，作为docker工具的替代方案。

+ **supervisord**
  - supervisord是一个轻量级的监控系统，用于保障kubelet和docker运行。

+ **fluentd**
  - fluentd是一个守护进程，可提供cluster-level logging.。



## kubernetes

### 理解为什么需要k8s
+ 可以对多个容器提供编排能力,运行 管理一组多个容器以及容器之间共同使用到的,如桥连网络段,如创建的数据卷Volume,也可以在多个容器间共享
+ 容器需要部署在多个机器上,需要配置跨主机的容器通信方案(非手动,因为难以维护容器间所有通信规则,iptables转发规则,docker+flannel解决了docker跨主机通信)
+ 容器运行在多个机器上,如何确保容器资源使用率监控,容器内服务监控

### k8s是什么,解决了什么问题
+ 纯docker运行模式,是一个docker主机,单独管理部署一堆容器应用,数量多了以后,配置复杂之后,难以维护.且跨主机的容器集群,更加难维护
  - 业务容器数量庞大,哪些容器部署在哪些节点,使用了哪些端口,如果记录,管理,需要登录到每台机器去管理?
  - 跨主机通信,多个机器之间如果相互调用,ipstables规则手动维护?
  - 跨主机容器相互调用,配置如何写?写死固定ip+port?
  - 如果实现高可用?多个容器对外提供服务如何负载均衡
  - 容器业务中断了,如何感知?感知到以后,如何自动重启新的容器?
  - 如何实现滚动升级保证业务连续性
### k8s特性
+ 自动化上线和回滚
+ 存储编排
+ 自动装箱
+ IPV4/IPV6双协议线
+ 自我修复
+ 服务发现于负载均衡
+ Secret和配置管理
+ 批量执行
+ 水平扩缩
+ 为拓展性设计

### k8s核心组件
'''
提供了很多的组件,方便用户从各个角度,更好的维护,管理容器
1.容器的运行高可用,数量保障,版本升级,扩容,缩容
2.容器间网络关系
3.容器间数据共享
4.容器内配置文件加密
5.xxx
'''

+ `etcd` 保存了集群的状态,分布式高性能数据库
+ `api-server` 提供了资源操作的唯一入口,并提供认证 授权 访问控制 api注册与发现机制
+ `controller manager` 负责维护集群状态,比如故障检测 自动扩展 滚动更新
+ `scheduler` 负责资源的调度,按照预订调度策略将pod调度到相应的node节点上
+ `kubelet` 负责维护容器的生命周期,同时也负责Volume(CVI)和网络(CNI)的管理.
  - 运行在每个node节点上的代理软件,脏活累活都是它干
  - pod管理:
    + kubelet定期从监听的数据源获取节点上pod/container的期望状态(运行什么容器,运行的副本数量,网络或者存储如何配置等),并调用对应容器平台接口达到这个状态
  - 容器健康检查
  	+ kubelet创建了容器之后还要查看容器是否正常运行,如果容器运行出错,就要根据pod设置的重启策略处理
  - 容器监控
    + kubelet会监控所在节点的资源使用情况,并定时向master报告,资源使用数据都是通过cAdvisor获取,知道整个集群所有节点资源情况,对pod调度和正常运行至关重要.
+ Container runtime 负责镜像管理以及pod和容器的真正运行(CRI)
+ kube-proxy 负责为Service提供cluster内部的服务发现和负载均衡,主要提供iptables,ipvs规则
+ kubectl:
	- 命令行接口,用于对集群运行命令

### 理解pod创建过程,与效果
+ pod创建过程
'''
1.在master节点,写入yaml描述你对容器的运行要求,创建pod的要求,install-nginx.yaml
2.使用kubectl命令创建,应用这个资源描述文件 `kubectl create -f install-nginx.yaml`我要创建一个pod运行nginx了,命令发给谁
3.验证kubectl命令发来的请求是否被允许利用本地https证书直接写入,请求被允许后才会执行
4.api-server将nginx-pod创建信息,记录到etcd中(镜像版本,容器名,是否端口映射...)
5.api-server再通知下一个组件,scheduler准备pod调度
6.scheduler会去etcd查询信息,判定合适的node节点去部署pod(选择好机器,还未执行)
7.scheduler告诉api-server决定将pod部署在哪个node节点
8.api-server将信息写入etcd,更新数据
9.此时api-server会通知远程具体机器,如k8s-node2上的工作进程kubelet,读取etcd信息,进行创建
'''

### pod
'''
1.pod的ip是随机变化的,删除pod,ip变化
2.pod内都有一个根容器
3.一个pod内可以有一个,多个容器
4.一个pod内所有的容器,共享根容器的网络名称空间,文件系统,进程资源
5.一个pod内的容器网络地址,由根容器提供
'''
+ pod部署几种形态
	- 一个pod下一个容器,无状态,无需数据卷
	- 一个pod下一个容器,持久化容器内数据,以卷的形式,放在宿主机上
	- 一个pod下多个容器,共享一个卷的数据
	- 一个pod下多个容器,多个卷 

### 容器运行状态
+ 创建容器是为了运行容器,容器有运行状态,表现为创建的成功 失败 问题
	- `Waiting` 
	- `Running`
	- `Terminated`
### Label
+ label是识别kubernetes对象的标签,以key-value的方式附加在对象上(key不超过64字节,value可为空,也可不超过253字节的字符串)
+ label不提供唯一性,并且实际上很多对象(如pod)都使用相同label来标识具体应用
+ label定义好后其他对象可以使用Label Selector来选择一组相同的label对象.Label Selector支持以下几种方式:
	- 等式,如 `app=nginx 或 env!=prod`
	- 集合,如 `env in (qa,uat)`
	- 多个label(它们是AND关系) `app=nginx,env = qa`
'''
1.label就是标签,用于标识kubernetes对象
2.我们传统对机器上应用查找,都是基于ip:port,但kubernetes中,更多匹配关系,都是基于label
'''	


### Namespace
+ Namespace是对一组资源和对象的抽象集合,比如可以用来将系统内部的对象划分为不同**资源组**
	- 常见的pods,services,replication,controller,deployment都属于某个namespace
	- node,persistentVolumes等则不属于任何namespace

### Controller(Deployment)
+ kubernetes控制器有多种,用在不同场景,如何更好管理pod
	- `replication controller` 副本控制器,主要控制pod数量
	- ``
	- ``



### Service
