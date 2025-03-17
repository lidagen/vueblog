<template><div><h2 id="java-servlet" tabindex="-1"><a class="header-anchor" href="#java-servlet"><span>Java Servlet</span></a></h2>
<h3 id="servlet-简介" tabindex="-1"><a class="header-anchor" href="#servlet-简介"><span>Servlet 简介</span></a></h3>
<ul>
<li>
<p><code v-pre>Servlet</code> :JAVA Servlet 是运行在web服务器或应用服务器上的程序，它是作为来自web浏览器或其它HTTP客户端的请求和HTTP服务器上的数据库或
应用程序之间的<strong>中间层</strong></p>
</li>
<li>
<p><code v-pre>Servlet 任务</code> :
servlet执行以下主要任务：</p>
<ul>
<li>读取客户端（浏览器）发送的显式的数据。这包括网页上的 HTML 表单，或者也可以是来自 applet 或自定义的 HTTP 客户端程序的表单。</li>
<li>读取客户端（浏览器）发送的隐式的 HTTP 请求数据。这包括 cookies、媒体类型和浏览器能理解的压缩格式等等。</li>
<li>处理数据并生成结果。这个过程可能需要访问数据库，执行 RMI 或 CORBA 调用，调用 Web 服务，或者直接计算得出对应的响应。</li>
<li>发送显式的数据（即文档）到客户端（浏览器）。该文档的格式可以是多种多样的，包括文本文件（HTML 或 XML）、二进制文件（GIF 图像）、Excel 等。</li>
<li>发送隐式的 HTTP 响应到客户端（浏览器）。这包括告诉浏览器或其他客户端被返回的文档类型（例如 HTML），设置 cookies 和缓存参数，以及其他类似的任务。</li>
</ul>
</li>
</ul>
<h3 id="servlet-生命周期" tabindex="-1"><a class="header-anchor" href="#servlet-生命周期"><span>Servlet 生命周期</span></a></h3>
<ul>
<li>
<p>Servlet 生命周期可被定义为从创建直到毁灭的整个过程。以下是 Servlet 遵循的过程：</p>
<ul>
<li>Servlet 通过调用 init () 方法进行初始化。</li>
<li>Servlet 调用 service() 方法来处理客户端的请求。</li>
<li>Servlet 通过调用 destroy() 方法终止（结束）。</li>
<li>最后，Servlet 是由 JVM 的垃圾回收器进行垃圾回收的。</li>
</ul>
</li>
<li>
<p><strong>init() 方法</strong></p>
<ul>
<li>init 方法被设计成只调用一次。它在第一次创建 Servlet 时被调用。</li>
<li>Servlet 创建于用户第一次调用对应于该 Servlet 的 URL 时，但是您也可以指定 Servlet 在服务器第一次启动时被加载。</li>
<li>当用户调用一个 Servlet 时，就会创建一个 Servlet 实例，每一个用户请求都会产生一个新的线程，适当的时候移交给 doGet 或 doPost 方法。</li>
</ul>
</li>
<li>
<p><strong>service() 方法</strong></p>
<ul>
<li>service() 方法是执行实际任务的主要方法。Servlet 容器（即 Web 服务器）调用 service() 方法来处理来自客户端（浏览器）的请求，并把格式化的响应写回给客户端。</li>
<li>每次服务器接收到一个 Servlet 请求时，服务器会<em>产生一个新的线程</em>并调用服务。service() 方法检查 HTTP 请求类型（GET、POST、PUT、DELETE 等），并在适当的时候调用 doGet、doPost、doPut，doDelete 等方法。</li>
</ul>
</li>
<li>
<p><strong>destroy() 方法</strong></p>
<ul>
<li>destroy() 方法只会被调用一次，在 Servlet 生命周期结束时被调用。</li>
</ul>
</li>
</ul>
<h3 id="客户端-http-请求" tabindex="-1"><a class="header-anchor" href="#客户端-http-请求"><span>客户端 HTTP 请求</span></a></h3>
<ul>
<li>当浏览器请求网页时，它会向 Web 服务器发送特定信息，这些信息不能被直接读取，因为这些信息是作为 HTTP 请求的头的一部分进行传输的。</li>
<li>以下是来自于浏览器端的重要头信息，您可以在 Web 编程中频繁使用：</li>
</ul>
<p>头信息 | 描述</p>
<ul>
<li>| :-: | :-: | :-: | -:
Accept | 这个头信息指定浏览器或其他客户端可以处理的 MIME 类型。值 image/png 或 image/jpeg 是最常见的两种可能值。
Accept-Charset | 这个头信息指定浏览器可以用来显示信息的字符集。例如 ISO-8859-1
Accept-Encoding | 这个头信息指定浏览器知道如何处理的编码类型。值 gzip 或 compress 是最常见的两种可能值
Accept-Language | 这个头信息指定客户端的首选语言，在这种情况下，Servlet 会产生多种语言的结果。例如，en、en-us、ru 等
Authorization | 这个头信息用于客户端在访问受密码保护的网页时识别自己的身份
Connection | 这个头信息指示客户端是否可以处理持久 HTTP 连接。持久连接允许客户端或其他浏览器通过单个请求来检索多个文件。值 Keep-Alive 意味着使用了持续连接
Content-Length | 这个头信息只适用于 POST 请求，并给出 POST 数据的大小（以字节为单位）
Cookie | 这个头信息把之前发送到浏览器的 cookies 返回到服务器。
Host | 这个头信息指定原始的 URL 中的主机和端口。
If-Modified-Since | 这个头信息表示只有当页面在指定的日期后已更改时，客户端想要的页面。如果没有新的结果可以使用，服务器会发送一个 304 代码，表示 Not Modified 头信息。
If-Unmodified-Since | 这个头信息是 If-Modified-Since 的对立面，它指定只有当文档早于指定日期时，操作才会成功。
Refere | 这个头信息指示所指向的 Web 页的 URL。例如，如果您在网页 1，点击一个链接到网页 2，当浏览器请求网页 2 时，网页 1 的 URL 就会包含在 Referer 头信息中。
User-Agent | 这个头信息识别发出请求的浏览器或其他客户端，并可以向不同类型的浏览器返回不同的内容。</li>
</ul>
<ul>
<li><strong>读取 HTTP 头的方法</strong>
<em>下面的方法可用在 Servlet 程序中读取 HTTP 头。这些方法通过 HttpServletRequest 对象可用。</em></li>
</ul>
<p>方法 | 描述</p>
<ul>
<li>| :-: | :-: | :-: | -:
Cookie[] getCookies() | 返回一个数组，包含客户端发送该请求的所有的 Cookie 对象。
Enumeration getAttributeNames() | 返回一个枚举，包含提供给该请求可用的属性名称。
Enumeration getHeaderNames() | 返回一个枚举，包含在该请求中包含的所有的头名。
Enumeration getParameterNames() | 返回一个 String 对象的枚举，包含在该请求中包含的参数的名称。
HttpSession getSession() | 返回与该请求关联的当前 session 会话，或者如果请求没有 session 会话，则创建一个。
HttpSession getSession(boolean create) | 返回与该请求关联的当前 HttpSession，或者如果没有当前会话，且创建是真的，则返回一个新的 session 会话。
Locale getLocale() | 基于 Accept-Language 头，返回客户端接受内容的首选的区域设置。
Object getAttribute(String name) | 以对象形式返回已命名属性的值，如果没有给定名称的属性存在，则返回 null。
ServletInputStream getInputStream() | 使用 ServletInputStream，以二进制数据形式检索请求的主体。
String getAuthType() | 返回用于保护 Servlet 的身份验证方案的名称，例如，&quot;BASIC&quot; 或 &quot;SSL&quot;，如果JSP没有受到保护则返回 null。
String getCharacterEncoding() | 返回请求主体中使用的字符编码的名称。
String getContentType() | 返回请求主体的 MIME 类型，如果不知道类型则返回 null。
String getContextPath() | 返回指示请求上下文的请求 URI 部分。
String getHeader(String name) | 以字符串形式返回指定的请求头的值。
String getMethod() | 返回请求的 HTTP 方法的名称，例如，GET、POST 或 PUT。
String getParameter(String name) | 以字符串形式返回请求参数的值，或者如果参数不存在则返回 null。
String getPathInfo() | 当请求发出时，返回与客户端发送的 URL 相关的任何额外的路径信息。
String getProtocol() | 返回请求协议的名称和版本。
String getQueryString() | 返回包含在路径后的请求 URL 中的查询字符串。
String getRemoteAddr() | 返回发送请求的客户端的互联网协议（IP）地址。
String getRemoteHost() | 返回发送请求的客户端的完全限定名称。
String getRemoteUser() | 如果用户已通过身份验证，则返回发出请求的登录用户，或者如果用户未通过身份验证，则返回 null。
String getRequestURI() | 从协议名称直到 HTTP 请求的第一行的查询字符串中，返回该请求的 URL 的一部分。
String getRequestedSessionId() | 返回由客户端指定的 session 会话 ID。
String getServletPath() | 返回调用 JSP 的请求的 URL 的一部分。
String[] getParameterValues(String name) | 返回一个字符串对象的数组，包含所有给定的请求参数的值，如果参数不存在则返回 null。
boolean isSecure() | 返回一个布尔值，指示请求是否使用安全通道，如 HTTPS。
int getContentLength() | 以字节为单位返回请求主体的长度，并提供输入流，或者如果长度未知则返回 -1。
int getIntHeader(String name) | 返回指定的请求头的值为一个 int 值。
int getServerPort() | 返回接收到这个请求的端口号。
int getParameterMap() | 将参数封装成 Map 类型。</li>
</ul>
<h3 id="服务器-http-响应" tabindex="-1"><a class="header-anchor" href="#服务器-http-响应"><span>服务器 HTTP 响应</span></a></h3>
<ul>
<li>当一个 Web 服务器响应一个 HTTP 请求时，响应通常包括一个状态行、一些响应报头、一个空行和文档。</li>
<li>下表总结了从 Web 服务器端返回到浏览器的最有用的 HTTP 1.1 响应报头，您会在 Web 编程中频繁地使用它们：</li>
</ul>
<p>头信息 | 描述</p>
<ul>
<li>| :-: | :-: | :-: | -:
Allow | 这个头信息指定服务器支持的请求方法（GET、POST 等）。
Cache-Control | 这个头信息指定响应文档在何种情况下可以安全地缓存。可能的值有：public、private 或 no-cache 等。Public 意味着文档是可缓存，Private 意味着文档是单个用户私用文档，且只能存储在私有（非共享）缓存中，no-cache 意味着文档不应被缓存。
Connection | 这个头信息指示浏览器是否使用持久 HTTP 连接。值 close 指示浏览器不使用持久 HTTP 连接，值 keep-alive 意味着使用持久连接。
Content-Disposition | 这个头信息可以让您请求浏览器要求用户以给定名称的文件把响应保存到磁盘。
Content-Encoding | 在传输过程中，这个头信息指定页面的编码方式。
Content-Language | 这个头信息表示文档编写所使用的语言。例如，en、en-us、ru 等。
Content-Length | 这个头信息指示响应中的字节数。只有当浏览器使用持久（keep-alive）HTTP 连接时才需要这些信息。
Content-Type | 这个头信息提供了响应文档的 MIME（Multipurpose Internet Mail Extension）类型。
Expires | 这个头信息指定内容过期的时间，在这之后内容不再被缓存。
Last-Modified | 这个头信息指示文档的最后修改时间。然后，客户端可以缓存文件，并在以后的请求中通过 If-Modified-Since 请求头信息提供一个日期。
Location | 这个头信息应被包含在所有的带有状态码的响应中。在 300s 内，这会通知浏览器文档的地址。浏览器会自动重新连接到这个位置，并获取新的文档。
Refresh | 这个头信息指定浏览器应该如何尽快请求更新的页面。您可以指定页面刷新的秒数。
Retry-After | 这个头信息可以与 503（Service Unavailable 服务不可用）响应配合使用，这会告诉客户端多久就可以重复它的请求
Set-Cookie | 这个头信息指定一个与页面关联的 cookie。</li>
</ul>
<ul>
<li><strong>设置 HTTP 响应报头的方法</strong></li>
</ul>
<p><em>下面的方法可用于在 Servlet 程序中设置 HTTP 响应报头。这些方法通过 HttpServletResponse 对象可用。</em></p>
<p>方法 | 描述</p>
<ul>
<li>| :-: | :-: | :-: | -:
String encodeRedirectURL(String url) | 为 sendRedirect 方法中使用的指定的 URL 进行编码，或者如果编码不是必需的，则返回 URL 未改变。
String encodeURL(String url) | 对包含 session 会话 ID 的指定 URL 进行编码，或者如果编码不是必需的，则返回 URL 未改变。
boolean containsHeader(String name) | 返回一个布尔值，指示是否已经设置已命名的响应报头。
boolean isCommitted() | 返回一个布尔值，指示响应是否已经提交。
void addCookie(Cookie cookie) | 把指定的 cookie 添加到响应。
void addDateHeader(String name, long date) | 添加一个带有给定的名称和日期值的响应报头。
void addHeader(String name, String value) | 添加一个带有给定的名称和值的响应报头。
void addIntHeader(String name, int value) | 添加一个带有给定的名称和整数值的响应报头。
void flushBuffer() | 强制任何在缓冲区中的内容被写入到客户端。
void reset() | 清除缓冲区中存在的任何数据，包括状态码和头。
void resetBuffer() | 清除响应中基础缓冲区的内容，不清除状态码和头。
void sendError(int sc) | 使用指定的状态码发送错误响应到客户端，并清除缓冲区.
void sendError(int sc, String msg) | 使用指定的状态发送错误响应到客户端。
void sendRedirect(String location) | 使用指定的重定向位置 URL 发送临时重定向响应到客户端。
void setBufferSize(int size) | 为响应主体设置首选的缓冲区大小。
void setCharacterEncoding(String charset) | 设置被发送到客户端的响应的字符编码（MIME 字符集）例如，UTF-8。
void setContentLength(int len) | 设置在 HTTP Servlet 响应中的内容主体的长度，该方法设置 HTTP Content-Length 头。
void setContentType(String type) | 如果响应还未被提交，设置被发送到客户端的响应的内容类型。
void setDateHeader(String name, long date) | 设置一个带有给定的名称和日期值的响应报头。
void setHeader(String name, String value) | 设置一个带有给定的名称和值的响应报头。
void setIntHeader(String name, int value) | 设置一个带有给定的名称和整数值的响应报头。
void setLocale(Locale loc) | 如果响应还未被提交，设置响应的区域。
void setStatus(int sc) | 为该响应设置状态码。</li>
</ul>
<h2 id="cookie-处理" tabindex="-1"><a class="header-anchor" href="#cookie-处理"><span>Cookie 处理</span></a></h2>
<ul>
<li>
<p>Cookie 是存储在<strong>客户端</strong>计算机上的文本文件，并保留了各种跟踪信息。Java Servlet 显然支持 HTTP Cookie。</p>
</li>
<li>
<p>识别返回用户包括三个步骤：</p>
<ul>
<li>服务器脚本向浏览器发送一组 Cookie。例如：姓名、年龄或识别号码等。</li>
<li>浏览器将这些信息存储在本地计算机上，以备将来使用。</li>
<li>当下一次浏览器向 Web 服务器发送任何请求时，浏览器会把这些 Cookie 信息发送到服务器，服务器将使用这些信息来识别用户。</li>
</ul>
</li>
</ul>
<h3 id="cookie-剖析" tabindex="-1"><a class="header-anchor" href="#cookie-剖析"><span>Cookie 剖析</span></a></h3>
<ul>
<li>Cookie 通常设置在 HTTP 头信息中</li>
<li>设置 Cookie 的 Servlet 会发送如下的头信息：</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>HTTP/1.1 200 OK
Date: Fri, 04 Feb 2000 21:03:38 GMT</p>
<p>Server: Apache/1.3.9 (UNIX) PHP/4.0b3</p>
<p>Set-Cookie: name=xyz; expires=Friday, 04-Feb-07 22:03:38 GMT;
path=/; domain=runoob.com</p>
<p>Connection: close</p>
<p>Content-Type: text/html</p>
<p><code v-pre>Set-Cookie 头包含了一个名称值对、一个 GMT 日期、一个路径和一个域。名称和值会被 URL 编码。expires 字段是一个指令，告诉浏览器在给定的时间和日期之后&quot;忘记&quot;该 Cookie。</code></p>
</div>
<h3 id="servlet-cookie-方法" tabindex="-1"><a class="header-anchor" href="#servlet-cookie-方法"><span>Servlet Cookie 方法</span></a></h3>
<p>方法 | 描述</p>
<ul>
<li>| :-: | :-: | :-: | -:
public void setDomain(String pattern) | 该方法设置 cookie 适用的域，例如 runoob.com。
public String getDomain() | 该方法获取 cookie 适用的域，例如 runoob.com。
public void setMaxAge(int expiry) | 该方法设置 cookie 过期的时间（以秒为单位）。如果不这样设置，cookie 只会在当前 session 会话中持续有效。
public int getMaxAge() | 该方法返回 cookie 的最大生存周期（以秒为单位），默认情况下，-1 表示 cookie 将持续下去，直到浏览器关闭。
public String getName() | 该方法返回 cookie 的名称。名称在创建后不能改变。
public void setValue(String newValue) | 该方法设置与 cookie 关联的值。
public String getValue() | 该方法获取与 cookie 关联的值。
public void setPath(String uri) | 该方法设置 cookie 适用的路径。如果您不指定路径，与当前页面相同目录下的（包括子目录下的）所有 URL 都会返回 cookie。
public String getPath() | 该方法获取 cookie 适用的路径。
public void setSecure(boolean flag) | 该方法设置布尔值，表示 cookie 是否应该只在加密的（即 SSL）连接上发送。
public void setComment(String purpose) | 设置cookie的注释。该注释在浏览器向用户呈现 cookie 时非常有用。
public String getComment() | 获取 cookie 的注释，如果 cookie 没有注释则返回 null。</li>
</ul>
<h3 id="通过-servlet-设置-cookie" tabindex="-1"><a class="header-anchor" href="#通过-servlet-设置-cookie"><span>通过 Servlet 设置 Cookie</span></a></h3>
<ul>
<li>通过 Servlet 设置 Cookie 包括三个步骤：<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">// 创建一个 Cookie 对象:</span></span>
<span class="line"><span class="token class-name">Cookie</span> cookie <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Cookie</span><span class="token punctuation">(</span><span class="token string">"key"</span><span class="token punctuation">,</span><span class="token string">"value"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"> <span class="token comment">// 设置最大生存周期：</span></span>
<span class="line">cookie<span class="token punctuation">.</span><span class="token function">setMaxAge</span><span class="token punctuation">(</span><span class="token number">60</span><span class="token operator">*</span><span class="token number">60</span><span class="token operator">*</span><span class="token number">24</span><span class="token punctuation">)</span><span class="token punctuation">;</span> </span>
<span class="line"><span class="token comment">//发送 Cookie 到 HTTP 响应头:</span></span>
<span class="line">response<span class="token punctuation">.</span><span class="token function">addCookie</span><span class="token punctuation">(</span>cookie<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h2 id="session-跟踪" tabindex="-1"><a class="header-anchor" href="#session-跟踪"><span>Session 跟踪</span></a></h2>
<ul>
<li>
<p>HTTP 是一种&quot;无状态&quot;协议，这意味着每次客户端检索网页时，客户端打开一个单独的连接到 Web 服务器，服务器会自动不保留之前客户端请求的任何记录。</p>
</li>
<li>
<p>但是仍然有以下三种方式来维持 Web 客户端和 Web 服务器之间的 session 会话：</p>
<ul>
<li>
<p><code v-pre>Cookies</code>: <strong>一个 Web 服务器可以分配一个唯一的 session 会话 ID 作为每个 Web 客户端的 cookie。</strong>
这可能不是一个有效的方法，因为很多浏览器不支持 cookie，所以我们建议不要使用这种方式来维持 session 会话。</p>
</li>
<li>
<p><code v-pre>隐藏的表单字段</code>: <strong>Web 服务器可以发送一个隐藏的 HTML 表单字段，以及一个唯一的 session 会话 ID。</strong>
但是点击常规的超文本链接不会导致表单提交，因此隐藏的表单字段也不支持常规的 session 会话跟踪。</p>
</li>
<li>
<p><code v-pre>URL 重写:</code><strong>在每个 URL 末尾追加一些额外的数据来标识 session 会话。</strong>
它的缺点是会动态生成每个 URL 来为页面分配一个 session 会话 ID，即使是在很简单的静态 HTML 页面中也会如此。</p>
</li>
</ul>
<h3 id="httpsession-对象" tabindex="-1"><a class="header-anchor" href="#httpsession-对象"><span>HttpSession 对象</span></a></h3>
<ul>
<li>
<p>除了上述的三种方式，Servlet 还提供了 HttpSession 接口，该接口提供了一种跨多个页面请求或访问网站时识别用户以及存储有关用户信息的方式。</p>
</li>
<li>
<p>Servlet 容器使用这个接口来创建一个 HTTP 客户端和 HTTP 服务器之间的 session 会话。会话持续一个指定的时间段，跨多个连接或页面请求。
您会通过调用 HttpServletRequest 的公共方法 getSession() 来获取 HttpSession 对象，如下所示：</p>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token class-name">HttpSession</span> session <span class="token operator">=</span> request<span class="token punctuation">.</span><span class="token function">getSession</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>你需要在向客户端发送任何文档内容之前调用 request.getSession()。下面总结了 HttpSession 对象中可用的几个重要的方法：</li>
</ul>
<p>方法 | 描述</p>
<ul>
<li>| :-: | :-: | :-: | -:
public Object getAttribute(String name) | 该方法返回在该 session 会话中具有指定名称的对象，如果没有指定名称的对象，则返回 null。<br>
public Enumeration getAttributeNames() | 该方法返回 String 对象的枚举，String 对象包含所有绑定到该 session 会话的对象的名称。<br>
public long getCreationTime() | 该方法返回该 session 会话被创建的时间，自格林尼治标准时间 1970 年 1 月 1 日午夜算起，以毫秒为单位。<br>
public String getId() | 该方法返回一个包含分配给该 session 会话的唯一标识符的字符串。<br>
public long getLastAccessedTime() | 该方法返回客户端最后一次发送与该 session 会话相关的请求的时间自格林尼治标准时间 1970 年 1 月 1 日午夜算起，以毫秒为单位<br>
public int getMaxInactiveInterval() | 该方法返回 Servlet 容器在客户端访问时保持 session 会话打开的最大时间间隔，以秒为单位。<br>
public void invalidate() | 该方法指示该 session 会话无效，并解除绑定到它上面的任何对象。<br>
public boolean isNew() | 如果客户端还不知道该 session 会话，或者如果客户选择不参入该 session 会话，则该方法返回 true。<br>
public void removeAttribute(String name) | 该方法将从该 session 会话移除指定名称的对象。<br>
public void setAttribute(String name, Object value)  | 该方法使用指定的名称绑定一个对象到该 session 会话。<br>
public void setMaxInactiveInterval(int interval) | 该方法在 Servlet 容器指示该 session 会话无效之前，指定客户端请求之间的时间，以秒为单位。</li>
</ul>
<h3 id="删除-session-会话数据" tabindex="-1"><a class="header-anchor" href="#删除-session-会话数据"><span>删除 Session 会话数据</span></a></h3>
<ul>
<li>当您完成了一个用户的 session 会话数据，您有以下几种选择：
<ul>
<li><code v-pre>移除一个特定的属性：</code>您可以调用 public void removeAttribute(String name) 方法来删除与特定的键相关联的值。
-<code v-pre> 删除整个 session 会话：</code>您可以调用 public void invalidate() 方法来丢弃整个 session 会话。</li>
<li><code v-pre>设置 session 会话过期时间：</code>您可以调用 public void setMaxInactiveInterval(int interval) 方法来单独设置 session 会话超时。</li>
<li><code v-pre>注销用户：</code>如果使用的是支持 servlet 2.4 的服务器，您可以调用 logout 来注销 Web 服务器的客户端，并把属于所有用户的所有 session 会话设置为无效。</li>
<li><code v-pre>web.xml 配置：</code>如果您使用的是 Tomcat，除了上述方法，您还可以在 web.xml 文件中配置 session 会话超时，如下所示：</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>session-config</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>session-timeout</span><span class="token punctuation">></span></span>15<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>session-timeout</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>session-config</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</li>
</ul>
</div></template>


