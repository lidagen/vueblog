## JDK 1.8 java.time 包

### 概述
+ java 1.8之前的日期类存在几个问题：
  - 线程不安全，`java.util.Date` 这个类线程不安全，是可变的。导致了需要二次封装。
  - 时间处理麻烦，默认时间从1900开始，不支持国际化，不提供时区支持。
  - 设计不好，比如`java.util`和`java.sql`中的日期类，名称都是一样，容易导错包。

+ java 1.8以后的`java.time`包，日期类不可变且线程安全的。吸取了第三方jada-time

### time关键类
+ `Instant` 它代表的是时间戳,这里的时间戳默认的是0时区的，所以比北京时间少8个时区

+ `LocalDate` 不包含时间的日期

+ `LocalTime` 时间

+ `LocalDateTime` 日期和时间

+ `ZonedDateTime` 包含时区的完整的日期时间，偏移量是以UTC/格林威治时间为基准的，如：2018-10-08T18:12:38.547+08:00[Asia/Shanghai]。


### 常用API


#### LocalDate、LocalTime、LocalDateTime

+ 这三个类分别表示日期、时间、日期时间，其API具有相似性。用LocalDateTime来举例它们的共性
#### LocalDateTime
````java
 //获取此刻的日期时间
LocalDateTime localDateTime = LocalDateTime.now();
/**
* 获取当前日期时间的明天、昨天
* 同理还有年、月 、日 时、分、秒的加减
*/
LocalDateTime tomorrow = localDateTime.plusDays(1L);
LocalDateTime yesterday = localDateTime.minusDays(1L);
/**
* 获取本月、本年的日期的API LocalDate LocalDateTime都有，LocalTime有类似的获取时间的API
*/
//第5天是本月的哪天
LocalDateTime withDayOfMonth = localDateTime.withDayOfMonth(5);
//第120天时本年的哪天
LocalDateTime withDayOfYear = localDateTime.withDayOfYear(120);

/**
* 计算两个日期时间的差值 （昨天直到明天 +2,反过来是 -2）
* 同理还有年、月、日、时、分、秒的差值比较
* LocalTime LocalDate都有此API,只是LocalTime不可计算年月日 ，LocalDate不可计算时分秒
*/
long untilDay = yesterday.until(tomorrow, ChronoUnit.DAYS);//2
/**
*日期的比较，返回一个boolean值，也有isAfter与此相反
* LocalTime LocalDate都有此API
*/
boolean before = yesterday.isBefore(tomorrow);//true
//转时间戳，需要设置东八区 +8
long timestamp = localDateTime.toInstant(ZoneOffset.ofHours(8)).toEpochMilli();
````
+ `TemporalAdjuster`该类是一个计算用的类，提供了各种各样的计算方法。比如某个月的第一天，某个月的最后一天，某一年的第一天，某一年的第几天等各种计算方法。同样用`LocalDateTime`举例
````java
LocalDateTime localDateTime = LocalDateTime.now();
/**
* TemporalAdjusters类 适用LocalDate LocalDateTime
*/
//本月第一天
LocalDateTime firstDayOfMonth = localDateTime.with(TemporalAdjusters.firstDayOfMonth());
//本年最后一天
LocalDateTime lastDayOfMonth = localDateTime.with(TemporalAdjusters.lastDayOfYear());
//下月第一天
LocalDateTime firstDayOfNextMonth = localDateTime.with(TemporalAdjusters.firstDayOfNextMonth());
````
+ `Period`和`Duration` Period是基于ISO-8601标准的日期系统，用于计算两个日期间的年，月，日的差值。比如'2年，3个月，4天'；而Duration和Period很像，但Duration计算的是两个日期间的秒，纳秒的值，是一种更为精确的计算方式。
  -  `Period.between(LocalDate day1,LocalDate day2)` 底层是 until方法实现，只是只接收LocalDate参数.
  -  `Duration.between(LocalTime time1,LocalTime time2)`计算两个时间之间的秒数，纳秒数。有一点需要注意，Duration中必须要支持秒数，如果没有的话，将会报错.
+ `ChronoUnit` 实现功能类型Period和Duration，但如果我们看它的底层实现，就可以看到它基本是基于Duration来实现的.
````java
LocalDateTime oldDate = LocalDateTime.of(2017, Month.AUGUST, 31, 10, 20, 55);
LocalDateTime newDate = LocalDateTime.of(2018, Month.NOVEMBER, 9, 10, 21, 56);

long years = ChronoUnit.YEARS.between(oldDate, newDate);
long months = ChronoUnit.MONTHS.between(oldDate, newDate);
long weeks = ChronoUnit.WEEKS.between(oldDate, newDate);
long days = ChronoUnit.DAYS.between(oldDate, newDate);
long hours = ChronoUnit.HOURS.between(oldDate, newDate);
long minutes = ChronoUnit.MINUTES.between(oldDate, newDate);
long seconds = ChronoUnit.SECONDS.between(oldDate, newDate);
long milis = ChronoUnit.MILLIS.between(oldDate, newDate);
long nano = ChronoUnit.NANOS.between(oldDate, newDate);
````

+`Clock`时钟系统，用于查找当前时刻。通过指定一个时区，我们可以获取到当前的时刻。
````java
/**
* Clock 可获取系统或者自主选择时区，获取时区码，时间戳，时区本地的时间
*/
// 系统默认
Clock systemDefaultClock = Clock.systemDefaultZone();
// 世界协调时UTC
Clock systemUTCClock = Clock.systemUTC();
//芝加哥
Clock clock = Clock.system(ZoneId.of(ZoneId.SHORT_IDS.get("CST")));
LocalDateTime.now(clock);//2019-08-29T22:54:45.515
clock.millis();//1567137013253
clock.getZone();//America/Chicago
````

#### Instant
````java
/**
*获取0时区的时间戳
*打印输出 2019-08-29T09:45:28.164Z
*/
Instant now = Instant.now();
````

#### ZonedDateTime
+` ZonedDateTime` 类似` LocalDateTime`,只是相比`LocalDateTime`,多了一个时区的概念



### `java.time.Instant` 与 `java.util.Date` 的转换

+ java 1.8 `java.util.Date`做了兼容，增加了两个方法`Date.from(Instant instant)``toInstant()`
  - `Instant`转为`Date`
````java
public static Date from(Instant instant) {
    try {
        return new Date(instant.toEpochMilli());
    } catch (ArithmeticException ex) {
        throw new IllegalArgumentException(ex);
    }
}
````
+ `Date`转为`Instant`
````java
public Instant toInstant() {
    return Instant.ofEpochMilli(getTime());
}
````

### `java.time.LocalDateTime` 与 `java.util.Date` 的转换

```` java
//LocalDateTime 转 Date
//转时间戳
long timestamp = localDateTime.toInstant(ZoneOffset.ofHours(8)).toEpochMilli();
//转Date
Date date = new Date(timestamp);

//  Date 转 LocalDateTime
//获取时间戳
Date date = new Date();
long time = date.getTime();
//转LocalDateTime
LocalDateTime localDateTime = Instant.ofEpochMilli(timestamp).atZone(ZoneOffset.ofHours(8)).toLocalDateTime();
````

### 总结
+ Instant.now()的时候注意时区问题。

+ time包下的`localDate` `localTime` `localDateTime`不需要类型转换都可以直接保存数据库，mysql 4.2版本以上。分别对应的类型是 date、time、 dateTime(timestamp)。

+ java.time包下其实还有一些其他的类与方法，如查询是否是闰年，日期比较，获取某一年的某一天等等。对日期时间的操作优先考虑time包下是否已有实现。