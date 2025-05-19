<template><div><h2 id="erc-20" tabindex="-1"><a class="header-anchor" href="#erc-20"><span>ERC-20</span></a></h2>
<h3 id="预言机-oracle" tabindex="-1"><a class="header-anchor" href="#预言机-oracle"><span>预言机 Oracle</span></a></h3>
<ul>
<li>
<p>预言机是将链下的内容（例如天气、股票价格、比赛结果等）安全可靠的传递到区块链上的智能合约，让智能合约可以根据这些信息执行预定的逻辑</p>
</li>
<li>
<p>区块链的局限性：</p>
<ul>
<li>区块链本质是一个封闭的系统，只能访问链上的内容，智能合约设计之初无法直接访问链下数据，因为这会引入信任问题，破坏区块链去中心化特征</li>
</ul>
</li>
<li>
<p>为什么需要预言机：<code v-pre>许多智能合约应用场景都依赖真实世界数据</code></p>
<ul>
<li><strong>去中心化金融DeFi</strong>:需要价格信息进行抵押贷款，交易等操作。</li>
<li><strong>保险</strong>：需要天气数据、航班延误信息进行理赔</li>
<li><strong>预测市场</strong>：需要根据比赛结果、选举情况进行结算</li>
<li><strong>供应链管理</strong>：需要物品物流信息来验证交货情况</li>
</ul>
</li>
<li>
<p>预言机工作原理：</p>
<ul>
<li>智能合约请求数据 ：当智能合约需要外部数据，向预言机请求数据</li>
<li>预言机获取数据： 预言机从外部数据源（API、网站、传感器等）获取相关信息</li>
<li>验证数据以及签名： 为了保证数据可靠，预言机通常会对数据进行验证并使用数字签名</li>
<li>传输数据到链上：预言机将验证并签名的数据传回智能合约</li>
<li>智能合约执行： 智能合约根据获取数据进行相应业务操作</li>
</ul>
</li>
<li>
<p>预言机类型：</p>
<ul>
<li>中心化预言机：由单个实体控制，数据来源和传输都由该实体保证，这种预言机容易受攻击、篡改。与区块链去中心化相悖</li>
<li>去中心化预言机<code v-pre>Decentralized Oracles</code>：由多个独立节点共同提供数据，采用共识机制验证数据真实性。场景去中心化预言机有Chainlink 和 Band Protocol</li>
<li>硬件预言机: 利用硬件设备直接将数据传输到链上，适用与需要物理世界数据的应用场景</li>
<li>人文预言机：依赖人工验证、判断，适用于需要主观判断的数据，例如内容审核、法律解释等</li>
</ul>
</li>
<li>
<p>预言机的安全问题：</p>
<ul>
<li>数据源的可靠性：预言机获取的数据必须来自可靠数据源，否则只能合约可能执行错误</li>
<li>预言机的安全性：预言机本身可能会遭受攻击、导致数据被篡改</li>
<li>女巫攻击：攻击者可能创建大量节点，控制去中心化预言机的共识结果</li>
</ul>
</li>
<li>
<p>chainlink 开发者文档</p>
<ul>
<li><a href="https://docs.chain.link/" target="_blank" rel="noopener noreferrer">https://docs.chain.link/</a></li>
</ul>
</li>
</ul>
<h3 id="" tabindex="-1"><a class="header-anchor" href="#"><span></span></a></h3>
</div></template>


