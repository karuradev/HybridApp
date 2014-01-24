HybridApp
=========

##Instructions for building Karura Framework based apps

1. Install homebrew - instructions can be found [here](http://brew.sh/)
2. Download and unzip the latest version of Apache Ant .You can download the latest version from [http://ant.apache.org/bindownload.cgi](http://ant.apache.org/bindownload.cgi)
3. Add ant to you path and define `export ANT_HOME=/path/to/apache-ant`
4. Download the source code for Karura and Sample app
`git clone https://github.com/karuradev/HybridApp.git`
`git clone https://github.com/karuradev/karura.git`
5. Install wget using homebrew ( `brew install wget`)
6. `wget http://www.beanshell.org/bsh-2.0b4.jar `
7. `mv bsh-2.0b4.jar $ANT_HOME/lib`
8. `wget http://www.bizdirusa.com/mirrors/apache//commons/bsf/binaries/bsf-bin-2.4.0.zip`
9. `unzip bsf-bin-2.4.0.zip`
10. `mv bsf-2.4.0/lib/bsf.jar $ANT_HOME/lib`
11. `wget http://mirrors.sonic.net/apache//commons/logging/binaries/commons-logging-1.1.3-bin.zip`
12. `unzip commons-logging-1.1.3-bin.zip`
13. `mv commons-logging-1.1.3/*.jar $ANT_HOME/lib`
14. `cd HybridApp`
15. `ant debug`

As you execute these commands, you will notice a lot of tools are downloaded and installed from the web which are needed for the framework to work. This includes SASS and JSLint among others. The build process takes the code from web.src folder applies these tools on the them create a post processed output in assets folder which is then deployed as part of the app.

Build troubleshooting
----
If you hit the following bug

`-code-gen:
[mergemanifest] Merging AndroidManifest files into one.
[mergemanifest] Manifest merger disabled. Using project manifest only.
     [echo] Handling aidl files...
     [aidl] No AIDL files to compile.
     [echo] ----------
     [echo] Handling RenderScript files...
     [echo] ----------
     [echo] Handling Resources...
     [aapt] Generating resource IDs...
     [aapt] invalid resource directory name: /Users/clkim/Documents/git/HybridApp/bin/res/crunch

BUILD FAILED
/Users/clkim/dev/adt-bundle-mac-x86_64-20131030/sdk/tools/ant/build.xml:653: The following error occurred while executing this line:
/Users/clkim/dev/adt-bundle-mac-x86_64-20131030/sdk/tools/ant/build.xml:698: null returned: 1
`

please use `ant clean` before `ant debug` 



Intermediate Hybrid Application using Karura Framework


![Loading View](https://raw.github.com/karuradev/screenshots/master/hybrid_contacts/loading.png)

![Listview View](https://raw.github.com/karuradev/screenshots/master/hybrid_contacts/listview.png)

![Details View](https://raw.github.com/karuradev/screenshots/master/hybrid_contacts/details.png)

![Edit View](https://raw.github.com/karuradev/screenshots/master/hybrid_contacts/edit.png)

![Add View](https://raw.github.com/karuradev/screenshots/master/hybrid_contacts/add.png)

![Info View](https://raw.github.com/karuradev/screenshots/master/hybrid_contacts/info.png)




Special Thanks to Heydon who let us use his excellent CSS fonts in our project, [click here to download them for free](http://www.fontsquirrel.com/foundry/Heydon-Pickering)


