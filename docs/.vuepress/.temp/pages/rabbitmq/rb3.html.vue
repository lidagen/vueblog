<template><div><h2 id="rabbitmq-集群" tabindex="-1"><a class="header-anchor" href="#rabbitmq-集群"><span>RabbitMQ 集群</span></a></h2>
<h3 id="集群方案原理" tabindex="-1"><a class="header-anchor" href="#集群方案原理"><span>集群方案原理</span></a></h3>
<ul>
<li>RabbitMQ消息中间件本身是基于Erlang编写，Erlang语言天生具备分布式特性（通过同步Erlang集群各节点magic cookie来实现）。因此，RabbitMQ天然支持Clustering,这使得RabbitMQ不需要想ActiveMQ\Kafka那样通过ZooKeeper来实现HA方案和保存集群元数据。集群是保证可靠性的一种方式，同时可以通过水平扩展达到增加消息吞吐能力的目的。</li>
</ul>
<h3 id="镜像模式" tabindex="-1"><a class="header-anchor" href="#镜像模式"><span>镜像模式</span></a></h3>
<ul>
<li>
<p>镜像模式：集群模式非常经典的就是Mirror镜像模式，保证100%数据不丢失，在实际工作中用的最多的。并且实现集群非常的简单，一般互联网大厂都会构建这种镜像集群模式。</p>
</li>
<li>
<p>Mirror镜像队列，目的是为了保证rabbitmq数据的高可靠性解决方案，主要就是实现数据的同步，一般来讲是2-3个实现数据同步（对于100%数据可靠性解决方案一般是3个节点）集群架构如下</p>
</li>
</ul>
<img :src="$withBase('/mq/7.png')" alt="dock">
<h3 id="haproxy" tabindex="-1"><a class="header-anchor" href="#haproxy"><span>HAProxy</span></a></h3>
<ul>
<li>HA Proxy是一个提供高可用性，负载均衡以及基于TCP和HTTP应用代理，支持虚拟主机。HAProxy实现了事件驱动，单一进程模型，此模型支持非常大的连接数</li>
</ul>
</div></template>


