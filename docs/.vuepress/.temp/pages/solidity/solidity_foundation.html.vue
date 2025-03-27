<template><div><h2 id="solidity-基础" tabindex="-1"><a class="header-anchor" href="#solidity-基础"><span>Solidity 基础</span></a></h2>
<h3 id="solidity编译器-remix" tabindex="-1"><a class="header-anchor" href="#solidity编译器-remix"><span>Solidity编译器 Remix</span></a></h3>
<ul>
<li>Solidity编译器是向前兼容的，即新版本兼容旧版本，反之不一定。
<ul>
<li>用于把人类编程语言转成机器语言</li>
</ul>
</li>
<li>EVM版本以城市命名
<ul>
<li>类似java的JVM,运行代码的虚拟机</li>
</ul>
</li>
</ul>
<h3 id="开源协议" tabindex="-1"><a class="header-anchor" href="#开源协议"><span>开源协议</span></a></h3>
<ul>
<li>合约需要定义适用的开源协议,不同的开源协议对应不同SPDX license,需要定义在.sol文件的第一行</li>
<li>spdx.org/licenses/中有不同协议的具体说明</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">// SPDX-License-Identifier: MIT</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="编译器版本" tabindex="-1"><a class="header-anchor" href="#编译器版本"><span>编译器版本</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 所有高于这个版本的编译器都可以编译</span></span>
<span class="line">pragma solidity ^0.8.24<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="solidity基础数据类型" tabindex="-1"><a class="header-anchor" href="#solidity基础数据类型"><span>Solidity基础数据类型</span></a></h3>
<ul>
<li>布尔</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">    <span class="token builtin">bool</span> boolVal_1 <span class="token operator">=</span> true<span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">bool</span> boolVal_2 <span class="token operator">=</span> false<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>uint 无符号整数</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">    </span>
<span class="line">    <span class="token comment">#uint8 可以存储 0 - （2^8-1） 即 0-255以内的数</span></span>
<span class="line">    uint8 uintVar <span class="token operator">=</span> <span class="token number">255</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">#uint256 即 0 - (2^256 -1)</span></span>
<span class="line">    uint256 uintVal_1 <span class="token operator">=</span> <span class="token number">255555555</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>int</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">    int256 intVar <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>bytes</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">    <span class="token comment">#最大可以到32</span></span>
<span class="line">    bytes32 byteVal <span class="token operator">=</span> <span class="token string">"hello world"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># string某种意义上动态分配的bytes，会根据字符串自动分配空间</span></span>
<span class="line">    string strVar <span class="token operator">=</span> <span class="token string">"hello world"</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>address</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">    <span class="token comment"># 区块链上比较特殊的基础数据类型,账户或者合约地址</span></span>
<span class="line">    address addrVar <span class="token operator">=</span> <span class="token number">0x6565A7f3D446AF85aC74eD687E0f75869a56Cd59</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="solidity-函数" tabindex="-1"><a class="header-anchor" href="#solidity-函数"><span>Solidity 函数</span></a></h3>
<ul>
<li>一段业务逻辑，用于对合约中的数据进行计算处理 ,关键字 function</li>
<li>函数拥有访问修饰符，分别是<code v-pre>public</code>、<code v-pre>privete</code>、<code v-pre>internal</code>、<code v-pre>external</code></li>
</ul>
<table>
<thead>
<tr>
<th style="text-align:left">Visibility</th>
<th style="text-align:center">Within contract</th>
<th style="text-align:center">Outside Contracts</th>
<th style="text-align:center">Child Contract</th>
<th style="text-align:center">External Accounts</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">Public</td>
<td style="text-align:center">Y</td>
<td style="text-align:center">Y</td>
<td style="text-align:center">Y</td>
<td style="text-align:center">Y</td>
</tr>
<tr>
<td style="text-align:left">Private</td>
<td style="text-align:center">Y</td>
<td style="text-align:center">N</td>
<td style="text-align:center">N</td>
<td style="text-align:center">N</td>
</tr>
<tr>
<td style="text-align:left">Internal</td>
<td style="text-align:center">Y</td>
<td style="text-align:center">N</td>
<td style="text-align:center">Y</td>
<td style="text-align:center">N</td>
</tr>
<tr>
<td style="text-align:left">External</td>
<td style="text-align:center">N</td>
<td style="text-align:center">Y</td>
<td style="text-align:center">N</td>
<td style="text-align:center">Y</td>
</tr>
</tbody>
</table>
<ul>
<li>
<p>view关键字</p>
<ul>
<li>对函数只会读取，不会修改其中逻辑以及变量</li>
</ul>
</li>
<li>
<p>pure关键字</p>
<ul>
<li>只运算，不会修改变量值</li>
</ul>
</li>
<li>
<p>返回值 returns</p>
<ul>
<li>并且会定义返回的数据类型</li>
</ul>
</li>
<li>
<p>示例</p>
</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line"><span class="token operator">//</span> SPDX<span class="token operator">-</span>License<span class="token operator">-</span>Identifier<span class="token punctuation">:</span> MIT</span>
<span class="line">pragma solidity <span class="token operator">^</span><span class="token number">0.8</span><span class="token number">.24</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">contract HelloWorld<span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment"># 合约中变量strVal是storage类型，不需要显式声明</span></span>
<span class="line">    string strVal <span class="token operator">=</span> <span class="token string">"hello world"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    function sayHello<span class="token punctuation">(</span><span class="token punctuation">)</span> public view returns <span class="token punctuation">(</span>string memory<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> setInfo<span class="token punctuation">(</span>strVal<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    function setHelloWorld<span class="token punctuation">(</span>string memory newStr<span class="token punctuation">)</span> public <span class="token punctuation">{</span></span>
<span class="line">        strVal <span class="token operator">=</span> newStr<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    function setInfo<span class="token punctuation">(</span>string memory helloworldStr<span class="token punctuation">)</span> internal pure returns <span class="token punctuation">(</span>string memory<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> string<span class="token punctuation">.</span>concat<span class="token punctuation">(</span>helloworldStr<span class="token punctuation">,</span><span class="token string">" from Jason‘s contract"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="solidity存储模式" tabindex="-1"><a class="header-anchor" href="#solidity存储模式"><span>solidity存储模式</span></a></h3>
<ul>
<li>solidity存储模式有以下6种
<ul>
<li>storage : 永久性存储</li>
<li>memory : 暂时性存储,变量运行时可以被修改</li>
<li>calldata : 暂时性存储,变量运行时无法被修改</li>
<li>stack :</li>
<li>codes :</li>
<li>logs :</li>
</ul>
</li>
<li>合约所有的声明、定义，都会落在这6种存储模式中的一种</li>
<li>存储可分为<strong>暂时性存储</strong>、<strong>永久性存储</strong></li>
</ul>
<blockquote>
<p>💡 <strong>Tip:</strong>     <br></p>
<ol>
<li>声明在合约中的数据类型，会判定为stroage <br></li>
<li>声明在变量中的数据类型，会判定为memory <br></li>
<li>传参的string需要显式声明memory，因为string是bytes构造的复杂数据结构，需要告诉编译器使用哪种存储模式</li>
</ol>
</blockquote>
<h3 id="数据、映射、结构体" tabindex="-1"><a class="header-anchor" href="#数据、映射、结构体"><span>数据、映射、结构体</span></a></h3>
<h4 id="struct-结构体" tabindex="-1"><a class="header-anchor" href="#struct-结构体"><span>struct 结构体</span></a></h4>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line"><span class="token comment"># 构造结构体</span></span>
<span class="line"> struct Info <span class="token punctuation">{</span></span>
<span class="line">        string phrase<span class="token punctuation">;</span></span>
<span class="line">        uint256 <span class="token builtin">id</span><span class="token punctuation">;</span></span>
<span class="line">        address addr<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 初始化</span></span>
<span class="line">Info memory info <span class="token operator">=</span> Info<span class="token punctuation">(</span>newStr<span class="token punctuation">,</span>_id<span class="token punctuation">,</span>msg<span class="token punctuation">.</span>sender<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="array-数组" tabindex="-1"><a class="header-anchor" href="#array-数组"><span>array 数组</span></a></h4>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">Info<span class="token punctuation">[</span><span class="token punctuation">]</span> infos<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">infos<span class="token punctuation">.</span>push<span class="token punctuation">(</span>info<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="mapping-映射" tabindex="-1"><a class="header-anchor" href="#mapping-映射"><span>mapping 映射</span></a></h4>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">mapping <span class="token punctuation">(</span>uint256 <span class="token operator">=</span><span class="token operator">></span> Info<span class="token punctuation">)</span> infoMapping<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">infoMapping<span class="token punctuation">[</span>_id<span class="token punctuation">]</span><span class="token punctuation">.</span>phrase<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="智能合约工厂模式" tabindex="-1"><a class="header-anchor" href="#智能合约工厂模式"><span>智能合约工厂模式</span></a></h3>
<ul>
<li>工厂模式的想法是拥有一个合约(工厂)，该合约将承担创建其他合约的任务。在基于类的编程中，此模式的主要动机来自单一职责原则(一个类不需要知道如何创建其他类的实例)，并且该模式为构造函数提供了一种抽象。</li>
<li>为什么要在 Solidity 中使用工厂模式
<ul>
<li>如果要创建同一合约的多个实例，并且正在寻找一种跟踪它们并简化管理的方法。</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">contract Factory <span class="token punctuation">{</span></span>
<span class="line">  Child<span class="token punctuation">[</span><span class="token punctuation">]</span> children<span class="token punctuation">;</span></span>
<span class="line">  function createChild<span class="token punctuation">(</span>uint data<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">     Child child <span class="token operator">=</span> new Child<span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">     children<span class="token punctuation">.</span>push<span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line">contract Child<span class="token punctuation">{</span></span>
<span class="line">     uint data<span class="token punctuation">;</span></span>
<span class="line">    constructor<span class="token punctuation">(</span>uint _data<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        data <span class="token operator">=</span> _data<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>节省部署成本：你可以先部署工厂，之后在使用时再来部署其他合约。</li>
<li>提高合约安全性: <a href="https://learnblockchain.cn/article/2297" target="_blank" rel="noopener noreferrer">https://learnblockchain.cn/article/2297</a></li>
</ul>
</li>
</ul>
<h3 id="hello-world工厂合约" tabindex="-1"><a class="header-anchor" href="#hello-world工厂合约"><span>hello world工厂合约</span></a></h3>
<ul>
<li>
<p>创建一个工厂合约</p>
</li>
<li>
<p>引入需要管理的合约</p>
<ul>
<li>引入本地的合约</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line"><span class="token comment"># 引入同级目录下test.sol文件的HelloWorld合约</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> HelloWorld <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./test.sol"</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>引入github合约</li>
<li>引入合约包</li>
</ul>
</li>
<li>
<p>示例</p>
</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line"><span class="token comment"># 工厂</span></span>
<span class="line"><span class="token operator">//</span> SPDX<span class="token operator">-</span>License<span class="token operator">-</span>Identifier<span class="token punctuation">:</span> MIT</span>
<span class="line">pragma solidity <span class="token operator">^</span><span class="token number">0.8</span><span class="token number">.24</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> HelloWorld <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./test.sol"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">contract HelloWorldFactory<span class="token punctuation">{</span></span>
<span class="line">    HelloWorld hw<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    HelloWorld<span class="token punctuation">[</span><span class="token punctuation">]</span> hws<span class="token punctuation">;</span></span>
<span class="line">    function creatHelloWorld<span class="token punctuation">(</span><span class="token punctuation">)</span> public <span class="token punctuation">{</span></span>
<span class="line">        hw <span class="token operator">=</span> new HelloWorld<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        hws<span class="token punctuation">.</span>push<span class="token punctuation">(</span>hw<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    function getHelloWorldByIndex<span class="token punctuation">(</span>uint256 _index<span class="token punctuation">)</span> public view returns <span class="token punctuation">(</span>HelloWorld<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> hws<span class="token punctuation">[</span>_index<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span> </span>
<span class="line"></span>
<span class="line">    function callHelloWorldFromFactory<span class="token punctuation">(</span>uint256 _index<span class="token punctuation">,</span>uint _id<span class="token punctuation">)</span> public view returns <span class="token punctuation">(</span>string memory<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> hws<span class="token punctuation">[</span>_index<span class="token punctuation">]</span><span class="token punctuation">.</span>sayHello<span class="token punctuation">(</span>_id<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    function callSetHelloWorldFactory<span class="token punctuation">(</span>uint256 _index<span class="token punctuation">,</span>string memory newStr<span class="token punctuation">,</span>uint256 _id<span class="token punctuation">)</span> public <span class="token punctuation">{</span></span>
<span class="line">        hws<span class="token punctuation">[</span>_index<span class="token punctuation">]</span><span class="token punctuation">.</span>setHelloWorld<span class="token punctuation">(</span>newStr<span class="token punctuation">,</span>_id<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line"><span class="token comment"># Hello World合约</span></span>
<span class="line"><span class="token operator">//</span> SPDX<span class="token operator">-</span>License<span class="token operator">-</span>Identifier<span class="token punctuation">:</span> MIT</span>
<span class="line">pragma solidity <span class="token operator">^</span><span class="token number">0.8</span><span class="token number">.24</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">contract HelloWorld<span class="token punctuation">{</span></span>
<span class="line">    string strVal <span class="token operator">=</span> <span class="token string">"hello world"</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    struct Info <span class="token punctuation">{</span></span>
<span class="line">        string phrase<span class="token punctuation">;</span></span>
<span class="line">        uint256 <span class="token builtin">id</span><span class="token punctuation">;</span></span>
<span class="line">        address addr<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    Info<span class="token punctuation">[</span><span class="token punctuation">]</span> infos<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    mapping <span class="token punctuation">(</span>uint256 <span class="token operator">=</span><span class="token operator">></span> Info<span class="token punctuation">)</span> infoMapping<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    function sayHello<span class="token punctuation">(</span>uint256 _id<span class="token punctuation">)</span> public view returns <span class="token punctuation">(</span>string memory<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            </span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>infoMapping<span class="token punctuation">[</span>_id<span class="token punctuation">]</span><span class="token punctuation">.</span>addr <span class="token operator">==</span> address<span class="token punctuation">(</span><span class="token number">0x0</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">return</span> setInfo<span class="token punctuation">(</span>strVal<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">            <span class="token keyword">return</span> infoMapping<span class="token punctuation">[</span>_id<span class="token punctuation">]</span><span class="token punctuation">.</span>phrase<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    function setHelloWorld<span class="token punctuation">(</span>string memory newStr<span class="token punctuation">,</span>uint256 _id<span class="token punctuation">)</span> public <span class="token punctuation">{</span></span>
<span class="line">        Info memory info <span class="token operator">=</span> Info<span class="token punctuation">(</span>newStr<span class="token punctuation">,</span>_id<span class="token punctuation">,</span>msg<span class="token punctuation">.</span>sender<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        infoMapping<span class="token punctuation">[</span>_id<span class="token punctuation">]</span> <span class="token operator">=</span> info<span class="token punctuation">;</span></span>
<span class="line">        infos<span class="token punctuation">.</span>push<span class="token punctuation">(</span>info<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    function setInfo<span class="token punctuation">(</span>string memory helloworldStr<span class="token punctuation">)</span> internal pure returns <span class="token punctuation">(</span>string memory<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> string<span class="token punctuation">.</span>concat<span class="token punctuation">(</span>helloworldStr<span class="token punctuation">,</span><span class="token string">" from Frank"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


