---
title: Docker A LEMP With Laravel In Ubuntu
layout: post
category : docker
---
### Docker A LEMP With Laravel In Ubuntu

---

1. #### Set up docker, Documents from official site : [Docker.com](https://store.docker.com/editions/community/docker-ce-server-ubuntu?tab=description "Docker").
   - ##### Set up the repository
     {% highlight php %}
     ```
       sudo apt-get -y install \
       apt-transport-https \
       ca-certificates \
       curl

       curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \        sudo apt-key add -

       sudo add-apt-repository \
       "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
       $(lsb_release -cs) \
       stable"

       sudo apt-get update
     ```
     
     {% endhighlight %}
   - ##### Get Docker CE (community edition)

     {% highlight php %}
     ```
     sudo apt-get -y install docker-ce
     ```
     {% endhighlight %}
     
   - ##### Test your Docker CE installation
     {% highlight php %}
     ```
     sudo docker run hello-world
     ``` 
     {% endhighlight %}
     
   - ##### use non root user run docker command (add user ray to group docker)
     {% highlight php %}
     ```
     sudo usermod -aG docker ray
     ```
     {% endhighlight %}
   - ##### check user group (command will list ray to docker group)
     {% highlight php %}
     ```
     id ray
     ```
     {% endhighlight %}
2. #### Set up LEMP(linux,nginx,php,mysql) environment    
   ***basic we just need nginx, php, mysql run on a linux server***    
  **get access container:** `docker exec -it <container-id> /bin/bash`
  
    - ##### Create folder and files:
    
    - ##### Docker-Compose file: docker-compose.yml
      {% highlight php %}
      ```
      version: "3"
        services:
          nginx:
            container_name: docker-nginx
            image: nginx:latest
            ports:
              - "80:80"
            links:
              - php # links let service php can communicate with nginx
            volumes:
              - ./nginx:/etc/nginx/conf.d  # map nginx server to container server configuration
              - ./logs/nginx-error.log:/var/log/nginx/error.log  # map nginx error to local file
              - ./logs/nginx-access.log:/var/log/nginx/access.log # map nginx access log to local file
              - ./www:/var/www/html
          php:
            container_name: docker-php
            image: php:7.1-fpm
            build:
              context: ./php ## folder contains dockerfile definations
              dockerfile: Dockerfile ## dockerfile define php
            ports:
              - "9000:9000"
            links:
              - mysql
            volumes:                # map www foler to php server /var/www/html. note: because docker php
              - ./www:/var/www/html # make this folder as root folder, so this can't be changed
              - ./php/custom-php.ini:/usr/local/etc/php/custom-php.ini # use this map to change php.ini configuration
          mysql:
            container_name: docker-mysql
            image: mysql:5.7
            ports:
              - "3306:3306"
            environment:
              MYSQL_DATABASE: 'databasename'
              MYSQL_ROOT_PASSWORD: 'password'
            command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
        ```
     - ##### Dockfile defination
        ```
        FROM php:7.1-fpm
        RUN apt-get update && apt-get install -y \
                libfreetype6-dev \
                libjpeg62-turbo-dev \
                libmcrypt-dev \
                libpng12-dev \
            && docker-php-ext-install -j$(nproc) iconv mcrypt \
            && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
            && docker-php-ext-install -j$(nproc) gd \
            && docker-php-ext-install pdo pdo_mysql
        ```
        {% endhighlight %}
        By default, docker image php don't have 'pdo, pdo_mysql', so we define this dockfile
        install them by using `docker-php-ext-install pdo pdo_mysql`
        
    - ##### Test Installation
      
      After Create folder and finish docker-compose config,
      Just Run `docker-compose up -d`
      Then `docker-compose ps`
      
      get service status like this:
      
3. #### Set up laravel

    Set up Laravel don't need much extro operations. just run command 
    `laravel new laravel-example-site` under foler 'www'
    
    **Notice: composer and npm commands can just run from host machine, only if they are avaliable**
      
      
     
   
   
   
   
   