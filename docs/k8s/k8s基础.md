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









