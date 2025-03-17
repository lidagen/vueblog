<template><div><h2 id="流程变量" tabindex="-1"><a class="header-anchor" href="#流程变量"><span>流程变量</span></a></h2>
<h3 id="流程变量的作用" tabindex="-1"><a class="header-anchor" href="#流程变量的作用"><span>流程变量的作用</span></a></h3>
<ul>
<li>用来传递业务参数</li>
<li>指定连线完成任务(同意/拒绝)</li>
<li>动态指定任务的办理人</li>
</ul>
<h3 id="表" tabindex="-1"><a class="header-anchor" href="#表"><span>表</span></a></h3>
<ul>
<li><code v-pre>act_ru_variable</code> 正在执行的流程变量表</li>
<li><code v-pre>act_hi_varinst</code> 历史的流程变量表</li>
</ul>
<h3 id="部署、启动" tabindex="-1"><a class="header-anchor" href="#部署、启动"><span>部署、启动</span></a></h3>
<ul>
<li>略 参见 <RouteLink to="/activiti/act1.html#%E6%B5%81%E7%A8%8B%E6%B5%81%E8%BD%AC%E8%BF%87%E7%A8%8B">helloWord</RouteLink> 部署启动部分</li>
</ul>
<h3 id="设置-获取流程变量" tabindex="-1"><a class="header-anchor" href="#设置-获取流程变量"><span>设置\获取流程变量</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**设置流程变量**/</span></span>
<span class="line">	<span class="token annotation punctuation">@Test</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setVariables</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token comment">// act_ru_variable 正在执行的流程变量表</span></span>
<span class="line">		<span class="token class-name">TaskService</span> taskService <span class="token operator">=</span> processEngine<span class="token punctuation">.</span><span class="token function">getTaskService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token comment">//taskService.setVariableLocal();与任务ID task_id 绑定</span></span>
<span class="line">		taskService<span class="token punctuation">.</span><span class="token function">setVariable</span><span class="token punctuation">(</span><span class="token string">"15008"</span><span class="token punctuation">,</span><span class="token string">"请假天数"</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		taskService<span class="token punctuation">.</span><span class="token function">setVariable</span><span class="token punctuation">(</span><span class="token string">"15008"</span><span class="token punctuation">,</span><span class="token string">"请假日期"</span><span class="token punctuation">,</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token doc-comment comment">/**获取流程变量**/</span></span>
<span class="line">	<span class="token annotation punctuation">@Test</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">getVariables</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token class-name">TaskService</span> taskService <span class="token operator">=</span> processEngine<span class="token punctuation">.</span><span class="token function">getTaskService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token class-name">String</span> taskKey <span class="token operator">=</span><span class="token string">"15008"</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token class-name">Integer</span> days <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Integer</span><span class="token punctuation">)</span>taskService<span class="token punctuation">.</span><span class="token function">getVariable</span><span class="token punctuation">(</span>taskKey<span class="token punctuation">,</span><span class="token string">"请假天数"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token class-name">Date</span> date <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Date</span><span class="token punctuation">)</span>taskService<span class="token punctuation">.</span><span class="token function">getVariable</span><span class="token punctuation">(</span>taskKey<span class="token punctuation">,</span><span class="token string">"请假日期"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token doc-comment comment">/**模拟设置好获取流程变量场景**/</span></span>
<span class="line">	<span class="token annotation punctuation">@Test</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setAndGetVariables</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token doc-comment comment">/**与流程实例，执行对象（正在执行）相关**/</span></span>
<span class="line">		<span class="token class-name">RuntimeService</span> runtimeService <span class="token operator">=</span> processEngine<span class="token punctuation">.</span><span class="token function">getRuntimeService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token doc-comment comment">/**与任务（正在执行）相关**/</span></span>
<span class="line">		<span class="token class-name">TaskService</span> taskService <span class="token operator">=</span> processEngine<span class="token punctuation">.</span><span class="token function">getTaskService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token doc-comment comment">/**设置流程变量**/</span></span>
<span class="line">		<span class="token comment">//表示使用执行对象ID(executionId为act_ru_task的 ID_)，流程变量名称设置变量的值（一次设置一个值）</span></span>
<span class="line">		<span class="token comment">//runtimeService.setVariable(executionId,variableName,value);</span></span>
<span class="line">		<span class="token comment">//设置多个,variables为map,map的key为流程变量名称,value 就是流程变量的值</span></span>
<span class="line">		<span class="token comment">//runtimeService.setVariables(executionId,variables);</span></span>
<span class="line"></span>
<span class="line">		<span class="token comment">//taskService.setVariable(taskId,variableName,value);//表示使用执行任务ID，流程变量名称设置变量的值（一次设置一个值）</span></span>
<span class="line">		<span class="token comment">//taskService.setVariables(taskId,variables);//设置多个</span></span>
<span class="line">		<span class="token doc-comment comment">/**启动时设置变量**/</span></span>
<span class="line">		<span class="token comment">//runtimeService.startProcessInstanceByKey(processDefinitionKey,variables)</span></span>
<span class="line">		<span class="token doc-comment comment">/**完成任务时设置变量**/</span></span>
<span class="line">		<span class="token comment">//taskService.complete(taskId,variables);</span></span>
<span class="line"></span>
<span class="line">		<span class="token comment">//runtimeService.getVariable(executionId,variableName)//执行变量ID和流程变量名称</span></span>
<span class="line">		<span class="token comment">//runtimeService.getVariables(executionId);//执行变量ID获取所有的流程变量,得到map</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning">
<p class="hint-container-title">Warning</p>
<ul>
<li>当一个javabean(序列化)放置到流程变量中,要求javabean属性(注意：<strong>属性发生变化不是属性值</strong>)不能发生变化,如果发生变化,获取时会抛出异常</li>
<li>序列化并生成固定的ID,不会有上述问题</li>
</ul>
</div>
</div></template>


