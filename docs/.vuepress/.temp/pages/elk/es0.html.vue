<template><div><h2 id="elacticsearch-基础" tabindex="-1"><a class="header-anchor" href="#elacticsearch-基础"><span>ElacticSearch 基础</span></a></h2>
<h3 id="elactic-search概念" tabindex="-1"><a class="header-anchor" href="#elactic-search概念"><span>Elactic Search概念</span></a></h3>
<h4 id="elactic-search是什么" tabindex="-1"><a class="header-anchor" href="#elactic-search是什么"><span>Elactic Search是什么</span></a></h4>
<ul>
<li>简单说，Elasticsearch 就是一个分布式的搜索、聚合与分析引擎</li>
<li>它的目的是通过简单的RESTful API来隐藏Lucene的复杂性，让全文检索变简单</li>
</ul>
<h4 id="为什么需要-es" tabindex="-1"><a class="header-anchor" href="#为什么需要-es"><span>为什么需要 ES</span></a></h4>
<ul>
<li>用数据库，也可以实现搜索的功能，为什么还需要搜索引擎呢？
<ul>
<li>数据库（理论上来讲，ES 也是数据库，这里的数据库，指的是关系型数据库），首先是存储，搜索只是顺便提供的功能，</li>
<li>而搜索引擎，首先是搜索，但是不把数据存下来就搜不了，所以只好存一存。</li>
<li>术业有专攻，专攻搜索的搜索引擎，自然会提供更强大的搜索能力。</li>
</ul>
</li>
<li>精确匹配和相关性匹配</li>
</ul>
<ul>
<li>在使用数据库搜索时，我们更多的是基于「精确匹配」的搜索。</li>
<li>搜索引擎的「相关性匹配」更贴近人的思维方式。</li>
</ul>
<ul>
<li>搜索和分析，不只是搜索，还有分析
<ul>
<li>这一切的分析数据的能力，都是建立在快速的查询上的，如果没有快速的查询，分析能力无从谈起。</li>
</ul>
</li>
<li>关系型数据库，把原本非常形象的对象，拍平了，拍成各个字段，存在数据库，查询时，再重新构造出对象；ES则是文档存储，把对象原原本本地放进去，取出时直接取出。</li>
</ul>
<ul>
<li>Mysql基于B+树索引，来实现快速检索，ES则基于<strong>倒排索引</strong>，对于文档搜索来说，倒排索引在性能和空间上都有更加明显的优势。</li>
</ul>
<h4 id="倒排索引" tabindex="-1"><a class="header-anchor" href="#倒排索引"><span>倒排索引</span></a></h4>
<ul>
<li>普通索引是根据文档找关键字，倒排索引是根据关键字找文档</li>
</ul>
<h4 id="es-对比-solr" tabindex="-1"><a class="header-anchor" href="#es-对比-solr"><span>ES 对比 Solr</span></a></h4>
<ul>
<li>Solr使用ZK进行分布式关联，ES使用自带分布式协调器</li>
<li>Solr支持多中数据结构，ES仅支持json格式</li>
<li>Solr官方提供功能更多，而ES本身更注重核心功能，高级功能多是第三方提供</li>
<li>Solr在传统搜索应用中表现好于ES，但在实时处理搜索应用时效率明显低于ES</li>
</ul>
<h3 id="es核心概念" tabindex="-1"><a class="header-anchor" href="#es核心概念"><span>ES核心概念</span></a></h3>
<ul>
<li>ES是面向文档的，这意味着它可以存储整个对象或文档，然而它不仅是存储，还会索引(index)每个文档内容可以被搜索，在ES中，你可以对文档(而非成行成列的数据)进行缩影、搜索、排序、过滤。ES对比传统数据库如下：</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>Relational DB -&gt;Database-&gt;Tables-&gt;Rows     -&gt;Columns</li>
<li>Elasticsearche-&gt;Indexs  -&gt;Types -&gt;Documents-&gt;Fields</li>
</ul>
</div>
<h4 id="索引-index" tabindex="-1"><a class="header-anchor" href="#索引-index"><span>索引 index:</span></a></h4>
<ul>
<li>一个索引就是一个拥有几分相似特征文档的集合。比如说，你可以有一个客户数据的索引，另一个产品目录的索引，还有一个订单数据的索引。一个索引由一个名字来标识(必须全部小写字母)，并且当我们要对对应这个索引中的文档进行索引、搜索、更新和删除时，都要使用这个名字，在一个集群中，你可以定义多个索引</li>
</ul>
<h4 id="类型-type" tabindex="-1"><a class="header-anchor" href="#类型-type"><span>类型 type:</span></a></h4>
<ul>
<li>在一个索引中，你可以定义一种或多种类型，一个类型是你的索引的一个逻辑上的分类/分区，其语义完全由你来定，会为具有一组共同字段的文档定义一个类型。比如说，我们假设你运营一个博客平台且将你所有数据存储在一个索引中。在这个索引中，你可以为用户数据定义一个类型，为博客数据定义另一个类型，为评论内容定义一个类型。</li>
<li>一个type下的document,都有相同的field</li>
<li>ES 7.X以后，Type概念已被删除</li>
</ul>
<h4 id="文档-documents" tabindex="-1"><a class="header-anchor" href="#文档-documents"><span>文档 Documents</span></a></h4>
<ul>
<li>一个文档是一个可以被索引的基础信息单元.比如你可以拥有某一个客户的文档，某一个产品的文档。文档以json格式来表示。</li>
</ul>
<h4 id="字段-fields" tabindex="-1"><a class="header-anchor" href="#字段-fields"><span>字段 Fields</span></a></h4>
<ul>
<li>相当于数据库的表字段，对文档数据根据不同属性进行分类标识</li>
</ul>
<h4 id="映射-mapping" tabindex="-1"><a class="header-anchor" href="#映射-mapping"><span>映射 mapping</span></a></h4>
<ul>
<li>mapping是处理数字的方式和规则方面进行了一些限制，如某个字段的数据类型、默认值、分析器、是否被索引等，这些都是映射里可以设置的，其它都是处理ES里面数据的一些使用规则设置也叫映射，按着最优规则处理数据对性能提高很大，因此才需要建立映射，并且需要思考如何建立映射对性能更好</li>
</ul>
<h3 id="安装es" tabindex="-1"><a class="header-anchor" href="#安装es"><span>安装ES</span></a></h3>
<ul>
<li><code v-pre>elasticsearch.org</code>下载对应系统的安装包，进入bin目录执行elasticsearch.bat (windows)</li>
<li><code v-pre>http://localhost:9200/</code>访问是否启动</li>
</ul>
<h3 id="文档管理-crud" tabindex="-1"><a class="header-anchor" href="#文档管理-crud"><span>文档管理(CRUD)</span></a></h3>
<h4 id="索引index-创建" tabindex="-1"><a class="header-anchor" href="#索引index-创建"><span>索引Index-创建</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#创建一个shopping的索引，幂等</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPUT</span> <span class="token string">"http://localhost:9200/shopping"</span> -d<span class="token string">''</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="索引index-查询-删除" tabindex="-1"><a class="header-anchor" href="#索引index-查询-删除"><span>索引Index-查询&amp;删除</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#查询shopping索引</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XGET</span> <span class="token string">"http://localhost:9200/shopping"</span> -d<span class="token string">''</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#查询所有索引信息</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XGET</span> <span class="token string">"http://localhost:9200/_cat/indices?v"</span> -d<span class="token string">''</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#删除索引</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XDELETE</span> <span class="token string">"http://localhost:9200/shopping"</span> -d<span class="token string">''</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="文档doucument-创建post" tabindex="-1"><a class="header-anchor" href="#文档doucument-创建post"><span>文档Doucument-创建Post</span></a></h4>
<ul>
<li>索引创建完了，添加Documents，新版本没有表的概念了，直接索引后面添加数据</li>
<li>_doc就是这个索引的type,也可以写为_create，固定写法</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 文档添加，需要json数据,该操作不幂等</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_doc"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"name":"小米4",</span>
<span class="line">	"price":1999</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"><span class="token comment"># 自定义ID 1001添加文档</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_doc/1001"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"name":"小米4",</span>
<span class="line">	"price":1999</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="主键查询-全查询" tabindex="-1"><a class="header-anchor" href="#主键查询-全查询"><span>主键查询&amp;全查询</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#主键查询</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_doc/1001"</span> -d<span class="token string">''</span></span>
<span class="line"><span class="token comment">#全部查询 会查询所有索引</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/_search"</span> -d<span class="token string">''</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="全量修改-局部修改-删除" tabindex="-1"><a class="header-anchor" href="#全量修改-局部修改-删除"><span>全量修改&amp;局部修改&amp;删除</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#全量修改，该index下的1001数据修改，幂等</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPUT</span> <span class="token string">"http://localhost:9200/shopping/_doc/1001"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"name":"小米5",</span>
<span class="line">	"price":3999</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment">#局部修改，该index下的1001数据修改，POST不幂等</span></span>
<span class="line"><span class="token comment">#_update代表局部修改，json数据doc表现对文档修改，name是具体修改的哪一个值</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_update/1001"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"doc":{</span>
<span class="line">	  "name":"华为"</span>
<span class="line">	}</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#删除文档</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XDELETE</span> <span class="token string">"http://localhost:9200/shopping/_doc/1001"</span> -d<span class="token string">''</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="条件查询-分页查询-查询排序" tabindex="-1"><a class="header-anchor" href="#条件查询-分页查询-查询排序"><span>条件查询&amp;分页查询&amp;查询排序</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#条件查询1</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XGET</span> <span class="token string">"http://localhost:9200/shopping/_search?q=name:华为"</span> -d<span class="token string">''</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#条件查询2 query代表条件查询，match匹配</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_search"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"query":{</span>
<span class="line">		"match":{</span>
<span class="line">			"name":"华为"</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#查询全部</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_search"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"query":{</span>
<span class="line">		"match_all":{</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#分页查询 from起始页，size每页大小</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_search"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"query":{</span>
<span class="line">		"match_all":{</span>
<span class="line">		}</span>
<span class="line">	},</span>
<span class="line">	"from":0,</span>
<span class="line">	"size":2</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#查询排序&amp;查询控制,_source指定想要查询的参数</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_search"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"query":{</span>
<span class="line">		"match_all":{</span>
<span class="line">		}</span>
<span class="line">	},</span>
<span class="line">	"from":0,</span>
<span class="line">	"size":2,</span>
<span class="line">  "_source":["price"],</span>
<span class="line">  "sort":{</span>
<span class="line">		"price":{</span>
<span class="line">			"order":"desc"</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="多条件查询-范围查询" tabindex="-1"><a class="header-anchor" href="#多条件查询-范围查询"><span>多条件查询&amp;范围查询</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 多条件查询,must代表多条件都需要匹配，类似SQL的and ,should代表or，可以替换must</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_search"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"query":{</span>
<span class="line">		"bool":{</span>
<span class="line">			"must":[</span>
<span class="line">				{</span>
<span class="line">					"match":{</span>
<span class="line">						"name":"华为"</span>
<span class="line">					}</span>
<span class="line">				},</span>
<span class="line">				{</span>
<span class="line">					"match":{</span>
<span class="line">						"price":4999</span>
<span class="line">					}</span>
<span class="line">				}</span>
<span class="line">			]</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#范围查询 增加filter做范围查询，如果should，match不生效，会查到华为以外的，must只会查名字叫华为且价格大于3000数据</span></span>
<span class="line"> </span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">	<span class="token string">"query"</span>:<span class="token punctuation">{</span></span>
<span class="line">		<span class="token string">"bool"</span>:<span class="token punctuation">{</span></span>
<span class="line">			<span class="token string">"must"</span>:<span class="token punctuation">[</span></span>
<span class="line">				<span class="token punctuation">{</span></span>
<span class="line">					<span class="token string">"match"</span>:<span class="token punctuation">{</span></span>
<span class="line">						<span class="token string">"name"</span><span class="token builtin class-name">:</span><span class="token string">"华为"</span></span>
<span class="line">					<span class="token punctuation">}</span></span>
<span class="line">				<span class="token punctuation">}</span></span>
<span class="line">			<span class="token punctuation">]</span>,</span>
<span class="line">			<span class="token string">"filter"</span>:<span class="token punctuation">{</span></span>
<span class="line">				<span class="token string">"range"</span>:<span class="token punctuation">{</span></span>
<span class="line">					<span class="token string">"price"</span>:<span class="token punctuation">{</span></span>
<span class="line">						<span class="token string">"gt"</span>:3000</span>
<span class="line">					<span class="token punctuation">}</span></span>
<span class="line">				<span class="token punctuation">}</span></span>
<span class="line">			<span class="token punctuation">}</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line">'</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="全文检索-完全匹配-高亮查询" tabindex="-1"><a class="header-anchor" href="#全文检索-完全匹配-高亮查询"><span>全文检索&amp;完全匹配&amp;高亮查询</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#全文检索 如果我们匹配了米华，分词会把小米和华为都查出来，</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_search"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"query":{</span>
<span class="line">		"match":{</span>
<span class="line">			"name":"米华"</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"><span class="token comment">#完全匹配 这样只能搜到名字带华的了，如果写米华匹配不成功</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_search"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"query":{</span>
<span class="line">		"match_phrase":{</span>
<span class="line">			"name":"华"</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"><span class="token comment">#高亮查询 fields代表要高亮的字段名</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_search"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"query":{</span>
<span class="line">		"match_phrase":{</span>
<span class="line">			"name":"华"</span>
<span class="line">		}</span>
<span class="line">	},</span>
<span class="line">	"highlight":{</span>
<span class="line">		"fields":{</span>
<span class="line">			"name":{}</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="聚合查询" tabindex="-1"><a class="header-anchor" href="#聚合查询"><span>聚合查询</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h4 id="映射关系" tabindex="-1"><a class="header-anchor" href="#映射关系"><span>映射关系</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 创建一个student的索引 并且设置mapping</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPUT</span> <span class="token string">"http://localhost:9200/student/_mapping"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"properties":{</span>
<span class="line">		"name":{</span>
<span class="line">			"type":	"text",</span>
<span class="line">			"index":true</span>
<span class="line">		},</span>
<span class="line">		"sex":{</span>
<span class="line">			"type":	"keyword",</span>
<span class="line">			"index":true</span>
<span class="line">		},</span>
<span class="line">		"phone":{</span>
<span class="line">			"type":	"keyword",</span>
<span class="line">			"index":false</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"><span class="token comment"># name这个属性是分词的，type类型是text,且为true</span></span>
<span class="line"><span class="token comment"># sex这个数据必须完全匹配才能查询，"type":	"keyword"</span></span>
<span class="line"><span class="token comment"># phone这个不能作为查询条件的	"type":	"keyword","index":false 不支持查询</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


