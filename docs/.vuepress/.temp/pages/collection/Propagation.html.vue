<template><div><h2 id="事务的传播机制" tabindex="-1"><a class="header-anchor" href="#事务的传播机制"><span>事务的传播机制</span></a></h2>
<h3 id="什么是事务" tabindex="-1"><a class="header-anchor" href="#什么是事务"><span>什么是事务</span></a></h3>
<ul>
<li>事务是程序中一系列严密的操作，所有操作执行必须成功完成，否则在每个操作所做的更改将会被撤销，这也是事务的原子性（要么成功，要么失败）。</li>
<li>数据库向用户提供保存当前程序状态的方法，叫事务提交（commit）；当事务执行过程中，使数据库忽略当前的状态并回到前面保存的状态的方法叫事务回滚（rollback）</li>
</ul>
<h3 id="事务的传播机制-1" tabindex="-1"><a class="header-anchor" href="#事务的传播机制-1"><span>事务的传播机制</span></a></h3>
<ul>
<li>
<p>事务属性通常由事务的传播行为，事务的隔离级别，事务的超时值和事务只读标志组成。我们在进行事务划分时，需要进行事务定义，也就是配置事务的属性。</p>
</li>
<li>
<p>spring在TransactionDefinition接口中定义了七个事务传播行为<code v-pre>Propagation</code>：</p>
<ul>
<li>REQUIRED  _如果当前没有事务，就新建一个事务，如果已存在一个事务中，加入到这个事务中，这是最常见的选择。</li>
<li>SUPPORTS _支持当前事务，如果没有当前事务，就以非事务方法执行</li>
<li>MANDATORY _使用当前事务，如果没有当前事务，就抛出异常。</li>
<li>REQUIRES_NEW _新建事务，如果当前存在事务，把当前事务挂起</li>
<li>NOT_SUPPORTED _以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。</li>
<li>NEVER _以非事务方式执行操作，如果当前事务存在则抛出异常。</li>
<li>NESTED _如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行与propagation_required类似的操作</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>使用PROPAGATION_REQUIRES_NEW,需要使用JtaTransactionManager作为事务管理器。</li>
<li>PROPAGATION_NOT_SUPPORTED,也需要使用JtaTransactionManager作为事务管理器</li>
</ul>
</div>
</li>
</ul>
</div></template>


