<template><div><h2 id="_1-值类型" tabindex="-1"><a class="header-anchor" href="#_1-值类型"><span>1.值类型</span></a></h2>
<ul>
<li>值类型（Value Type): 包括布尔、整数等，这类变量赋值时候直接传递数值</li>
<li>引用类型（Reference Type): 包括数组、结构体，这类变量占空间大，赋值时直接传递地址（类似指针）</li>
<li>映射类型（Mapping Type): Solidity中存储键值对的数据结构，可以理解为哈希表</li>
</ul>
<h4 id="布尔-bool是二值变量-取值true、false" tabindex="-1"><a class="header-anchor" href="#布尔-bool是二值变量-取值true、false"><span>布尔 <code v-pre>bool是二值变量，取值true、false</code></span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">bool public _bool = true;</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="整型-整型是solidity中的整数" tabindex="-1"><a class="header-anchor" href="#整型-整型是solidity中的整数"><span>整型 <code v-pre>整型是Solidity中的整数</code></span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">int public _int =-1; //整数，包括负数</span>
<span class="line">uint public _uint = 1; //无符号整数</span>
<span class="line">uint256 public _uint256 = 2022030; //256位无符号整数</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="地址类型-solidity中特有的类型" tabindex="-1"><a class="header-anchor" href="#地址类型-solidity中特有的类型"><span>地址类型 <code v-pre>Solidity中特有的类型</code></span></a></h4>
<pre><code>+  普通地址（address): 存储一个20字节的值（ETH地址的大小）
+ payable address: 比普通地址多了`transfer` `send`两个成员方法，用于接收转账
</code></pre>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">// 地址</span>
<span class="line">address public _address = 0x7A58c0Be72BE218B41C608b7Fe7C5bB630736C71;</span>
<span class="line">address payable public _address1 = payable(_address); // payable address，可以转账、查余额</span>
<span class="line">// 地址类型的成员</span>
<span class="line">uint256 public balance = _address1.balance; // balance of address</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="定长字节数组-字节数组分为定长和不定长两种" tabindex="-1"><a class="header-anchor" href="#定长字节数组-字节数组分为定长和不定长两种"><span>定长字节数组 <code v-pre>字节数组分为定长和不定长两种：</code></span></a></h4>
<ul>
<li>
<ul>
<li>定长字节数组: 属于值类型，数组长度在声明之后不能改变。根据字节数组的长度分为 <code v-pre>bytes1</code>, <code v-pre>bytes8</code>, <code v-pre>bytes32</code> 等类型。定长字节数组最多存储 32 bytes 数据，即<code v-pre>bytes32</code>。</li>
</ul>
</li>
<li>不定长字节数组: 属于引用类型（之后的章节介绍），数组长度在声明之后可以改变，包括 <code v-pre>bytes</code> 等。</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">// 固定长度的字节数组 </span>
<span class="line">bytes32 public _byte32 = "MiniSolidity"; </span>
<span class="line">bytes1 public _byte = _byte32[0];</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="枚举enum" tabindex="-1"><a class="header-anchor" href="#枚举enum"><span>枚举enum</span></a></h4>
<ul>
<li>枚举（<code v-pre>enum</code>）是 Solidity 中用户定义的数据类型。它主要用于为 <code v-pre>uint</code> 分配名称，使程序易于阅读和维护。它与 <code v-pre>C 语言</code> 中的 <code v-pre>enum</code> 类似，使用名称来代替从 <code v-pre>0</code> 开始的 <code v-pre>uint</code>：</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">// 用enum将uint 0， 1， 2表示为Buy, Hold, Sell </span>
<span class="line">enum ActionSet { Buy, Hold, Sell } </span>
<span class="line">// 创建enum变量 action </span>
<span class="line">ActionSet action = ActionSet.Buy;</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-函数" tabindex="-1"><a class="header-anchor" href="#_2-函数"><span>2. 函数</span></a></h2>
<ul>
<li>Solidity中函数非常灵活，可以进行各种复杂操作，以下为函数表现形式</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">function &lt;function name>([parameter types[, ...]]) {internal|external|public|private} [pure|view|payable] [virtual|override] [&lt;modifiers>]</span>
<span class="line">[returns (&lt;return types>)]{ &lt;function body> }</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以下为函数部分关键字</p>
<ul>
<li><code v-pre>internal|external|public|private</code> 函数的可见说明符
<ul>
<li>public : 内部和外部都可见</li>
<li>private: 本合约内部可见、继承的合约也不可见</li>
<li>external: 只能从合约外部访问(但内部可通过this.functhion_name()调用)</li>
<li>internal: 只能合约内部访问，继承的合约可用</li>
</ul>
</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line"> **注意 1**：合约中定义的函数需要明确指定可见性，它们没有默认值。</span>
<span class="line"></span>
<span class="line">**注意 2**：`public|private|internal` 也可用于修饰状态变量(定义可参考[WTF Solidity 第5讲的相关内容]</span>
<span class="line">`public`变量会自动生成同名的`getter`函数，用于查询数值。未标明可见性类型的状态变量，默认为`internal`。</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>``</p>
<ul>
<li><code v-pre>[pure|view|payable]</code>：决定函数权限/功能的关键字。<code v-pre>payable</code>（可支付的）很好理解，带着它的函数，运行的时候可以给合约转入 ETH。</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">pure和view的引入，主要是ETH交易需要支付gas fee,合约的状态变量存储在链上，gas fee很贵，而如果不需要修改链上状态，就可以不用支付gas fee。包含 pure、view的函数是不修改链上状态的，因此用户直接调用不需要支付gas fee(注意：合约中非pure、view的函数调研pure或view需要支付gas fee)</span>
<span class="line"></span>
<span class="line">ETH中视为修改链上状态的是：</span>
<span class="line">1.写入状态变量</span>
<span class="line">2.释放事件</span>
<span class="line">3.创建其它合约</span>
<span class="line">4.使用 selfdestruct</span>
<span class="line">5.通过调用发送ETH</span>
<span class="line">6.调用任意未标注pure\view的函数</span>
<span class="line">7.使用低级调用（low-level calls)</span>
<span class="line">8.使用包含某些操作码的内联汇编</span>
<span class="line"></span>
<span class="line">pure函数即不可读取也不可写入链上的状态变量</span>
<span class="line">view可以读取但不能写入链上状态变量</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>[virtual|override]</code>: 方法是否可以被重写，或者是否是重写方法。<code v-pre>virtual</code>用在父合约上，标识的方法可以被子合约重写。<code v-pre>override</code>用在自合约上，表名方法重写了父合约的方法。</li>
<li><code v-pre>&lt;modifiers&gt;</code>: 自定义的修饰器，可以有0个或多个修饰器。</li>
</ul>
<h2 id="函数输出" tabindex="-1"><a class="header-anchor" href="#函数输出"><span>函数输出</span></a></h2>
<ul>
<li>函数输出包含： 返回多种变量、命名式返回、结构式返回读取全部或部分返回值</li>
</ul>
<h3 id="return-和-returns" tabindex="-1"><a class="header-anchor" href="#return-和-returns"><span>return 和 returns</span></a></h3>
<ul>
<li>returns 跟在函数名后，用于声明返回变量类型以及变量名</li>
<li>return 用于函数主体中，返回指定变量</li>
</ul>
<h4 id="返回多种变量" tabindex="-1"><a class="header-anchor" href="#返回多种变量"><span>返回多种变量</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">// 返回多个变量</span>
<span class="line">function returnMultiple() public pure returns(uint256, bool, uint256[3] memory){</span>
<span class="line">    return(1, true, [uint256(1),2,5]);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">returns 声明返回分别是uint256、bool、uint256长度为3的数组</span>
<span class="line">return返回数组中 1,2,5默认是uint8长度，所以首个元素显示强转uint256</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="命名式返回" tabindex="-1"><a class="header-anchor" href="#命名式返回"><span>命名式返回</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">// 命名式返回 f</span>
<span class="line">unction returnNamed() public pure returns(uint256 _number, bool _bool, uint256[3] memory _array){ </span>
<span class="line">_number = 2; </span>
<span class="line">_bool = false; </span>
<span class="line">_array = [uint256(3),2,1];</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">该方法我们通过给返回的变量_number、_bool、_array赋值，即可自动返回，当然你可以用return来返回</span>
<span class="line">return(2,false,[uin(3),2,1]);</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="解构式返回" tabindex="-1"><a class="header-anchor" href="#解构式返回"><span>解构式返回</span></a></h4>
<ul>
<li>Solidity 支持使用解构式赋值规则来读取函数的全部或部分返回值。</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">uint256 _number; </span>
<span class="line">bool _bool;</span>
<span class="line">uint256[3] memory _array;</span>
<span class="line"></span>
<span class="line">(_number, _bool, _array) = returnNamed();</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>读取部分返回值，不读取的留空</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">(, _bool2, ) = returnNamed();</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="变量数据存储" tabindex="-1"><a class="header-anchor" href="#变量数据存储"><span>变量数据存储</span></a></h2>
<ul>
<li>引用类型（Reference Type）：包括数组<code v-pre>array</code> 和结构体<code v-pre>struct</code>，这类变量比较复杂，占用空间大，所以我们要声明数据存储的位置</li>
</ul>
<h3 id="数据位置" tabindex="-1"><a class="header-anchor" href="#数据位置"><span>数据位置</span></a></h3>
<ul>
<li>Solidity数据存储有3类：<code v-pre>storage</code> , <code v-pre>memory</code>,<code v-pre>calldata</code>。不同存储位置需要的gas 成本不同
<ul>
<li><code v-pre>storage</code>存储在链上，类似计算机硬盘，消耗gas多。合约状态变量默认存储storage</li>
<li><code v-pre>memory</code>存储在临时内存上，消耗gas少,函数中参数，临时变量一般用memory,不上链，尤其是返回数据类型是变长的情况下，必须加memory,例如string,bytes,array,和自定义结构</li>
<li><code v-pre>calldata</code>和memory类似，不同点是calldata变量不能修改，一般用于函数参数</li>
</ul>
</li>
<li>整体gas消耗是：storge &gt; memory &gt; calldata</li>
</ul>
<h3 id="数据位置和赋值规则" tabindex="-1"><a class="header-anchor" href="#数据位置和赋值规则"><span>数据位置和赋值规则</span></a></h3>
<p>在不同存储类型相互赋值时候，有时会产生独立的副本（修改新变量不会影响原变量），有时会产生引用（修改新变量会影响原变量）。规则如下：</p>
<ul>
<li>赋值本质上是创建<strong>引用</strong>指向本体，因此修改本体或者是引用，变化可以被同步：
<ul>
<li><code v-pre>memory</code>赋值给<code v-pre>memory</code>，会创建引用，改变新变量会影响原变量。</li>
<li><code v-pre>storage</code>（合约的状态变量）赋值给本地<code v-pre>storage</code>（函数里的）时候，会创建引用，改变新变量会影响原变量。例子：</li>
</ul>
</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">uint[] x = [1,2,3]; // 状态变量：数组 x </span>
<span class="line">function fStorage() public{ </span>
<span class="line">	//声明一个storage的变量 xStorage，指向x。修改xStorage也会影响</span>
<span class="line">	x uint[] storage xStorage = x; </span>
<span class="line">	xStorage[0] = 100; </span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>其他情况下，赋值创建的是本体的副本，即对二者之一的修改，并不会同步到另一方。这有时会涉及到开发中的问题，比如从<code v-pre>storage</code>中读取数据，赋值给<code v-pre>memory</code>，然后修改<code v-pre>memory</code>的数据，但如果没有将<code v-pre>memory</code>的数据赋值回<code v-pre>storage</code>，那么<code v-pre>storage</code>的数据是不会改变的。</li>
</ul>
<h2 id="变量的作用域" tabindex="-1"><a class="header-anchor" href="#变量的作用域"><span>变量的作用域</span></a></h2>
<p><code v-pre>Solidity</code>中变量按作用域划分有三种，分别是状态变量（state variable），局部变量（local variable）和全局变量(global variable)</p>
<h3 id="_1-状态变量" tabindex="-1"><a class="header-anchor" href="#_1-状态变量"><span>1 .状态变量</span></a></h3>
<p>状态变量是数据存储在链上的变量，所有合约内函数都可以访问，<code v-pre>gas</code>消耗高。状态变量在合约内、函数外声明：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">contract Variables { </span>
<span class="line">	uint public x = 1;</span>
<span class="line">	uint public y; </span>
<span class="line">	string public z;</span>
<span class="line"> }</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以在函数里更改状态变量的值：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">function foo() external{ </span>
<span class="line">	// 可以在函数里更改状态变量的值 </span>
<span class="line">	x = 5; </span>
<span class="line">	y = 2; </span>
<span class="line">	z = "0xAA";</span>
<span class="line"> }</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-局部变量" tabindex="-1"><a class="header-anchor" href="#_2-局部变量"><span>2. 局部变量</span></a></h3>
<p>局部变量是仅在函数执行过程中有效的变量，函数退出后，变量无效。局部变量的数据存储在内存里，不上链，<code v-pre>gas</code>低。局部变量在函数内声明：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">function bar() external pure returns(uint){ </span>
<span class="line">	uint xx = 1; </span>
<span class="line">	uint yy = 3; </span>
<span class="line">	uint zz = xx + yy; </span>
<span class="line">	return(zz);</span>
<span class="line"> }</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-全局变量" tabindex="-1"><a class="header-anchor" href="#_3-全局变量"><span>3.全局变量</span></a></h3>
<p>全局变量是全局范围工作的变量，都是<code v-pre>solidity</code>预留关键字。他们可以在函数内不声明直接使用：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">function global() external view returns(address, uint, bytes memory){ </span>
<span class="line">	address sender = msg.sender; </span>
<span class="line">	uint blockNum = block.number; </span>
<span class="line">	bytes memory data = msg.data; </span>
<span class="line">	return(sender, blockNum, data); </span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面例子里，我们使用了3个常用的全局变量：<code v-pre>msg.sender</code>，<code v-pre>block.number</code>和<code v-pre>msg.data</code>，他们分别代表请求发起地址，当前区块高度，和请求数据。下面是一些常用的全局变量，更完整的列表请看这个<a href="https://learnblockchain.cn/docs/solidity/units-and-global-variables.html#special-variables-and-functions" target="_blank" rel="noopener noreferrer">链接</a>：</p>
<ul>
<li><code v-pre>blockhash(uint blockNumber)</code>: (<code v-pre>bytes32</code>) 给定区块的哈希值 – 只适用于最近的256个区块, 不包含当前区块。</li>
<li><code v-pre>block.coinbase</code>: (<code v-pre>address payable</code>) 当前区块矿工的地址</li>
<li><code v-pre>block.gaslimit</code>: (<code v-pre>uint</code>) 当前区块的gaslimit</li>
<li><code v-pre>block.number</code>: (<code v-pre>uint</code>) 当前区块的number</li>
<li><code v-pre>block.timestamp</code>: (<code v-pre>uint</code>) 当前区块的时间戳，为unix纪元以来的秒</li>
<li><code v-pre>gasleft()</code>: (<code v-pre>uint256</code>) 剩余 gas</li>
<li><code v-pre>msg.data</code>: (<code v-pre>bytes calldata</code>) 完整call data</li>
<li><code v-pre>msg.sender</code>: (<code v-pre>address payable</code>) 消息发送者 (当前 caller)</li>
<li><code v-pre>msg.sig</code>: (<code v-pre>bytes4</code>) calldata的前四个字节 (function identifier)</li>
<li><code v-pre>msg.value</code>: (<code v-pre>uint</code>) 当前交易发送的 <code v-pre>wei</code> 值</li>
<li><code v-pre>block.blobbasefee</code>: (<code v-pre>uint</code>) 当前区块的blob基础费用。这是Cancun升级新增的全局变量。</li>
<li><code v-pre>blobhash(uint index)</code>: (<code v-pre>bytes32</code>) 返回跟当前交易关联的第 <code v-pre>index</code> 个blob的版本化哈希（第一个字节为版本号，当前为<code v-pre>0x01</code>，后面接KZG承诺的SHA256哈希的最后31个字节）。若当前交易不包含blob，则返回空字节。这是Cancun升级新增的全局变量。</li>
</ul>
<h3 id="_4-全局变量-以太单位与时间单位" tabindex="-1"><a class="header-anchor" href="#_4-全局变量-以太单位与时间单位"><span>4. 全局变量-以太单位与时间单位</span></a></h3>
<h4 id="以太单位" tabindex="-1"><a class="header-anchor" href="#以太单位"><span>以太单位</span></a></h4>
<p><code v-pre>Solidity</code>中不存在小数点，以<code v-pre>0</code>代替为小数点，来确保交易的精确度，并且防止精度的损失，利用以太单位可以避免误算的问题，方便程序员在合约中处理货币交易。</p>
<ul>
<li><code v-pre>wei</code>: 1</li>
<li><code v-pre>gwei</code>: 1e9 = 1000000000</li>
<li><code v-pre>ether</code>: 1e18 = 1000000000000000000</li>
</ul>
<h4 id="时间单位" tabindex="-1"><a class="header-anchor" href="#时间单位"><span>时间单位</span></a></h4>
<p>可以在合约中规定一个操作必须在一周内完成，或者某个事件在一个月后发生。这样就能让合约的执行可以更加精确，不会因为技术上的误差而影响合约的结果。因此，时间单位在<code v-pre>Solidity</code>中是一个重要的概念，有助于提高合约的可读性和可维护性</p>
<ul>
<li><code v-pre>seconds</code>: 1</li>
<li><code v-pre>minutes</code>: 60 seconds = 60</li>
<li><code v-pre>hours</code>: 60 minutes = 3600</li>
<li><code v-pre>days</code>: 24 hours = 86400</li>
<li><code v-pre>weeks</code>: 7 days = 604800</li>
</ul>
</div></template>


