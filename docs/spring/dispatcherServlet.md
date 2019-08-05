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

### service 方法
+ `Servlet`接口, 定义了 service()方法。
+ `HttpServlet`实现了service()方法。  
+ `FrameworkServlet`抽象类重写了service()方法增加了**PATCH**类型请求。方法最终指向了 *processRequest()* 方法

### processRequest 方法

````java
protected final void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    long startTime = System.currentTimeMillis();
    Throwable failureCause = null;
      // 获取LocaleContextHolder中保存的原始LocaleContext
    LocaleContext previousLocaleContext = LocaleContextHolder.getLocaleContext();
     // 创建当前请求的LocaleContext
    LocaleContext localeContext = this.buildLocaleContext(request);
     // 获取RequestContextHolder中保存的原始RequestAttributes
    RequestAttributes previousAttributes = RequestContextHolder.getRequestAttributes();
    // 创建当前请求的RequestAttributes
    ServletRequestAttributes requestAttributes = this.buildRequestAttributes(request, response, previousAttributes);
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);
    asyncManager.registerCallableInterceptor(FrameworkServlet.class.getName(), new FrameworkServlet.RequestBindingInterceptor());
    //将localeContext、requestAttributes分别设置到LocaleContextHolder和RequestContextHolder
    this.initContextHolders(request, localeContext, requestAttributes);

    try {
      // 模板方法，DispatcherServlet中实现
        this.doService(request, response);
    } catch (ServletException var17) {
        failureCause = var17;
        throw var17;
    } catch (IOException var18) {
        failureCause = var18;
        throw var18;
    } catch (Throwable var19) {
        failureCause = var19;
        throw new NestedServletException("Request processing failed", var19);
    } finally {
        this.resetContextHolders(request, previousLocaleContext, previousAttributes);
        if (requestAttributes != null) {
            requestAttributes.requestCompleted();
        }

        if (this.logger.isDebugEnabled()) {
            if (failureCause != null) {
                this.logger.debug("Could not complete request", (Throwable)failureCause);
            } else if (asyncManager.isConcurrentHandlingStarted()) {
                this.logger.debug("Leaving response open for concurrent processing");
            } else {
                this.logger.debug("Successfully completed request");
            }
        }

        this.publishRequestHandledEvent(request, response, startTime, (Throwable)failureCause);
    }

}
````

### doService 方法
````java
protected void doService(HttpServletRequest request, HttpServletResponse response) throws Exception {
    if (this.logger.isDebugEnabled()) {
        String resumed = WebAsyncUtils.getAsyncManager(request).hasConcurrentResult() ? " resumed" : "";
        this.logger.debug("DispatcherServlet with name '" + this.getServletName() + "'" + resumed + " processing " + request.getMethod() + " request for [" + getRequestUri(request) + "]");
    }

    Map<String, Object> attributesSnapshot = null;
    if (WebUtils.isIncludeRequest(request)) {
        attributesSnapshot = new HashMap();
        Enumeration attrNames = request.getAttributeNames();

        label108:
        while(true) {
            String attrName;
            do {
                if (!attrNames.hasMoreElements()) {
                    break label108;
                }

                attrName = (String)attrNames.nextElement();
            } while(!this.cleanupAfterInclude && !attrName.startsWith("org.springframework.web.servlet"));

            attributesSnapshot.put(attrName, request.getAttribute(attrName));
        }
    }

    request.setAttribute(WEB_APPLICATION_CONTEXT_ATTRIBUTE, this.getWebApplicationContext());
    request.setAttribute(LOCALE_RESOLVER_ATTRIBUTE, this.localeResolver);
    request.setAttribute(THEME_RESOLVER_ATTRIBUTE, this.themeResolver);
    request.setAttribute(THEME_SOURCE_ATTRIBUTE, this.getThemeSource());
    FlashMap inputFlashMap = this.flashMapManager.retrieveAndUpdate(request, response);
    if (inputFlashMap != null) {
        request.setAttribute(INPUT_FLASH_MAP_ATTRIBUTE, Collections.unmodifiableMap(inputFlashMap));
    }

    request.setAttribute(OUTPUT_FLASH_MAP_ATTRIBUTE, new FlashMap());
    request.setAttribute(FLASH_MAP_MANAGER_ATTRIBUTE, this.flashMapManager);

    try {
        this.doDispatch(request, response);
    } finally {
        if (!WebAsyncUtils.getAsyncManager(request).isConcurrentHandlingStarted() && attributesSnapshot != null) {
            this.restoreAttributesAfterInclude(request, attributesSnapshot);
        }

    }

}
````  
+ 此方法给request设置一些值，主要方法在doDispatch(request,response);

### doDispatch 核心方法
+ 检查是否是文件上传类型
+ 获取HandlerExecutionChain
+ 适配器模式,包装处理getHandler
+ 执行preHandle拦截器,判断是否通过
+ 执行controller中的方法
+ 设置视图
+ 执行拦截器的postHandle方法
+ 判断解析视图是否成功

````java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    HttpServletRequest processedRequest = request;
    HandlerExecutionChain mappedHandler = null;
    boolean multipartRequestParsed = false;
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

    try {
        try {
            ModelAndView mv = null;
            Object dispatchException = null;

            try {
                //检查是否文件类型请求
                processedRequest = this.checkMultipart(request);
                multipartRequestParsed = processedRequest != request;
                //获取HandlerExecutionChain
                mappedHandler = this.getHandler(processedRequest);
                if (mappedHandler == null || mappedHandler.getHandler() == null) {
                    this.noHandlerFound(processedRequest, response);
                    return;
                }
                //适配器模式,包装处理getHandler
                HandlerAdapter ha = this.getHandlerAdapter(mappedHandler.getHandler());
                String method = request.getMethod();
                boolean isGet = "GET".equals(method);
                if (isGet || "HEAD".equals(method)) {
                    long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
                    if (this.logger.isDebugEnabled()) {
                        this.logger.debug("Last-Modified value for [" + getRequestUri(request) + "] is: " + lastModified);
                    }

                    if ((new ServletWebRequest(request, response)).checkNotModified(lastModified) && isGet) {
                        return;
                    }
                }
                //执行preHandle拦截器,判断是否通过
                if (!mappedHandler.applyPreHandle(processedRequest, response)) {
                    return;
                }
                //执行controller中的方法
                mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
                if (asyncManager.isConcurrentHandlingStarted()) {
                    return;
                }
                //设置视图
                this.applyDefaultViewName(processedRequest, mv);
                //执行拦截器的postHandle方法
                mappedHandler.applyPostHandle(processedRequest, response, mv);
            } catch (Exception var20) {
                dispatchException = var20;
            } catch (Throwable var21) {
                dispatchException = new NestedServletException("Handler dispatch failed", var21);
            }
            //判断解析视图是否成功
            this.processDispatchResult(processedRequest, response, mappedHandler, mv, (Exception)dispatchException);
        } catch (Exception var22) {
            this.triggerAfterCompletion(processedRequest, response, mappedHandler, var22);
        } catch (Throwable var23) {
            this.triggerAfterCompletion(processedRequest, response, mappedHandler, new NestedServletException("Handler processing failed", var23));
        }

    } finally {
        if (asyncManager.isConcurrentHandlingStarted()) {
            if (mappedHandler != null) {
                mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);
            }
        } else if (multipartRequestParsed) {
            this.cleanupMultipart(processedRequest);
        }

    }
}
````

<Valine></Valine>