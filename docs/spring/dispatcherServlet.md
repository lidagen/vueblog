## DispatcherServlet 源码解析

### 概述

+ `DispatcherServlet`是springMVC的核心，其本质是一个Servlet，主要进行全局的流程控制。

+ `DispatcherServlet` 继承 `FrameworkServlet`抽象类，`FrameworkServlet`抽象类继承 `HttpServletBean`实现`ApplicationContextAware`接口。`HttpServletBean`继承 `HttpServlet`。
  - `FrameworkServlet`重写了service()、destory()方法，service()增加了**PATCH**类型请求受理。
  - 真正处理请求的是`DispatcherServlet`的doService()方法下的doDispatch()

+ `DispatcherServlet`运行流程：
  - 客户端发送HTTP请求，到达dispatcherServelt，dispatcherServelt调用handlerMapping将会把请求映射为HandlerExecutionChain对象（包含一个Handler处理器,多个HandlerInterceptor拦截器)。
  - DispatcherServlet-->HandlerAdapter,HandlerAdapter将会把处理器包装为适配器，从而支持多种类型的处理器。
  - HandlerAdapter-->处理器功能处理方法的调用，HandlerAdapter将会根据适配的结果调用真正的处理器的功能处理方法，完成功能处理，并返回一个ModelAndView对象(包含模型数据，逻辑视图名)。
  - ModelAndView的逻辑视图名-->ViewResolver，ViewResoler将把逻辑视图名解析为具体的View。
  - View-->渲染，View会根据传进来的Model模型数据进行渲染，此处的Model实际是一个Map数据结构。
  - 返回控制权给DispatcherServlet，由DispatcherServlet返回响应给用户。

###   
