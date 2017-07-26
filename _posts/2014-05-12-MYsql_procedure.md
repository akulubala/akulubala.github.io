---
title: Mysql 存储过程举例
layout: post
category: mysql
---

1. 创建过程：
    
   必须具有CREATE ROUTINE权限，并且ALTER ROUTINE和EXECUTE权限被自动授予它的创建者。
   两种方式，及参数语法说明：

        CREATE PROCEDURE sp_name ([proc_parameter[,...]])
            [characteristic ...] routine_body
         
        CREATE FUNCTION sp_name ([func_parameter[,...]])
            RETURNS type
            [characteristic ...] routine_body
            
            proc_parameter:
            [ IN | OUT | INOUT ] param_name type->IN 传入参数，OUT 传出参数,INOUT 即可传入又可传出
            
            func_parameter:
            param_name type
         
        type:
            Any valid MySQL data type
         
        characteristic:
            LANGUAGE SQL
          | [NOT] DETERMINISTIC
          | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
          | SQL SECURITY { DEFINER | INVOKER }
          | COMMENT 'string'
         
        routine_body:
            Valid SQL procedure statement or statements

2. 查看及删除

        查看：
        SHOW CREATE PROCEDURE `procedure name`
        SHOW CREATE FUNCTION  `function name`
        删除：
        DROP PROCEDURE/FUNCTION [if exists]  procedure/function_name   

3. 变量

        1) 用户变量：
        
        set @var 若没有指定GLOBAL 或SESSION ，那么默认将会定义用户变量，
        如 set @a =3,@a:=5；set @f := select f from table 
        用户变量跟mysql客户端是绑定的，设置的变量，只对当前用户使用的客户端生效
        
        2) 全局变量：
        
        定义时，以如下两种形式出现，set GLOBAL 变量名  或者  set @@global.变量名 
        对所有客户端生效。只有具有super权限才可以设置全局变量
        
        3) 局部变量：作用范围在begin到end语句块之间。在该语句块里设置的变量
        
        declare语句专门用于定义局部变量。set语句是设置不同类型的变量，包括会话变量和全局变量
        
        4) 会话变量：

        只对连接的客户端有效。set session varname = value; shwo session variable 来查看
 
4. 例一：


        DELIMITER $$ #定义结束标志
        DROP PROCEDURE IF EXISTS `pr_add`;$$
        #创建存储过程
        CREATE PROCEDURE `pr_add`()
             BEGIN
                   
                  declare n int default 0;   
                     declare bb int;
                  DECLARE cur_1 CURSOR FOR SELECT action_id FROM useraction where uid=xxx;//取得游标，相当于数字的key
                  DECLARE CONTINUE HANDLER FOR NOT FOUND SET n = 1;//如果记录取完，游标设置为1；
         
                  OPEN cur_1;
                  FETCH cur_1 INTO bb;
                  while n<>1 do           
                          replace into useraction set action_id=bb,uid=xxx;
                          FETCH cur_1 INTO bb; /*取下一条记录，游标每取一次会自动向后进一*/
                      end while;
                      close cur_1;
             END$$
        DELIMITER ;
        #调用存储过程
        CALL pr_add();
5. 例二

        DELIMITER $$ #定义结束标志
        
        DROP PROCEDURE IF EXISTS `curdemo`;$$
        
        #创建存储过程
        CREATE PROCEDURE curdemo()
        BEGIN
          DECLARE done INT DEFAULT 0;-->declare这个语句被用来声明局部变量。要给变量提供一个默认值，请包含一个DEFAULT子句
          DECLARE a CHAR(16);
          DECLARE b,c INT;
          DECLARE cur1 CURSOR FOR SELECT id,data FROM test.t1;-->申明光标cur1
          DECLARE cur2 CURSOR FOR SELECT i FROM test.t2;
          DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = 1;
         
          OPEN cur1;
          OPEN cur2;
          REPEAT-->REPEAT语句内的语句或语句群被重复，直至search_condition 为真
            FETCH cur1 INTO a, b;-->这个语句用指定的打开光标读取下一行（如果有下一行的话），并且前进光标指针。
            FETCH cur2 INTO c;
            IF NOT done THEN
               IF b < c THEN
                  INSERT INTO test.t3 VALUES (a,b);
               ELSE
                  INSERT INTO test.t3 VALUES (a,c);
               END IF;
            END IF;
          UNTIL done END REPEAT;
          CLOSE cur1;
          CLOSE cur2;
        END
  
6. 例三

        delimiter $$
        
        DROP PROCEDURE IF EXISTS `fs2_first_active_lottery`;$$
        
        CREATE PROCEDURE fs2_first_active_lottery (IN curr_l_time datetime,IN u_id varchar(45),OUT a_type tinyint(3) unsigned,OUT out_time datetime)
        
        BEGIN
        DECLARE curr_id INT;
        
        DECLARE counts_awards tinyint(3) unsigned  default 0;
        
        select sum(award_type) into counts_awards from fs2_first_active_lottery_records where user_id=u_id and award_type!=0 group by user_id for update;
        
        if counts_awards =0 then //还没有中过奖
        
        SELECT id,date_distribute,awards_type into curr_id,out_time,a_type FROM db_freestyle_event.fs2_first_active_awards_infos
        where date_distribute<curr_l_time and status='Y'  limit 1 for update;
        elseif counts_awards=1 then
        set a_type =2;
        
        SELECT id,date_distribute,awards_type into curr_id,out_time,a_type FROM db_freestyle_event.fs2_first_active_awards_infos         where date_distribute<curr_l_time and status='Y' and awards_type=a_type  limit 1 for update;
        elseif counts_awards=2 then
        set a_type =2;
        
        SELECT id,date_distribute,awards_type into curr_id,out_time,a_type FROM db_freestyle_event.fs2_first_active_awards_infos         where date_distribute<curr_l_time and status='Y' and awards_type=a_type  limit 1 for update;
        end if;
        
        update db_freestyle_event.fs2_first_active_awards_infos set status='N' where id=curr_id;
        END$$
        
        $call_procedure = sprintf("call fs2_first_active_lottery('%s','%s',@m1,@m2);",  $currDate,$this->uid);
        
         $sql = sprintf("select @m1 as award_type,@m2 as distribute_date");
         

官方文档：[http://dev.mysql.com/doc/refman/5.1/zh/stored-procedures.html][1]


  [1]: http://dev.mysql.com/doc/refman/5.1/zh/stored-procedures.html