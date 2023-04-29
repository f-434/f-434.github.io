---
title: SpringBoot快速上手
date: 2023-02-20 17:08:03
tags: 框架
index_img: /img/blog_img/springboot.png
---

### SpringBoot快速上手
##### springboot 介绍

- springboot是由pivotal团队提供的基于spring的全新框架 , 旨在简化spring应用的初始搭建和开发过程

- springboot 是所有基于spring开发项目的起点
- 尽可能简化应用开发的门槛 , 让应用开发,测试, 部署变得更加简单

##### SpringBoot特点

- 遵循约定优于配置 的原则 , 只需要很少的配置或使用默认的配置
- 能够使用内嵌的Tomcat jetty服务器 , 不需要部署war文件
- 提供定制化的启动器starters , 简化Maven配置
- 纯java配置,没有代码生成 , 也不需要xml配置
- 提供了生产级的服务监控方案 , 如安全监控 , 应用监控 , 健康检测等

##### 开发环境热部署

- springboot提供了spring-boot-devtools组件,使得无需手动重启springboot应用即可重新编译 , 启动项目 , 从而缩短启动时间

- devtools会监听classpath下的文件变动 , 触发restart类加载器重新加载该类 , 从而实现类文件和属性文件的热部署

- 并不是所有的更改都需要重启应用(例如静态资源 , 视图模板) , 可通过设置spring.devtools.restart.exclude属性来指定一些文件或目录的修改不用重启应用

- 使用

  - 添加dev-tools依赖

    > optional=true , 表示依赖不会传递,及该项目依赖devtools,其他项目引用此项目生成的jar包不包含devtools

    ```xml
            <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-devtools -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-devtools</artifactId>
                <optional>true</optional>
            </dependency>
    ```

  - 在application.properties中配置devtools

    ```properties
    # 开启热部署
    spring.devtools.restart.enabled=true
    # 设置重启目录
    spring.devtools.restart.additional-paths=src/main/java
    ```

    

### SpringBoot Controller

##### web入门

- springboot将传统的web开发的mvc json tomcat等框架整合 , 提供了spring-boot-starter-web组件,简化了web应用配置
- 创建springboot项目勾选spring web选项后 , 会自动将spring-boot-starter-web组件加入到项目当中
- spring-boot-starter-web启动器主要包括web webmvc json tomcat等基础依赖组件,提供web开发场景所需的所有底层依赖
- webmvc为web开发的基础框架 , json为JSON数据解析组件 , tomcat为自带的容器依赖

##### 控制器

- springboot提供@Controller和@RestController两种注解来标识此类负责接收和处理HTTP请求
- 如果请求的是页面和数据 , 使用@Controller注解即可, 如果只是请求数据,则可以使用@RestController
- @RestController 用法
  - 默认情况下 ,@RestController注解会将返回的对象数据转换为JSON格式



##### 路由映射

- @RequestMapping注解主要负责URL的路由映射 , 他可以添加在Controller类或者具体的方法上

- 若果添加在Controller类上 , 则这个Controller中的所有路由映射都将会加上此映射规则 , 如果添加在方法上,则指对当前方法生效

- @RequestMapping注解包含很多属性参数来定义HTTP的请求映射规则.常用的属性参数如下

  - value : 请求URL的路径 , 支持URL模板 , 正则表达式
  - method : HTTP请求方法
  - consumes : 请求的媒体类型(Content-Type) , 如application/json
  - produces : 响应的媒体类型
  - params , headers : 请求的参数及请求头的值

  ##### 参数传递

  - @RequestParam将请求参数绑定到控制器的方法参数上,接收的参数来自HTTP请求体或请求url的QueryString , 当请求的参数名称与Controller的业务方法参数名称一致时,@RequestParam可以省略
  - @PathVaraible: 用来处理动态的URL , URL的值可以作为控制器中处理方法的参数
  - @RequestBody接收的参数是来自requestBody中 , 及请求体 , 一班用于处理非Content-Type/x-www-from-urlencode编码格式的数据 . 比如application/json , application/xml等类型的数据



### SpringBoot 文件上传 + 拦截器

##### 静态资源访问

- idea创建SpringBoot 项目,会默认创建出classpath:/static/目录,静态资源一般放在这个目录下即可

- 如果默认的静态资源过滤策略不能满足开发需求 , 可以自定义静态资源过滤策略

- 在application.properties中配置如下

  ```properties
  # 定义静态资源的加载位置
  spring.mvc.static-path-pattern=/img/**
  ```



##### springboot实现文件上传

> 实现上传的文件可以被访问需更改静态资源加载位置
>
> ```properties
> # 第一个斜线代表的是服务器所在的路径
> spring.web.resources.static-locations=/upload/
> ```
>
> 

- 内嵌的tomcat限制了请求文件的大小 ,默认每个文件最大为1MB , 单次请求文件总数不大于10MB

- 需要更改可在application.properties中配置如下

  ```properties
  spring.servlet.multipart.max-request-size=10MB
  spring.servlet.multipart.max-file-size=10MB
  ```

- 当表单的enctype="multipart/from-data"时,可以使用MultipartFile获取上传的文件数据 , 再通过transferTo方法将其写入到磁盘中

  ```java
  package com.example.hellworld.controller;
  
  
  import org.springframework.web.bind.annotation.PostMapping;
  import org.springframework.web.bind.annotation.RestController;
  import org.springframework.web.multipart.MultipartFile;
  
  import javax.servlet.http.HttpServletRequest;
  import java.io.File;
  import java.io.IOException;
  
  @RestController
  public class FileController {
  
      @PostMapping("/upload")
      public String up(String name , MultipartFile multipartFile , HttpServletRequest request) throws IOException {
          System.out.println(name);
          //获取上传文件的原始名称
          System.out.println(multipartFile.getOriginalFilename());
  
          //获取文件类型
          System.out.println(multipartFile.getContentType());
  
  
          //动态获取服务器下upload的绝对路径
          String path = request.getServletContext().getRealPath("/upload/");
          System.out.println(path);
          saveFile(multipartFile , path);
          return "上传成功";
      }
  
      public void saveFile(MultipartFile multipartFile , String path) throws IOException {
          //判断目录 , 不存在则创建
          File dir = new File(path);
          if (!dir.exists()){
              //创建目录
              dir.mkdir();
          }
  
          File file = new File(path + multipartFile.getOriginalFilename());
          multipartFile.transferTo(file);
      }
  }
  
  ```

  

  

  

  

#### 拦截器

- 拦截器在web系统中非常常见 , 对于某些全局统一的操作 , 我们可以把它提取到拦截器中实现

- 使用场景
  - 权限检查:如登陆检测,进入处理程序检测是否登录 , 如果没有,则直接返回登陆界面
  - 性能监控: 有时系统在某时间段莫名其妙很慢,可以通过拦截器在进入处理程序之前记录开始时间,在处理完后记录结束时间,从而得到该请求的处理时间
  - 通用行为: 读取cookie得到用户信息并将用户对象放入请求,从而方便后续流程使用 , 还有提取Locale Theme信息等 , 只要是多个处理程序都需要的,即可使用拦截器实现

  - spring boot 定义了HandlerInterceptor接口来实现自定义拦截器功能
  - HandlerInterceptor接口定义了preHandle , postHandle afterCompletion三种方法 , 通过重写这三种方法实现请求前, 请求后等操作
  
- 具体使用
  
  - 定义拦截器
  
    ```java
    package com.example.hellworld.interceptor;
    
    import org.springframework.web.servlet.HandlerInterceptor;
    
    import javax.servlet.http.HttpServletRequest;
    import javax.servlet.http.HttpServletResponse;
    
    public class LoginInterCeptor implements HandlerInterceptor {
    
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            
            //可做条件判断
            System.out.println("LoginInterCeptor");
            return true;
        }
    }
    ```
  
  - 配置拦截器
  
    ```java
    package com.example.hellworld.config;
    
    
    import com.example.hellworld.interceptor.LoginInterCeptor;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
    import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
    
    @Configuration
    public class WebConfig implements WebMvcConfigurer {
    
    
        @Override
        public void addInterceptors(InterceptorRegistry registry) {
            // addPathPatterns("/user/**") 拦截指定路径下的请求
            //不加则拦截所有
    
            registry.addInterceptor(new LoginInterCeptor());
        }
    }
    ```
  
  
  
  
  
  
  
  
## 构建RESTful服务 + Swagger

##### RESTful服务介绍

- RESTful是目前流行的互联网软件服务架构设计风格
- 全称是Representational State Transfer，中文意思是表述（编者注：通常译为表征）性状态转移。定义了互联网软件架构的原则
- REST并不是一个标准,更像一组客户端和服务端交互时的架构理念和设计原则,基于这种架构理念和设计原则的Web API更加简洁 ,更有层次

##### RESTful特点

- 每个URL都代表一个资源
- 客户端使用get post put delete 四种表示操作方式的动词对服务资源进行操作:
  - get用于获取资源
  - post用于新建资源(也可用于更新资源)
  - put用于更新资源
  - delete用于删除资源
- 通过操作资源的表现形式来实现服务端请求操作
- 资源的表现形式JSON或者HTML
- 客户端与服务端之间的交互在请求之间是无状态的,从客户端到服务端的每个请求都包含必须的信息

##### RESTful API

- 两个关键特性:
  - 安全性: 安全的方法被期望不会产生任何副作用,当我们使用get操作获取资源时,不会引起资源本身的改变,也不会引起服务器状态的改变
  - 幂等性:幂等的方法保证了重复进行一个请求和多次请求的效果相同(并不是指响应总是相同的,而是指服务器上资源的状态从第一次请求后就不再改变),在数学上幂等性是指N次变换和一次变换相同

  

  

  

##### HTTP Method

- http提供了post get put delete 等操作类型对某个Web资源进行create , read update和delete操作

- 一个http请求除了利用URL标志目标资源外,还需要通过HTTP Method指定针对该资源的操作类型,常见的HTTP方法及其在RESTful风格下的使用

  | HTTP方法 | 操作   | 返回值                                            | 特定返回值                              |
  | -------- | ------ | ------------------------------------------------- | --------------------------------------- |
  | POST     | Create | 201(Created),提交或保存资源                       | 404(Not Found),409(Conflict)资源已存在  |
  | GET      | Read   | 200(OK),获取资源或数据列表,支持分页,排序,条件查询 | 200(OK)返回资源404(Not Found)资源不存在 |
  | PUT      |        | 200 / 204                                         | 404 / 405 (禁止使用该方法调用)          |
  | PATCH    |        | 200 / 204                                         | 404                                     |
  | DELETE   |        | 200                                               | 404 / 405                               |
  |          |        |                                                   |                                         |





##### HTTP状态码

- HTTP状态码就是服务向用户返回的状态码和提示信息,客户端的每一次请求,服务器都必须给出回应,回应包括HTTP状态码和数据两部分
- HTTP定义了40个标准状态码,可用于传达客户端请求的结果,状态码分为以下五类
  - 1XX: 信息,通信传输协议级信息
  - 2XX : 成功,表示客户端的请求已成功接收
  - 3XX : 重定向,表示客户端必须执行一些其他操作才能完成其请求
  - 4XX : 客户端错误 ,此类错误状态码直接指向客户端
  - 5XX : 服务器错误 

##### Spring Boot 实现RESTful

- SpringBoot提供的spring-boot-starter-web组件完全支持开发TRESTful API , 提供了与REST操作方式对应的注解

- @GetMapping : 处理Get请求,获取资源

- @PostMapping:处理Post请求,新增资源

- @PutMapping:处理Put请求,更新资源

- @DeleteMapping:处理Delete请求 ,删除资源

- @PatchMapping:处理Patch请求 , 用于资源的部分更新

- 在RESTful架构中, 每个网址代表一种资源,所以URL中建议不要包含动词,只包含名词即可,而且所用的名词往往与数据库中的表名对应

  

##### Swagger 介绍

- Swagger 是一个规范和完整的框架 , 用于生成描述调用和可视化RESTful风格的Web服务,是非常流行的API表达工具

- Swagger 能够自动生成晚上的RESTful API文档,同时并根据后台代码的修改同步更新,同时提供完整的测试页面来调试API

- 使用:

  - 添加springfox-swagger2和springfox-swagger-ui依赖

    ```xml
    <!-- https://mvnrepository.com/artifact/io.springfox/springfox-swagger2 -->
    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger2</artifactId>
        <version>2.9.2</version>
    </dependency>
    
    <!-- https://mvnrepository.com/artifact/io.springfox/springfox-swagger-ui -->
    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger-ui</artifactId>
        <version>2.9.2</version>
    </dependency>
    
    
    
    ```

  - 创建Swagger2配置类

    ```java
    package com.example.hellworld.config;
    
    import org.springframework.context.annotation.Configuration;
    import springfox.documentation.builders.ApiInfoBuilder;
    import springfox.documentation.builders.PathSelectors;
    import springfox.documentation.builders.RequestHandlerSelectors;
    import springfox.documentation.service.ApiInfo;
    import springfox.documentation.spi.DocumentationType;
    import springfox.documentation.spring.web.plugins.Docket;
    import springfox.documentation.swagger2.annotations.EnableSwagger2;
    
    @Configuration //该类为配置类
    @EnableSwagger2 //启用Swagger2功能
    public class Swagger2Config {
    
        public Docket createRestApi(){
            return new Docket(DocumentationType.SWAGGER_2)
                    .apiInfo(apiInfo())
                    .select()
    //                com包下的所有API都交给Swagger2管理
                    .apis(RequestHandlerSelectors.basePackage("com"))
                    .paths(PathSelectors.any())
                    .build();
        }
    
        private ApiInfo apiInfo(){
            return new ApiInfoBuilder()
                    .title("项目API") //标题
                    .description("学习Swagger2的演示项目") // 描述
                    .version("1.0") // 版本
                    .build();
        }
    
    
    
    }
    
    ```

  - `application.properties`中配置如下

    ```xml
    spring.mvc.pathmatch.matching-strategy=ant_path_matcher
    ```

  - 启动项目后浏览器访问`http://localhost:8080/swagger-ui.html`

  

  ## MyBatisPlus 快速上手

  

  ### ORM介绍

  - ORM(Object Relational Mapping , 对象关系映射)  ,是为了解决面向对象与关系型数据库存在的互不匹配现象的一种技术
  - ORM通过使用描述对象和数据库之间映射的元数据将程序中的对象自动持久化到关系数据库中
  - ORM框架的本质是简化编程中操作数据库的编码

  ![ORM对象关系映射](https://img1.imgtp.com/2023/03/30/Iwb9YseN.png)
  
  
  
  ### MyBatis-Plus 介绍
  
  - MyBatis能够非常灵活的实现动态SQL , 可以使用XML或注解来配置和映射原生信息,能够轻松的将Java的pojo(Plain Ordinary Java Object , 普通的Java对象)与数据库中的表和字段进行映射关联
  - MyBatis-Plus是MyBatis的增强 ,简化了开发
  
  ### MyBatis-Plus的使用
  
  - 添加依赖
  
    ```xml
    
    
    <!-- MyBatisPlus依赖 -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>3.4.2</version>
    </dependency>
    
    <!-- mysql驱动依赖 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.47</version>
    </dependency>
    
    <!--数据连接池 druid -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
        <version>1.1.20</version>
    </dependency>
    
    
    
    ```
  
  - `application.properties`下配置
  
    ```properties
    
    spring.datasource.driver-class-name=com.mysql.jdbc.Driver
    spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
    spring.datasource.url=jdbc:mysql://localhost:3307/ssm_db?characterEncoding=utf-8&useSSL=false
    spring.datasource.username=root
    spring.datasource.password=123456
    mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
    ```
    
  - 添加@MapperScan注解
  
    ```java
    package com.example.hellworld;
    
    import org.mybatis.spring.annotation.MapperScan;
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;
    
    @SpringBootApplication
    
    @MapperScan("com.xxx.mapper")
    public class HellworldApplication {
    
        public static void main(String[] args) {
            SpringApplication.run(HellworldApplication.class, args);
        }
    
    }
    
    ```
  
  - MyBatis CRUD 注解
  
    | 注解     | 功能                             |
    | -------- | -------------------------------- |
    | @Insert  | 插入数据                         |
    | @Update  | 更新数据                         |
    | @Delete  | 删除数据                         |
    | @Select  | 查询数据                         |
    | @Result  | 实现结果集封装                   |
    | @Results | 与@Result一起使用,封装多个结果集 |
    | @One     | 实现一对一结果集封装             |
    | @Many    | 实现一对多结果集封装             |
    
    
    
    
    
    
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  










