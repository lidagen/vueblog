<template><div><h2 id="部署对象和流程定义相关的表" tabindex="-1"><a class="header-anchor" href="#部署对象和流程定义相关的表"><span>部署对象和流程定义相关的表</span></a></h2>
<ul>
<li>act_re_deployment 部署对象表</li>
<li>act_re_procdef 流程定义表</li>
<li>act_ge_bytearray 资源文件表</li>
<li>act_ge_property 主键生成策略表</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>先获取流程对象，在创建时自动加载classpath下的activiti.cfg.xml</li>
<li>首先获取默认的流程引擎，通过流程引擎获取一个RepositoryService仓库对象</li>
<li>由仓库的服务对象产生一个部署配置对象，用来封装部署操作的相关配置</li>
<li>这是一个链式编程，在部署配置对象中设置显示名，上传流程定义规则文件</li>
<li>向数据库表中存放流程定义的规则信息
<ul>
<li>这一步将操作三张表
<ul>
<li><code v-pre>act_re_deployment</code> 部署对象表<br>
存放流程定义的显示名和部署时间，每部署一次增加一条记录</li>
<li><code v-pre>act_re_procdef</code> 流程定义表<br>
存放流程定义的属性信息，部署每个新的流程定义都会在此表增加一条记录<br>
当流程定义key相同时，会增加version字段</li>
<li><code v-pre>act_ge_bytearray</code> 资源文件表<br>
流程定义相关的部署信息，既流程定义的资源存放地，每部署一次增加两条记录，一条关于bpmn文件的，一条关于
png的。以二进制形式存储在数据库中</li>
</ul>
</li>
</ul>
</li>
</ul>
</div>
<h2 id="流程定义表操作-act-re-procdef" tabindex="-1"><a class="header-anchor" href="#流程定义表操作-act-re-procdef"><span>流程定义表操作 <em>act_re_procdef</em></span></a></h2>
<ul>
<li>表字段</li>
</ul>
<p>字段名称 | 字段 |  备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID_ |  主键ID
乐观锁 | REV_ |  默认值 NULL，version版本
类别 | CATEGORY_ |  流程定义的Namespace就是类别
名称 | NAME_ |   	名称
KEY | KEY_ |  	流程定义的ID
版本 | VERSION_ |   版本
部署表ID | DEPLOYMENT_ID_ | 	部署表ID
bpmn文件名称 | RESOURCE_NAME_ | 流程bpmn文件名称
png图片名称 | DGRM_RESOURCE_NAME_ |  流程图片名称
描述 | DESCRIPTION_ |
是否存在开始节点formKey | HAS_START_FORM_KEY_ | start节点是否存在formKey（0：否、1：是）
角色ID | HAS_GRAPHICAL_NOTATION_ |
是否挂起 | SUSPENSION_STATE_ |
租户ID | TENANT_ID_ |</li>
</ul>
<h3 id="查询流程定义" tabindex="-1"><a class="header-anchor" href="#查询流程定义"><span>查询流程定义</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**查询流程定义**/</span></span>
<span class="line"><span class="token annotation punctuation">@Test</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">findProcess</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/***act_re_procdef 流程定义表 **/</span></span>
<span class="line">    <span class="token class-name">ProcessDefinition</span> processDefinition <span class="token operator">=</span> processEngine<span class="token punctuation">.</span><span class="token function">getRepositoryService</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">                        <span class="token punctuation">.</span><span class="token function">createProcessDefinitionQuery</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token comment">//创建一个流程定义查询</span></span>
<span class="line">                        <span class="token punctuation">.</span><span class="token function">deploymentId</span><span class="token punctuation">(</span><span class="token string">"2501"</span><span class="token punctuation">)</span><span class="token comment">//部署对象deployment_id查询</span></span>
<span class="line">            <span class="token comment">//			.processDefinitionId("myProcess_1:1:4")//流程定义ID查询</span></span>
<span class="line">            <span class="token comment">//			.processDefinitionKey()//根据Key查询，返回集合</span></span>
<span class="line"></span>
<span class="line">            <span class="token comment">//			.list();//集合</span></span>
<span class="line">                        <span class="token punctuation">.</span><span class="token function">singleResult</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//单个对象</span></span>
<span class="line">            <span class="token comment">//			.count();//count</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>processDefinition<span class="token punctuation">.</span><span class="token function">getCategory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>processDefinition<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//对应.bpmn中的name属性值</span></span>
<span class="line">	processDefinition<span class="token punctuation">.</span><span class="token function">getKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//对应.bpmn中的id属性值</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="删除流程定义" tabindex="-1"><a class="header-anchor" href="#删除流程定义"><span>删除流程定义</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**删除流程定义**/</span></span>
<span class="line">	<span class="token annotation punctuation">@Test</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">deleteProcess</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token class-name">String</span> deploymentId <span class="token operator">=</span> <span class="token string">"1"</span><span class="token punctuation">;</span></span>
<span class="line">		processEngine<span class="token punctuation">.</span><span class="token function">getRepositoryService</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">				<span class="token comment">//.deleteDeployment(deploymentId);//不带级联的删除,只能删除没有启动的流程，</span></span>
<span class="line">                <span class="token comment">//如果流程启动，就会抛出异常</span></span>
<span class="line">				<span class="token punctuation">.</span><span class="token function">deleteDeployment</span><span class="token punctuation">(</span>deploymentId<span class="token punctuation">,</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//级联删除，启动也能删除</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="查看流程图" tabindex="-1"><a class="header-anchor" href="#查看流程图"><span>查看流程图</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**查看流程图**/</span></span>
<span class="line">	<span class="token annotation punctuation">@Test</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">viewPic</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token keyword">throws</span> <span class="token class-name">Exception</span><span class="token punctuation">{</span></span>
<span class="line">		<span class="token class-name">String</span> deploymentId <span class="token operator">=</span> <span class="token string">"2501"</span><span class="token punctuation">;</span><span class="token comment">//act_ge_bytearray 的deploymentId值</span></span>
<span class="line">		<span class="token class-name">String</span> name <span class="token operator">=</span> <span class="token string">"diagrams/hello.png"</span><span class="token punctuation">;</span> <span class="token comment">//act_ge_bytearray 的name值</span></span>
<span class="line">		<span class="token doc-comment comment">/**将生成文件放到文件夹下**/</span></span>
<span class="line">		<span class="token class-name">InputStream</span> in <span class="token operator">=</span> processEngine<span class="token punctuation">.</span><span class="token function">getRepositoryService</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">				<span class="token punctuation">.</span><span class="token function">getResourceAsStream</span><span class="token punctuation">(</span>deploymentId<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token doc-comment comment">/**写入D盘下**/</span></span>
<span class="line">		<span class="token class-name">File</span> file <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span><span class="token string">"D:/"</span><span class="token operator">+</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//commons-io jar</span></span>
<span class="line">        <span class="token class-name">FileUtils</span><span class="token punctuation">.</span><span class="token function">copyInputStreamToFile</span><span class="token punctuation">(</span>in<span class="token punctuation">,</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="查询最新流程定义" tabindex="-1"><a class="header-anchor" href="#查询最新流程定义"><span>查询最新流程定义</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**查询最新版本的流程定义**/</span></span>
<span class="line"><span class="token annotation punctuation">@Test</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">findLastVersion</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line"><span class="token doc-comment comment">/***act_re_procdef key相同的最新version **/</span></span>
<span class="line"><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ProcessDefinition</span><span class="token punctuation">></span></span> list <span class="token operator">=</span> processEngine<span class="token punctuation">.</span><span class="token function">getRepositoryService</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">                                    <span class="token punctuation">.</span><span class="token function">createProcessDefinitionQuery</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">                                    <span class="token punctuation">.</span><span class="token function">orderByProcessDefinitionVersion</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token comment">//version</span></span>
<span class="line">                                    <span class="token punctuation">.</span><span class="token function">asc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token comment">//使用流程定义的升序排序</span></span>
<span class="line">                                    <span class="token punctuation">.</span><span class="token function">list</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span><span class="token class-name">ProcessDefinition</span><span class="token punctuation">></span></span> processDefinitionMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LinkedHashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">CollectionUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>list<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">ProcessDefinition</span> pd <span class="token operator">:</span> list<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        processDefinitionMap<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>pd<span class="token punctuation">.</span><span class="token function">getKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>pd<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ProcessDefinition</span><span class="token punctuation">></span></span> arrayList <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>processDefinitionMap<span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">ProcessDefinition</span> processDefinition <span class="token operator">:</span> arrayList<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>processDefinition<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="批量删除流程定义" tabindex="-1"><a class="header-anchor" href="#批量删除流程定义"><span>批量删除流程定义</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"> <span class="token doc-comment comment">/**删除key相同的不同版本流程定义**/</span></span>
<span class="line"><span class="token annotation punctuation">@Test</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">deleteByKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/***act_re_procdef key相同的最新**/</span></span>
<span class="line">    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ProcessDefinition</span><span class="token punctuation">></span></span> list <span class="token operator">=</span> processEngine<span class="token punctuation">.</span><span class="token function">getRepositoryService</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">                                    <span class="token punctuation">.</span><span class="token function">createProcessDefinitionQuery</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">                                    <span class="token punctuation">.</span><span class="token function">processDefinitionKey</span><span class="token punctuation">(</span><span class="token string">"key"</span><span class="token punctuation">)</span></span>
<span class="line">                                    <span class="token punctuation">.</span><span class="token function">list</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">CollectionUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>list<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">ProcessDefinition</span> pd <span class="token operator">:</span> list<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">String</span> deploymentId <span class="token operator">=</span> pd<span class="token punctuation">.</span><span class="token function">getDeploymentId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            processEngine<span class="token punctuation">.</span><span class="token function">getRepositoryService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">deleteDeployment</span><span class="token punctuation">(</span>deploymentId<span class="token punctuation">,</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>流程定义是不能修改的</li>
<li>控制修改(使用流程定义的key相同的情况下,版本升级)</li>
</ul>
</div>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<ul>
<li>
<font color=#A23400 >Deployment 部署对象</font><ul>
<li>一次部署多个文件的信息,对于不需要的流程可以删除和修改</li>
<li>对应的表
<ul>
<li><code v-pre>act_re_deployment</code> 部署对象表</li>
<li><code v-pre>act_re_procdef</code> 流程定义表</li>
<li><code v-pre>act_ge_bytearray</code> 资源文件表</li>
<li><code v-pre>act_ge_property</code> 主键生成策略表</li>
</ul>
</li>
</ul>
</li>
<li>
<font color=#A23400 >ProcessDefinition 部署对象</font><ul>
<li>解析.bpmn后得到的流程定义规则的信息,工作流系统就是安装流程定义的规则执行的。</li>
</ul>
</li>
</ul>
</div></template>


