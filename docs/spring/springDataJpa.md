## Spring-data-jpa 
+ JPA(Java Persistence API)是Sun官方提出的Java持久化规范。它为Java开发人员提供了一种对象/关联映射工具来管理Java应用中的关系数据。
### JPA入门
#### Jpa提供的接口
+ `Repository`： 最顶层的空接口，目的为了统一所有Repository的类型，且能被组件扫描
+ `CrudRepository `: Repository子接口，提供CRUD功能
+ `PagingAndSortingRepository`: 是CrudRepository的子接口，添加分页和排序的功能
+ `JpaRepository`: 是PagingAndSortingRepository的子接口，增加了一些实用的功能，比如：批量操作等
+ `JpaSpecificationExecutor`: 用来做负责查询的接口
+ `Specification`: 是Spring Data JPA提供的一个查询规范，要做复杂的查询，只需围绕这个规范来设置查询条件即可

#### Jpa查询规则
+ 按照方法名解析规则如下： **find+全局修饰+By+实体属性名称+限定词+连接词+（其他实体属性）+OrderBy+排序属性+排序方向**
````java
findDistinctByFirstNameIgnoreCaseAndLastNameOrderByAgeDesc(String firstName,String lastName)
````
+ 全局修饰符：*distinct,top,first*
+ 关键词： *IsNull,IsNotNull,Like,NotLike,Containing,In,NotIn,IgnoreCase,Between,Equals,LessThan,GreaterThan,After,Before*
+ 排序方向： *Asc,Desc*
#### 所有支持的关键词
keyword | sample |  JPQL |  
- | :-: | :-: | :-: | -:
AND | findByLastnameAndFirstname | ...where x.lastname=?1 and x.firstname=?2 |
Or | findByLastnameOrFirstname | ...where x.lastname=?1 or x.firstname=?2  |
Between | findByStartDateBetween | ...where x.startDate between ?1 and ?2  |
lessThan | findByAgeLessThan | ...where x.age < ?1  |
GreaterThan | findByAgeGreaterThan | ...where x.age > ?1  |
After | findByStartDateAfter | ...where x.startDate > ?1   |
Before | findByStartDateBefore |  ...where x.startDate < ?1  |
IsNull | findByNameIsNull | ...where x.name is null  |
IsNotNull、NotNull | findByNameIsNotNull | ...where x.name is not null |
Like | findByFirstnameLike | ...where x.firstname like ?1  |
NotLike | findByFirstnameNotLike | ...where x.firstname not like ?1  |
StartingWith | findByFirstnameStartingWith | ...where x.firstname like ?1(parameter bound with apended %)  |
EndingWith | findByFirstnameEndingWith | ...where x.firstname like ?1(parameter bound with prepended %)   |
Containing | findByFirstnameContaining | ...where x.firstname like ?1(parameter bound warpped in %)  |
OrderBy | findByAgeOrderByLastNameDesc | ...where x.age=?1 order by x.lastname desc  |
Not | findByNameNot | ...where x.name <> ?1 |
In | findByAgeNIn | ...where x.age in ?1  |
NotIn | findByAgeNotIn | ...where x.age not in ?1  |
True | findByActiveTure | ...where x.active = true |
False | findByActiveFalse | ...where x.active = false   |
### 实体解析和关联关系
#### 实体管理器
+ 实体管理器EntityManager是实体与数据库的桥梁（和事务一起发挥作用）,相当于Hibenrtae中的session，Mybatis中的sqlSession。
+ 例子
````java
@PersistenceContext
private EntityManager em;  // 注入实体管理器
@SuppressWarnings("unchecked")
public Page<Student> search(User user) {
    String dataSql = "select t from User t where 1 = 1";
    String countSql = "select count(t) from User t where 1 = 1";
    
    if(null != user && !StringUtils.isEmpty(user.getName())) {
        dataSql += " and t.name = ?1";
        countSql += " and t.name = ?1";
    }
    
    Query dataQuery = em.createQuery(dataSql);
    Query countQuery = em.createQuery(countSql);
    
    if(null != user && !StringUtils.isEmpty(user.getName())) {
        dataQuery.setParameter(1, user.getName());
        countQuery.setParameter(1, user.getName());
    }long totalSize = (long) countQuery.getSingleResult();
    Page<User> page = new Page();
    page.setTotalSize(totalSize);
    List<User> data = dataQuery.getResultList();
    page.setData(data);
    return page;
}
````
+ 实体总共有4个状态:
  - 新建状态（A）：新建实体的时候，实体就是属于这个状态，执行persist方法后进入托管状态
  - 托管状态（B）：托管状态，实体属于这个状态就说明实体已经被entityManager管理了
  - 删除状态（C）：略
  - 游离状态（D）：游离状态和A的区别就是D的ID是有值的
#### 实体基础映射
+ `@Entity` 表示这个类是个实体类
+ `@Table` 指定这个实体对应数据库表名
+ `@Column` 用于指定持久化属性映射到数据库表的列
  - name (string) 列的名称，默认为属性的名称
  - unique (boolean) 列的值是否是唯一的
  - nullable (boolean) 列的值是否允许为 null。默认为 true
  - insertable (boolean) 列是否包含在 INSERT 语句中，默认为 true。
  - updatable (boolean) 列是否包含在 UPDATE 语句中，默认为 true。
  - table (string) 当前列所属的表的名称。
  - length (int) 列的长度，仅对字符串类型的列生效。默认为255。
  - precision (int) 列的精度，仅对十进制数值有效，表示有效数值的总位数。默认为0。
  - scale (int) 列的精度，仅对十进制数值有效，表示小数位的总位数。默认为0。     
+ `@Id` 主键ID
+ `@GenerateValue` 主键策略
  - AUTO 和默认的一样
  - IDENTITY 自动增长
  - SEQUENCE 序列，oracle使用 
#### 实体高级映射
// TUDO
+ 一对一
+ 一对多
+ 多对多  
#### jpa应用分析
+ 实体管理器高级操作——getReference()
  - 用于查询单记录实体，和find类似 `T entity = entityManager.getReference(entityClass, id);`
  - 它与find区别是：当根据主键查询记录不存在时，将抛出EntityNotFoundException,我们可以根据异常做一些处理
+ 实体管理器高级操作——提交方式FlushModeType
  - 提交(调用flush)分为两种方式：
    + AUTO:自动提交，实体管理器会在适当的时机同步实际记录到数据库，也是默认的提交方式
    + COMMIT:一旦一个事务完毕了，那么就立刻提交到数据库（忽略事务共享、事务传播）。 很多人建议使用默认的AUTO
+ 大量数据分批提交
  - 有的时候我们需要循环保存数据，当保存大量数据的时候，如果到最后才提交所有数据，那么数据库的负载可能会比较大。我们可以这样做，每30个记录就提交（flush）一次。代码如下：
````java
public void updateBatch(List<Z> list) {
		for (int i = 0; i < list.size(); i++) {
			entityManager.merge(list.get(i)); // 变成托管状态
			if (i % 30 == 0) {
				entityManager.flush(); // 变成持久化状态
				entityManager.clear(); // 变成游离状态
			}
		}
	}
 
	public void saveBatch(List<Z> list) {
		for (int i = 0; i < list.size(); i++) {
			entityManager.persist(list.get(i)); // 变成托管状态
			if (i % 30 == 0) {
				entityManager.flush(); // 变成持久化状态
				entityManager.clear(); // 变成游离状态
			}
		}
	}
````
+ refresh()
  - 该方法是和flush()相反，是将数据库记录重新读到实体中，这样实体也是出于持久化环境中了，处于托管状态。
+ clear()
  - 该方法是将所有的处于上下文中的实体全部转换成游离状态，此时还没有及时flush到数据库的信息，很遗憾，将不会持久化到数据库中。不是急于释放资源的情况下，请慎用之。        
### JPQL
+ JPQL类似hibernate中hql，它跟数据库无关，可以自动翻译成对应数据库的sql
+ 要从 Java 代码内发出 JPQL 查询，您需要利用 EntityManager API 和 Query API 的相应方法，执行以下一般步骤：
  - 1.使用注入或通过 EntityManagerFactory 实例获取一个 EntityManager 实例。
  - 2.通过调用相应 EntityManager 的方法（如 createQuery），创建一个 Query 实例。
  - 3.如果有查询参数，使用相应 Query 的 setParameter 方法进行设置。
  - 4. 如果需要，使用 setMaxResults 和/或 setFirstResult Query 的方法设置要检索的实例的最大数量和/或指定检索的起始实例位置。
  - 5.如果需要，使用 setHint Query 的方法设置供应商特定的提示。
  - 6.如果需要，使用 setFlushMode Query 的方法设置查询执行的刷新模式，覆盖实体管理器的刷新模式。
  - 7.使用相应 Query 的方法 getSingleResult 或 getResultList 执行查询。如果进行更新或删除操作，您必须使用 executeUpdate 方法，它返回已更新或删除的实体实例的数量。
````java
@PersistenceContext
private EntityManager em;  // 注入实体管理器
@SuppressWarnings("unchecked")
public Page<Student> search(User user) {
    String dataSql = "select t from User t where 1 = 1";
    String countSql = "select count(t) from User t where 1 = 1";
    
    if(null != user && !StringUtils.isEmpty(user.getName())) {
        dataSql += " and t.name = ?1";
        countSql += " and t.name = ?1";
    }
    
    Query dataQuery = em.createQuery(dataSql);
    Query countQuery = em.createQuery(countSql);
    
    if(null != user && !StringUtils.isEmpty(user.getName())) {
        dataQuery.setParameter(1, user.getName());
        countQuery.setParameter(1, user.getName());
    }
    long totalSize = (long) countQuery.getSingleResult();
    Page<User> page = new Page();
    page.setTotalSize(totalSize);
    List<User> data = dataQuery.getResultList();
    page.setData(data);
    return page;
}
````  
+ JPQL具体写法略
### 高级查询
+ JPQL使用起来非常方便，但是如果SQL有一个词不小心写错了，只有在程序运行时才能发现错误在哪，这是一个弊端，如果想要在编译期间发现错误该怎么做呢，答案是使用Spring Data Jpa高级查询。
+ Criteria查询
````java
CriteriaBuilder cb = entityManager.getCriteriaBuilder ();  // criteriaQuery工厂
CriteriaQuery cq = cb.createQuery(); //查询语句构造器
Root<User> root = cq.from(User.class);  //获取查询根对象
cq.select(root);   // select u from User u
Predicate pre = cb.greaterThan(root.get("age").as(Integer.class), 20); // age大于20
cq.where(pre); // select u from User u where u.age > 20
// 上面这一串的目的就是为了构造出    select u from User u where u.age > 20  的JPQL语句
Query query = em.createQuery(cq);
List<User> users = query.getResultList();
```` 
  - 只查询部分字段：把cq.select(root)改成cq.select(root.get(“字段名”))即可；有多个字段就 cq.multiselect(root.get("age"), root.get("name").......)即可；
  - Fetch查询：在cq.select 前加上：`Fetch rootFetch = root.fetch("interests");   // 关联查询出用户的所有兴趣`  
    + 想要在程序中手动控制fetch，需要先再@ManyToMany等其他注解中将fetch设置成懒加载，然后在程序中控制。
  - 设置JOIN：在cq.select前加：`root.join("interests", JoinType.LEFT);  // select u from User u left join u.interests where u.age > 20`  
  - 结果集排序：在cq.orderBy后面：` cq.orderBy(cb.desc(root.get("age")), cb.asc(root.get("name")));`
  - 多个查询条件:
````java
Predicate pre = cb.greaterThan(root.get("age").as(Integer.class), 20); // age大于20
Predicate pre2 = cb.lessThan(root.get("age").as(Integer.class), 40); // age小于40
cq.where(pre)改成cq.where(pre,pre2);
```` 
+ 使用JpaSpecificationExcutor查询
````java
public interface UserRepository extends JpaRepository<User, Integer> , JapSpecificationExecutor<User>{
 
}
````
+ repository继承了JapSpecificationExecutor之后，在UserServiceImpl中调用userRepository ：
````java
public List<User> getUsers(){
    return userRepository.findAll(new Specification<User>(){
        @Override
        public Predicate toPredicate(Root<User>, CriteriaQuery<?> cq, CriteriaBuilder cb){
            List<Predicate> preList = new ArrayList();
            // 跟上面Criteria的条件构造是一样的
            // ..........
            // ..........
            // 条件构造完毕，都在 preList 里面
            return cq.where(preList.toArray(new Predicate[preList.size()])).getRestriction();
        }            
    }) ;       
}
```` 
+ @Query和@NamedQuery查询
  - 这个注解允许我们在接口的方法处使用自定义的查询语句（JPQL或者SQL），
  - 如果想使用原生sql的话，@Query注解里有一个属性可以配置：`nativeQuery = true`
````java
@Query(value="select  u from user u where name like ?1"， nativeQuery = true)
````  