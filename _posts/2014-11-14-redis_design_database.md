---
layout: 'post'
title : redis数据库设计
category : redis
---
公司要用redis 做数据存储，主要业务是做图片处理，有这么几个成员：
>reference
>>这张表记录产品(image)	

>steps	
>>step记录图片和reference处理到哪一步

>history
>>history记录step变化详细

>company
>>company记录reference属于那个company

>member
>>member是公司员工

>group
>>员工所属的组

>work_limit
>>员工可以进行的工作

_ _ _

1. 首先设计reference表 

	reference 有detail,及多个image，存储reference以reference_id来唯一区别，detail有多个属性及值所以需要hash类型存储:	

        hset pp_reference:example_reference_id_1:detail saas_reference_code code_example_1 	reference_source source1 dist dist1 curr_step step1

    对于搜索的时候需要按时间排序，另外也有可能需要做分页搜索，时间搜索，因此我需要一个zset（可以做range操作）的集合来存储reference的插入时间，并且时间为score，且int型的timestemp，value为reference_id      
        zadd pp_reference:created_at 12354678(timestemp_example) example_reference_id

    对于reference对应的图片，因为是一对多的关系而且图片也有图片细节，所以每一个reference都将有一个set集合来存储图片的ID（图片详情也存hash并且先于reference存储）：

        sadd pp_reference:example_reference_id:image_id 1 2 12 3

    与reference的history也是一对多的关系，因此也需要存一个像上面图片一样的集合，集合里面存reference_history_id

        sadd pp_reference:example_reference_id:reference_history_id 1 2 12 3

    reference在查询的时候，不会按照id去查询所以需要有一个reference_code与ID的对应(*另外因为本身我这里的reference_id是从mysql取得的自增id所以这里不需要设置自增i*d)
    
        set pp_reference:reference_code_example_abc 123
    
    *reference 的结构基本就以以上这么一个方式存储*

    >-与reference相关的子集表:pp_images  
    
		`hmset pp_image:image_id_1:detail name abc.jpg size 1024k curr_step step2`	
        
	>由于image需要一个自增id所以还需要：	
    
        `setnx pp_image:image_auto_id 0`	
        `INCR pp_image:image_auto_id`	
        
    >这样每次存储前先执行这么一个语句取得该ID作为自增ID
    >-与reference相关子集表:pp_histtory	
    
        `hmset pp_history:pp_history_id_1:detail step_from step_1 step_to step_2  time 2014-06-06 10:10:10`	
        
    >同样的也需要一个自增id	
    
        `setnx pp_history:history_auto_id 0`
        `INCR pp_history:history_auto_id`	
        
    >查询日志set建立	
    
		`zadd pp_history:created_at 12354678(timestemp_example)  example_history_id	`	
        
    >使用redis desk manager结构图：
        ![redis_1](http://akulubala.github.io/public/images/2014/redis_design_1.png)

2. steps表	

    和reference一样存储多种数据，需要hash类型	
    
		hmset pp_step:step_1:step_detail name setp_1 isactive 1 description		 xxxxxx
        setnx pp_step:step_id 0
   
    > step 是单纯记录各个step意义，实际存放reference 所在step应该有以下设计	
    
    `sadd step_1:image image_id_1 image_id_2`
    `sadd step_1:reference reference_1 reference_2`	
    
    >这样当image或者reference的step变化的时候就直接从一个集合拿id到另一个集合，或者说删除一个/添加一个
>>结构图![redis_2](http://akulubala.github.io/public/images/2014/redis_design_2.png)

通过上面两个表的建立基本了解了如果建立redis数据库，其主要是需要了解redis各个数据结构的原理及使用范围。通过对应关系可以找出相关的数据这样就可以了。
	



