<template><div><h2 id="分布式锁一-数据库分布式锁" tabindex="-1"><a class="header-anchor" href="#分布式锁一-数据库分布式锁"><span>分布式锁一 数据库分布式锁</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>
<p>java提供的synchronized,Lock是在JVM层面的锁，在单应用部署时，可保证数据的一致性，在集群环境中，仍有可能出问题，这时候需要考虑分布式锁。</p>
</li>
<li>
<p>数据库分布式锁，顾名思义就是基于数据库实现的一种锁，用于保证并发情况下数据一致性。基于mysql数据库的分布式锁有多种，可以用乐观锁或悲观锁实现，也可用一张表来实现分布式悲观锁。主要讲第二种的实现。</p>
</li>
</ul>
<h3 id="实现过程" tabindex="-1"><a class="header-anchor" href="#实现过程"><span>实现过程</span></a></h3>
<ul>
<li>
<p>数据库新建一张表用于，当我们要操作某个流程时，先在数据库里插入一条记录，当这个流程走完以后，再删除这条记录。基于 DB 的唯一索引。</p>
</li>
<li>
<p>当并发请求进来后，先判断这张表是否存在记录，如果不存在则执行流程，存在的话，则结束本次请求。</p>
</li>
</ul>
<h3 id="代码片段" tabindex="-1"><a class="header-anchor" href="#代码片段"><span>代码片段</span></a></h3>
<ul>
<li>新建一张表,<strong>业务类型</strong>和<strong>业务ID</strong>做联合唯一索引。</li>
</ul>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">DROP</span> <span class="token keyword">TABLE</span> <span class="token keyword">IF</span> <span class="token keyword">EXISTS</span> <span class="token identifier"><span class="token punctuation">`</span>cs_one_by_one<span class="token punctuation">`</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> <span class="token identifier"><span class="token punctuation">`</span>cs_one_by_one<span class="token punctuation">`</span></span> <span class="token punctuation">(</span></span>
<span class="line">  <span class="token identifier"><span class="token punctuation">`</span>BIZ_TYPE<span class="token punctuation">`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">32</span><span class="token punctuation">)</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">'业务类型'</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token identifier"><span class="token punctuation">`</span>BIZ_ID<span class="token punctuation">`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">64</span><span class="token punctuation">)</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">'业务ID'</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token identifier"><span class="token punctuation">`</span>METHOD<span class="token punctuation">`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">32</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">'方法'</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token identifier"><span class="token punctuation">`</span>CREATED_TIME<span class="token punctuation">`</span></span> <span class="token keyword">timestamp</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token keyword">CURRENT_TIMESTAMP</span> <span class="token keyword">ON</span> <span class="token keyword">UPDATE</span> <span class="token keyword">CURRENT_TIMESTAMP</span> <span class="token keyword">COMMENT</span> <span class="token string">'创建时间'</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span> <span class="token punctuation">(</span><span class="token identifier"><span class="token punctuation">`</span>BIZ_TYPE<span class="token punctuation">`</span></span><span class="token punctuation">,</span><span class="token identifier"><span class="token punctuation">`</span>BIZ_ID<span class="token punctuation">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token keyword">UNIQUE</span> <span class="token keyword">KEY</span> <span class="token identifier"><span class="token punctuation">`</span>UI_CS_ONE_BY_ONE_BIZ_TYPE_BIZ_ID<span class="token punctuation">`</span></span> <span class="token punctuation">(</span><span class="token identifier"><span class="token punctuation">`</span>BIZ_TYPE<span class="token punctuation">`</span></span><span class="token punctuation">,</span><span class="token identifier"><span class="token punctuation">`</span>BIZ_ID<span class="token punctuation">`</span></span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">)</span> <span class="token keyword">ENGINE</span><span class="token operator">=</span><span class="token keyword">InnoDB</span> <span class="token keyword">DEFAULT</span> <span class="token keyword">CHARSET</span><span class="token operator">=</span>utf8 <span class="token keyword">COMMENT</span><span class="token operator">=</span><span class="token string">'OneByOne控制表'</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>实体类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OneByOne</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/** 业务类型 */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> bizType<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/** 业务ID */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> bizId<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/** 方法 */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> method<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/** 创建时间 */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">Date</span>   createTime<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> description<span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">boolean</span> insertSuccess<span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    </span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 创建一个接一个处理记录</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">bizType</span> 业务类型</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">bizId</span> 业务ID </span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">method</span> 方法</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">OneByOne</span><span class="token punctuation">(</span><span class="token class-name">String</span> bizType<span class="token punctuation">,</span> <span class="token class-name">String</span> bizId<span class="token punctuation">,</span> <span class="token class-name">String</span> method<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>bizType <span class="token operator">=</span> bizType<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>bizId <span class="token operator">=</span> bizId<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>method <span class="token operator">=</span> method<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 获取业务类型</span>
<span class="line">     * <span class="token keyword">@return</span> 业务类型</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getBizType</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> bizType<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 设置业务类型</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">bizType</span> 业务类型</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setBizType</span><span class="token punctuation">(</span><span class="token class-name">String</span> bizType<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>bizType <span class="token operator">=</span> bizType<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 获取业务ID</span>
<span class="line">     * <span class="token keyword">@return</span> 业务ID</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getBizId</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> bizId<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 设置业务ID</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">bizId</span> 业务ID</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setBizId</span><span class="token punctuation">(</span><span class="token class-name">String</span> bizId<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>bizId <span class="token operator">=</span> bizId<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 获取方法</span>
<span class="line">     * <span class="token keyword">@return</span> 方法</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> method<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 设置方法</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">method</span> 方法</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setMethod</span><span class="token punctuation">(</span><span class="token class-name">String</span> method<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>method <span class="token operator">=</span> method<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 获取创建时间</span>
<span class="line">     * <span class="token keyword">@return</span> 创建时间</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">Date</span> <span class="token function">getCreateTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> createTime<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 设置创建时间</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">createTime</span> 创建时间</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setCreateTime</span><span class="token punctuation">(</span><span class="token class-name">Date</span> createTime<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>createTime <span class="token operator">=</span> createTime<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * <span class="token keyword">@return</span> the description</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token class-name">String</span> <span class="token function">getDescription</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> description<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">description</span> the description to set</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">void</span> <span class="token function">setDescription</span><span class="token punctuation">(</span><span class="token class-name">String</span> description<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>description <span class="token operator">=</span> description<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * <span class="token keyword">@return</span> the insertSuccess</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">boolean</span> <span class="token function">isInsertSuccess</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> insertSuccess<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">insertSuccess</span> the insertSuccess to set</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">void</span> <span class="token function">setInsertSuccess</span><span class="token punctuation">(</span><span class="token keyword">boolean</span> insertSuccess<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>insertSuccess <span class="token operator">=</span> insertSuccess<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>处理模板</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//回调接口</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">CallBack</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 调用</span>
<span class="line">     * <span class="token keyword">@return</span> 结果</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token class-name">T</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * 一个接一个业务处理模版<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">></span></span></span>
<span class="line"> * 防止在请求并发下，业务重复处理，比如重复充值。<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">></span></span></span>
<span class="line"> */</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">OneByOneTemplate</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 执行</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">oneByOne</span> 一个接一个处理记录</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">callBack</span> 回调</span>
<span class="line">     * <span class="token keyword">@return</span> 执行结果</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token class-name">T</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token class-name">OneByOne</span> oneByOne<span class="token punctuation">,</span> <span class="token class-name">CallBack</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> callBack<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * 一个接一个业务处理模版默认实现<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">></span></span></span>
<span class="line"> * </span>
<span class="line"> * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span></span>
<span class="line"> * 用一个业务处理表记录，在处理前对锁状态进行判断 ，判断逻辑参见<span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token punctuation">#</span><span class="token field">beforeInvoke</span></span><span class="token punctuation">}</span>方法<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">></span></span></span>
<span class="line"> * </span>
<span class="line"> * 业务处理表： 业务类型 PK|业务ID PK|方法|创建时间<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">></span></span></span>
<span class="line"> */</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OneByOneTemplateImpl</span> <span class="token keyword">implements</span> <span class="token class-name">OneByOneTemplate</span><span class="token punctuation">,</span> <span class="token class-name">InitializingBean</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/** logger */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Logger</span> logger <span class="token operator">=</span> <span class="token class-name">LoggerFactory</span><span class="token punctuation">.</span><span class="token function">getLogger</span><span class="token punctuation">(</span><span class="token class-name">OneByOneTemplateImpl</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/** 插入处理记录 */</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> insert<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/** 删除处理记录 */</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> delete<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/** 表名 */</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> table <span class="token operator">=</span> <span class="token string">"CS_ONE_BY_ONE"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/** 数据源 */</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">DataSource</span> dataSource<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/** 事务模版 */</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">TransactionTemplate</span> transactionTemplate<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/** Jdbc模版 */</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">JdbcTemplate</span> jdbcTemplate<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * <span class="token punctuation">{</span><span class="token keyword">@inheritDoc</span><span class="token punctuation">}</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token class-name">T</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token class-name">OneByOne</span> oneByOne<span class="token punctuation">,</span> <span class="token class-name">CallBack</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> callBack<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        oneByOne<span class="token punctuation">.</span><span class="token function">setDescription</span><span class="token punctuation">(</span>oneByOne<span class="token punctuation">.</span><span class="token function">getBizType</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"-"</span> <span class="token operator">+</span> oneByOne<span class="token punctuation">.</span><span class="token function">getBizId</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"-"</span> <span class="token operator">+</span> oneByOne<span class="token punctuation">.</span><span class="token function">getMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">beforeInvoke</span><span class="token punctuation">(</span>oneByOne<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">            <span class="token keyword">return</span> callBack<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">afterInvoke</span><span class="token punctuation">(</span>oneByOne<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 设置数据源</span>
<span class="line">     * </span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">dataSource</span> 数据源</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setDataSource</span><span class="token punctuation">(</span><span class="token class-name">DataSource</span> dataSource<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>dataSource <span class="token operator">=</span> dataSource<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 设置表名</span>
<span class="line">     * </span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">table</span> 表名</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setTable</span><span class="token punctuation">(</span><span class="token class-name">String</span> table<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>table <span class="token operator">=</span> table<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * <span class="token punctuation">{</span><span class="token keyword">@inheritDoc</span><span class="token punctuation">}</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">afterPropertiesSet</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>dataSource <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">AppException</span><span class="token punctuation">(</span><span class="token class-name">CoreErrorCode</span><span class="token punctuation">.</span><span class="token constant">ERROR_PARAM_NULL</span><span class="token punctuation">,</span> <span class="token string">"数据源为空"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 初始化Jdbc模版和事务模版</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>jdbcTemplate <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">JdbcTemplate</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>dataSource<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>transactionTemplate <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">TransactionTemplate</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">DataSourceTransactionManager</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>dataSource<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 初始化SQL</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>insert <span class="token operator">=</span> <span class="token string">"INSERT INTO "</span> <span class="token operator">+</span> <span class="token keyword">this</span><span class="token punctuation">.</span>table <span class="token operator">+</span> <span class="token string">" (BIZ_TYPE, BIZ_ID, METHOD, CREATED_TIME) VALUES (?, ?, ?, ?)"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>delete <span class="token operator">=</span> <span class="token string">"DELETE FROM "</span> <span class="token operator">+</span> <span class="token keyword">this</span><span class="token punctuation">.</span>table <span class="token operator">+</span> <span class="token string">" WHERE BIZ_TYPE = ? AND BIZ_ID = ?"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 回调前置</span>
<span class="line">     * </span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">oneByOne</span> 一个接一个处理记录</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token annotation punctuation">@SuppressWarnings</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token string">"rawtypes"</span><span class="token punctuation">,</span> <span class="token string">"unchecked"</span> <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">beforeInvoke</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token class-name">OneByOne</span> oneByOne<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            oneByOne<span class="token punctuation">.</span><span class="token function">setInsertSuccess</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">            <span class="token comment">// 插入处理记录</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span>transactionTemplate<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TransactionCallback</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token annotation punctuation">@Override</span></span>
<span class="line">                <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">doInTransaction</span><span class="token punctuation">(</span><span class="token class-name">TransactionStatus</span> status<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    jdbcTemplate<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>insert<span class="token punctuation">,</span> oneByOne<span class="token punctuation">.</span><span class="token function">getBizType</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> oneByOne<span class="token punctuation">.</span><span class="token function">getBizId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> oneByOne<span class="token punctuation">.</span><span class="token function">getMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">                            <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">                    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Throwable</span> t<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            oneByOne<span class="token punctuation">.</span><span class="token function">setInsertSuccess</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>logger<span class="token punctuation">.</span><span class="token function">isWarnEnabled</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                logger<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span>oneByOne<span class="token punctuation">.</span><span class="token function">getDescription</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"插入处理记录失败！异常信息:{}"</span><span class="token punctuation">,</span> t<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">            <span class="token comment">// 如果插入失败，抛出AppException</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">AppException</span><span class="token punctuation">(</span><span class="token class-name">CoreErrorCode</span><span class="token punctuation">.</span><span class="token constant">ONE_BY_ONE_EXCEPTION</span><span class="token punctuation">,</span> oneByOne<span class="token punctuation">.</span><span class="token function">getDescription</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"业务正在处理中"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 回调后置</span>
<span class="line">     * </span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">oneByOne</span> 一个接一个处理记录</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token annotation punctuation">@SuppressWarnings</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token string">"rawtypes"</span><span class="token punctuation">,</span> <span class="token string">"unchecked"</span> <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">afterInvoke</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token class-name">OneByOne</span> oneByOne<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 插入失败，不删除处理记录</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>oneByOne<span class="token punctuation">.</span><span class="token function">isInsertSuccess</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">return</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">            <span class="token comment">// 删除处理记录</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span>transactionTemplate<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TransactionCallback</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token annotation punctuation">@Override</span></span>
<span class="line">                <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">doInTransaction</span><span class="token punctuation">(</span><span class="token class-name">TransactionStatus</span> status<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    jdbcTemplate<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>delete<span class="token punctuation">,</span> oneByOne<span class="token punctuation">.</span><span class="token function">getBizType</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> oneByOne<span class="token punctuation">.</span><span class="token function">getBizId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">                    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Throwable</span> t<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            logger<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>oneByOne<span class="token punctuation">.</span><span class="token function">getDescription</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"删除处理记录失败！"</span><span class="token punctuation">,</span> t<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>使用</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line">oneByOneTemplate<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">OneByOne</span><span class="token punctuation">(</span><span class="token class-name">OneByOneConstant</span><span class="token punctuation">.</span><span class="token constant">BIZ_TYPE_SETTLE_DETAIL_ACCEPT</span><span class="token punctuation">,</span> dto<span class="token punctuation">.</span><span class="token function">getRequestSerialNo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"handle"</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token keyword">new</span> <span class="token class-name">CallBack</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Result</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token annotation punctuation">@Override</span></span>
<span class="line">                <span class="token keyword">public</span> <span class="token class-name">Result</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token class-name">Result</span> result <span class="token operator">=</span> <span class="token function">settleDetailAcceptHandle</span><span class="token punctuation">(</span>dto<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                    <span class="token keyword">return</span> result<span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实现有以下几个问题" tabindex="-1"><a class="header-anchor" href="#实现有以下几个问题"><span>实现有以下几个问题：</span></a></h3>
<ul>
<li>这把锁强依赖数据库的可用性，数据库是一个单点，一旦数据库挂掉，会导致业务系统不可用。</li>
<li>这把锁没有失效时间，一旦解锁操作失败，就会导致锁记录一直在数据库中，其他线程无法再获得到锁。</li>
<li>这把锁只能是非阻塞的，因为数据的insert操作，一旦插入失败就会直接报错。没有获得锁的线程并不会进入排队队列，要想再次获得锁就要再次触发获得锁操作。</li>
<li>这把锁是非重入的，同一个线程在没有释放锁之前无法再次获得该锁。因为数据中数据已经存在了。</li>
</ul>
<h3 id="解决方法" tabindex="-1"><a class="header-anchor" href="#解决方法"><span>解决方法：</span></a></h3>
<ul>
<li>数据库是单点？搞两个数据库，数据之前双向同步。一旦挂掉快速切换到备库上。</li>
<li>没有失效时间？只要做一个定时任务，每隔一定时间把数据库中的超时数据清理一遍。</li>
<li>非阻塞的？搞一个while循环，直到insert成功再返回成功。</li>
<li>非重入的？在数据库表中加个字段，记录当前获得锁的机器的主机信息和线程信息，那么下次再获取锁的时候先查询数据库，如果当前机器的主机信息和线程信息在数据库可以查到的话，直接把锁分配给他就可以了。</li>
</ul>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<p>数据库分布式锁实现上来说，是简单容易理解的。但是其性能以及可靠性，比不上另外两种实现。可适用并发量不是很高的业务上。</p>
</div></template>


