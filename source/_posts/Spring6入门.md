---
title: Spring6入门
date: 2023-02-22 21:44:48
tags: 框架
index_img: /img/blog_img/spring6.png
---


## Spring6

### 1. 概述

###### 1. 什么是Spring?

   是一款主流的Java EE 轻量级开源框架 , Spring由"Spring之父"Rod Johnson 提出并创立 , 目的用于简化Java企业级应用的开发难度和开发周期, Spring的用途不仅限于服务器端的开发.从简单性,可测试性和松耦合的角度而言,任何Java应用都可以从Spring中收益.Spring框架除了自己提供功能外,还提供整合其他技术和框架的能力

###### 2. Spring的广义狭义

   - 广义Spring : Spring技术栈
     - 泛指以Spring Framework为核心的Spring技术栈
     - 经过十多年的发展,Spring已经不再是一个单纯的应用框架,而是逐渐发展成了一个人有多个不同子项目(模块)组成的成熟技术,l例如 Spring Framework , Spring MVC , Spring Boot , Spring Cloud , Spring Data , Spring Security等 , 其中Spring Framework是其他子项目的基础
     - 这些子项目涵盖了从企业级警用开发到云计算等各方面的内容, 能够帮助开发人员解决软件发展过程中不断产生的各种实际问题,从而带来更好的开发体验
   - 狭义的Spring : Spring Framework
     - 狭义Spring 特指: Spring Framework , 通常称为Spring框架
     - Spring 框架是一个分层的 , 面向切面的Java应用程序的一站式轻量解决方案 , 他是Spring技术的核心和基础 , 是为了解决企业级应用开发的复杂性而创建的.
     - Spring 两个核心模块
       - IOC : Inverse of Control 的简写 , 译为"控制反转" , 指把创建对象的过程交给Spring来管理
       - AOP : Aspect Oriented Programming 的简写 , 译为"面向切面编程" . AOP用来封装多个类的公共行为 , 将那些与业务无关,却为业务模块所共同调用的逻辑封装起来 ,减少系统的重复代码 , 降低系统之间的耦合度 , 另外,AOP还解决一些系统层面的问题 , 比如日志 , 事务, 权限等.

###### 3. Spring Framework特点

   - 非侵入式 : Spring 对应用程序本身的结构影响非常小. 对领域模型可以做到零污染; 对功能性组件也只需要使用几个简单的注解进行标记 , 完全不坏原有结构 , 反而能将组件结构进一步简化 , 这就使得基于Spring Framework 开发的应用程序结构清晰 , 简洁优雅
   - 控制反转 : IoC ,把自己创建资源,向环境索取资源变成环境将资源准备好, 我们享受资源注入
   - 面向切面编程 : AOP , 在不修改源代码的基础上增强代码功能
   - 容器 : Spring IoC 是一个容器 , 因为它包含并且管理组件对象的生命周期.组件享受到了容器化的管理, 替代程序员屏蔽了组件创建中大量细节 , 极大降低了使用门槛 , 大幅度提高开发效率
   - 组件化 : Spring实现了使用简单组件配置组合成一个复杂的应用 , 在Spring中可以使用XML 和Java 注解组合这些对象,这使得我们可以基于一个个功能明确,边界清晰的组件有条不紊的搭建超大型复杂应用系统.
   - 一站式: 在IoC 和 AOP的基础上可以整合各种企业应用的开源框架和优秀的第三方类库 ,Spring旗下项目已经覆盖了广泛领域 , 很多方面的功能性需求可以在Spring Framework 的基础上全部使用Spring 来实现

###### 4. Spring模块组成

   - Spring Core (核心容器)

     > 提供了IoC ,DI , Bean配置装载创建的核心实现. 核心概念: Beans、BeanFactory、BeanDefinitions、ApplicationContext
     >
     > > Spring-core : IoC 和 DI的基本实现
     > >
     > > Spring-beans : BeanFactory和Bean的装配管理(BeanFactory)
     > >
     > > spring-context : Spring context上下文 , 即IoC容器(ApplicationContext)
     > >
     > > spring-expression : spring 表达式语言

   - Spring AOP
     - spring-aop : 面向切面编程的应用模块 , 整合 ASM , CGLIB , JDK Proxy
     - spring-aspects : 集成 AspectJ , AOP应用框架
     - spring-instrument : 动态Class Loding 模块
   - Spring Data Access
     - spring-jdbc : spring对JDBC的封装 , 用于简化jdbc操作
     - spring-orm : java对象与数据库数据的映射框架
     - spring-oxm : 对象与XML文件的映射框架
     - spring-jms : Spring 对Java Message Services(Java消息服务)的封装 , 用于服务之间的相互通信
     - spring-tx : spring jdbc事务管理
   - Spring Web
     - spring-web : 最基础的Web支持, 建立于spring-context 之上 , 通过servlet或listener来初始化IOC容器
     - spring-webmvc : 实现web mvc
     - spring-websocket : 与前端的全双工通信协议
     - spring-webflux : spring5.0提供 , 用于取传统java servlet ,非阻塞式Reactive Web 框架, 异步, 非阻塞 , 事件驱动的服务
   - Spring Messege
     - spring-messaging : spring 4.0 提供, 为spring继承一些基础的报文传送服务
   - Spring Test
     - spring-test : 集成测试支持 , 主要是对junit 的封装

###### 5. Spring6要求JDK版本最低17





### 2. 入门

###### 1. 程序开发

- 添加依赖

  ```xml
  <dependencies>
      <!--spring context依赖-->
      <!--当你引入Spring Context依赖之后，表示将Spring的基础依赖引入了-->
      <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-context</artifactId>
          <version>6.0.2</version>
      </dependency>
  
      <!--junit5测试-->
      <dependency>
          <groupId>org.junit.jupiter</groupId>
          <artifactId>junit-jupiter-api</artifactId>
          <version>5.3.1</version>
      </dependency>
  </dependencies>
  ```

- 创建java类

  ```java
  package com.f434.spring6.bean;
  
  public class HelloWorld {
      
      public void sayHello(){
          System.out.println("helloworld");
      }
  }
  ```

- 创建配置文件

  > 在resources目录创建一个 Spring 配置文件 xxx.xml

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
  
      <!--
      配置HelloWorld所对应的bean，即将HelloWorld的对象交给Spring的IOC容器管理
      通过bean标签配置IOC容器所管理的bean
      属性：
          id：设置bean的唯一标识
          class：设置bean所对应类型的全类名
  	-->
      <bean id="helloWorld" class="com.f434.spring6.bean.HelloWorld"></bean>
      
  </beans>
  ```

- 创建测试类测试

  ```java
  package com.f434.spring6.bean;
  
  import org.junit.jupiter.api.Test;
  import org.springframework.context.ApplicationContext;
  import org.springframework.context.support.ClassPathXmlApplicationContext;
  
  public class HelloWorldTest {
  
      @Test
      public void testHelloWorld(){
          ApplicationContext ac = new ClassPathXmlApplicationContext("beans.xml");
          HelloWorld helloworld = (HelloWorld) ac.getBean("helloWorld");
          helloworld.sayHello();
      }
  }
  ```

- 程序分析

  - 创建对象时调用个无参构造
  - 通过反射机制用无参数构造方法创建对象
