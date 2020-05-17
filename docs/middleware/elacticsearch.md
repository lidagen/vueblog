## Elactic Search 基础
### Elactic Search概念
####  Elactic Search是什么
+ 简单说，Elasticsearch 就是一个分布式的搜索、聚合与分析引擎
+ 它的目的是通过简单的RESTful API来隐藏Lucene的复杂性，让全文检索变简单
#### 为什么需要 ES
+ 用数据库，也可以实现搜索的功能，为什么还需要搜索引擎呢？
  - 数据库（理论上来讲，ES 也是数据库，这里的数据库，指的是关系型数据库），首先是存储，搜索只是顺便提供的功能，
  - 而搜索引擎，首先是搜索，但是不把数据存下来就搜不了，所以只好存一存。
  - 术业有专攻，专攻搜索的搜索引擎，自然会提供更强大的搜索能力。
+ 精确匹配和相关性匹配
 - 在使用数据库搜索时，我们更多的是基于「精确匹配」的搜索。
 - 搜索引擎的「相关性匹配」更贴近人的思维方式。  
+ 搜索和分析，不只是搜索，还有分析
  - 这一切的分析数据的能力，都是建立在快速的查询上的，如果没有快速的查询，分析能力无从谈起。
+ 关系型数据库，把原本非常形象的对象，拍平了，拍成各个字段，存在数据库，查询时，再重新构造出对象；ES则是文档存储，把对象原原本本地放进去，取出时直接取出。
 - Mysql基于B+树索引，来实现快速检索，ES则基于**倒排索引**，对于文档搜索来说，倒排索引在性能和空间上都有更加明显的优势。  
#### 倒排索引

#### ES 对比 Solr
+ Solr使用ZK进行分布式关联，ES使用自带分布式协调器
+ Solr支持多中数据结构，ES仅支持json格式
+ Solr官方提供功能更多，而ES本身更注重核心功能，高级功能多是第三方提供
+ Solr在传统搜索应用中表现好于ES，但在实时处理搜索应用时效率明显低于ES

### ES核心概念
+ ES是面向文档的，这意味着它可以存储整个对象或文档，然而它不仅是存储，还会索引(index)每个文档内容可以被搜索，在ES中，你可以对文档(而非成行成列的数据)进行缩影、搜索、排序、过滤。ES对比传统数据库如下：
:::tip
+ Relational DB ->Database->Tables->Rows     ->Columns
+ Elasticsearche->Indexs  ->Types ->Documents->Fields
:::
#### 索引 index:
+ 一个索引就是一个拥有几分相似特征文档的集合。比如说，你可以有一个客户数据的索引，另一个产品目录的索引，还有一个订单数据的索引。一个索引由一个名字来标识(必须全部小写字母)，并且当我们要对对应这个索引中的文档进行索引、搜索、更新和删除时，都要使用这个名字，在一个集群中，你可以定义多个索引
#### 类型 type:
+ 在一个索引中，你可以定义一种或多种类型，一个类型是你的索引的一个逻辑上的分类/分区，其语义完全由你来定，会为具有一组共同字段的文档定义一个类型。比如说，我们假设你运营一个博客平台且将你所有数据存储在一个索引中。在这个索引中，你可以为用户数据定义一个类型，为博客数据定义另一个类型，为评论内容定义一个类型。
+ 一个type下的document,都有相同的field
#### 字段 Fields
+ 相当于数据库的表字段，对文档数据根据不同属性进行分类标识
#### 映射 mapping
+ mapping是处理数字的方式和规则方面进行了一些限制，如某个字段的数据类型、默认值、分析器、是否被索引等，这些都是映射里可以设置的，其它都是处理ES里面数据的一些使用规则设置也叫映射，按着最优规则处理数据对性能提高很大，因此才需要建立映射，并且需要思考如何建立映射对性能更好
#### 文档 Documents
+ 一个文档是一个可以被索引的基础信息单元.比如你可以拥有某一个客户的文档，某一个产品的文档。文档以json格式来表示。
#### 接近实时 NRT
+ ES是一个接近实时的搜索平台，这意味着，从索引一个文档直到这个文档能够被搜索到有一个轻微的延迟（1s以内）
#### 集群 cluster
+ 一个集群就是由一个或者多个节点组织一起的，它们共同持有整个数据，并提供索引和搜索功能。一个集群由一个唯一的名字来标识，这个名字默认‘elactisearch’,这个名字是重要的，因为节点的加入必须指定某个集群的名字。
#### 节点 node
+ 一个节点就是集群中的一个服务器，每个集群都有一个随机漫威角色名字来标识
#### 分片和复制 shards&replicas
+ 分片：
  - 分片就是，有一个大的索引，单节点没有这么大容量或者放单节点上处理搜索很慢，为了解决这个问题，es设置分片，允许一个索引放置在多个节点上。
  - 分片很重要，主要的原因有两个：1）允许你水平分割/拓展你的内容容量 2）允许你分片(潜在地位于多个节点上)之上进行分布式，并行的操作，提高吞吐量
+ 复制：
  - 某个节点挂了，有一个故障转移很重要。为此目的，ES允许你创建分片的一份或多份拷贝，这些拷贝叫做复制分片，或者复制
  - 复制很重要，主要的原因有两个：1）在节点失败的情况下，提供了高可用 2）拓展搜索量/吞吐量  