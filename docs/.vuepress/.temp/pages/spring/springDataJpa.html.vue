<template><div><h2 id="spring-data-jpa" tabindex="-1"><a class="header-anchor" href="#spring-data-jpa"><span>Spring-data-jpa</span></a></h2>
<ul>
<li>JPA(Java Persistence API)是Sun官方提出的Java持久化规范。它为Java开发人员提供了一种对象/关联映射工具来管理Java应用中的关系数据。</li>
</ul>
<h3 id="jpa入门" tabindex="-1"><a class="header-anchor" href="#jpa入门"><span>JPA入门</span></a></h3>
<h4 id="jpa提供的接口" tabindex="-1"><a class="header-anchor" href="#jpa提供的接口"><span>Jpa提供的接口</span></a></h4>
<ul>
<li><code v-pre>Repository</code>： 最顶层的空接口，目的为了统一所有Repository的类型，且能被组件扫描</li>
<li><code v-pre>CrudRepository </code>: Repository子接口，提供CRUD功能</li>
<li><code v-pre>PagingAndSortingRepository</code>: 是CrudRepository的子接口，添加分页和排序的功能</li>
<li><code v-pre>JpaRepository</code>: 是PagingAndSortingRepository的子接口，增加了一些实用的功能，比如：批量操作等</li>
<li><code v-pre>JpaSpecificationExecutor</code>: 用来做负责查询的接口</li>
<li><code v-pre>Specification</code>: 是Spring Data JPA提供的一个查询规范，要做复杂的查询，只需围绕这个规范来设置查询条件即可</li>
</ul>
<h4 id="jpa查询规则" tabindex="-1"><a class="header-anchor" href="#jpa查询规则"><span>Jpa查询规则</span></a></h4>
<ul>
<li>按照方法名解析规则如下： <strong>find+全局修饰+By+实体属性名称+限定词+连接词+（其他实体属性）+OrderBy+排序属性+排序方向</strong></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token function">findDistinctByFirstNameIgnoreCaseAndLastNameOrderByAgeDesc</span><span class="token punctuation">(</span><span class="token class-name">String</span> firstName<span class="token punctuation">,</span><span class="token class-name">String</span> lastName<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>全局修饰符：<em>distinct,top,first</em></li>
<li>关键词： <em>IsNull,IsNotNull,Like,NotLike,Containing,In,NotIn,IgnoreCase,Between,Equals,LessThan,GreaterThan,After,Before</em></li>
<li>排序方向： <em>Asc,Desc</em></li>
</ul>
<h4 id="所有支持的关键词" tabindex="-1"><a class="header-anchor" href="#所有支持的关键词"><span>所有支持的关键词</span></a></h4>
<p>keyword | sample |  JPQL |</p>
<ul>
<li>| :-: | :-: | :-: | -:
AND | findByLastnameAndFirstname | ...where x.lastname=?1 and x.firstname=?2 |
Or | findByLastnameOrFirstname | ...where x.lastname=?1 or x.firstname=?2  |
Between | findByStartDateBetween | ...where x.startDate between ?1 and ?2  |
lessThan | findByAgeLessThan | ...where x.age &lt; ?1  |
GreaterThan | findByAgeGreaterThan | ...where x.age &gt; ?1  |
After | findByStartDateAfter | ...where x.startDate &gt; ?1   |
Before | findByStartDateBefore |  ...where x.startDate &lt; ?1  |
IsNull | findByNameIsNull | ...where x.name is null  |
IsNotNull、NotNull | findByNameIsNotNull | ...where x.name is not null |
Like | findByFirstnameLike | ...where x.firstname like ?1  |
NotLike | findByFirstnameNotLike | ...where x.firstname not like ?1  |
StartingWith | findByFirstnameStartingWith | ...where x.firstname like ?1(parameter bound with apended %)  |
EndingWith | findByFirstnameEndingWith | ...where x.firstname like ?1(parameter bound with prepended %)   |
Containing | findByFirstnameContaining | ...where x.firstname like ?1(parameter bound warpped in %)  |
OrderBy | findByAgeOrderByLastNameDesc | ...where x.age=?1 order by x.lastname desc  |
Not | findByNameNot | ...where x.name &lt;&gt; ?1 |
In | findByAgeNIn | ...where x.age in ?1  |
NotIn | findByAgeNotIn | ...where x.age not in ?1  |
True | findByActiveTure | ...where x.active = true |
False | findByActiveFalse | ...where x.active = false   |</li>
</ul>
<h3 id="实体解析和关联关系" tabindex="-1"><a class="header-anchor" href="#实体解析和关联关系"><span>实体解析和关联关系</span></a></h3>
<h4 id="实体管理器" tabindex="-1"><a class="header-anchor" href="#实体管理器"><span>实体管理器</span></a></h4>
<ul>
<li>实体管理器EntityManager是实体与数据库的桥梁（和事务一起发挥作用）,相当于Hibenrtae中的session，Mybatis中的sqlSession。</li>
<li>例子</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@PersistenceContext</span></span>
<span class="line"><span class="token keyword">private</span> <span class="token class-name">EntityManager</span> em<span class="token punctuation">;</span>  <span class="token comment">// 注入实体管理器</span></span>
<span class="line"><span class="token annotation punctuation">@SuppressWarnings</span><span class="token punctuation">(</span><span class="token string">"unchecked"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">Page</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Student</span><span class="token punctuation">></span></span> <span class="token function">search</span><span class="token punctuation">(</span><span class="token class-name">User</span> user<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">String</span> dataSql <span class="token operator">=</span> <span class="token string">"select t from User t where 1 = 1"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">String</span> countSql <span class="token operator">=</span> <span class="token string">"select count(t) from User t where 1 = 1"</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">!=</span> user <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        dataSql <span class="token operator">+=</span> <span class="token string">" and t.name = ?1"</span><span class="token punctuation">;</span></span>
<span class="line">        countSql <span class="token operator">+=</span> <span class="token string">" and t.name = ?1"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token class-name">Query</span> dataQuery <span class="token operator">=</span> em<span class="token punctuation">.</span><span class="token function">createQuery</span><span class="token punctuation">(</span>dataSql<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">Query</span> countQuery <span class="token operator">=</span> em<span class="token punctuation">.</span><span class="token function">createQuery</span><span class="token punctuation">(</span>countSql<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">!=</span> user <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        dataQuery<span class="token punctuation">.</span><span class="token function">setParameter</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> user<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        countQuery<span class="token punctuation">.</span><span class="token function">setParameter</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> user<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token keyword">long</span> totalSize <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">long</span><span class="token punctuation">)</span> countQuery<span class="token punctuation">.</span><span class="token function">getSingleResult</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">Page</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">User</span><span class="token punctuation">></span></span> page <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Page</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    page<span class="token punctuation">.</span><span class="token function">setTotalSize</span><span class="token punctuation">(</span>totalSize<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">User</span><span class="token punctuation">></span></span> data <span class="token operator">=</span> dataQuery<span class="token punctuation">.</span><span class="token function">getResultList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    page<span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> page<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>实体总共有4个状态:
<ul>
<li>新建状态（A）：新建实体的时候，实体就是属于这个状态，执行persist方法后进入托管状态</li>
<li>托管状态（B）：托管状态，实体属于这个状态就说明实体已经被entityManager管理了</li>
<li>删除状态（C）：略</li>
<li>游离状态（D）：游离状态和A的区别就是D的ID是有值的</li>
</ul>
</li>
</ul>
<h4 id="实体基础映射" tabindex="-1"><a class="header-anchor" href="#实体基础映射"><span>实体基础映射</span></a></h4>
<ul>
<li><code v-pre>@Entity</code> 表示这个类是个实体类</li>
<li><code v-pre>@Table</code> 指定这个实体对应数据库表名</li>
<li><code v-pre>@Column</code> 用于指定持久化属性映射到数据库表的列
<ul>
<li>name (string) 列的名称，默认为属性的名称</li>
<li>unique (boolean) 列的值是否是唯一的</li>
<li>nullable (boolean) 列的值是否允许为 null。默认为 true</li>
<li>insertable (boolean) 列是否包含在 INSERT 语句中，默认为 true。</li>
<li>updatable (boolean) 列是否包含在 UPDATE 语句中，默认为 true。</li>
<li>table (string) 当前列所属的表的名称。</li>
<li>length (int) 列的长度，仅对字符串类型的列生效。默认为255。</li>
<li>precision (int) 列的精度，仅对十进制数值有效，表示有效数值的总位数。默认为0。</li>
<li>scale (int) 列的精度，仅对十进制数值有效，表示小数位的总位数。默认为0。</li>
</ul>
</li>
<li><code v-pre>@Id</code> 主键ID</li>
<li><code v-pre>@GenerateValue</code> 主键策略
<ul>
<li>AUTO 和默认的一样</li>
<li>IDENTITY 自动增长</li>
<li>SEQUENCE 序列，oracle使用</li>
</ul>
</li>
</ul>
<h4 id="实体高级映射" tabindex="-1"><a class="header-anchor" href="#实体高级映射"><span>实体高级映射</span></a></h4>
<p>// TUDO</p>
<ul>
<li>一对一</li>
<li>一对多</li>
<li>多对多</li>
</ul>
<h4 id="jpa应用分析" tabindex="-1"><a class="header-anchor" href="#jpa应用分析"><span>jpa应用分析</span></a></h4>
<ul>
<li>实体管理器高级操作——getReference()
<ul>
<li>用于查询单记录实体，和find类似 <code v-pre>T entity = entityManager.getReference(entityClass, id);</code></li>
<li>它与find区别是：当根据主键查询记录不存在时，将抛出EntityNotFoundException,我们可以根据异常做一些处理</li>
</ul>
</li>
<li>实体管理器高级操作——提交方式FlushModeType
<ul>
<li>提交(调用flush)分为两种方式：
<ul>
<li>AUTO:自动提交，实体管理器会在适当的时机同步实际记录到数据库，也是默认的提交方式</li>
<li>COMMIT:一旦一个事务完毕了，那么就立刻提交到数据库（忽略事务共享、事务传播）。 很多人建议使用默认的AUTO</li>
</ul>
</li>
</ul>
</li>
<li>大量数据分批提交
<ul>
<li>有的时候我们需要循环保存数据，当保存大量数据的时候，如果到最后才提交所有数据，那么数据库的负载可能会比较大。我们可以这样做，每30个记录就提交（flush）一次。代码如下：</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">updateBatch</span><span class="token punctuation">(</span><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Z</span><span class="token punctuation">></span></span> list<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> list<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">			entityManager<span class="token punctuation">.</span><span class="token function">merge</span><span class="token punctuation">(</span>list<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 变成托管状态</span></span>
<span class="line">			<span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">%</span> <span class="token number">30</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">				entityManager<span class="token punctuation">.</span><span class="token function">flush</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 变成持久化状态</span></span>
<span class="line">				entityManager<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 变成游离状态</span></span>
<span class="line">			<span class="token punctuation">}</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"> </span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">saveBatch</span><span class="token punctuation">(</span><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Z</span><span class="token punctuation">></span></span> list<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> list<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">			entityManager<span class="token punctuation">.</span><span class="token function">persist</span><span class="token punctuation">(</span>list<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 变成托管状态</span></span>
<span class="line">			<span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">%</span> <span class="token number">30</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">				entityManager<span class="token punctuation">.</span><span class="token function">flush</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 变成持久化状态</span></span>
<span class="line">				entityManager<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 变成游离状态</span></span>
<span class="line">			<span class="token punctuation">}</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>refresh()
<ul>
<li>该方法是和flush()相反，是将数据库记录重新读到实体中，这样实体也是出于持久化环境中了，处于托管状态。</li>
</ul>
</li>
<li>clear()
<ul>
<li>该方法是将所有的处于上下文中的实体全部转换成游离状态，此时还没有及时flush到数据库的信息，很遗憾，将不会持久化到数据库中。不是急于释放资源的情况下，请慎用之。</li>
</ul>
</li>
</ul>
<h3 id="jpql" tabindex="-1"><a class="header-anchor" href="#jpql"><span>JPQL</span></a></h3>
<ul>
<li>JPQL类似hibernate中hql，它跟数据库无关，可以自动翻译成对应数据库的sql</li>
<li>要从 Java 代码内发出 JPQL 查询，您需要利用 EntityManager API 和 Query API 的相应方法，执行以下一般步骤：
<ul>
<li>1.使用注入或通过 EntityManagerFactory 实例获取一个 EntityManager 实例。</li>
<li>2.通过调用相应 EntityManager 的方法（如 createQuery），创建一个 Query 实例。</li>
<li>3.如果有查询参数，使用相应 Query 的 setParameter 方法进行设置。</li>
<li>
<ol start="4">
<li>如果需要，使用 setMaxResults 和/或 setFirstResult Query 的方法设置要检索的实例的最大数量和/或指定检索的起始实例位置。</li>
</ol>
</li>
<li>5.如果需要，使用 setHint Query 的方法设置供应商特定的提示。</li>
<li>6.如果需要，使用 setFlushMode Query 的方法设置查询执行的刷新模式，覆盖实体管理器的刷新模式。</li>
<li>7.使用相应 Query 的方法 getSingleResult 或 getResultList 执行查询。如果进行更新或删除操作，您必须使用 executeUpdate 方法，它返回已更新或删除的实体实例的数量。</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@PersistenceContext</span></span>
<span class="line"><span class="token keyword">private</span> <span class="token class-name">EntityManager</span> em<span class="token punctuation">;</span>  <span class="token comment">// 注入实体管理器</span></span>
<span class="line"><span class="token annotation punctuation">@SuppressWarnings</span><span class="token punctuation">(</span><span class="token string">"unchecked"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">Page</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Student</span><span class="token punctuation">></span></span> <span class="token function">search</span><span class="token punctuation">(</span><span class="token class-name">User</span> user<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">String</span> dataSql <span class="token operator">=</span> <span class="token string">"select t from User t where 1 = 1"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">String</span> countSql <span class="token operator">=</span> <span class="token string">"select count(t) from User t where 1 = 1"</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">!=</span> user <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        dataSql <span class="token operator">+=</span> <span class="token string">" and t.name = ?1"</span><span class="token punctuation">;</span></span>
<span class="line">        countSql <span class="token operator">+=</span> <span class="token string">" and t.name = ?1"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token class-name">Query</span> dataQuery <span class="token operator">=</span> em<span class="token punctuation">.</span><span class="token function">createQuery</span><span class="token punctuation">(</span>dataSql<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">Query</span> countQuery <span class="token operator">=</span> em<span class="token punctuation">.</span><span class="token function">createQuery</span><span class="token punctuation">(</span>countSql<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">!=</span> user <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        dataQuery<span class="token punctuation">.</span><span class="token function">setParameter</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> user<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        countQuery<span class="token punctuation">.</span><span class="token function">setParameter</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> user<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">long</span> totalSize <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">long</span><span class="token punctuation">)</span> countQuery<span class="token punctuation">.</span><span class="token function">getSingleResult</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">Page</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">User</span><span class="token punctuation">></span></span> page <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Page</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    page<span class="token punctuation">.</span><span class="token function">setTotalSize</span><span class="token punctuation">(</span>totalSize<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">User</span><span class="token punctuation">></span></span> data <span class="token operator">=</span> dataQuery<span class="token punctuation">.</span><span class="token function">getResultList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    page<span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> page<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>JPQL具体写法略</li>
</ul>
<h3 id="高级查询" tabindex="-1"><a class="header-anchor" href="#高级查询"><span>高级查询</span></a></h3>
<ul>
<li>JPQL使用起来非常方便，但是如果SQL有一个词不小心写错了，只有在程序运行时才能发现错误在哪，这是一个弊端，如果想要在编译期间发现错误该怎么做呢，答案是使用Spring Data Jpa高级查询。</li>
<li>Criteria查询</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token class-name">CriteriaBuilder</span> cb <span class="token operator">=</span> entityManager<span class="token punctuation">.</span>getCriteriaBuilder <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// criteriaQuery工厂</span></span>
<span class="line"><span class="token class-name">CriteriaQuery</span> cq <span class="token operator">=</span> cb<span class="token punctuation">.</span><span class="token function">createQuery</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//查询语句构造器</span></span>
<span class="line"><span class="token class-name">Root</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">User</span><span class="token punctuation">></span></span> root <span class="token operator">=</span> cq<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token class-name">User</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">//获取查询根对象</span></span>
<span class="line">cq<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>   <span class="token comment">// select u from User u</span></span>
<span class="line"><span class="token class-name">Predicate</span> pre <span class="token operator">=</span> cb<span class="token punctuation">.</span><span class="token function">greaterThan</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"age"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">as</span><span class="token punctuation">(</span><span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// age大于20</span></span>
<span class="line">cq<span class="token punctuation">.</span><span class="token function">where</span><span class="token punctuation">(</span>pre<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// select u from User u where u.age > 20</span></span>
<span class="line"><span class="token comment">// 上面这一串的目的就是为了构造出    select u from User u where u.age > 20  的JPQL语句</span></span>
<span class="line"><span class="token class-name">Query</span> query <span class="token operator">=</span> em<span class="token punctuation">.</span><span class="token function">createQuery</span><span class="token punctuation">(</span>cq<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">User</span><span class="token punctuation">></span></span> users <span class="token operator">=</span> query<span class="token punctuation">.</span><span class="token function">getResultList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>只查询部分字段：把cq.select(root)改成cq.select(root.get(“字段名”))即可；有多个字段就 cq.multiselect(root.get(&quot;age&quot;), root.get(&quot;name&quot;).......)即可；</li>
<li>Fetch查询：在cq.select 前加上：<code v-pre>Fetch rootFetch = root.fetch(&quot;interests&quot;);   // 关联查询出用户的所有兴趣</code>
<ul>
<li>想要在程序中手动控制fetch，需要先再@ManyToMany等其他注解中将fetch设置成懒加载，然后在程序中控制。</li>
</ul>
</li>
<li>设置JOIN：在cq.select前加：<code v-pre>root.join(&quot;interests&quot;, JoinType.LEFT);  // select u from User u left join u.interests where u.age &gt; 20</code></li>
<li>结果集排序：在cq.orderBy后面：<code v-pre> cq.orderBy(cb.desc(root.get(&quot;age&quot;)), cb.asc(root.get(&quot;name&quot;)));</code></li>
<li>多个查询条件:</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token class-name">Predicate</span> pre <span class="token operator">=</span> cb<span class="token punctuation">.</span><span class="token function">greaterThan</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"age"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">as</span><span class="token punctuation">(</span><span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// age大于20</span></span>
<span class="line"><span class="token class-name">Predicate</span> pre2 <span class="token operator">=</span> cb<span class="token punctuation">.</span><span class="token function">lessThan</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"age"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">as</span><span class="token punctuation">(</span><span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">40</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// age小于40</span></span>
<span class="line">cq<span class="token punctuation">.</span><span class="token function">where</span><span class="token punctuation">(</span>pre<span class="token punctuation">)</span>改成cq<span class="token punctuation">.</span><span class="token function">where</span><span class="token punctuation">(</span>pre<span class="token punctuation">,</span>pre2<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>使用JpaSpecificationExcutor查询</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">UserRepository</span> <span class="token keyword">extends</span> <span class="token class-name">JpaRepository</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">User</span><span class="token punctuation">,</span> <span class="token class-name">Integer</span><span class="token punctuation">></span></span> <span class="token punctuation">,</span> <span class="token class-name">JapSpecificationExecutor</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">User</span><span class="token punctuation">></span></span><span class="token punctuation">{</span></span>
<span class="line"> </span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>repository继承了JapSpecificationExecutor之后，在UserServiceImpl中调用userRepository ：</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">User</span><span class="token punctuation">></span></span> <span class="token function">getUsers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> userRepository<span class="token punctuation">.</span><span class="token function">findAll</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Specification</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">User</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token annotation punctuation">@Override</span></span>
<span class="line">        <span class="token keyword">public</span> <span class="token class-name">Predicate</span> <span class="token function">toPredicate</span><span class="token punctuation">(</span><span class="token class-name">Root</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">User</span><span class="token punctuation">></span></span><span class="token punctuation">,</span> <span class="token class-name">CriteriaQuery</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> cq<span class="token punctuation">,</span> <span class="token class-name">CriteriaBuilder</span> cb<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Predicate</span><span class="token punctuation">></span></span> preList <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token comment">// 跟上面Criteria的条件构造是一样的</span></span>
<span class="line">            <span class="token comment">// ..........</span></span>
<span class="line">            <span class="token comment">// ..........</span></span>
<span class="line">            <span class="token comment">// 条件构造完毕，都在 preList 里面</span></span>
<span class="line">            <span class="token keyword">return</span> cq<span class="token punctuation">.</span><span class="token function">where</span><span class="token punctuation">(</span>preList<span class="token punctuation">.</span><span class="token function">toArray</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Predicate</span><span class="token punctuation">[</span>preList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getRestriction</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span>            </span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">;</span>       </span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>@Query和@NamedQuery查询
<ul>
<li>这个注解允许我们在接口的方法处使用自定义的查询语句（JPQL或者SQL），</li>
<li>如果想使用原生sql的话，@Query注解里有一个属性可以配置：<code v-pre>nativeQuery = true</code></li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Query</span><span class="token punctuation">(</span>value<span class="token operator">=</span><span class="token string">"select  u from user u where name like ?1"</span>， nativeQuery <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="querydsl" tabindex="-1"><a class="header-anchor" href="#querydsl"><span>QueryDSL</span></a></h3>
<ul>
<li>使用JPA对单表操作很灵活，复杂一点的SQL就处理不好，这时候用QueryDSL 来实现复杂SQL</li>
<li>QueryDSL仅仅是一个通用的查询框架，专注于通过 JavaAPI 构建类型安全的 Sql 查询，也可以说 QueryDSL 是基于各种 ORM 框架以及 Sql 之上的一个通用的查询框架，QueryDSL 的查询，类似于 SQL 查询</li>
</ul>
<h4 id="引入querydsl相关" tabindex="-1"><a class="header-anchor" href="#引入querydsl相关"><span>引入QueryDSL相关</span></a></h4>
<ul>
<li>引入依赖</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token comment">&lt;!--query dsl--></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>com.querydsl<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>querydsl-jpa<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>4.2.2<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>com.querydsl<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>querydsl-apt<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>4.2.2<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>scope</span><span class="token punctuation">></span></span>provided<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>scope</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token comment">&lt;!--query dsl end--></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>引入插件，用于生成查询实例</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token comment">&lt;!--该插件可以生成querysdl需要的查询对象，执行mvn compile即可--></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugin</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>com.mysema.maven<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>apt-maven-plugin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>1.1.3<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>executions</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>execution</span><span class="token punctuation">></span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>goals</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>goal</span><span class="token punctuation">></span></span>process<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>goal</span><span class="token punctuation">></span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>goals</span><span class="token punctuation">></span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>configuration</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>outputDirectory</span><span class="token punctuation">></span></span>target/generated-sources/java<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>outputDirectory</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>processor</span><span class="token punctuation">></span></span>com.querydsl.apt.jpa.JPAAnnotationProcessor<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>processor</span><span class="token punctuation">></span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>configuration</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>execution</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>executions</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugin</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="单表演示" tabindex="-1"><a class="header-anchor" href="#单表演示"><span>单表演示</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@RunWith</span><span class="token punctuation">(</span><span class="token class-name">SpringRunner</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token annotation punctuation">@SpringBootTest</span></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">JpaProjectApplicationTests</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">EntityManager</span> entityManager<span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">//查询工厂实体</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">JPAQueryFactory</span> queryFactory<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@PostConstruct</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">initFactory</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        queryFactory <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">JPAQueryFactory</span><span class="token punctuation">(</span>entityManager<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token annotation punctuation">@Test</span></span>
<span class="line">    <span class="token keyword">void</span> <span class="token function">contextLoads</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">User</span> user <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">User</span><span class="token punctuation">(</span><span class="token string">"ws"</span><span class="token punctuation">,</span><span class="token string">"123"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">QUser</span> qUser <span class="token operator">=</span> <span class="token class-name">QUser</span><span class="token punctuation">.</span>user<span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">// 定于获取条件</span></span>
<span class="line">        <span class="token class-name">BooleanBuilder</span> booleanBuilder <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BooleanBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">// 要查询的条件</span></span>
<span class="line">        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span><span class="token function">getUsername</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 放入要查询的条件信息</span></span>
<span class="line">            booleanBuilder<span class="token punctuation">.</span><span class="token function">and</span><span class="token punctuation">(</span>qUser<span class="token punctuation">.</span>username<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span><span class="token function">getUsername</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token comment">// 要查询的条件</span></span>
<span class="line">        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span><span class="token function">getPassword</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            booleanBuilder<span class="token punctuation">.</span><span class="token function">and</span><span class="token punctuation">(</span>qUser<span class="token punctuation">.</span>password<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span><span class="token function">getPassword</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">User</span><span class="token punctuation">></span></span> fetch <span class="token operator">=</span> queryFactory<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span>qUser<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>qUser<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">where</span><span class="token punctuation">(</span>booleanBuilder<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">orderBy</span><span class="token punctuation">(</span>qUser<span class="token punctuation">.</span>creatTime<span class="token punctuation">.</span><span class="token function">desc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">fetch</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">User</span> fetch1 <span class="token operator">:</span> fetch<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>fetch1<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">"+++++++++++++++++++++"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>单表只为了演示基本使用，单表查询JPA就可以解决，QueryDSL主要解决多表联查问题</li>
</ul>
<h4 id="多表关联" tabindex="-1"><a class="header-anchor" href="#多表关联"><span>多表关联</span></a></h4>
<ul>
<li>三张表 user role user_role ,user_role是中间表</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@RunWith</span><span class="token punctuation">(</span><span class="token class-name">SpringRunner</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token annotation punctuation">@SpringBootTest</span></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">JpaProjectApplicationTests</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">EntityManager</span> entityManager<span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">//查询工厂实体</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">JPAQueryFactory</span> queryFactory<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">int</span> roleId <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">int</span> userId <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@PostConstruct</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">initFactory</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        queryFactory <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">JPAQueryFactory</span><span class="token punctuation">(</span>entityManager<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Test</span></span>
<span class="line">    <span class="token keyword">void</span> <span class="token function">contextLoads</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">QUser</span> qUser <span class="token operator">=</span> <span class="token class-name">QUser</span><span class="token punctuation">.</span>user<span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">QRole</span> qRole <span class="token operator">=</span> <span class="token class-name">QRole</span><span class="token punctuation">.</span>role<span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">QUserRole</span> qUserRole <span class="token operator">=</span> <span class="token class-name">QUserRole</span><span class="token punctuation">.</span>userRole<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 定于获取条件</span></span>
<span class="line">        <span class="token class-name">BooleanBuilder</span> booleanBuilder <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BooleanBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">// 要查询的条件</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>roleId<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 放入要查询的条件信息</span></span>
<span class="line">            booleanBuilder<span class="token punctuation">.</span><span class="token function">and</span><span class="token punctuation">(</span>qUserRole<span class="token punctuation">.</span>roleId<span class="token punctuation">.</span><span class="token function">eq</span><span class="token punctuation">(</span>roleId<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token comment">// 要查询的条件</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>userId<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 放入要查询的条件信息</span></span>
<span class="line">            booleanBuilder<span class="token punctuation">.</span><span class="token function">and</span><span class="token punctuation">(</span>qUserRole<span class="token punctuation">.</span>userId<span class="token punctuation">.</span><span class="token function">eq</span><span class="token punctuation">(</span>userId<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        </span>
<span class="line">        <span class="token class-name">QueryResults</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">UserRoleVo</span><span class="token punctuation">></span></span> queryResults <span class="token operator">=</span> queryFactory<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token class-name">Projections</span><span class="token punctuation">.</span><span class="token function">bean</span><span class="token punctuation">(</span><span class="token class-name">UserRoleVo</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> qUser<span class="token punctuation">.</span>username<span class="token punctuation">,</span> qRole<span class="token punctuation">.</span>roleName<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>qUser<span class="token punctuation">,</span> qUserRole<span class="token punctuation">,</span> qRole<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">where</span><span class="token punctuation">(</span>booleanBuilder<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">fetchResults</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        queryResults<span class="token punctuation">.</span><span class="token function">getResults</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>r <span class="token operator">-></span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>r<span class="token punctuation">.</span><span class="token function">getUsername</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"++++++++++++"</span><span class="token operator">+</span>r<span class="token punctuation">.</span><span class="token function">getRoleName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


