<template><div><h2 id="jdk-1-8-java-time-包" tabindex="-1"><a class="header-anchor" href="#jdk-1-8-java-time-包"><span>JDK 1.8 java.time 包</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>
<p>java 1.8之前的日期类存在几个问题：</p>
<ul>
<li>线程不安全，<code v-pre>java.util.Date</code> 这个类线程不安全，是可变的。导致了需要二次封装。</li>
<li>时间处理麻烦，默认时间从1900开始，不支持国际化，不提供时区支持。</li>
<li>设计不好，比如<code v-pre>java.util</code>和<code v-pre>java.sql</code>中的日期类，名称都是一样，容易导错包。</li>
</ul>
</li>
<li>
<p>java 1.8以后的<code v-pre>java.time</code>包，日期类不可变且线程安全的。吸取了第三方jada-time</p>
</li>
</ul>
<h3 id="time关键类" tabindex="-1"><a class="header-anchor" href="#time关键类"><span>time关键类</span></a></h3>
<ul>
<li>
<p><code v-pre>Instant</code> 它代表的是时间戳,这里的时间戳默认的是0时区的，所以比北京时间少8个时区</p>
</li>
<li>
<p><code v-pre>LocalDate</code> 不包含时间的日期</p>
</li>
<li>
<p><code v-pre>LocalTime</code> 时间</p>
</li>
<li>
<p><code v-pre>LocalDateTime</code> 日期和时间</p>
</li>
<li>
<p><code v-pre>ZonedDateTime</code> 包含时区的完整的日期时间，偏移量是以UTC/格林威治时间为基准的，如：2018-10-08T18:12:38.547+08:00[Asia/Shanghai]。</p>
</li>
</ul>
<h3 id="常用api" tabindex="-1"><a class="header-anchor" href="#常用api"><span>常用API</span></a></h3>
<h4 id="localdate、localtime、localdatetime" tabindex="-1"><a class="header-anchor" href="#localdate、localtime、localdatetime"><span>LocalDate、LocalTime、LocalDateTime</span></a></h4>
<ul>
<li>这三个类分别表示日期、时间、日期时间，其API具有相似性。用LocalDateTime来举例它们的共性</li>
</ul>
<h4 id="localdatetime" tabindex="-1"><a class="header-anchor" href="#localdatetime"><span>LocalDateTime</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"> <span class="token comment">//获取此刻的日期时间</span></span>
<span class="line"><span class="token class-name">LocalDateTime</span> localDateTime <span class="token operator">=</span> <span class="token class-name">LocalDateTime</span><span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">* 获取当前日期时间的明天、昨天</span>
<span class="line">* 同理还有年、月 、日 时、分、秒的加减</span>
<span class="line">*/</span></span>
<span class="line"><span class="token class-name">LocalDateTime</span> tomorrow <span class="token operator">=</span> localDateTime<span class="token punctuation">.</span><span class="token function">plusDays</span><span class="token punctuation">(</span><span class="token number">1L</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">LocalDateTime</span> yesterday <span class="token operator">=</span> localDateTime<span class="token punctuation">.</span><span class="token function">minusDays</span><span class="token punctuation">(</span><span class="token number">1L</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">* 获取本月、本年的日期的API LocalDate LocalDateTime都有，LocalTime有类似的获取时间的API</span>
<span class="line">*/</span></span>
<span class="line"><span class="token comment">//第5天是本月的哪天</span></span>
<span class="line"><span class="token class-name">LocalDateTime</span> withDayOfMonth <span class="token operator">=</span> localDateTime<span class="token punctuation">.</span><span class="token function">withDayOfMonth</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//第120天时本年的哪天</span></span>
<span class="line"><span class="token class-name">LocalDateTime</span> withDayOfYear <span class="token operator">=</span> localDateTime<span class="token punctuation">.</span><span class="token function">withDayOfYear</span><span class="token punctuation">(</span><span class="token number">120</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">* 计算两个日期时间的差值， （后面的 - 前面的 +2）</span>
<span class="line">* 同理还有年、月、日、时、分、秒的差值比较</span>
<span class="line">* LocalTime LocalDate都有此API,只是LocalTime不可计算年月日 ，LocalDate不可计算时分秒</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">long</span> untilDay <span class="token operator">=</span> yesterday<span class="token punctuation">.</span><span class="token function">until</span><span class="token punctuation">(</span>tomorrow<span class="token punctuation">,</span> <span class="token class-name">ChronoUnit</span><span class="token punctuation">.</span><span class="token constant">DAYS</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//2</span></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*日期的比较，返回一个boolean值，也有isAfter与此相反</span>
<span class="line">* LocalTime LocalDate都有此API</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">boolean</span> before <span class="token operator">=</span> yesterday<span class="token punctuation">.</span><span class="token function">isBefore</span><span class="token punctuation">(</span>tomorrow<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//true</span></span>
<span class="line"><span class="token comment">//转时间戳，需要设置东八区 +8</span></span>
<span class="line"><span class="token keyword">long</span> timestamp <span class="token operator">=</span> localDateTime<span class="token punctuation">.</span><span class="token function">toInstant</span><span class="token punctuation">(</span><span class="token class-name">ZoneOffset</span><span class="token punctuation">.</span><span class="token function">ofHours</span><span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toEpochMilli</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">* 用DateTimeFormatter，把LocalDateTime转成想要的日期格式字符串 (HH:mm:ss是24小时制)</span>
<span class="line">* LocalDate 也适用</span>
<span class="line">*/</span></span>
<span class="line"><span class="token class-name">DateTimeFormatter</span> dateTimeFormatter <span class="token operator">=</span> <span class="token class-name">DateTimeFormatter</span><span class="token punctuation">.</span><span class="token function">ofPattern</span><span class="token punctuation">(</span><span class="token string">"yyyyMMdd HH:mm:ss"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">LocalDateTime</span> time <span class="token operator">=</span> <span class="token class-name">LocalDateTime</span><span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">String</span> format <span class="token operator">=</span> dateTimeFormatter<span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span>time<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//把字符串转为LocalDate</span></span>
<span class="line"><span class="token class-name">LocalDate</span> localDate <span class="token operator">=</span> <span class="token class-name">LocalDate</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span><span class="token string">"20180813"</span><span class="token punctuation">,</span><span class="token class-name">DateTimeFormatter</span><span class="token punctuation">.</span><span class="token function">ofPattern</span><span class="token punctuation">(</span><span class="token string">"yyyyMMdd"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>TemporalAdjuster</code>该类是一个计算用的类，提供了各种各样的计算方法。比如某个月的第一天，某个月的最后一天，某一年的第一天，某一年的第几天等各种计算方法。同样用<code v-pre>LocalDateTime</code>举例</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token class-name">LocalDateTime</span> localDateTime <span class="token operator">=</span> <span class="token class-name">LocalDateTime</span><span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">* TemporalAdjusters类 适用LocalDate LocalDateTime</span>
<span class="line">*/</span></span>
<span class="line"><span class="token comment">//本月第一天</span></span>
<span class="line"><span class="token class-name">LocalDateTime</span> firstDayOfMonth <span class="token operator">=</span> localDateTime<span class="token punctuation">.</span><span class="token keyword">with</span><span class="token punctuation">(</span><span class="token class-name">TemporalAdjusters</span><span class="token punctuation">.</span><span class="token function">firstDayOfMonth</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//本年最后一天</span></span>
<span class="line"><span class="token class-name">LocalDateTime</span> lastDayOfMonth <span class="token operator">=</span> localDateTime<span class="token punctuation">.</span><span class="token keyword">with</span><span class="token punctuation">(</span><span class="token class-name">TemporalAdjusters</span><span class="token punctuation">.</span><span class="token function">lastDayOfYear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//下月第一天</span></span>
<span class="line"><span class="token class-name">LocalDateTime</span> firstDayOfNextMonth <span class="token operator">=</span> localDateTime<span class="token punctuation">.</span><span class="token keyword">with</span><span class="token punctuation">(</span><span class="token class-name">TemporalAdjusters</span><span class="token punctuation">.</span><span class="token function">firstDayOfNextMonth</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>Period</code>和<code v-pre>Duration</code> Period是基于ISO-8601标准的日期系统，用于计算两个日期间的年，月，日的差值。比如'2年，3个月，4天'；而Duration和Period很像，但Duration计算的是两个日期间的秒，纳秒的值，是一种更为精确的计算方式。
<ul>
<li><code v-pre>Period.between(LocalDate day1,LocalDate day2)</code> 底层是 until方法实现，只是只接收LocalDate参数.</li>
<li><code v-pre>Duration.between(LocalTime time1,LocalTime time2)</code>计算两个时间之间的秒数，纳秒数。有一点需要注意，Duration中必须要支持秒数，如果没有的话，将会报错.</li>
</ul>
</li>
<li><code v-pre>ChronoUnit</code> 实现功能类型Period和Duration，但如果我们看它的底层实现，就可以看到它基本是基于Duration来实现的.</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token class-name">LocalDateTime</span> oldDate <span class="token operator">=</span> <span class="token class-name">LocalDateTime</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token number">2017</span><span class="token punctuation">,</span> <span class="token class-name">Month</span><span class="token punctuation">.</span><span class="token constant">AUGUST</span><span class="token punctuation">,</span> <span class="token number">31</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">,</span> <span class="token number">55</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">LocalDateTime</span> newDate <span class="token operator">=</span> <span class="token class-name">LocalDateTime</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token number">2018</span><span class="token punctuation">,</span> <span class="token class-name">Month</span><span class="token punctuation">.</span><span class="token constant">NOVEMBER</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">,</span> <span class="token number">21</span><span class="token punctuation">,</span> <span class="token number">56</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">long</span> years <span class="token operator">=</span> <span class="token class-name">ChronoUnit</span><span class="token punctuation">.</span><span class="token constant">YEARS</span><span class="token punctuation">.</span><span class="token function">between</span><span class="token punctuation">(</span>oldDate<span class="token punctuation">,</span> newDate<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">long</span> months <span class="token operator">=</span> <span class="token class-name">ChronoUnit</span><span class="token punctuation">.</span><span class="token constant">MONTHS</span><span class="token punctuation">.</span><span class="token function">between</span><span class="token punctuation">(</span>oldDate<span class="token punctuation">,</span> newDate<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">long</span> weeks <span class="token operator">=</span> <span class="token class-name">ChronoUnit</span><span class="token punctuation">.</span><span class="token constant">WEEKS</span><span class="token punctuation">.</span><span class="token function">between</span><span class="token punctuation">(</span>oldDate<span class="token punctuation">,</span> newDate<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">long</span> days <span class="token operator">=</span> <span class="token class-name">ChronoUnit</span><span class="token punctuation">.</span><span class="token constant">DAYS</span><span class="token punctuation">.</span><span class="token function">between</span><span class="token punctuation">(</span>oldDate<span class="token punctuation">,</span> newDate<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">long</span> hours <span class="token operator">=</span> <span class="token class-name">ChronoUnit</span><span class="token punctuation">.</span><span class="token constant">HOURS</span><span class="token punctuation">.</span><span class="token function">between</span><span class="token punctuation">(</span>oldDate<span class="token punctuation">,</span> newDate<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">long</span> minutes <span class="token operator">=</span> <span class="token class-name">ChronoUnit</span><span class="token punctuation">.</span><span class="token constant">MINUTES</span><span class="token punctuation">.</span><span class="token function">between</span><span class="token punctuation">(</span>oldDate<span class="token punctuation">,</span> newDate<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">long</span> seconds <span class="token operator">=</span> <span class="token class-name">ChronoUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">.</span><span class="token function">between</span><span class="token punctuation">(</span>oldDate<span class="token punctuation">,</span> newDate<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">long</span> milis <span class="token operator">=</span> <span class="token class-name">ChronoUnit</span><span class="token punctuation">.</span><span class="token constant">MILLIS</span><span class="token punctuation">.</span><span class="token function">between</span><span class="token punctuation">(</span>oldDate<span class="token punctuation">,</span> newDate<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">long</span> nano <span class="token operator">=</span> <span class="token class-name">ChronoUnit</span><span class="token punctuation">.</span><span class="token constant">NANOS</span><span class="token punctuation">.</span><span class="token function">between</span><span class="token punctuation">(</span>oldDate<span class="token punctuation">,</span> newDate<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>+<code v-pre>Clock</code>时钟系统，用于查找当前时刻。通过指定一个时区，我们可以获取到当前的时刻。</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">* Clock 可获取系统或者自主选择时区，获取时区码，时间戳，时区本地的时间</span>
<span class="line">*/</span></span>
<span class="line"><span class="token comment">// 系统默认</span></span>
<span class="line"><span class="token class-name">Clock</span> systemDefaultClock <span class="token operator">=</span> <span class="token class-name">Clock</span><span class="token punctuation">.</span><span class="token function">systemDefaultZone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">// 世界协调时UTC</span></span>
<span class="line"><span class="token class-name">Clock</span> systemUTCClock <span class="token operator">=</span> <span class="token class-name">Clock</span><span class="token punctuation">.</span><span class="token function">systemUTC</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//芝加哥</span></span>
<span class="line"><span class="token class-name">Clock</span> clock <span class="token operator">=</span> <span class="token class-name">Clock</span><span class="token punctuation">.</span><span class="token function">system</span><span class="token punctuation">(</span><span class="token class-name">ZoneId</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token class-name">ZoneId</span><span class="token punctuation">.</span><span class="token constant">SHORT_IDS</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"CST"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">LocalDateTime</span><span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span>clock<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//2019-08-29T22:54:45.515</span></span>
<span class="line">clock<span class="token punctuation">.</span><span class="token function">millis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//1567137013253</span></span>
<span class="line">clock<span class="token punctuation">.</span><span class="token function">getZone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//America/Chicago</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="instant" tabindex="-1"><a class="header-anchor" href="#instant"><span>Instant</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*获取0时区的时间戳</span>
<span class="line">*打印输出 2019-08-29T09:45:28.164Z</span>
<span class="line">*/</span></span>
<span class="line"><span class="token class-name">Instant</span> now <span class="token operator">=</span> <span class="token class-name">Instant</span><span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="zoneddatetime" tabindex="-1"><a class="header-anchor" href="#zoneddatetime"><span>ZonedDateTime</span></a></h4>
<p>+<code v-pre> ZonedDateTime</code> 类似<code v-pre> LocalDateTime</code>,只是相比<code v-pre>LocalDateTime</code>,多了一个时区的概念</p>
<h3 id="java-time-instant-与-java-util-date-的转换" tabindex="-1"><a class="header-anchor" href="#java-time-instant-与-java-util-date-的转换"><span><code v-pre>java.time.Instant</code> 与 <code v-pre>java.util.Date</code> 的转换</span></a></h3>
<ul>
<li>java 1.8 <code v-pre>java.util.Date</code>做了兼容，增加了两个方法<code v-pre>Date.from(Instant instant)``toInstant()</code>
<ul>
<li><code v-pre>Instant</code>转为<code v-pre>Date</code></li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Date</span> <span class="token function">from</span><span class="token punctuation">(</span><span class="token class-name">Instant</span> instant<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span>instant<span class="token punctuation">.</span><span class="token function">toEpochMilli</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">ArithmeticException</span> ex<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalArgumentException</span><span class="token punctuation">(</span>ex<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>Date</code>转为<code v-pre>Instant</code></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">Instant</span> <span class="token function">toInstant</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token class-name">Instant</span><span class="token punctuation">.</span><span class="token function">ofEpochMilli</span><span class="token punctuation">(</span><span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="java-time-localdatetime-与-java-util-date-的转换" tabindex="-1"><a class="header-anchor" href="#java-time-localdatetime-与-java-util-date-的转换"><span><code v-pre>java.time.LocalDateTime</code> 与 <code v-pre>java.util.Date</code> 的转换</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//LocalDateTime 转 Date</span></span>
<span class="line"><span class="token comment">//转时间戳</span></span>
<span class="line"><span class="token keyword">long</span> timestamp <span class="token operator">=</span> localDateTime<span class="token punctuation">.</span><span class="token function">toInstant</span><span class="token punctuation">(</span><span class="token class-name">ZoneOffset</span><span class="token punctuation">.</span><span class="token function">ofHours</span><span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toEpochMilli</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//转Date</span></span>
<span class="line"><span class="token class-name">Date</span> date <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span>timestamp<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">//  Date 转 LocalDateTime</span></span>
<span class="line"><span class="token comment">//获取时间戳</span></span>
<span class="line"><span class="token class-name">Date</span> date <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">long</span> time <span class="token operator">=</span> date<span class="token punctuation">.</span><span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//转LocalDateTime</span></span>
<span class="line"><span class="token class-name">LocalDateTime</span> localDateTime <span class="token operator">=</span> <span class="token class-name">Instant</span><span class="token punctuation">.</span><span class="token function">ofEpochMilli</span><span class="token punctuation">(</span>timestamp<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">atZone</span><span class="token punctuation">(</span><span class="token class-name">ZoneOffset</span><span class="token punctuation">.</span><span class="token function">ofHours</span><span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toLocalDateTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<ul>
<li>
<p>Instant.now()的时候注意时区问题。</p>
</li>
<li>
<p>time包下的<code v-pre>localDate</code> <code v-pre>localTime</code> <code v-pre>localDateTime</code>不需要类型转换都可以直接保存数据库，mysql 4.2版本以上。分别对应的类型是 date、time、 dateTime(timestamp)。</p>
</li>
<li>
<p>java.time包下其实还有一些其他的类与方法，如查询是否是闰年，日期比较，获取某一年的某一天等等。对日期时间的操作优先考虑time包下是否已有实现。</p>
</li>
</ul>
</div></template>


