## Servlet 源码解析

### 概述
+ Servlet技术的核心是Servlet，它是所有**Servlet类必须直接或者间接实现的一个接口。**

+ Servlet的类结构
  + `HttpServlet` 抽象类继承 `GenericServlet`抽象类
  + `GenericServlet` 抽象类继承 `Servlet`、 `ServletConfig`接口

### Servlet 接口
+  Servlet接口定义了`Servlet`与`servlet容器`之间的契约。这个契约是：Servlet容器将Servlet类载入内存，并产生Servlet实例和调用它具体的方法。但是要注意的是，**在一个应用程序中，每种Servlet类型只能有一个实例。**

+ Servlet接口中定义的方法：
  ````java
   void init(ServletConfig var1) throws ServletException;

   ServletConfig getServletConfig();

   void service(ServletRequest var1, ServletResponse var2) throws ServletException, IOException;

   String getServletInfo();

   void destroy();
  ````
  - `init()`初始化的时候执行一次、`destroy()`销毁的时候只执行一次。`service()`每次请求时调用。在初始化后-销毁前存活。
  - `getServletConfig()`，这个方法会返回由**Servlet容器**传给`init()`方法的ServletConfig对象。 `getServletInfo()`，这个方法会返回Servlet的一段描述，可以返回一段字符串 。

### GenericServlet 抽象类
 ````java
    public abstract class GenericServlet implements Servlet, ServletConfig, Serializable {
        private static final String LSTRING_FILE = "javax.servlet.LocalStrings";
        private static ResourceBundle lStrings = ResourceBundle.getBundle("javax.servlet.LocalStrings");
        private transient ServletConfig config;

        public GenericServlet() {
        }

        public void destroy() {
        }

        public String getInitParameter(String name) {
            ServletConfig sc = this.getServletConfig();
            if (sc == null) {
                throw new IllegalStateException(lStrings.getString("err.servlet_config_not_initialized"));
            } else {
                return sc.getInitParameter(name);
            }
        }

        public Enumeration<String> getInitParameterNames() {
            ServletConfig sc = this.getServletConfig();
            if (sc == null) {
                throw new IllegalStateException(lStrings.getString("err.servlet_config_not_initialized"));
            } else {
                return sc.getInitParameterNames();
            }
        }

        public ServletConfig getServletConfig() {
            return this.config;
        }

        public ServletContext getServletContext() {
            ServletConfig sc = this.getServletConfig();
            if (sc == null) {
                throw new IllegalStateException(lStrings.getString("err.servlet_config_not_initialized"));
            } else {
                return sc.getServletContext();
            }
        }

        public String getServletInfo() {
            return "";
        }
      
        public void init(ServletConfig config) throws ServletException {
            //容器加载的 ServletConfig 赋值给内部的ServletConfig引用,由此实现ServletConfig方法
            this.config = config;
            this.init();
        }

        public void init() throws ServletException {
        }

        public void log(String msg) {
            this.getServletContext().log(this.getServletName() + ": " + msg);
        }

        public void log(String message, Throwable t) {
            this.getServletContext().log(this.getServletName() + ": " + message, t);
        }

        public abstract void service(ServletRequest var1, ServletResponse var2) throws ServletException, IOException;

        public String getServletName() {
            ServletConfig sc = this.getServletConfig();
            if (sc == null) {
                throw new IllegalStateException(lStrings.getString("err.servlet_config_not_initialized"));
            } else {
                return sc.getServletName();
            }
        }
    }
 ````
+ 如果自己编写Servlet实现`Servlet`接口，必须要实现接口中所有方法，并且要手动维护`ServletConfig`这个对象的引用。`GenericServlet` 实现了`Servlet`和`ServletConfig`的大部分方法，只留下了 **service(ServletRequest var1, ServletResponse var2)** 方法待实现。

### HttpServlet 抽象类
````java
public abstract class HttpServlet extends GenericServlet {
    private static final String METHOD_DELETE = "DELETE";
    private static final String METHOD_HEAD = "HEAD";
    private static final String METHOD_GET = "GET";
    private static final String METHOD_OPTIONS = "OPTIONS";
    private static final String METHOD_POST = "POST";
    private static final String METHOD_PUT = "PUT";
    private static final String METHOD_TRACE = "TRACE";
    private static final String HEADER_IFMODSINCE = "If-Modified-Since";
    private static final String HEADER_LASTMOD = "Last-Modified";
    private static final String LSTRING_FILE = "javax.servlet.http.LocalStrings";
    private static ResourceBundle lStrings = ResourceBundle.getBundle("javax.servlet.http.LocalStrings");

    public HttpServlet() {
    }

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String protocol = req.getProtocol();
        String msg = lStrings.getString("http.method_get_not_supported");
        if (protocol.endsWith("1.1")) {
            resp.sendError(405, msg);
        } else {
            resp.sendError(400, msg);
        }

    }

    protected long getLastModified(HttpServletRequest req) {
        return -1L;
    }

    protected void doHead(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        NoBodyResponse response = new NoBodyResponse(resp);
        this.doGet(req, response);
        response.setContentLength();
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String protocol = req.getProtocol();
        String msg = lStrings.getString("http.method_post_not_supported");
        if (protocol.endsWith("1.1")) {
            resp.sendError(405, msg);
        } else {
            resp.sendError(400, msg);
        }

    }

    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String protocol = req.getProtocol();
        String msg = lStrings.getString("http.method_put_not_supported");
        if (protocol.endsWith("1.1")) {
            resp.sendError(405, msg);
        } else {
            resp.sendError(400, msg);
        }

    }

    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String protocol = req.getProtocol();
        String msg = lStrings.getString("http.method_delete_not_supported");
        if (protocol.endsWith("1.1")) {
            resp.sendError(405, msg);
        } else {
            resp.sendError(400, msg);
        }

    }

    private Method[] getAllDeclaredMethods(Class<? extends HttpServlet> c) {
        Class<?> clazz = c;

        Method[] allMethods;
        for(allMethods = null; !clazz.equals(HttpServlet.class); clazz = clazz.getSuperclass()) {
            Method[] thisMethods = clazz.getDeclaredMethods();
            if (allMethods != null && allMethods.length > 0) {
                Method[] subClassMethods = allMethods;
                allMethods = new Method[thisMethods.length + allMethods.length];
                System.arraycopy(thisMethods, 0, allMethods, 0, thisMethods.length);
                System.arraycopy(subClassMethods, 0, allMethods, thisMethods.length, subClassMethods.length);
            } else {
                allMethods = thisMethods;
            }
        }

        return allMethods != null ? allMethods : new Method[0];
    }

    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Method[] methods = this.getAllDeclaredMethods(this.getClass());
        boolean ALLOW_GET = false;
        boolean ALLOW_HEAD = false;
        boolean ALLOW_POST = false;
        boolean ALLOW_PUT = false;
        boolean ALLOW_DELETE = false;
        boolean ALLOW_TRACE = true;
        boolean ALLOW_OPTIONS = true;

        for(int i = 0; i < methods.length; ++i) {
            String methodName = methods[i].getName();
            if (methodName.equals("doGet")) {
                ALLOW_GET = true;
                ALLOW_HEAD = true;
            } else if (methodName.equals("doPost")) {
                ALLOW_POST = true;
            } else if (methodName.equals("doPut")) {
                ALLOW_PUT = true;
            } else if (methodName.equals("doDelete")) {
                ALLOW_DELETE = true;
            }
        }

        StringBuilder allow = new StringBuilder();
        if (ALLOW_GET) {
            allow.append("GET");
        }

        if (ALLOW_HEAD) {
            if (allow.length() > 0) {
                allow.append(", ");
            }

            allow.append("HEAD");
        }

        if (ALLOW_POST) {
            if (allow.length() > 0) {
                allow.append(", ");
            }

            allow.append("POST");
        }

        if (ALLOW_PUT) {
            if (allow.length() > 0) {
                allow.append(", ");
            }

            allow.append("PUT");
        }

        if (ALLOW_DELETE) {
            if (allow.length() > 0) {
                allow.append(", ");
            }

            allow.append("DELETE");
        }

        if (ALLOW_TRACE) {
            if (allow.length() > 0) {
                allow.append(", ");
            }

            allow.append("TRACE");
        }

        if (ALLOW_OPTIONS) {
            if (allow.length() > 0) {
                allow.append(", ");
            }

            allow.append("OPTIONS");
        }

        resp.setHeader("Allow", allow.toString());
    }

    protected void doTrace(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String CRLF = "\r\n";
        StringBuilder buffer = (new StringBuilder("TRACE ")).append(req.getRequestURI()).append(" ").append(req.getProtocol());
        Enumeration reqHeaderEnum = req.getHeaderNames();

        while(reqHeaderEnum.hasMoreElements()) {
            String headerName = (String)reqHeaderEnum.nextElement();
            buffer.append(CRLF).append(headerName).append(": ").append(req.getHeader(headerName));
        }

        buffer.append(CRLF);
        int responseLength = buffer.length();
        resp.setContentType("message/http");
        resp.setContentLength(responseLength);
        ServletOutputStream out = resp.getOutputStream();
        out.print(buffer.toString());
    }
     //接收HttpServletRequest  HttpServletResponse参数的service方法
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //getMethod()
        String method = req.getMethod();
        long lastModified;
        if (method.equals("GET")) {
            lastModified = this.getLastModified(req);
            if (lastModified == -1L) {
                this.doGet(req, resp);
            } else {
                long ifModifiedSince = req.getDateHeader("If-Modified-Since");
                if (ifModifiedSince < lastModified) {
                    this.maybeSetLastModified(resp, lastModified);
                    this.doGet(req, resp);
                } else {
                    resp.setStatus(304);
                }
            }
        } else if (method.equals("HEAD")) {
            lastModified = this.getLastModified(req);
            this.maybeSetLastModified(resp, lastModified);
            this.doHead(req, resp);
        } else if (method.equals("POST")) {
            this.doPost(req, resp);
        } else if (method.equals("PUT")) {
            this.doPut(req, resp);
        } else if (method.equals("DELETE")) {
            this.doDelete(req, resp);
        } else if (method.equals("OPTIONS")) {
            this.doOptions(req, resp);
        } else if (method.equals("TRACE")) {
            this.doTrace(req, resp);
        } else {
            String errMsg = lStrings.getString("http.method_not_implemented");
            Object[] errArgs = new Object[]{method};
            errMsg = MessageFormat.format(errMsg, errArgs);
            resp.sendError(501, errMsg);
        }

    }

    private void maybeSetLastModified(HttpServletResponse resp, long lastModified) {
        if (!resp.containsHeader("Last-Modified")) {
            if (lastModified >= 0L) {
                resp.setDateHeader("Last-Modified", lastModified);
            }

        }
    }
    //重写GenericServlet的service方法
    public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
        if (req instanceof HttpServletRequest && res instanceof HttpServletResponse) {
            HttpServletRequest request = (HttpServletRequest)req;
            HttpServletResponse response = (HttpServletResponse)res;
            //接收HttpServletRequest  HttpServletResponse参数的service方法
            this.service(request, response);
        } else {
            throw new ServletException("non-HTTP request or response");
        }
    }
}
````

+ `HttpServlet` 抽象类继承 `GenericServlet`,实现了 **service(ServletRequest req, ServletResponse res)** 方法并且添加了一个自己独有的Service(HttpServletRequest request，HttpServletResponse response)方法。

+ `HttpServletRequest` 、`HttpServletResponse`继承`ServletRequest`、 `ServletResponse`接口。service方法中对request、response做了强转。之所以能够这样强制的转换，是因为在调用Servlet的Service方法时，**Servlet容器总会传入一个HttpServletRequest对象和HttpServletResponse对象，预备使用HTTP.**

+ 转换之后，service方法把两个转换后的对象传入了另一个service方法。此service方法中根据`HttpServletRequest` 中getMethod()获取请求类型，调对应的doGet()、doPost()...的方法。

+ `HttpServlet` 相较于`GenericServlet`更加简化，不需要调用service(),只需要根据请求实现对应的doGet()、doPost()方法。

## Servlet 相关类

### ServletContext（上下文） 对象
+  ServletContext对象表示Servlet应用程序。**每个Web应用程序都只有一个ServletContext对象。** 分布式环境中，每台Java虚拟机上的Web应用都会有一个ServletContext对象。工程内部的所有servlet都共享这个对象.

+ **有了ServletContext对象，就可以共享从应用程序中的所有资料处访问到的信息，并且可以动态注册Web对象。前者将对象保存在ServletContext中的一个内部Map中。** 保存在ServletContext中的对象被称作属性。

+ servletContext是一个域对象，域对象是服务器在内存上创建的存储空间，用于在不同动态资源（servlet）之间传递与共享数据。


+ ServletContext中的下列方法负责处理属性，凡是域对象都有如下3个方法：
  ````java
  //获取已命名属性的值
  Object getAttribute(String var1);
  
  //设置属性的k v值
  void setAttribute(String var1, Object var2);
 
  void removeAttribute(String var1);

  ````
 
+  核心方法。
 ````java
  getServletContext().getRealPath(path)//根据相对路径获取服务器上资源的绝对路径

  getServletContext().getResourceAsStream(path)//根据相对路径获取服务器上资源的输入字节流

  getServletContext().getContextPath()；//获取当前工程名字
 ````  

### ServletConfig 接口
````java
public interface ServletConfig {
    //获取servlet名称
    String getServletName();
    //获取ServletContext对象
    ServletContext getServletContext();
    //获得servlet初始化参数
    String getInitParameter(String var1);
    //获得所有servlet初始化参数的名称
    Enumeration<String> getInitParameterNames();
}
````

### HttpServletRequest接口
+ HttpServletRequest表示Http环境中的Servlet请求。它扩展于javax.servlet.ServletRequest接口，并添加了几个方法。
````java
String getContextPath();//返回请求上下文的请求URI部分
Cookie[] getCookies();//返回一个cookie对象数组
String getHeader(String var1);//返回指定HTTP标题的值
String getMethod();//返回生成这个请求HTTP的方法名称
String getQueryString();//返回请求URL中的查询字符串
HttpSession getSession();//返回与这个请求相关的会话对象
````

### ServletRequset 接口
+ Servlet容器对于接受到的每一个Http请求，都会创建一个ServletRequest对象，并把这个对象传递给Servlet的Sevice( )方法。
+ ServletRequest对象内封装了关于这个请求的许多详细信息。
````java
//接口的部分内容
public interface ServletRequest {
  
 
    int getContentLength();//返回请求主体的字节数
 
    String getContentType();//返回主体的MIME类型
 
    String getParameter(String var1);//返回请求参数的值，最常用的方法，可用于获取查询字符串的值。
 
}
````

### ServletResponse接口
+ ServletResponse接口表示一个Servlet响应，在调用Servlet的Service( )方法前，Servlet容器会先创建一个ServletResponse对象，并把它作为第二个参数传给Service( )方法。ServletResponse隐藏了向浏览器发送响应的复杂过程。
+ ServletResponse内部部分方法
````java

public interface ServletResponse {
    String getCharacterEncoding();
 
    String getContentType();
 
    ServletOutputStream getOutputStream() throws IOException;
    //PrintWriter对象使用ISO-8859-1编码（该编码在输入中文时会发生乱码）。
    PrintWriter getWriter() throws IOException;
    
    void setCharacterEncoding(String var1);
 
    void setContentLength(int var1);
    /**在发送任何HTML之前，应该先调用setContentType（）方法，设置响应的内容类型，
    *并将“text/html”作为一个参数传入，这是在告诉浏览器响应的内容类型为HTML，
    *需要以HTML的方法解释响应内容而不是普通的文本，或者也可以加上“charset=UTF-8”
    *改变响应的编码方式以防止发生中文乱码现象。
    **/
    void setContentType(String var1);
 
    void setBufferSize(int var1);
 
    int getBufferSize();
 
    void flushBuffer() throws IOException;
 
    void resetBuffer();
 
    boolean isCommitted();
 
    void reset();
 
    void setLocale(Locale var1);
 
    Locale getLocale();
}
````

### HttpServletResponse接口
+ HttpServletResponse接口，它继承自ServletResponse接口，专门用来封装HTTP响应消息。 
+  由于HTTP请求消息分为状态行，响应消息头，响应消息体三部分，因此，在HttpServletResponse接口中定义了向客户端发送响应状态码，响应消息头，响应消息体的方法。

+ 通过Response设置响应
````java
void addCookie(Cookie var1);//给这个响应添加一个cookie
void addHeader(String var1, String var2);//给这个请求添加一个响应头
void sendRedirect(String var1) throws IOException;//发送一条响应码，讲浏览器跳转到指定的位置
void setStatus(int var1);//设置响应行的状态码
````
::: warning
注意：虽然response对象的getOutSream（）和getWriter（）方法都可以发送响应消息体，但是他们之间相互排斥，不可以同时使用，否则会发生异常。
:::

### ServletContextListener（Servlet全局监听器）
+ ServletContextListener是一个接口,只要类实现了ServletContextListener接口,那么这个类就实现了【监听ServletContext】的功能。
````java
public interface ServletContextListener extends EventListener {
    //ServletContext初始化。（应用start时）---------->Servlet容器调用
    default void contextInitialized(ServletContextEvent sce) {
    }
    //ServletContext销毁。（应用stop时）---------->Servlet容器调用 
    default void contextDestroyed(ServletContextEvent sce) {
    }
}
````
+ 应用启动时，ServletContext进行初始化，Servlet容器会自动调用正在监听ServletContext的ServletContextListener的contextInitialized 
+ 当应用停止时，ServletContext被销毁，此时Servlet容器也会自动地调用正在监听ServletContext的ServletContextListener的 contextDestroyed(ServletContextEvent var1)方法。
