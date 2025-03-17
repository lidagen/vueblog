<template><div><h2 id="elacticsearch进阶" tabindex="-1"><a class="header-anchor" href="#elacticsearch进阶"><span>ElacticSearch进阶</span></a></h2>
<h3 id="集群部署" tabindex="-1"><a class="header-anchor" href="#集群部署"><span>集群部署</span></a></h3>
<ul>
<li>集群提供可扩展的容量，且高可用，并发处理高，生产环境应用运行在集群中</li>
</ul>
<h4 id="windows集群" tabindex="-1"><a class="header-anchor" href="#windows集群"><span>Windows集群</span></a></h4>
<h4 id="linux集群" tabindex="-1"><a class="header-anchor" href="#linux集群"><span>Linux集群</span></a></h4>
<h3 id="es核心" tabindex="-1"><a class="header-anchor" href="#es核心"><span>ES核心</span></a></h3>
<h4 id="接近实时-nrt" tabindex="-1"><a class="header-anchor" href="#接近实时-nrt"><span>接近实时 NRT</span></a></h4>
<ul>
<li>ES是一个接近实时的搜索平台，这意味着，从索引一个文档直到这个文档能够被搜索到有一个轻微的延迟（1s以内）</li>
</ul>
<h4 id="集群-cluster" tabindex="-1"><a class="header-anchor" href="#集群-cluster"><span>集群 cluster</span></a></h4>
<ul>
<li>一个集群就是由一个或者多个节点组织一起的，它们共同持有整个数据，并提供索引和搜索功能。一个集群由一个唯一的名字来标识，这个名字默认‘elactisearch’,这个名字是重要的，因为节点的加入必须指定某个集群的名字。</li>
</ul>
<h4 id="节点-node" tabindex="-1"><a class="header-anchor" href="#节点-node"><span>节点 node</span></a></h4>
<ul>
<li>集群包含多个节点，它参与集群的索引和搜索功能</li>
<li>节点也是有名称的，默认情况下是一个随机的漫威角色名，这个名字会在节点启动时赋予。节点名称对于管理也是重要的，在管理过程中，需要确定网络中哪些服务器对于集群中的哪些节点。</li>
<li>一个节点可以通过配置集群名称加入集群，如果你启动了若干节点，并假定它们彼此互相发现，那么它们就自动的形成并加入集群中。</li>
</ul>
<h4 id="分片-shards" tabindex="-1"><a class="header-anchor" href="#分片-shards"><span>分片 shards</span></a></h4>
<ul>
<li>分片：
<ul>
<li>分片就是，有一个大的索引，单节点没有这么大容量或者放单节点上处理搜索很慢，为了解决这个问题，es设置分片，允许一个索引放置在多个节点上。</li>
<li>分片很重要，主要的原因有两个：1）允许你水平分割/拓展你的内容容量 2）允许你分片(潜在地位于多个节点上)之上进行分布式，并行的操作，提高吞吐量</li>
</ul>
</li>
</ul>
<h4 id="副本-replicas" tabindex="-1"><a class="header-anchor" href="#副本-replicas"><span>副本 replicas</span></a></h4>
<ul>
<li>在一个网络、云环境中，失败随时可能发生，在某个分片/节点挂掉时，有一个故障转移机制是非常有用的</li>
</ul>
<ul>
<li>某个节点挂了，有一个故障转移很重要。为此目的，ES允许你创建分片的一份或多份拷贝，这些拷贝叫做复制分片，或者复制</li>
<li>复制很重要，主要的原因有两个：1）在节点失败的情况下，提供了高可用 2）拓展搜索量/吞吐量</li>
<li>复制不与原分片/主要分片置于同一节点是重要的</li>
</ul>
<h4 id="分配-allocation" tabindex="-1"><a class="header-anchor" href="#分配-allocation"><span>分配 allocation</span></a></h4>
<ul>
<li>将分片分配给某个节点的过程，包括分配主分片或者副本。如果是副本，还包含从主分片复制数据的过程。这个过程是由master节点完成的</li>
</ul>
<h4 id="系统架构" tabindex="-1"><a class="header-anchor" href="#系统架构"><span>系统架构</span></a></h4>
<img :src="$withBase('/es/es.png')" alt="dock">
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 假设我们设置一个users的索引,设置三个分片，每个分片对应一个副本</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPUT</span> <span class="token string">"http://localhost:9200/users/_settings"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">  "settings":{</span>
<span class="line">    "number_of_shards:": 3,</span>
<span class="line">    "number_of_replicas": 1</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="故障转移" tabindex="-1"><a class="header-anchor" href="#故障转移"><span>故障转移</span></a></h4>
<ul>
<li>当集群只有一个节点时，意味着会有单点故障问题。
<ul>
<li>当你在同一台集群启动另一个节点，只要第二个节点具有相同的cluster.name,它会自动发现加入。</li>
<li>在不同机器上启动节点，为了加入集群，需要配置一个可连接到单播主机列表。之所以配置为使用单播发现，是防止其它节点无意中加入集群</li>
</ul>
</li>
</ul>
<h4 id="水平扩容" tabindex="-1"><a class="header-anchor" href="#水平扩容"><span>水平扩容</span></a></h4>
<ul>
<li>水平扩容，当启动三个节点，为了分散负载会对分片进行重新分片
<ul>
<li>如果是一个或两个节点，三个分片每个节点都会有，当节点为三个，则三个分片会两两分配到三个节点上，保证每个节点上，任意一个分片异常，都有别的节点上副本提供备用</li>
</ul>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>假设三个分片0、1、2，三个节点A、B、C
<ul>
<li>A节点上分片 0、1</li>
<li>B节点上分片 0、2</li>
<li>C节点上分片 1、2</li>
</ul>
</li>
</ul>
</div>
<ul>
<li>
<p>分片是一个功能完整的搜索引擎，它拥有使用的一个节点上所有资源的能力。我们现在拥有6个节点（3主分片，3副本分片）的索引最大可扩展到6个节点，每个节点上一个分片，并且每个分片拥有所在节点的全部资源。</p>
</li>
<li>
<p>如果我们想扩容超过6个节点怎么办？</p>
<ul>
<li>主分片数目在索引创建时已经确定了（不可变），只有3个。这个定义的数目已经确定了数据存储的最大量（取决数据大小、硬件大小、使用场景）。但是读操作，是可以同时从主分片和副本分片处理。意味着，你可以扩展大的副本节点，使吞吐量变大</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#条件副本分片为2，即三个分片拥有6个副本</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPUT</span> <span class="token string">"http://localhost:9200/users/_settings"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">  "number_of_replicas":2</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"><span class="token comment"># 这种情况下，极限节点数就是9台，3主+6副本</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="应对故障" tabindex="-1"><a class="header-anchor" href="#应对故障"><span>应对故障</span></a></h4>
<ul>
<li>假设从Node挂掉，只会影响分片数，不会影响数据的CRUD。从节点恢复以后，继续加入主节点</li>
<li>如果主Node挂掉，其它从Node会选举一个主Node,也不会影响数据的CRUD。挂掉的节点再加入就变成了从Node</li>
</ul>
<h4 id="es的数据写入和读取" tabindex="-1"><a class="header-anchor" href="#es的数据写入和读取"><span>ES的数据写入和读取</span></a></h4>
<ul>
<li>
<p>写入</p>
<ul>
<li>客户端选择一个 node 发送请求过去，这个 node 就是 <code v-pre>coordinating node</code>（协调节点）</li>
<li><code v-pre>coordinating node</code> 对 document 进行<strong>路由</strong>，将请求转发给对应的 node（primary shard）。</li>
<li>实际的 node 上的 <code v-pre>primary shard</code> 处理请求，然后将数据同步到 <code v-pre>replica node</code>。</li>
<li><code v-pre>coordinating node</code> 如果发现 <code v-pre>primary node</code> 和所有 <code v-pre>replica node</code> 都搞定之后，就返回响应结果给客户端。</li>
<li>写入数据，判断写入哪个主分片叫做路由计算 ：hash(id)%主分片数</li>
</ul>
</li>
<li>
<p>读取</p>
<ul>
<li>可以通过 <code v-pre>doc id</code> 来查询，会根据 <code v-pre>doc id</code> 进行 hash，判断出来当时把 <code v-pre>doc id</code> 分配到了哪个 shard 上面去，从那个 shard 去查询</li>
<li>客户端发送请求到<strong>任意</strong>一个 node，成为 <code v-pre>coordinate node</code>。</li>
<li><code v-pre>coordinate node</code> 对 <code v-pre>doc id</code> 进行哈希路由，将请求转发到对应的 node，此时会使用 <code v-pre>round-robin</code> <strong>随机轮询算法</strong>，在 <code v-pre>primary shard</code> 以及其所有 replica 中随机选择一个，让读请求负载均衡。</li>
<li>接收请求的 node 返回 document 给 <code v-pre>coordinate node</code>。</li>
<li><code v-pre>coordinate node</code> 返回 document 给客户端。</li>
</ul>
</li>
</ul>
<h4 id="倒排索引结构" tabindex="-1"><a class="header-anchor" href="#倒排索引结构"><span>倒排索引结构</span></a></h4>
<ul>
<li>前面提过，倒排索引就是根据value找key,为此我们举个例子
<ul>
<li>假设有个users索引，它有四个字段，分别是name|gender|age|address。画出来大概是个这个样子，以关系型数据库一样</li>
</ul>
</li>
</ul>
<p>id | name | gender |  age | address</p>
<ul>
<li>| :-: | :-: | :-: | -:
1 | 张三 | 1 | 22 | 宝鸡市陈仓区
2 | 李四 | 2 | 21 | 西安市长安区<br>
3 | 王五 | 1 | 23 | 西安市雁塔区</li>
</ul>
<ul>
<li>
<p><code v-pre>Term单词</code>：一段文本经过分析器分析后输出的一串单词，就是一个个的Term</p>
</li>
<li>
<p><code v-pre>Term Dictionary字典</code>：顾名思义，就是保存Term的字典。</p>
</li>
<li>
<p><code v-pre>Posting List倒排列表</code>：记录出现过某个Term的所有Documents文档列表以及该Term在文档位置,每条记录都称为一个倒排项Posting</p>
<ul>
<li><em>实际的Posting List不仅仅保存文档ID这么简单，还保存了其它信息，比如次频、偏移量等</em></li>
</ul>
</li>
<li>
<p><code v-pre>Term Index单词索引</code>：为了更好找到某个单词，我们为Term单词建立索引</p>
</li>
<li>
<p>上面的例子，ES建立的索引大致如下：</p>
</li>
</ul>
<ul>
<li>name字段</li>
</ul>
<p>Term | Posting List |</p>
<ul>
<li>
<p>| :-: | :-: | :-: | -:
张三 | 1 |
李四 | 2 |
王五 | 3 |</p>
<ul>
<li>age字段</li>
</ul>
</li>
</ul>
<p>Term | Posting List |</p>
<ul>
<li>
<p>| :-: | :-: | :-: | -:
21 | 2 |
22 | 1 |
23 | 3 |</p>
<ul>
<li>gender字段</li>
</ul>
</li>
</ul>
<p>Term | Posting List |</p>
<ul>
<li>
<p>| :-: | :-: | :-: | -:
1 | [1,3] |
2 | 1 |</p>
<ul>
<li>address字段</li>
</ul>
</li>
</ul>
<p>Term | Posting List |</p>
<ul>
<li>| :-: | :-: | :-: | -:
宝鸡市 | 1 |
西安市 | [2,3] |<br>
陈仓区 | 1 |<br>
雁塔区 | 3 |<br>
长安区 | 2 |</li>
</ul>
<ul>
<li>ES会为每个字段都建立一个<strong>倒排索引</strong>，上面的张三、西安市、22都是Term,而[2，3]就是Posting List，存储了所有符合某个Term的文档ID</li>
<li>如何根据关键词找到Term？这就需要给Term建立索引，类似MySQL的B+Tree结构</li>
<li>倒排索引中，我们根据Term索引可以找到Term在Term Dictionary的位置，进而找到Posting List,然后找到 Documents的ID
<ul>
<li><em>类比MySQL,Term Index可以理解为索引,Term Dictionary理解为数据</em></li>
</ul>
</li>
</ul>
<h4 id="文档搜索" tabindex="-1"><a class="header-anchor" href="#文档搜索"><span>文档搜索</span></a></h4>
<ul>
<li>早期全文检索会为整个文档Documents建立一个很大的倒排索引并写入磁盘，一旦新的索引就绪，旧的会被替换，这样保证最近的变化可以被检索到</li>
<li>倒排索引写入磁盘后是不可改变的，目的如下：
<ul>
<li>不需要锁，因为没有写入，就只有读</li>
<li>索引被读入内核文件缓存，大部分的请求直接访问缓存，不会命中磁盘</li>
<li>其它缓存（filter缓存），在索引生命周期内始终有效，不需要每次数据改变被重建</li>
<li>写入单个大的倒排索引允许数据压缩，减少磁盘I/O和需要被缓存到内存的使用量</li>
</ul>
</li>
<li>当然不变的倒排索引也有缺点，即创建后，如果要修改，就需要重建整个倒排索引，如果更新频率高，则性能有很大影响</li>
<li>如何保证不变性前提下实现倒排索引更新？
<ul>
<li>答案是：建立更多的倒排索引，即通过创建新的倒排索引来补充修改的内容，而不是直接全部重写。每个倒排索引都会被查询，合并后返回</li>
</ul>
</li>
<li>逻辑删除：这样的话，一个倒排索引就可能包含多段，既然段不可改变，删除的数据也是不能真正在磁盘中删除的。所以我们会对删除的数据进行标记（逻辑删除）。这个缺点就会导致无效数据量可能累计过大。</li>
<li>合并：解决一个倒排索引中多个段无效数据过多的问题，对数据进行整理合并。</li>
</ul>
<h4 id="文档刷新-文档刷写-文档合并" tabindex="-1"><a class="header-anchor" href="#文档刷新-文档刷写-文档合并"><span>文档刷新&amp;文档刷写&amp;文档合并</span></a></h4>
<ul>
<li>近实时搜索：
<ul>
<li>随着按段（per-segment）搜索的发展，提交Commiting一个新的段到磁盘需要一个<code v-pre>fsync</code>来确保数据写入磁盘。保证数据不丢失。但是这个操作代价很大，如果每个索引都执行一次开销很大。</li>
</ul>
<ul>
<li>我们有更轻量化方式使文档可被搜索。即修改的内容先在内存缓存区OS Cache中被写入一个新的段中。然后再被刷新到磁盘。到磁盘这一步代价较高，不过文件以及在缓存区OS Cache中了，就已经可以被读取。保证了近实时。</li>
<li>内存中数据写入到OS Cache过程叫refresh，效率很高。进入以后就可以提供给用户查询了，而写入磁盘的flush较慢。flush中包含了文档的合并</li>
</ul>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>数据写入磁盘，协调节点找到主分片，并发写入副本分片
<ul>
<li>延时：主分片的延时+并行写入副本的最大延时</li>
</ul>
</li>
</ul>
</div>
<h4 id="文档分析" tabindex="-1"><a class="header-anchor" href="#文档分析"><span>文档分析</span></a></h4>
<ul>
<li>
<p>文档分析包含以下过程</p>
<ul>
<li>将一个词条分成合适的倒排索引独立的Term</li>
<li>将这些词条统一化成标准格式提高可搜索性</li>
</ul>
</li>
<li>
<p>以上操作由分析器来操作，分析器实际是将三个操作封装到包里：</p>
<ul>
<li>字符过滤器：字符串按顺序通过每个字符过滤器。它们任务是在分词前整理字符串。一个字符过滤器可以用来去掉HTML、或者将&amp;转化成and</li>
<li>分词器：字符串会被分词器分为单个的Term,一个简单的分词器遇到空格或者标点时，可能会对文本拆分</li>
<li>Token过滤器：词条按顺序通过Token过滤器，这个过程可能会改变词条（例如，Like变小写），删除词条（例如a、the、and无效词条），或者增加词条（例如，jump和leap这种同义词）</li>
</ul>
</li>
<li>
<p>内置分词器</p>
<ul>
<li>ES提供了一些预装的分词器，主要的如下：
<ul>
<li>标准分词器：这是ES的默认分词器。它分析各种语言最常用文本选择，删除绝大部分标点，将词条小写。</li>
<li>简单分词器：在任何不是字母的地方进行分隔，词条小写</li>
<li>空格分词器：在空格的地方分词</li>
<li>语言分析器：特定语言分析器可用于多种语言，它可以考虑语言特点，例如分析英语中无效的a\the\and等</li>
</ul>
</li>
</ul>
</li>
<li>
<p>分析器使用场景</p>
<ul>
<li>当我们索引一个文档，它的全文域会被分析成Term来创建倒排索引。但当我们用全文域搜索时。需要将查询字符串通过相同的分析过程，以保证我们搜索词条格式和索引中Term一致</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 检测分词器分词效果</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XGET</span> <span class="token string">"http://localhost:9200/_analyze"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"analyzer":"standard",</span>
<span class="line">	"text":"Text to analyze"</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"><span class="token comment"># 返回结果中token是实际存储的Term,position记录Term在原始文本的位置，start_offset\end_offset记录偏移量</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>指定分析器IK
<ul>
<li>中文分词，采用IK分词器，下载地址 https://github.com/medcl/elasticsearch-analysis-ik/releases?after=v7.8.0</li>
<li>解压文件放入ES根目录下plugins目录下，重启ES</li>
</ul>
</li>
<li>测试效果</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># ik_max_word将文本拆成最细粒度的</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XGET</span> <span class="token string">"http://localhost:9200/_analyze"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"analyzer":"ik_max_word",</span>
<span class="line">	"text":"中国人"</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"><span class="token comment"># ik_max_word中Term会分为`中国人` `中国` `国人`</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#ik_smart 将文本最粗粒度拆分</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XGET</span> <span class="token string">"http://localhost:9200/_analyze"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"analyzer":"ik_smart",</span>
<span class="line">	"text":"中国人"</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"><span class="token comment">#ik_smart中Term只有一个就是`中国人` </span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>ES也可以自己对分词进行扩展
<ul>
<li>进入ES的plugins目录的ik文件夹，进入config目录，创建custome.dic文件，写入自定义分词</li>
<li>打开IKAnalyzer.cfg.xml文件，将新建custom.dic配置其中，然后重启ES</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token operator">&lt;</span>?xml <span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token string">"1.0"</span> <span class="token assign-left variable">encoding</span><span class="token operator">=</span><span class="token string">"UTF-8"</span>?<span class="token operator">></span></span>
<span class="line"><span class="token operator">&lt;</span><span class="token operator">!</span>DOCTYPE properties SYSTEM <span class="token string">"http://java.sun.com/dtd/properties.dtd"</span><span class="token operator">></span></span>
<span class="line"><span class="token operator">&lt;</span>properties<span class="token operator">></span></span>
<span class="line">    <span class="token operator">&lt;</span>comment<span class="token operator">></span>IK Analyzer 扩展配置<span class="token operator">&lt;</span>/comment<span class="token operator">></span></span>
<span class="line">    <span class="token operator">&lt;</span><span class="token operator">!</span>--用户可以在这里配置自己的扩展字典 --<span class="token operator">></span></span>
<span class="line">    <span class="token operator">&lt;</span>entry <span class="token assign-left variable">key</span><span class="token operator">=</span><span class="token string">"ext_dict"</span><span class="token operator">></span>custom.dic<span class="token operator">&lt;</span>/entry<span class="token operator">></span></span>
<span class="line">     <span class="token operator">&lt;</span><span class="token operator">!</span>--用户可以在这里配置自己的扩展停止词字典--<span class="token operator">></span></span>
<span class="line">    <span class="token operator">&lt;</span>entry <span class="token assign-left variable">key</span><span class="token operator">=</span><span class="token string">"ext_stopwords"</span><span class="token operator">></span><span class="token operator">&lt;</span>/entry<span class="token operator">></span></span>
<span class="line">    <span class="token operator">&lt;</span><span class="token operator">!</span>--用户可以在这里配置远程扩展字典 --<span class="token operator">></span></span>
<span class="line">    <span class="token operator">&lt;</span><span class="token operator">!</span>-- <span class="token operator">&lt;</span>entry <span class="token assign-left variable">key</span><span class="token operator">=</span><span class="token string">"remote_ext_dict"</span><span class="token operator">></span>words_location<span class="token operator">&lt;</span>/entry<span class="token operator">></span> --<span class="token operator">></span></span>
<span class="line">    <span class="token operator">&lt;</span><span class="token operator">!</span>--用户可以在这里配置远程扩展停止词字典--<span class="token operator">></span></span>
<span class="line">    <span class="token operator">&lt;</span><span class="token operator">!</span>-- <span class="token operator">&lt;</span>entry <span class="token assign-left variable">key</span><span class="token operator">=</span><span class="token string">"remote_ext_stopwords"</span><span class="token operator">></span>words_location<span class="token operator">&lt;</span>/entry<span class="token operator">></span> --<span class="token operator">></span></span>
<span class="line"><span class="token operator">&lt;</span>/properties<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="文档控制" tabindex="-1"><a class="header-anchor" href="#文档控制"><span>文档控制</span></a></h4>
<ul>
<li>文档冲突：当我们使用index API更新文档，可以一次性读取原始文档，做修改。然后重新索引整个文档。最后的索引请求将被执行。如果同时他人也在更改整个文档，他们的更改会丢失。</li>
<li>如果是全量更新，最终执行的是一个人的修改数据。如果是局部更新，可能A成员改了a部分数据，B成员改了b部分数据，这就有问题了。</li>
<li>悲观并发控制：这种方式在关系型数据库被广泛使用，简单来说就是操作数据时，对资源加锁</li>
<li>乐观并发控制：ES假设这种冲突不太可能发生，并且不会阻塞数据操作。如果源数据读写过程中被修改，更新将会失败，应用程序将决定如何处理失败。例如尝试更新、使用新的数据，或者将问题报告给用户 。
<ul>
<li>put文档时，会返回<code v-pre>_seq_no</code>和<code v-pre>_primary_term</code>字段，用来做乐观锁（老版本用version）</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_doc/1001?if_seq_no=0&amp;if_primary_term=1"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"name":"华为",</span>
<span class="line">	"price":"4999"</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#还有一种用version的方式，即你的version需要大于文档的version</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> <span class="token string">"http://localhost:9200/shopping/_doc/1001?version=3&amp;version_type=external"</span> -d<span class="token string">'</span>
<span class="line">{</span>
<span class="line">	"name":"华为",</span>
<span class="line">	"price":"4999"</span>
<span class="line">}</span>
<span class="line">'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="文档展示-kibana" tabindex="-1"><a class="header-anchor" href="#文档展示-kibana"><span>文档展示-kibana</span></a></h4>
<ul>
<li>下载安装kibana</li>
<li>修改配置config/kibana.yml文件</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#默认端口</span></span>
<span class="line">server.port:5601</span>
<span class="line"><span class="token comment">#配置ES服务器地址</span></span>
<span class="line">elasticsearch.hosts:<span class="token punctuation">[</span><span class="token string">"http://localhost:9200"</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#索引名</span></span>
<span class="line">kibana.index:<span class="token string">".kibana"</span></span>
<span class="line"><span class="token comment">#支持中文</span></span>
<span class="line">i18n.locale:<span class="token string">"zh-CN"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


