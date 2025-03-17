<template><div><h2 id="分布式事务" tabindex="-1"><a class="header-anchor" href="#分布式事务"><span>分布式事务</span></a></h2>
<ul>
<li>多个服务之间协调处理数据需要保持ACID，这就需要分布式事务</li>
</ul>
<h3 id="分布式事务产生场景" tabindex="-1"><a class="header-anchor" href="#分布式事务产生场景"><span>分布式事务产生场景</span></a></h3>
<ul>
<li>微服务架构跨JVM、跨数据库实例</li>
<li>单体系统跨数据库实例</li>
<li>多服务访问同一数据库实例</li>
</ul>
<h3 id="cap" tabindex="-1"><a class="header-anchor" href="#cap"><span>CAP</span></a></h3>
<ul>
<li>
<p>CAP是一致性Consistency、可用性Availability、分区容错性Partition tolerance缩写</p>
</li>
<li>
<p>一致性<code v-pre>Consistency</code>：</p>
<ul>
<li>一致性是指写操作以后的读操作可以读取最新的数据。（主从结构的，从读的跟主一致）</li>
<li>如何实现：写入主，在同步从的期间，锁定从数据库，待同步完成解锁</li>
<li>一致性特点：
<ul>
<li>1.由于同步的过程，写操作有一定延迟</li>
<li>2.为了保持数据一致会对资源暂时锁定</li>
<li>3.请求同步失败节点会返回错误信息，而不是旧数据</li>
</ul>
</li>
</ul>
</li>
<li>
<p>可用性<code v-pre>Availability</code>:</p>
</li>
</ul>
<ul>
<li>可用性指任何事务操作都会响应结果，且不会出现响应超时或响应错误</li>
<li>如何实现：保证可用则同步过程不能锁定资源;即使没同步成功也会响应旧数据</li>
<li>可用性特点：
<ul>
<li>所有请求都有响应，且不会响应超时或错误</li>
</ul>
</li>
</ul>
<ul>
<li>分区容错性<code v-pre>Partition tolerance</code>:
<ul>
<li>通常分布式系统各节点部署在不同子网，不可避免出现网络问题导致节点间通信失败，此时仍可对外提供服务，叫分区容错性</li>
<li>目标：主数据向从同步数据失败不影响读写操作；其中一个节点挂掉不影响另一个对外提供服务</li>
<li>如何实现：尽量异步取代同步;添加多节点，一个挂掉还有其它提供服务</li>
<li>分区容错性特点：
<ul>
<li>分区容错是分布式系统具备的基本能力</li>
</ul>
</li>
</ul>
</li>
</ul>
<h3 id="cap组合方式" tabindex="-1"><a class="header-anchor" href="#cap组合方式"><span>CAP组合方式</span></a></h3>
<ul>
<li>所有分布式事务场景不会同时具备CAP三个特性，在必须满足P的前提下A和C不能共存</li>
<li>AP：放弃一致性，追求分区容错性和可用性，是很多分布式系统设计的选择
<ul>
<li>通常AP都会保证最终一致性，一些业务场景比如订单退款，今天申请明天到帐</li>
</ul>
</li>
<li>CP：放弃可用性，追求分区容错性和一致性，zk就是追求强一致
<ul>
<li>跨行转账，一次请求要等待双方银行系统都完成整个事务才算完成</li>
</ul>
</li>
<li>CA:：放弃分区容忍性，即不进行分区，不考虑网络不通或节点挂掉情况，最常用的关系型数据库就是满足CA</li>
<li>总结：一个分布式系统最多只能满足CP或AP，对于大多数互联网应用场景，节点众多，部署分散，节点故障不可避免，而且要满足服务高可用（99.99...%),并要达到良好的响应性能，一般都会保证AP，舍弃C，保证最终一致性</li>
</ul>
<h3 id="base理论" tabindex="-1"><a class="header-anchor" href="#base理论"><span>BASE理论</span></a></h3>
<ul>
<li>强一致性和最终一致性：
<ul>
<li>CAP理论告诉我们一个分布式系统最多满足两项，而AP实际应用中较多，但实际生产中很多场景都需要实现一致性。CAP理论的C要求任何时间查询每个节点数据都必须一致（强一致性），而最终一致性是指允许一段时间内每个节点数据不一致，但最终保证数据一致性</li>
</ul>
</li>
<li>Base理论：
<ul>
<li>BASE是Basically Avilable(基本可用)、Soft state(软状态)和 Eventually consistent(最终一致性)的缩写，BASE理论是对CAP理论中AP的扩展，通过牺牲强一致性获得可用性，允许数据一段时间内不一致，最终达到一致状态。满足BASE理论的事务，我们称为<strong>柔性事务</strong></li>
</ul>
<ul>
<li>基本可用：分布式系统在出现故障时，允许损失部分可用功能，保证核心功能可用</li>
<li>软状态：由于不要求强一致性，所以BASE允许系统存在中间状态（也叫软状态），这个状态不影响系统可用性 。如订单状态&quot;支付中&quot;</li>
<li>最终一致：经过一段时间后，所有节点数据最终达到一致，但需要一定时间延迟</li>
</ul>
</li>
</ul>
<h3 id="分布式解决方案" tabindex="-1"><a class="header-anchor" href="#分布式解决方案"><span>分布式解决方案</span></a></h3>
<ul>
<li>2pc</li>
<li>tcc</li>
<li>可靠消息最终一致性</li>
<li>最大努力通知</li>
</ul>
<h3 id="_1-分布式事务解决方案之2pc-两阶段提交" tabindex="-1"><a class="header-anchor" href="#_1-分布式事务解决方案之2pc-两阶段提交"><span>1.分布式事务解决方案之2PC（两阶段提交）</span></a></h3>
<ul>
<li>2PC,是将整个事务流程分为两个阶段，准备阶段（Prepare phase）、提交阶段（commit phase）</li>
<li>准备阶段：事务管理器(TM)给每个参与者发送Prepare消息，每个事务参与者(RM)在本地执行事务，并写本地Undo/Redo日志，此时事务未提交</li>
<li>提交阶段：如果事务管理器收到参与者执行失败或超时信息时，直接给参与者发送rollback指令；否则发送commit指令。参与者根据指令执行操作，最后阶段释放事务处理过程中的锁资源</li>
</ul>
<h4 id="xa方案" tabindex="-1"><a class="header-anchor" href="#xa方案"><span>XA方案</span></a></h4>
<ul>
<li>2pc传统方案是数据库层面的实现，如Oracle|MySQL都支持2pc协议，为了统一行业标准，定义了分布式事务处理模型DTP</li>
<li>DTP模型角色：
<ul>
<li>AP<code v-pre>application program</code>：应用程序，可以理解为使用DTP分布式事务的程序</li>
<li>RM<code v-pre>resource manage</code>：资源管理器，数据库实例，控制分支事务的角色</li>
<li>TM<code v-pre>transcation manage</code>:事务管理器,负责协调和管理事务，事务管理器控制着全局事务，并协调各RM</li>
<li>DTP模型定义了TM和RM之间的接口通讯规范叫XA。简单理解就是数据库提供2pc接口协议，<strong>基于数据库的XA协议来实现2pc又称为XA方案</strong></li>
</ul>
</li>
<li>XA方案问题
<ul>
<li>需要本地数据库支持XA协议</li>
<li>资源锁定需要等待两个阶段执行完才放锁，性能较差</li>
</ul>
</li>
</ul>
<h4 id="seata方案" tabindex="-1"><a class="header-anchor" href="#seata方案"><span>seata方案</span></a></h4>
<ul>
<li>seata是阿里开源的分布式事务框架，传统2pc的问题在seata中得到了解决。它通过对本地关系型数据库分支事务的协调来驱动完成全局事务，是工作在应用层的中间件。性能好，不长时间占用连接资源。它提供的AT模式（即2PC）及TCC模式的分布式解决方案。</li>
<li>seata设计思想：
<ul>
<li>seata把分布式事务理解成一个包含了若干<strong>分支事务</strong>的<strong>全局事务</strong>，全局事务的职责是协调其下分支事务达成一致，要么全成功，要么全失败。</li>
</ul>
</li>
<li>seata三个组件：
<ul>
<li>TC<code v-pre>transcation coordinator</code>：事务协调器，它是独立中间件，独立部署维护全局事务运行状态，接收TM指令发起全局事务提交和回滚，负责和RM通信协调个分支的提交与回滚</li>
<li>TM<code v-pre>transcation manage</code>：事务管理器，需要嵌入程序中，它负责开启一个全局事务，并最终向TC发起全局提交或全局回滚</li>
<li>RM<code v-pre>resource manage</code>：控制分支事务，负责分支事务注册，状态汇报，并接收TC指令，驱动分支（本地）事务提交和回滚</li>
</ul>
</li>
<li>执行流程
<ul>
<li>用户服务的TM向TC申请开启一个全局事务，创建成功TC生成一个全局唯一XID</li>
<li>用户服务的RM向TC注册分支事务，执行用户逻辑（插入数据），并将其纳入XID全局事务管辖</li>
<li>逻辑执行到远程调用积分服务时（XID在调用链路上下文传播），积分服务的RM向TC注册分支事务，并执行积分逻辑（操作数据），执行完毕后返回用户服务</li>
<li>TM向TC发起针对XID的全局提交或回滚</li>
<li>TC调度XID下辖的全部分支事务完成提交或回滚提交（回滚反响操作，删掉数据，不需要锁定资源）
<img :src="$withBase('/transcation/1.png')" alt="dock"></li>
</ul>
</li>
<li>seate实现2pc与传统2pc差别：
<ul>
<li>架构层面，传统2pc的RM实际是数据库层，通过XA实现；  而seata的RM是jar包形式作为中间件部署在应用程序这一侧</li>
<li>两阶段提交层面，传统2pc无论第二阶段是rollback还是commit,事务资源锁都要保持到phase2才释放；seata做法是phase1就将本地事务提交，这样提高整体效率</li>
</ul>
</li>
</ul>
<h3 id="_2-分布式事务解决方案之tcc" tabindex="-1"><a class="header-anchor" href="#_2-分布式事务解决方案之tcc"><span>2.分布式事务解决方案之TCC</span></a></h3>
<ul>
<li>TCC是Try、Confirm、Cancle三个词语的缩写，TCC要求每个分支事务实现三个操作：预处理try、确认confirm、撤销cancel。try操作做业务检查和资源预留；confirm做业务确认操作；cancel实现一个和try相反的回滚操作。</li>
<li>TM首先发起所有分支事务的try操作，任何一个分支事务try操作失败，TM则进行cancel操作，若try全部成功，TM则发起confirm操作。confirm/cancel若执行失败，则会重试</li>
</ul>
<h4 id="tcc的三个阶段" tabindex="-1"><a class="header-anchor" href="#tcc的三个阶段"><span>TCC的三个阶段</span></a></h4>
<ul>
<li>Try阶段是做业务检查（一致性）及资源预留（隔离），此阶段和后续的Confirm一起才构成真正完整的业务逻辑</li>
<li>Confirm阶段做确认提交，Try阶段所有分支事务执行成功后执行Confirm。通常情况下，采用TCC默认Confirm阶段是不会失败的，若真的失败，需引入人工介入以及重试机制</li>
<li>Cancel阶段在业务执行错误需要回滚状态下执行分支事务的业务取消，预留资源释放。通常情况下，TCC默认的Cancle也是一定成功的。若失败，需引入人工介入以及重试机制</li>
<li>TM事务管理器：TM事务管理器可以实现为独立的服务，也可以让<strong>全局事务发起方</strong>充当TM角色，TM独立出来是为了充当公共组件复用。</li>
</ul>
<p>TM在发起全局事务同时生成全局事务记录，全局事务ID贯穿整个分布式事务调用链条，用来记录事务上下文，追踪和记录状态，由于Confirm和Cancel失败需重试，因此需要实现幂等性。</p>
<h3 id="_3-分布式事务解决方案之可靠消息最终一致性" tabindex="-1"><a class="header-anchor" href="#_3-分布式事务解决方案之可靠消息最终一致性"><span>3.分布式事务解决方案之可靠消息最终一致性</span></a></h3>
<ul>
<li>可靠消息最终一致性方案是指当事务发起方执行完本地事务后并发出一条消息，事务参与方（消息消费者）一定能够接收消息并处理事务成功，此方案强调的是只要消费发给事务参与方，最终要达到一致</li>
<li>此方案是消息中间件完成：
<ul>
<li>事务发起方（消息生产者）将消息发给消息中间件，事务参与方从消息中间件接收消息，事务发起方和消息中间件之间、事务参与方与消息中间件之间都是通过网络通信</li>
</ul>
</li>
<li>可靠消息最终一致性需要解决几个问题：
<ul>
<li>本地事务与消息发送的原子性问题（）</li>
<li>事务参与方接收消息可靠性  （ack）</li>
<li>消息重复消费问题（幂等）</li>
</ul>
</li>
</ul>
<h4 id="可靠消息最终一致性——本地消息表方案" tabindex="-1"><a class="header-anchor" href="#可靠消息最终一致性——本地消息表方案"><span>可靠消息最终一致性——本地消息表方案</span></a></h4>
<ul>
<li>此方案的核心是通过本地事务保证数据业务操作和消息的一致性，然后通过定时任务将消费发送至消息中间件，待确认消息发送给消费方后再将消息删除</li>
<li>方案：
<ul>
<li>事务发起方新增消息日志表，操作本地事务并增加日志。定时任务触发日志到MQ，让下游事务参与方完成事务</li>
</ul>
</li>
</ul>
<h4 id="可靠消息最终一致性——rocketmq事务消息方案" tabindex="-1"><a class="header-anchor" href="#可靠消息最终一致性——rocketmq事务消息方案"><span>可靠消息最终一致性——RocketMQ事务消息方案</span></a></h4>
<ul>
<li>方案：
<ul>
<li>MQ发起方会向MQ Server发送消息，MQ Server接收消息会向MQ发起方回应成功</li>
<li>MQ发起方收到回应，会向MQ Server发送Commit 或者Rollback指令</li>
<li>MQ Server接收到指令了会执行对应Commit或者Rollback操作，选择是否让MQ订阅方消费</li>
</ul>
</li>
<li>注意点：
<ul>
<li>为了防止网络问题导致发起方和MQ Server发送 Commit 或者Rollback指令断掉，会有个<strong>回查事务</strong>，需要事务发起方实现一个<code v-pre>RocketMQLocalTranscationListener</code>接口</li>
</ul>
</li>
</ul>
<h3 id="_4-分布式事务解决方案之最大努力通知" tabindex="-1"><a class="header-anchor" href="#_4-分布式事务解决方案之最大努力通知"><span>4.分布式事务解决方案之最大努力通知</span></a></h3>
<ul>
<li>最大努力通知方案目标：发起通知方通过一定机制最大努力将业务处理结果通知给接收方
<ul>
<li>一定的重复通知机制</li>
<li>提供接口给接收方主动查询</li>
</ul>
</li>
</ul>
<h3 id="最大努力通知与可靠消息一致性区别" tabindex="-1"><a class="header-anchor" href="#最大努力通知与可靠消息一致性区别"><span>最大努力通知与可靠消息一致性区别</span></a></h3>
<ul>
<li>方案思想不同
<ul>
<li>最大努力通知：发起通知方尽最大努力将业务处理结果通知接收通知方，并提供接口供接收通知方查询，通知可靠性在于接收方保证</li>
<li>可靠消息一致性：消息通知方需保证消息发出去并通知接收方，消息可靠性又发起方保证</li>
</ul>
</li>
<li>业务场景不同
<ul>
<li>最大努力通知：关注的是交易后的通知事务，即将交易可靠的通知出去</li>
<li>可靠消息一致性：关注的是交易过程事务一致性，以异步方式完成交易</li>
</ul>
</li>
<li>技术解决方案不同
<ul>
<li>最大努力通知：无法保证消息发出去到接收的一致性，只提供消息接收的可靠性机制</li>
<li>可靠消息一致性：解决的是消息发出到接收的一致性，即发出消息并被接收</li>
</ul>
</li>
</ul>
</div></template>


