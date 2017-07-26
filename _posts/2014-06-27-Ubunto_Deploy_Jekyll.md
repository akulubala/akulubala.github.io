---
title: Ubunto Deploy Jekyll
layout: post
category: system
---

 1. Download and install ruby
        
        sudo mkdir Downloads
        curl -O http://cache.ruby-lang.org/pub/ruby/2.1/ruby-2.1.2.tar.gz 
        tar -zxvf ruby-2.1.2.tar.gz -C ../
        cd ..
        sudo chown -R ray ruby-2.1.2
        sudo chgrp -R ray ruby-2.1.2
        cd ruby-2.1.2

        ./configure  ---->error no gcc installed
    
    Install gcc
    
        sudo apt-get install gcc
        gcc -v ---->gcc version 4.8.2
        sudo apt-get install build-essential -->this is needed for gcc to find software infomation 
        
        ./configure
        sudo make&make install
    
    Install rubygem
    
        culr -O http://production.cf.rubygems.org/rubygems/rubygems-2.3.0.tgz
        tar -zxvf rubygems-2.3.0.tgz -C ../
        sudo chown -R ray rubygems-2.3.0
        sudo chgrp -R ray rubygems-2.3.0

 2. Install jekyll
    
    OK...stupid things came out:

    **first error said i need zlib..**
    
    then install zlib
    
        sudo apt-get install zlib1g-dev
    
    and rebuild ruby ,rubygems
    
    **Second error said i need openssl**
     because i do not have openssl installed..
     
        sudo apt-get install libssl0.9.8
        sudo apt-get install libssl-dev
    
    then rebuild ruby,ruby gems..
    
    Third error said need javascript runtime..
    here have some illustration [https://github.com/jekyll/jekyll/issues/2327][1]
    but i think it's jekyll problem ,it's ask us use coffescript
    
        gem install execjs
        sudo apt-get install nodejs
    
    Finally,finished..

        jekyll -v --->ok

 3. Deploy my blog

        sudo apt-get install git
        git clone git@github.com:akulubala/akulubala.github.io.git
    
    some error because i don't have some plug-in defined in my Gemfile
    
        just gem install xx
        then ./deploy
    
    see my blog ok...
 4. SSH and Sftp
    
        sudo apt-get install openssh-server
        cd /etc/ssh/
        sudo cp sshd_config sshd_config.defaults_bak--->backup file
        sudo vim sshd_config
        unmake PasswordAuthentication 
        sudo restart ssh

    then open terminal :
    login system or filezila login

    [1]: https://github.com/jekyll/jekyll/issues/2327