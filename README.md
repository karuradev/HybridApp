HybridApp
=========

Instructions for building Karura Framework based apps


* Install homebrew (instructions can be found at http://brew.sh/)
* Download and unzip the latest version of Apache Ant (You can download the latest version from http://ant.apache.org/bindownload.cgi)
* Add ant to you path and define ANT_HOME=/path/to/apache-ant
* Download the source code for Karura and Sample app
----
git clone https://github.com/karuradev/HybridApp.git
git clone https://github.com/karuradev/karura.git
---
 Install wget using homebrew ( brew install wget)
6. wget http://www.beanshell.org/bsh-2.0b4.jar 
7. mv bsh-2.0b4.jar $ANT_HOME/lib
8. wget http://www.bizdirusa.com/mirrors/apache//commons/bsf/binaries/bsf-bin-2.4.0.zip
9. unzip bsf-bin-2.4.0.zip
10. mv bsf-2.4.0/lib/bsf.jar ~/ant/lib/
11. wget http://mirrors.sonic.net/apache//commons/logging/binaries/commons-logging-1.1.3-bin.zip
12. unzip commons-logging-1.1.3-bin.zip
13. mv commons-logging-1.1.3/*.jar ~/ant/lib/
14. cd HybridApp
15. ant debug



Intermediate Hybrid Application using Karura Framework


![Loading View](https://raw.github.com/karuradev/screenshots/master/hybrid_contacts/loading.png)

![Listview View](https://raw.github.com/karuradev/screenshots/master/hybrid_contacts/listview.png)

![Details View](https://raw.github.com/karuradev/screenshots/master/hybrid_contacts/details.png)

![Edit View](https://raw.github.com/karuradev/screenshots/master/hybrid_contacts/edit.png)

![Add View](https://raw.github.com/karuradev/screenshots/master/hybrid_contacts/add.png)

![Info View](https://raw.github.com/karuradev/screenshots/master/hybrid_contacts/info.png)


