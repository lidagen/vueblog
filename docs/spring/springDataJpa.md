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

### JPQL
### 高级查询