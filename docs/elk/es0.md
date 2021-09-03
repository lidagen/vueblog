## ElacticSearch 基础

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
+ 普通索引是根据文档找关键字，倒排索引是根据关键字找文档

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
+ ES 7.X以后，Type概念已被删除

#### 文档 Documents
+ 一个文档是一个可以被索引的基础信息单元.比如你可以拥有某一个客户的文档，某一个产品的文档。文档以json格式来表示。
#### 字段 Fields
+ 相当于数据库的表字段，对文档数据根据不同属性进行分类标识

#### 映射 mapping
+ mapping是处理数字的方式和规则方面进行了一些限制，如某个字段的数据类型、默认值、分析器、是否被索引等，这些都是映射里可以设置的，其它都是处理ES里面数据的一些使用规则设置也叫映射，按着最优规则处理数据对性能提高很大，因此才需要建立映射，并且需要思考如何建立映射对性能更好

### 安装ES
+ `elasticsearch.org`下载对应系统的安装包，进入bin目录执行elasticsearch.bat (windows) 
+ `http://localhost:9200/`访问是否启动

### 文档管理(CRUD)

#### 索引Index-创建
````sh
#创建一个shopping的索引，幂等
curl -XPUT "http://localhost:9200/shopping" -d''
````
#### 索引Index-查询&删除
````sh
#查询shopping索引
curl -XGET "http://localhost:9200/shopping" -d''

#查询所有索引信息
curl -XGET "http://localhost:9200/_cat/indices?v" -d''

#删除索引
curl -XDELETE "http://localhost:9200/shopping" -d''
````

#### 文档Doucument-创建Post
+ 索引创建完了，添加Documents，新版本没有表的概念了，直接索引后面添加数据
+ _doc就是这个索引的type,也可以写为_create，固定写法
````sh
# 文档添加，需要json数据,该操作不幂等
curl -XPOST "http://localhost:9200/shopping/_doc" -d'
{
	"name":"小米4",
	"price":1999
}
'
# 自定义ID 1001添加文档
curl -XPOST "http://localhost:9200/shopping/_doc/1001" -d'
{
	"name":"小米4",
	"price":1999
}
'
````
#### 主键查询&全查询
````sh
#主键查询
curl -XPOST "http://localhost:9200/shopping/_doc/1001" -d''
#全部查询 会查询所有索引
curl -XPOST "http://localhost:9200/_search" -d''
````
#### 全量修改&局部修改&删除
````sh
#全量修改，该index下的1001数据修改，幂等
curl -XPUT "http://localhost:9200/shopping/_doc/1001" -d'
{
	"name":"小米5",
	"price":3999
}
'


#局部修改，该index下的1001数据修改，POST不幂等
#_update代表局部修改，json数据doc表现对文档修改，name是具体修改的哪一个值
curl -XPOST "http://localhost:9200/shopping/_update/1001" -d'
{
	"doc":{
	  "name":"华为"
	}
}
'

#删除文档
curl -XDELETE "http://localhost:9200/shopping/_doc/1001" -d''
````
#### 条件查询&分页查询&查询排序
````sh
#条件查询1
curl -XGET "http://localhost:9200/shopping/_search?q=name:华为" -d''

#条件查询2 query代表条件查询，match匹配
curl -XPOST "http://localhost:9200/shopping/_search" -d'
{
	"query":{
		"match":{
			"name":"华为"
		}
	}
}
'

#查询全部
curl -XPOST "http://localhost:9200/shopping/_search" -d'
{
	"query":{
		"match_all":{
		}
	}
}
'

#分页查询 from起始页，size每页大小
curl -XPOST "http://localhost:9200/shopping/_search" -d'
{
	"query":{
		"match_all":{
		}
	},
	"from":0,
	"size":2
}
'

#查询排序&查询控制,_source指定想要查询的参数
curl -XPOST "http://localhost:9200/shopping/_search" -d'
{
	"query":{
		"match_all":{
		}
	},
	"from":0,
	"size":2,
  "_source":["price"],
  "sort":{
		"price":{
			"order":"desc"
		}
	}
}
'
````
#### 多条件查询&范围查询
````sh
# 多条件查询,must代表多条件都需要匹配，类似SQL的and ,should代表or，可以替换must
curl -XPOST "http://localhost:9200/shopping/_search" -d'
{
	"query":{
		"bool":{
			"must":[
				{
					"match":{
						"name":"华为"
					}
				},
				{
					"match":{
						"price":4999
					}
				}
			]
		}
	}
}
'

#范围查询 增加filter做范围查询，如果should，match不生效，会查到华为以外的，must只会查名字叫华为且价格大于3000数据
 
{
	"query":{
		"bool":{
			"must":[
				{
					"match":{
						"name":"华为"
					}
				}
			],
			"filter":{
				"range":{
					"price":{
						"gt":3000
					}
				}
			}
		}
	}
}
'
````
#### 全文检索&完全匹配&高亮查询
````sh
#全文检索 如果我们匹配了米华，分词会把小米和华为都查出来，
curl -XPOST "http://localhost:9200/shopping/_search" -d'
{
	"query":{
		"match":{
			"name":"米华"
		}
	}
}
'
#完全匹配 这样只能搜到名字带华的了，如果写米华匹配不成功
curl -XPOST "http://localhost:9200/shopping/_search" -d'
{
	"query":{
		"match_phrase":{
			"name":"华"
		}
	}
}
'
#高亮查询 fields代表要高亮的字段名
curl -XPOST "http://localhost:9200/shopping/_search" -d'
{
	"query":{
		"match_phrase":{
			"name":"华"
		}
	},
	"highlight":{
		"fields":{
			"name":{}
		}
	}
}
'
````
#### 聚合查询
````sh
````
#### 映射关系
````sh
# 创建一个student的索引 并且设置mapping
curl -XPUT "http://localhost:9200/student/_mapping" -d'
{
	"properties":{
		"name":{
			"type":	"text",
			"index":true
		},
		"sex":{
			"type":	"keyword",
			"index":true
		},
		"phone":{
			"type":	"keyword",
			"index":false
		}
	}
}
'
# name这个属性是分词的，type类型是text,且为true
# sex这个数据必须完全匹配才能查询，"type":	"keyword"
# phone这个不能作为查询条件的	"type":	"keyword","index":false 不支持查询
````
















