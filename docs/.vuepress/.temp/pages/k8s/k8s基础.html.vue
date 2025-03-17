<template><div><h2 id="kubernetes-基础概述" tabindex="-1"><a class="header-anchor" href="#kubernetes-基础概述"><span>Kubernetes 基础概述</span></a></h2>
<h3 id="kubernetes-是什么" tabindex="-1"><a class="header-anchor" href="#kubernetes-是什么"><span>Kubernetes 是什么</span></a></h3>
<ul>
<li>Kubernetes是容器集群管理系统，是一个开源的平台，可以实现容器集群的<strong>自动化部署</strong>、<strong>自动扩缩容</strong>、<strong>维护</strong>等功能、</li>
</ul>
<h4 id="kubernetes-特点" tabindex="-1"><a class="header-anchor" href="#kubernetes-特点"><span>Kubernetes 特点</span></a></h4>
<ul>
<li>可移植: 支持公有云，私有云，混合云，多重云</li>
<li>可扩展: 模块化, 插件化, 可挂载, 可组合</li>
<li>自动化: 自动部署，自动重启，自动复制，自动伸缩/扩展</li>
</ul>
<h4 id="为什么要使用容器技术" tabindex="-1"><a class="header-anchor" href="#为什么要使用容器技术"><span>为什么要使用容器技术</span></a></h4>
<ul>
<li>传统的部署方式是通过插件和脚本来安装应用，这样做的缺点是应用的运行、配置、管理、所有的生存周期都与当前操作系统绑定，不利于系统的升级回滚操作。</li>
<li>容器部署，每个容器相互独立，容器间的进程不会互相影响。而且因为容器存在，应用不依赖生产环境的基础结构，这使得研发、测试，生产提供一致的环境。同时容器比虚拟机更轻量化、更透明，便于监控和管理。</li>
</ul>
<h4 id="容器的优势" tabindex="-1"><a class="header-anchor" href="#容器的优势"><span>容器的优势</span></a></h4>
<ul>
<li>快速创建/部署应用：与VM虚拟机相比，容器镜像的创建更加容易</li>
<li>持续开发、集成和部署：提供可靠且频繁的容器镜像构建/部署，并使用快速和简单的回滚(由于镜像不可变性)。</li>
<li>开发和运行相分离：在build或者release阶段创建容器镜像，使得应用和基础设施解耦。</li>
<li>开发，测试和生产环境一致性：在本地或外网（生产环境）运行的一致性。</li>
<li>云平台或其他操作系统：可以在 Ubuntu、RHEL、 CoreOS、on-prem、Google Container Engine或其它任何环境中运行</li>
<li>Loosely coupled，分布式，弹性，微服务化：应用程序分为更小的、独立的部件，可以动态部署和管理。</li>
<li>资源隔离</li>
<li>资源利用：更高效</li>
</ul>
<h4 id="kubernetes能做什么" tabindex="-1"><a class="header-anchor" href="#kubernetes能做什么"><span>Kubernetes能做什么</span></a></h4>
<ul>
<li>多个进程（作为容器运行）协同工作。（Pod）</li>
<li>存储系统挂载</li>
<li>Distributing secrets</li>
<li>应用健康检测</li>
<li>应用实例的复制</li>
<li>Pod自动伸缩/扩展</li>
<li>Naming and discovering</li>
<li>负载均衡</li>
<li>滚动更新</li>
<li>资源监控</li>
<li>日志访问</li>
<li>调试应用程序</li>
<li>提供认证和授权</li>
</ul>
<h4 id="kubernetes不是什么" tabindex="-1"><a class="header-anchor" href="#kubernetes不是什么"><span>Kubernetes不是什么</span></a></h4>
<ul>
<li>Kubernetes并不是传统的PaaS（平台即服务）系统</li>
<li>Kubernetes不限制支持应用的类型，不限制应用框架。不限制受支持的语言runtimes (例如, Java, Python, Ruby)，满足12-factor applications 。不区分 “apps” 或者“services”。</li>
<li>Kubernetes不提供中间件（如message buses）、数据处理框架（如Spark）、数据库(如Mysql)或者集群存储系统(如Ceph)作为内置服务。但这些应用都可以运行在Kubernetes上面</li>
<li>Kubernetes不部署源码不编译应用。持续集成的 (CI)工作流方面，不同的用户有不同的需求和偏好的区域，因此，我们提供分层的 CI工作流，但并不定义它应该如何工作</li>
<li>Kubernetes允许用户选择自己的日志、监控和报警系统</li>
<li>Kubernetes不提供或授权一个全面的应用程序配置 语言/系统（例如，jsonnet）</li>
<li>Kubernetes不提供任何机器配置、维护、管理或者自修复系统</li>
</ul>
<h3 id="kubernetes-组件" tabindex="-1"><a class="header-anchor" href="#kubernetes-组件"><span>Kubernetes 组件</span></a></h3>
<h4 id="master-组件" tabindex="-1"><a class="header-anchor" href="#master-组件"><span>Master 组件</span></a></h4>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>Master组件提供集群的管理控制中心。</li>
<li>Master组件可以在集群中任何节点上运行。但是为了简单起见，通常在一台VM/机器上启动所有Master组件，并且不会在此VM/机器上运行用户容器。</li>
</ul>
</div>
<ul>
<li>
<p><strong>kube-apiserver</strong></p>
<ul>
<li>kube-apiserver用于暴露Kubernetes API。任何的资源请求/调用操作都是通过kube-apiserver提供的接口进行。</li>
</ul>
</li>
<li>
<p><strong>ETCD</strong></p>
<ul>
<li>etcd是Kubernetes提供默认的存储系统，保存所有集群数据，使用时需要为etcd数据提供备份计划</li>
</ul>
</li>
<li>
<p><strong>kube-controller-manager</strong></p>
<ul>
<li>kube-controller-manager运行管理控制器，它们是集群中处理常规任务的后台线程。逻辑上，每个控制器是一个单独的进程，但为了降低复杂性，它们都被编译成单个二进制文件，并在单个进程中运行。</li>
<li>这些控制器包括：
<ul>
<li>节点（Node）控制器。</li>
<li>副本（Replication）控制器：负责维护系统中每个副本中的pod。</li>
<li>端点（Endpoints）控制器：填充Endpoints对象（即连接Services＆Pods）。</li>
<li>Service Account和Token控制器：为新的Namespace 创建默认帐户访问API Token。</li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong>cloud-controller-manager</strong></p>
<ul>
<li>云控制器管理器负责与底层云提供商的平台交互。云控制器管理器是Kubernetes版本1.6中引入的，目前还是Alpha的功能</li>
<li>cloud-controller-manager 具体功能：
<ul>
<li>节点（Node）控制器</li>
<li>路由（Route）控制器</li>
<li>Service控制器</li>
<li>卷（Volume）控制器</li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong>kube-scheduler</strong></p>
<ul>
<li>kube-scheduler 监视新创建没有分配到Node的Pod，为Pod选择一个Node。</li>
</ul>
</li>
<li>
<p><strong>插件 addons</strong></p>
<ul>
<li>插件（addon）是实现集群pod和Services功能的 。Pod由Deployments，ReplicationController等进行管理。Namespace 插件对象是在kube-system Namespace中创建。</li>
<li>DNS
<ul>
<li>虽然不严格要求使用插件，但Kubernetes集群都应该具有集群 DNS。群集 DNS是一个DNS服务器，能够为 Kubernetes services提供 DNS记录。由Kubernetes启动的容器自动将这个DNS服务器包含在他们的DNS searches中。</li>
</ul>
</li>
<li>用户界面
<ul>
<li>kube-ui提供集群状态基础信息查看</li>
</ul>
</li>
<li>容器资源监测
<ul>
<li>容器资源监控提供一个UI浏览监控数据。</li>
</ul>
</li>
<li>Cluster-level Logging
<ul>
<li>Cluster-level logging，负责保存容器日志，搜索/查看日志。</li>
</ul>
</li>
</ul>
</li>
</ul>
<h4 id="节点-node-组件" tabindex="-1"><a class="header-anchor" href="#节点-node-组件"><span>节点（Node）组件</span></a></h4>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>节点组件运行在Node，提供Kubernetes运行时环境，以及维护Pod。</li>
</ul>
</div>
<ul>
<li>
<p><strong>kubelet</strong></p>
<ul>
<li>kubelet是主要的节点代理，它会监视已分配给节点的pod，具体功能：
<ul>
<li>安装Pod所需的volume。</li>
<li>下载Pod的Secrets。</li>
<li>Pod中运行的 docker（或experimentally，rkt）容器。</li>
<li>定期执行容器健康检查。</li>
<li>Reports the status of the pod back to the rest of the system, by creating a mirror pod if necessary.</li>
<li>Reports the status of the node back to the rest of the system.</li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong>kube-proxy</strong></p>
<ul>
<li>kube-proxy通过在主机上维护网络规则并执行连接转发来实现Kubernetes服务抽象。</li>
</ul>
</li>
<li>
<p><strong>docker</strong></p>
<ul>
<li>docker用于运行容器。</li>
</ul>
</li>
<li>
<p><strong>RKT</strong></p>
<ul>
<li>rkt运行容器，作为docker工具的替代方案。</li>
</ul>
</li>
<li>
<p><strong>supervisord</strong></p>
<ul>
<li>supervisord是一个轻量级的监控系统，用于保障kubelet和docker运行。</li>
</ul>
</li>
<li>
<p><strong>fluentd</strong></p>
<ul>
<li>fluentd是一个守护进程，可提供cluster-level logging.。</li>
</ul>
</li>
</ul>
<h2 id="kubernetes" tabindex="-1"><a class="header-anchor" href="#kubernetes"><span>kubernetes</span></a></h2>
<h3 id="理解为什么需要k8s" tabindex="-1"><a class="header-anchor" href="#理解为什么需要k8s"><span>理解为什么需要k8s</span></a></h3>
<ul>
<li>可以对多个容器提供编排能力,运行 管理一组多个容器以及容器之间共同使用到的,如桥连网络段,如创建的数据卷Volume,也可以在多个容器间共享</li>
<li>容器需要部署在多个机器上,需要配置跨主机的容器通信方案(非手动,因为难以维护容器间所有通信规则,iptables转发规则,docker+flannel解决了docker跨主机通信)</li>
<li>容器运行在多个机器上,如何确保容器资源使用率监控,容器内服务监控</li>
</ul>
<h3 id="k8s是什么-解决了什么问题" tabindex="-1"><a class="header-anchor" href="#k8s是什么-解决了什么问题"><span>k8s是什么,解决了什么问题</span></a></h3>
<ul>
<li>纯docker运行模式,是一个docker主机,单独管理部署一堆容器应用,数量多了以后,配置复杂之后,难以维护.且跨主机的容器集群,更加难维护
<ul>
<li>业务容器数量庞大,哪些容器部署在哪些节点,使用了哪些端口,如果记录,管理,需要登录到每台机器去管理?</li>
<li>跨主机通信,多个机器之间如果相互调用,ipstables规则手动维护?</li>
<li>跨主机容器相互调用,配置如何写?写死固定ip+port?</li>
<li>如果实现高可用?多个容器对外提供服务如何负载均衡</li>
<li>容器业务中断了,如何感知?感知到以后,如何自动重启新的容器?</li>
<li>如何实现滚动升级保证业务连续性</li>
</ul>
</li>
</ul>
<h3 id="k8s特性" tabindex="-1"><a class="header-anchor" href="#k8s特性"><span>k8s特性</span></a></h3>
<ul>
<li>自动化上线和回滚</li>
<li>存储编排</li>
<li>自动装箱</li>
<li>IPV4/IPV6双协议线</li>
<li>自我修复</li>
<li>服务发现于负载均衡</li>
<li>Secret和配置管理</li>
<li>批量执行</li>
<li>水平扩缩</li>
<li>为拓展性设计</li>
</ul>
<h3 id="k8s核心组件" tabindex="-1"><a class="header-anchor" href="#k8s核心组件"><span>k8s核心组件</span></a></h3>
<p>'''
提供了很多的组件,方便用户从各个角度,更好的维护,管理容器
1.容器的运行高可用,数量保障,版本升级,扩容,缩容
2.容器间网络关系
3.容器间数据共享
4.容器内配置文件加密
5.xxx
'''</p>
<ul>
<li><code v-pre>etcd</code> 保存了集群的状态,分布式高性能数据库</li>
<li><code v-pre>api-server</code> 提供了资源操作的唯一入口,并提供认证 授权 访问控制 api注册与发现机制</li>
<li><code v-pre>controller manager</code> 负责维护集群状态,比如故障检测 自动扩展 滚动更新</li>
<li><code v-pre>scheduler</code> 负责资源的调度,按照预订调度策略将pod调度到相应的node节点上</li>
<li><code v-pre>kubelet</code> 负责维护容器的生命周期,同时也负责Volume(CVI)和网络(CNI)的管理.
<ul>
<li>运行在每个node节点上的代理软件,脏活累活都是它干</li>
<li>pod管理:
<ul>
<li>kubelet定期从监听的数据源获取节点上pod/container的期望状态(运行什么容器,运行的副本数量,网络或者存储如何配置等),并调用对应容器平台接口达到这个状态</li>
</ul>
</li>
<li>容器健康检查
<ul>
<li>kubelet创建了容器之后还要查看容器是否正常运行,如果容器运行出错,就要根据pod设置的重启策略处理</li>
</ul>
</li>
<li>容器监控
<ul>
<li>kubelet会监控所在节点的资源使用情况,并定时向master报告,资源使用数据都是通过cAdvisor获取,知道整个集群所有节点资源情况,对pod调度和正常运行至关重要.</li>
</ul>
</li>
</ul>
</li>
<li>Container runtime 负责镜像管理以及pod和容器的真正运行(CRI)</li>
<li>kube-proxy 负责为Service提供cluster内部的服务发现和负载均衡,主要提供iptables,ipvs规则</li>
<li>kubectl:
<ul>
<li>命令行接口,用于对集群运行命令</li>
</ul>
</li>
</ul>
<h3 id="理解pod创建过程-与效果" tabindex="-1"><a class="header-anchor" href="#理解pod创建过程-与效果"><span>理解pod创建过程,与效果</span></a></h3>
<ul>
<li>pod创建过程
'''
1.在master节点,写入yaml描述你对容器的运行要求,创建pod的要求,install-nginx.yaml
2.使用kubectl命令创建,应用这个资源描述文件 <code v-pre>kubectl create -f install-nginx.yaml</code>我要创建一个pod运行nginx了,命令发给谁
3.验证kubectl命令发来的请求是否被允许利用本地https证书直接写入,请求被允许后才会执行
4.api-server将nginx-pod创建信息,记录到etcd中(镜像版本,容器名,是否端口映射...)
5.api-server再通知下一个组件,scheduler准备pod调度
6.scheduler会去etcd查询信息,判定合适的node节点去部署pod(选择好机器,还未执行)
7.scheduler告诉api-server决定将pod部署在哪个node节点
8.api-server将信息写入etcd,更新数据
9.此时api-server会通知远程具体机器,如k8s-node2上的工作进程kubelet,读取etcd信息,进行创建
'''</li>
</ul>
<h3 id="pod" tabindex="-1"><a class="header-anchor" href="#pod"><span>pod</span></a></h3>
<p>'''
1.pod的ip是随机变化的,删除pod,ip变化
2.pod内都有一个根容器
3.一个pod内可以有一个,多个容器
4.一个pod内所有的容器,共享根容器的网络名称空间,文件系统,进程资源
5.一个pod内的容器网络地址,由根容器提供
'''</p>
<ul>
<li>pod部署几种形态
<ul>
<li>一个pod下一个容器,无状态,无需数据卷</li>
<li>一个pod下一个容器,持久化容器内数据,以卷的形式,放在宿主机上</li>
<li>一个pod下多个容器,共享一个卷的数据</li>
<li>一个pod下多个容器,多个卷</li>
</ul>
</li>
</ul>
<h3 id="容器运行状态" tabindex="-1"><a class="header-anchor" href="#容器运行状态"><span>容器运行状态</span></a></h3>
<ul>
<li>创建容器是为了运行容器,容器有运行状态,表现为创建的成功 失败 问题
<ul>
<li><code v-pre>Waiting</code></li>
<li><code v-pre>Running</code></li>
<li><code v-pre>Terminated</code></li>
</ul>
</li>
</ul>
<h3 id="label" tabindex="-1"><a class="header-anchor" href="#label"><span>Label</span></a></h3>
<ul>
<li>label是识别kubernetes对象的标签,以key-value的方式附加在对象上(key不超过64字节,value可为空,也可不超过253字节的字符串)</li>
<li>label不提供唯一性,并且实际上很多对象(如pod)都使用相同label来标识具体应用</li>
<li>label定义好后其他对象可以使用Label Selector来选择一组相同的label对象.Label Selector支持以下几种方式:
<ul>
<li>等式,如 <code v-pre>app=nginx 或 env!=prod</code></li>
<li>集合,如 <code v-pre>env in (qa,uat)</code></li>
<li>多个label(它们是AND关系) <code v-pre>app=nginx,env = qa</code>
'''
1.label就是标签,用于标识kubernetes对象
2.我们传统对机器上应用查找,都是基于ip:port,但kubernetes中,更多匹配关系,都是基于label
'''</li>
</ul>
</li>
</ul>
<h3 id="namespace" tabindex="-1"><a class="header-anchor" href="#namespace"><span>Namespace</span></a></h3>
<ul>
<li>Namespace是对一组资源和对象的抽象集合,比如可以用来将系统内部的对象划分为不同<strong>资源组</strong>
<ul>
<li>常见的pods,services,replication,controller,deployment都属于某个namespace</li>
<li>node,persistentVolumes等则不属于任何namespace</li>
</ul>
</li>
</ul>
<h3 id="controller-deployment" tabindex="-1"><a class="header-anchor" href="#controller-deployment"><span>Controller(Deployment)</span></a></h3>
<ul>
<li>kubernetes控制器有多种,用在不同场景,如何更好管理pod
<ul>
<li><code v-pre>replication controller</code> 副本控制器,主要控制pod数量</li>
<li>``</li>
<li>``</li>
</ul>
</li>
</ul>
<h3 id="service" tabindex="-1"><a class="header-anchor" href="#service"><span>Service</span></a></h3>
</div></template>


