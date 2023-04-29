---
title: MyBatis入门
date: 2023-01-29 23:28:55
tags: 框架
index_img: /img/blog_img/mybatis.jpg
---

### 一. [MyBatis](https://github.com/mybatis/mybatis-3)简介

- MyBatis历史
  - MyBatis最初是Apache的一个开源项目iBatis, 2010年6月这个项目由Apache Software Foundation迁 移到了Google Code。随着开发团队转投Google Code旗下， iBatis3.x正式更名为MyBatis。代码于 2013年11月迁移到Github
  - iBatis一词来源于“internet”和“abatis”的组合，是一个基于Java的持久层框架。 iBatis提供的持久层框架 包括SQL Maps和Data Access Objects（DAO）。
- MyBatis特性
  - MyBatis 是支持定制化 SQL、存储过程以及高级映射的优秀的持久层框架
  - MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集
  - MyBatis可以使用简单的XML或注解用于配置和原始映射，将接口和Java的POJO（Plain Old Java Objects，普通的Java对象）映射成数据库中的记录
  - MyBatis 是一个 半自动的ORM（Object Relation Mapping）框架
- 持久化层技术对比
  - JDBC
    - SQL 夹杂在Java代码中耦合度高，导致硬编码内伤 
    - 维护不易且实际开发需求中 SQL 有变化，频繁修改的情况多见 
    - 代码冗长，开发效率低
  - Hibernate 和 JPA
    - 操作简便，开发效率高 
    - 程序中的长难复杂 SQL 需要绕过框架 
    - 内部自动生产的 SQL，不容易做特殊优化 
    - 基于全映射的全自动框架，大量字段的 POJO 进行部分映射时比较困难。 
    - 反射操作太多，导致数据库性能下降
  - MyBatis
    - 轻量级，性能出色 
    - SQL 和 Java 编码分开，功能边界清晰。Java代码专注业务、SQL语句专注数据 
    - 开发效率稍逊于HIbernate，但是完全能够接受



### 二. 搭建MyBatis

- 创建Maven工程

  - 打包方式

    ```xml
    <packaging>jar</packaging>
    ```

  - 引入依赖

    ```xml
    <dependencies>
        <!-- Mybatis核心 -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.7</version>
        </dependency>
        <!-- junit测试 -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <!-- MySQL驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.3</version>
        </dependency>
    </dependencies>
    
    ```

- 创建MyBatis核心配置文件

  >推荐配置文件命名: mybatis-config.xml
  >
  >核心配置文件主要用于配置连接数据库的环境以及MyBatis的全局配置信息
  >
  >核心配置文件存放的位置是src/main/resources目录下

  ```xml
  <?xml version="1.0" encoding="UTF-8" ?>
  <!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
  <configuration>
      
      <!--设置连接数据库的环境-->
      <environments default="development">
          <environment id="development">
              <transactionManager type="JDBC"/>
              <dataSource type="POOLED">
                  <property name="driver" value="com.mysql.jdbc.Driver"/>
                  <property name="url"value="jdbc:mysql://localhost:3306/MyBatis"/>
                  <property name="username" value="root"/>
                  <property name="password" value="123456"/>
              </dataSource>
          </environment>
      </environments>
  
      <!--引入映射文件-->
      <mappers>
      	<mapper resource="mappers/UserMapper.xml"/>
      </mappers>
  </configuration>
  ```

- 创建Mapper接口

  > MyBatis中的mapper接口相当于以前的dao。区别在于，mapper仅仅是接口,不需要提供实现类。

  ```java
  public interface UserMapper {
      /**
      * 添加用户信息
      */
      int insertUser();
  }
  ```

- 创建MyBatis的映射文件

  > ORM（Object Relationship Mapping）对象关系映射。
  >
  > - 对象：Java的实体类对象
  >
  > - 关系：关系型数据库
  >
  > - 映射：二者之间的对应关系
  >
  >   | java | 数据库    |
  >   | ---- | --------- |
  >   | 类   | 表        |
  >   | 属性 | 字段 / 列 |
  >   | 对象 | 记录 / 行 |
  >
  > - 映射文件命名规则
  >
  >   - 表所对应的实体类的类名+Mapper.xml 
  >
  >     > 表t_user，映射的实体类为User，所对应的映射文件为UserMapper.xml
  >     >
  >     > 因此一个映射文件对应一个实体类，对应一张表的操作
  >     >
  >     > MyBatis映射文件用于编写SQL，访问以及操作表中的数据
  >     >
  >     > MyBatis映射文件存放的位置是src/main/resources/mappers目录下
  >
  >   - <font color='red'>两个一致</font>
  >
  >     > mapper接口的全类名和映射文件的命名空间（namespace）保持一致
  >     >
  >     > mapper接口中方法的方法名和映射文件中编写SQL的标签的id属性保持一致

  ```xml
  <?xml version="1.0" encoding="UTF-8" ?>
  <!DOCTYPE mapper
      PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
      "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
  
  <mapper namespace="com.f434.mapper.UserMapper">
      
      <!--int insertUser();-->
      <insert id="insertUser">
      	insert into t_user values(null,'张三','123',23,'女')
      </insert>
  </mapper>
  ```

- junit测试功能

  ```java
  public class mybatisTest {
  
      @Test
      public void insertTest() throws IOException {
  //      获取核心配置文件的输入流
          InputStream is = Resources.getResourceAsStream("mybatis-conf.xml");
  //      获取sqlSessionFactoryBuilder
          SqlSessionFactoryBuilder sfb = new SqlSessionFactoryBuilder();
  //      获取SqlSessionFactory
          SqlSessionFactory sqlSessionFactory = sfb.build(is);
  //      获取Sql的会话对象,mybatis提供的操作数据库的对象
          SqlSession sqlSession = sqlSessionFactory.openSession();
  //      获取UserMapper接口的 代理 实现类对象
          userMapper mapperImpl = sqlSession.getMapper(userMapper.class);
  //      调用mapper接口中的方法,来实现添加
          int i = mapperImpl.insertUser();
          System.out.println("结果:" + i);
  
  //      提交事务
          sqlSession.commit();
  
  //      关闭sqlSession会话
          sqlSession.close();
      }
  
  }
  ```

  > SqlSession：代表Java程序和数据库之间的会话。（HttpSession是Java程序和浏览器之间的 会话）
  >
  > SqlSessionFactory：是“生产”SqlSession的“工厂”
  >
  > 工厂模式：如果创建某一个对象，使用的过程基本固定，那么我们就可以把创建这个对象的 相关代码封装到一个“工厂类”中，以后都使用这个工厂类来“生产”我们需要的对象。

- 加入log4j日志功能

  1. 加入依赖

     ```xml
     <!-- log4j日志 -->
     <dependency>
         <groupId>log4j</groupId>
         <artifactId>log4j</artifactId>
         <version>1.2.17</version>
     </dependency>
     ```

     2. 加入log4j的配置文件

        > log4j的配置文件名为log4j.xml，存放的位置是src/main/resources目录下
        >
        > > 日志级别(从左到右打印的内容越来越详细)
        > >
        > > FATAL(致命)>ERROR(错误)>WARN(警告)>INFO(信息)>DEBUG(调试)

  ```xml
  <?xml version="1.0" encoding="UTF-8" ?>
  <!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
  <log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">
      <appender name="STDOUT" class="org.apache.log4j.ConsoleAppender">
          <param name="Encoding" value="UTF-8" />
          <layout class="org.apache.log4j.PatternLayout">
              <param name="ConversionPattern" value="%-5p %d{MM-dd HH:mm:ss,SSS}%m (%F:%L) \n" />
          </layout>
      </appender>
      <logger name="java.sql">
          <level value="debug" />
      </logger>
      <logger name="org.apache.ibatis">
          <level value="info" />
      </logger>
      <root>
          <level value="debug" />
          <appender-ref ref="STDOUT" />
      </root>
  </log4j:configuration>
  
  ```

  ### 三. 核心配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--
      MyBatis核心配置文件中,标签的顺序
        (
         properties?,settings?,typeAliases?,typeHandlers?,objectFactory?,objectWrapperFactory?,
         reflectorFactory?,plugins?,environments?,databaseIdProvider?,mappers?
         )
-->


<!--    引入properties , 以${属性名}来访问属性值-->
    <properties resource="jdbc.properties"/>


    <settings>
        <!--将表中字段的下划线自动转换为驼峰-->
        <setting name="mapUnderscoreToCamelCase" value="true"/>

        <!--开启延迟加载-->
        <setting name="lazyLoadingEnabled" value="true"/>
    </settings>

<!--   typeAlias: 设置类型别名
             属性:
                type: 设置需要设置别名的类型
                alias: 设置某个类型的别名(如果不设置该属性, 那么该类型拥有默认的别名,即类名, 且不区分大小写)
-->
    <typeAliases>
<!--    <typeAlias type="com.f434.pojo.User" alias="user"></typeAlias> -->
<!--    以包为单位, 将包下所有的类型设置默认的类型别名,即类名, 且不区分大小写-->
        <package name="com.f434.pojo" />

    </typeAliases>
    



<!--    environments: 配置连接多个数据库环境
            属性:
                default: 设置默认使用的数据库环境
-->
    <environments default="development">

<!--    environment : 配置某个具体的数据库环境
            属性:
                id :表示连接数据库环境的唯一标识,(不能重复)
-->
        <environment id="development">

<!--    transactionManager: 设置事务管理方式
            属性:
                type="JDBC|MANAGED"
                    JDBC: 表示当前环境中,执行SQL时,使用的是JDBC中原生的事务管理方式(事务的提交或者回滚需要手动处理)
                    MANAGED: 被管理 , 例如Spring
-->
            <transactionManager type="JDBC"/>

<!--    dataSource : 配置数据源
            属性:
                type: 设置数据源的类型
                type = "POOLED|UNPOOLED|JNDI"
                    POOLED: 使用数据库连接池，即会将创建的连接进行缓存，下次使用可以从缓存中直接获取，不需要重新创建
                    UNPOOLED: 不使用数据库连接池，即每次使用连接都需要重新创建
                    JNDI: 使用上下文中的数据源
-->
            <dataSource type="POOLED">
                <!--设置驱动类的全类名-->
                <property name="driver" value="${jdbc.driver}"/>
                <!--设置连接数据库的连接地址-->
                <property name="url" value="${jdbc.url}"/>
                <!--设置连接数据库的用户名-->
                <property name="username" value="${jdbc.username}"/>
                <!--设置连接数据库的密码-->
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>




<!--    引入映射文件-->
<!--    同级目录-->
    <mappers>
<!--    <mapper resource="mappers/UserMapper.xml"/>-->

<!--    package : 以包为单位引入映射文件
            要求:
                1. mapper接口所在的包要和映射文件所在的包一致
                2. mapper接口要和映射文件的名字保持一致
-->
        <package name="com.f434.mapper"/>
    </mappers>
</configuration>

```



### 四. MyBatis增删改查

1. 添加

   ```xml
   <!--    int insertUser();-->
       <insert id="insertUser" >
           insert into t_user values(null , "admin" , "123456" , 23 , "男" , "yanchaoyu@gmail.com");
       </insert>
   ```

   

2. 删除

   ```xml
   <!--    int delUser();-->
       <delete id="delUser">
           delete from t_user where id = 3;
       </delete>
   ```

   

3. 修改

   ```xml
   <!--    int changeUser();-->
       <update id="changeUser">
           update t_user set username='zhangsan' where id = 4;
       </update>
   ```

   

4. 查询

   - 查询一个实体类对象

     ```xml
     <!--     User queryUserById();-->
     <!--    查询功能的标签必须设置resultType或者resultMap
                     resultType :设置默认的映射关系
                     resultMap : 设置自定义的映射关系
     
     -->
         <select id="queryUserById" resultType="user">
             select * from t_user where id = 4;
         </select>
     ```

   - 查询集合

     ```xml
     <!--    List<User> queryUser();-->
         <select id="queryUser" resultType="user">
             select * from t_user;
         </select>
     
         <!--
             当查询的数据为多条时，不能使用实体类作为返回值，只能使用集合
             否则会抛出异常TooManyResultsException；
             但是若查询的数据只有一条，可以使用实体类或集合作为返回值
         -->
     ```


     ### <font color='red'>五. MyBatis获取参数值的两种方式</font>

> MyBatis获取参数的两种方式`${}`和`#{}`
>
> <font color='cornflowerblue'>${}的本质就是字符串拼接</font>
>
> <font color='cornflowerblue'>#{}的本质就是占位符赋值</font>
>
> ${}使用字符串拼接的方式拼接sql，若为字符串类型或日期类型的字段进行赋值时，需要手动加单引 号；但是#{}使用占位符赋值的方式拼接sql，此时为字符串类型或日期类型的字段进行赋值时，可以<font color='red'>自动</font>添加单引号

1. 单个字面量类型的参数

   - 可以使用${}和#{}以任意的名称获取参数的值，注意${}需要手动加单引号

     ```xml
     <!--    User queryUserByUserName(String username)-->
         <select id="queryUserByUserName" resultType="user">
             <!--select * from t_user where username = #{username};-->
             select * from t_user where username = '${username}';
         </select>
     ```

2. 多个字面量类型的参数

   - MyBatis会自动将这些参数放在一个map集合中，以arg0,arg1...为键，以参数为值；以 param1,param2...为键，以参数为值；因此只需要通过${}和#{}访问map集合的键就可以获取相对应的 值，注意${}需要手动加单引号

     ```xml
     <!--    User checkLogin(String username , String password);-->
         <select id="checkLogin" resultType="user">
             <!--select * from t_user where username = #{arg0} and password = #{arg1} and age = #{arg2};-->
             select * from t_user where username = '${arg0}' and password = '${arg1}' and age = '${arg2}';
         </select>
     ```

3. map集合类型的参数

   - 若mapper接口中的方法需要的参数为多个时，此时可以手动创建map集合，将这些数据放在map中 只需要通过${}和#{}访问map集合的键就可以获取相对应的值，注意${}需要手动加单引号

     ```xml
     <!--    User queryUserByNameAndPass(Map<String , Object> datas);-->
         <select id="queryUserByNameAndPass" resultType="user">
             select *from t_user where username = #{username} and password = #{password};
         </select>
     ```

4. 实体类类型参数

   - 使用${}和#{}，通过访问实体类对象中的属性名获取属性值，注意${}需要手动加单引号

     ```xml
         <!--    User queryUserBypojo(User u);-->
         <select id="queryUserBypojo" resultType="user">
             select * from t_user where username = #{username} and password = #{password};
         </select>
     ```

5. 使用@Param标识参数

   - 可以通过@Param注解标识mapper接口中的方法参数 此时，会将这些参数放在map集合中，以@Param注解的value属性值为键，以参数为值；以 param1,param2...为键，以参数为值；只需要通过${}和#{}访问map集合的键就可以获取相对应的值， 注意${}需要手动加单引号

     ```xml
         <!--    User queryUserByParam(@Param("user") String username , @Param("pass") String password);-->
         <select id="queryUserByParam" resultType="user">
             select * from t_user where username = #{user} and password = #{pass};
         </select>
     ```



### 六. MyBatis的各种查询功能

1. 查询一个实体类对象

   ```java
       /**
        * 根据ID查询数据
        */
       List<User> getUserById(@Param("id") int id);
   ```

   ```xml
   <!--    User getUserById(@Param("id") int id);-->
       <select id="getUserById" resultType="user">
           select * from t_user where id = #{id};
       </select>
   ```

2. 查询一个list集合

   ```java
       /**
        * 查询所有用户信息
        */
       List<User> getAllUser();
   ```

   ```xml
   <!--    List<User> getAllUser();-->
       <select id="getAllUser" resultType="user">
           select * from t_user;
       </select>
   ```

3. 查询单个数据

   ```java
       /**
        *查询总条目
        */
       int getCount();
   ```

   ```xml
   <!--    int getCount();-->
       <select id="getCount" resultType="int">
           select count(*) from t_user;
       </select>
   ```

4. 查询一条数据为map集合

   ```java
       /**
        * 根据ID查询数据
        */
       Map<String , Object> getUserByIdAndMap(@Param("id") int id);
   ```

   ```xml
   <!--    Map<String , Object> getUserByIdAndMap(@Param("id") int id);-->
       <select id="getUserByIdAndMap" resultType="map">
           select * from t_user where id = #{id};
       </select>
   ```

5. 查询多条数据为map集合

   - 法一:

     ```java
         /**
          * 查询所有用户信息存入Map
          * 将表中的数据以map集合的方式查询，一条数据对应一个map；若有多条数据，就会产生多个map集合，此时可以将这些map放在一个list集合中获取
          */
         List<Map<String , Object>> getAllUserToMap();
     ```

     ```xml
     <!--    Map<String , Object> getAllUserToMap();-->
         <select id="getAllUserToMap" resultType="user">
             select * from t_user;
         </select>
     ```

   - 法二:

     ```java
         /**
          * 查询所有用户信息存入Map
          *  将表中的数据以map集合的方式查询，一条数据对应一个map；若有多条数据，就会产生多个map集合，并且最终要以一个map的方式返回数据，此时需要通过@MapKey注解设置map集合的键，值是每条数据所对应的map集合
     	 *
          */
     
         @MapKey("id")
         Map<String , Object> getAllUserToMap();
     ```

     ```xml
     <!--    Map<String , Object> getAllUserToMap();-->
         <select id="getAllUserToMap" resultType="user">
             select * from t_user;
         </select>
     
     <!--
         查询结果:
             {
                 1={password=123456, sex=男, id=1, age=23, username=admin},
                 2={password=123456, sex=男, id=2, age=23, username=张三},
                 3={password=123456, sex=男, id=3, age=23, username=张三}
             }
     -->
     ```





### 七. 特殊SQL的执行

1. 模糊查询

   ```java
       /**
        * 根据用户名模糊查询
        */
       List<User> getUserByLike(@Param("username") String username);
   ```

   ```xml
   <!--List<User> getUserByLike(@Param("username") String username);-->
       <select id="getUserByLike" resultType="user">
   <!--    select * from t_user where username like '%${username}%';-->
   <!--    select * from t_user where username like concat('%' , #{username} , '%');-->
           select * from t_user where username like "%"#{username}"%";
       </select>
   ```

2. 批量删除

   ```java
       /**
        * 根据id批量删除
        */
       int delMore(@Param("ids") String ids);
   ```

   ```xml
   <!--    int delMore(@Param("ids") String ids);-->
       <delete id="delMore">
           delete from t_user where id in (${ids})
       </delete>
   ```

3. 动态设置表名

   ```java
       /**
        * 根据表名查询所有数据
        */
       List<User> getUserToTable(@Param("t_name") String t_name);
   ```

   ```xml
   <!--    List<User> getUserToTable(@Param("t_name") String t_name);-->
       <select id="getUserToTable" resultType="user">
           select * from ${t_name};
       </select>
   ```

4. 添加功能获取自增的主键

   > t_clazz(clazz_id,clazz_name) 
   >
   > t_student(student_id,student_name,clazz_id) 
   >
   > 1、添加班级信息
   >
   >  2、获取新添加的班级的id 
   >
   > 3、为班级分配学生，即将某学的班级id修改为新添加的班级的id

   ```java
       /**
        * 添加用户
        */
   
       int insertUser(User u);
   ```

   ```xml
   <!--    int insertUser(User u);
           useGeneratedKeys: 设置当前标签中的sql使用了自增的id
           keyProperty : 将自增的主键的值赋值给传输到映射文件中参数的某个属性 (自增信息由谁携带)
   
   -->
       <insert id="insertUser" useGeneratedKeys="true" keyProperty="id">
           insert into t_user values (null , #{username} , #{password} , #{age} , #{sex} , #{email});
       </insert>
   ```

  
### 八. 自定义映射resultMap

1. resultMap处理字段和属性的映射关系

   > 若字段名和实体类中的属性名不一致，则可以通过resultMap设置自定义映射

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE mapper
           PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
           "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
   <!--
    Mybatis面向接口的两个一致
         1. 映射文件的nameSpace 要和 mapper接口的全类名保持一致
         2. 映射文件中SQL语句的id要和mapper接口中的方法名保持一致
   -->
   <mapper namespace="com.f434.mapper.EmpMapper">
   
       <!--
           resultMap: 自定义映射关系
               id: 唯一标识,不能重复
               type: 设置映射关系中的实体类类型
               子标签
                   id: 设置主键的映射关系
                   result: 设置普通字段的映射关系
   				association：设置多对一的映射关系
   				collection：设置一对多的映射关系
                   属性:
                       property: 设置映射关系中的属性名,必须是type属性所设置的实体类类中的属性名
                       column: 设置映射关系中的字段名 , 必须是SQL语句查询出的字段名
   
   
       -->
       
       <resultMap id="empResultMap" type="Emp">
           <id property="eid" column="eid"></id>
           <result property="empName" column="emp_name"></result>
           <result property="age" column="age"></result>
           <result property="sex" column="sex"></result>
           <result property="email" column="email"></result>
           <result property="did" column="did"></result>
       </resultMap>
   
   <!--    List<Emp> getAllEmp();-->
       <select id="getAllEmp" resultMap="empResultMap">
           select * from t_emp;
       </select>
   
       <select id="getAllEmpOld" resultType="Emp">
   <!--    select eid , emp_name empName , age , sex , email , did from t_emp;-->
           select * from t_emp;
       </select>
   
   
   </mapper>
   ```

   > 若字段名和实体类中的属性名不一致，但是字段名符合数据库的规则（使用_），实体类中的属性 名符合Java的规则（使用驼峰）,解决方式:
   >
   > 1. 可以通过为字段起别名的方式，保证和实体类中的属性名保持一致
   >
   > 2. 可以在MyBatis的核心配置文件中设置一个全局配置信息mapUnderscoreToCamelCase，可 以在查询表中数据时，自动将_类型的字段名转换为驼峰
   >
   >    例如 : user_name 将会自动转化成 userName

2. 多对一映射处理

   1. 级联方式处理映射关系(联级属性赋值)

      ```xml
      <!--Emp getEmpAndDept(@Param("eid") Integer eid);-->
      
          <!--处理多对一映射关系方式一: 级联属性赋值-->
          <resultMap id="empAndDeptResultMap01" type="Emp">
              <id property="eid" column="eid"></id>
              <result property="empName" column="emp_name"></result>
              <result property="age" column="age"></result>
              <result property="sex" column="sex"></result>
              <result property="email" column="email"></result>
      
              <!--通过级联属性解决多对一的映射关系-->
              <result property="dept.did" column="did"></result>
              <result property="dept.deptName" column="dept_name"></result>
          </resultMap>
      
          <select id="getEmpAndDept" resultMap="empAndDeptResultMap01">
              select * from t_emp left join t_dept on t_emp.did = t_dept.did where t_emp.eid = #{eid}
          </select>
      ```

   2. 使用association处理映射关系

      ```xml
          <!--处理多对一映射关系方式二: association-->
          <resultMap id="empAndDeptResultMap02" type="Emp">
              <id property="eid" column="eid"></id>
              <result property="empName" column="emp_name"></result>
              <result property="age" column="age"></result>
              <result property="sex" column="sex"></result>
              <result property="email" column="email"></result>
              <!--
              association : 处理多对一的映射关系
              property : 需要来处理多对一的映射关系属性名
              javaType : 该属性的类型
              -->
              <association property="dept" javaType="Dept">
                  <id property="did" column="did"></id>
                  <result property="deptName" column="dept_name"></result>
              </association>
          </resultMap>
      
      
          <select id="getEmpAndDept" resultMap="empAndDeptResultMap02">
              select * from t_emp left join t_dept on t_emp.did = t_dept.did where t_emp.eid = #{eid}
          </select>
      ```

      3. 分步查询

      1. 第一步:查询员工信息

         ```java
             /**
              * 通过分步查询员工信息,以及员工所对应的部门
              * 分步第一步: 先查询员工信息
              */
             Emp getEmpAndDeptByStepOne(@Param("eid") Integer eid);
         ```
   
         ```xml
          <!--Emp getEmpAndDeptByStepOne(@Param("eid") Integer eid);-->
             <resultMap id="empAndDeptByStepResultMap" type="Emp">
                 <id property="eid" column="eid"></id>
                 <result property="empName" column="emp_name"></result>
                 <result property="age" column="age"></result>
                 <result property="sex" column="sex"></result>
                 <result property="email" column="email"></result>
         
                 <!--
                 select : 设置分步查询的sql唯一标识(nameSpace.SQLid或mapper接口的全类名.方法名)
                 column : 设置分步查询的条件 根据哪个字段查询(did是Emp中对应Dept的id值，并传参给DeptMapper中定义的getDeptAndEmpByStepTow)
                 fetchType : 当开启了全局的延迟加载之后 , 可通过此属性手动控制延迟加载的效果(开启了全局的延迟加载之后)
                     fetchType="lazy|eager" :
                 -->
         
                 <association property="dept"
                              select="com.f434.mapper.DeptMapper.getEmpAndDeptByStepTwo"
                              column="did"
                              fetchType="eager"></association>
         
             </resultMap>
             <select id="getEmpAndDeptByStepOne" resultMap="empAndDeptByStepResultMap">
                 select * from t_emp where eid = #{eid};
             </select>
         ```
   
      2. 根据第一步查询出的部门id来查询出该部门下对应的员工
   
         ```java
             /**
              * 通过分步查询员工信息,以及员工所对应的部门
              * 分步第二步: 通过did查询员工对应的部门
              */
             Dept getEmpAndDeptByStepTwo(@Param("did") Integer did);
         ```
   
         ```xml
             <!--List<Emp> getDeptAndEmpByStepTow(@Param("did") Integer did);-->
             <select id="getDeptAndEmpByStepTow" resultType="Emp">
                 select * from t_emp where did = #{did};
             </select>
         ```
   
      
   
      
   
      3. 一对多映射处理
   
         1. collection
   
            ```java
                /**
                 * 获取部门以及部门中所有的员工信息
                 */
            
                Dept getDeptAndEmp(@Param("did") Integer did);
            ```
   
            ```xml
             <!--Dept getDeptAndEmp(@Param("did") Integer did);-->
                <resultMap id="getDeptAndEmpResultMap" type="Dept">
                    <id property="did" column="did"></id>
                    <result property="deptName" column="dept_name"></result>
            
            
            
                    <!--
                    collection: 处理一对多的关系属性
                    ofType : 表示该属性所对应的集合中存储数据的类型(由集合类型决定)
                    -->
                    <collection property="emps" ofType="Emp">
                        <id property="eid" column="eid"></id>
                        <result property="empName" column="emp_name"></result>
                        <result property="age" column="age"></result>
                        <result property="sex" column="sex"></result>
                        <result property="email" column="email"></result>
            
                    </collection>
                </resultMap>
            
                <select id="getDeptAndEmp" resultMap="getDeptAndEmpResultMap">
                    select * from t_dept left join t_emp on t_dept.did = t_emp.did where t_dept.did = #{did};
                </select>
            ```
   
         2. 分步查询
   
            1. 查询部门信息
   
                ```java
                    /**
                     * 通过分步查询, 查询出部门下的员工
                     * 分步查询第一步 : 查询部门信息
                     */
                    Dept getDeptAndEmpStepOne(@Param("did") Integer did);
                ```

                ```xml
                <!--Dept getDeptAndEmpStepOne(@Param("did") Integer did);-->
                    <resultMap id="deptAndEmpStepResultMap" type="Dept">
                        <id property="did" column="did"></id>
                        <result property="deptName" column="dept_name"></result>
                
                        <collection property="emps"
                                    select="com.f434.mapper.EmpMapper.getDeptAndEmpByStepTow"
                                    column="did"></collection>
                    </resultMap>
                    <select id="getDeptAndEmpStepOne" resultMap="deptAndEmpStepResultMap">
                        select * from t_dept where did = #{did};
                    </select>
                ```
   
            2. 再根据部门id查询部门中的员工
            
                ```java
                    /**
                     * 通过分步查询, 查询出部门下的员工
                     * 分步查询第二步 : 根据did查询员工信息
                     */
                    List<Emp> getDeptAndEmpByStepTow(@Param("did") Integer did);
                ```
            
                ```xml
                    <!--List<Emp> getDeptAndEmpByStepTow(@Param("did") Integer did);-->
                    <select id="getDeptAndEmpByStepTow" resultType="Emp">
                        select * from t_emp where did = #{did};
                    </select>
                ```
            
                > 分步查询的优点：<font color='cornflowerblue'>可以实现延迟加载，但是必须在核心配置文件中设置全局配置信息</font>：
                >
                > ​	lazyLoadingEnabled：延迟加载的全局开关。当开启时，所有关联对象都会延迟加载
                >
                > ​	aggressiveLazyLoading：当开启时，任何方法的调用都会加载该对象的所有属性。 否则，每个 属性会按需加载
                >
                > ​	<font color='red'>实现按需加载，获取的数据是什么，就只执行相应的sql。</font>
            
      
      
      
      
      
      
      ### 九. 动态SQL
      
      > 根据特定条件动态拼装SQL语句的功能，它存在的意义是为了解决 拼接SQL语句字符串时的痛点问题
      
      1. if
      
         > if标签可通过test属性的表达式进行判断，若表达式的结果为true，则标签中的内容会执行；反之标签中 的内容不会执行
         >
         > where 1 = 1解决where没有条件报错的问题
      
         ```xml
             <select id="getEmpByConditionOne" resultType="emp">
                 select * from t_emp where 1 = 1
                 <if test="empName != null and empName != ''">emp_name = #{empName}</if>
                 <if test="sex != null and sex != ''"> and sex = #{sex}</if>
                 <if test="age != null and age != ''"> and age = #{age}</if>
                 <if test="email != null and email != ''"> and email = #{email}</if>
             </select>
         ```
      
      2. where
      
         > where和if一般结合使用： 
         >
         > 1. 若where标签中的if条件都不满足，则where标签没有任何功能，即不会添加where关键字 
         >
         > 2. 若where标签中的if条件满足，则where标签会自动添加where关键字，并将条件最前方多余的 and去掉 
         > 3. 注意：where标签不能去掉条件最后多余的and
      
         ```xml
             <select id="getEmpByConditionTwo" resultType="emp">
                 select * from t_emp
                <where>
                    <if test="empName != null and empName != ''">emp_name = #{empName}</if>
                    <if test="sex != null and sex != ''"> and sex = #{sex}</if>
                    <if test="age != null and age != ''"> and age = #{age}</if>
                    <if test="email != null and email != ''"> and email = #{email}</if>
                </where>
         
             </select>
         ```
      
      3. trim
      
         > trim用于去掉或添加标签中的内容 
         >
         > 1. prefix：在trim标签中的内容的前面添加某些内容 
         > 2. prefixOverrides：在trim标签中的内容的前面去掉某些内容 
         > 3. suffix：在trim标签中的内容的后面添加某些内容 
         > 4. suffixOverrides：在trim标签中的内容的后面去掉某些内容
      
         ```xml
             <select id="getEmpByCondition" resultType="emp">
                 select <include refid="EmpColumns"></include> from t_emp
                 <trim prefix="where" suffixOverrides="and|or">
                     <if test="empName != null and empName != ''">emp_name = #{empName} and</if>
                     <if test="sex != null and sex != ''"> sex = #{sex} and</if>
                     <if test="age != null and age != ''">  age = #{age} and</if>
                     <if test="email != null and email != ''">  email = #{email}</if>
                 </trim>
         
             </select>
         ```
      
      4. choose when otherwise
      
         > choose、when、otherwise相当于if...else if..else
         >
         >  when:至少有一个  otherwise: 至多有一个
      
         ```xml
             <!--List<Emp> getEmpByChoose(Emp emp);-->
             <select id="getEmpByChoose" resultType="Emp">
                 select * from t_emp
                 <where>
                     <choose>
                         <when test="empName != null and empName != ''">emp_name = #{empName}</when>
                         <when test="sex != null and sex != ''">sex = #{sex}</when>
                         <when test="age != null and age != ''">age = #{age}</when>
                         <when test="email != null and email != ''">email = #{email}</when>
                         <otherwise> eid = 5</otherwise>
                     </choose>
                 </where>
             </select>
         ```
      
      5. foreach
      
         > 1. collection：设置要循环的数组或集合 
         > 2. item：表示集合或数组中的每一个数据 
         > 3. separator：设置循环体之间的分隔符 
         > 4. open：设置foreach标签中的内容的开始符 
         > 5. close：设置foreach标签中的内容的结束符
      
         ```xml
             <!--int delMoreByArray(@Param("eids") Integer[] eids);-->
             <delete id="delMoreByArray">
                 <!--delete from t_emp where eid in
                 <foreach collection="eids" item="eid" separator="," open="(" close=")" >#{eid}</foreach>-->
         
                 delete from t_emp where
                 <foreach collection="eids" item="eid" separator="or">eid = #{eid}</foreach>
         
         
             </delete>
         ```
      
      6. SQL片段
      
         > sql片段，可以记录一段公共sql片段，在使用的地方通过include标签进行引入
      
         ```xml
             <!--sql片段-->
             <sql id="EmpColumns">eid , emp_name , age , sex , email</sql>
         
         	select <include refid="EmpColumns"></include> from t_emp
         ```
      
         
      
         
      
      ### <font color='red'>十. MyBatis的缓存</font>
      
      #### 1. MyBatis的一级缓存
      
      - ​	一级缓存是<font color='red'>SqlSession级别的</font>，通过同一个SqlSession查询的数据会被缓存，下次查询相同的数据，就 会从缓存中直接获取，不会从数据库重新访问
      - 使一级缓存失效的四种情况：
        - 不同的SqlSession对应不同的一级缓存
        - 同一个SqlSession但是查询条件不同 
        - 同一个SqlSession两次查询期间执行了任何一次增删改操作
        - 同一个SqlSession两次查询期间手动清空了缓存
      
      
      
      #### 2.MyBatis的二级缓存
      
      - 二级缓存是SqlSessionFactory级别，通过同一个SqlSessionFactory创建的SqlSession查询的结果会被 缓存；此后若再次执行相同的查询语句，结果就会从缓存中获取
      - 开启条件:
        - 在核心配置文件中，设置全局配置属性cacheEnabled="true"，默认为true，不需要设置
        - 在映射文件中设置标签
        - 二级缓存必须在SqlSession关闭或提交之后有效
        - 查询的数据所转换的实体类类型必须实现序列化的接口
      - 使二级缓存失效的情况：
        - 两次查询之间执行了任意的增删改，会使一级和二级缓存同时失效
      
      -------
      
      
      
         ....................未完........................
      








