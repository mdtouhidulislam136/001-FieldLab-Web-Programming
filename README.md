# **FieldLab Web Programming**

Valtteri Setälä,    valtteri.setala@tuni.fi

Eemil Peltonen,     eemil.peltonen@tuni.fi

Md Touhidul Islam,  mdtouhidul.islam@tuni.fi

**Project Manager:** Elias Peteri,  elias.peteri@tuni.fi

**Project Description**
A project to improve and develop web front of the FieldLab project and help the previous developer.

**Project Goals** Some examples of what can be done:

- Improving data fetching
- Improving charts
- Refactoring and improving old code
- Implementing test automation
- Smaller improvements to UI and usability


**Current Status**

**Work in progress:**
- Improving charts

**Done**
- Test automation
- Improving data fetching
- UI improvements


Below is the original README of the FieldLab project.


# **Innovation project**

A project that visualizes data from various ABB machines and IoT sensors..  
  
Consisting of:  
**React**, front-end/UI  
**NodeJs Express server**, back-end that is connected to database  
**OPC Data Transfer**, database and OPC data logic  

**NOTE:** Front-end needs to be ran on a machine connected to **StudentVPN** and back-end needs to be ran on this **project specific virtual machine** to have the proper access.

# **Cloning the repo**

```sh
git clone https://git@https://gitlab.tamk.cloud/tamk-projects/summer-projects/2020/0026
```

# **Installing the server side by script**

Navigate to the script-installation folder:

```sh
cd script-install
``` 

Run the installer as sudo:

```sh
sudo ./install.sh
``` 

# **Using docker on server side**

Navigate to the container folder:

```sh
cd container
``` 

Run the runFirst.sh script to alter the configurations:
```sh
./runFirst.sh
``` 

Raise the containers detached:

```sh
docker-compose.yml up -d
``` 

# **OPC Data Transfer**

## Table of Contents

- [Requirements](#OPC Requirements)  
- [Python Libraries](#Python Libraries)
- [Installation And Usage](#Installation And Usage)

In this project, the connection from the OPC server to the Postgre database happens with custom program made with Python coding language.

## OPC Requirements

are simply following:
*  Windows (with these instructions)
*  32-bit python 3.6.x
*  DLL library ”gbda_aut.dll” from graybox

## Python Libraries

Next requirements are libraries for python and to be installed with pip (pip is the standard package manager for Python.)
*  **OpenOPC-Python3x** (connections to OPC server)

| install with pip (one of the following)|
| ------ |
| pip install OpenOPC-Python3x |
| pip3 install OpenOPC-Python3x |
| py -m pip install OpenOPC-Python3x |
| https://github.com/Alexhll/OpenOPC-python3.6 |

*  **psycopg2** (postgres connections and queries)

| install with pip (one of the following)|
| ------ |
| pip install psycopg2 |
| pip3 install psycopg2 |
| py -m pip install psycopg2 |
| https://www.psycopg.org/install/ |

*  **pywin32** (Pywin32 is basically a very thin wrapper of python that allows us to interact with COM objects and automate Windows applications with python. The power of this approach is that you can pretty much do anything that a Microsoft Application can do through python.)

| install with pip (one of the following)|
| ------ |
| pip install pywin32==224 |
| pip3 install pywin32==224 |
| py -m pip install pywin32==224 |
| https://github.com/mhammond/pywin32/releases |

## Installation And Usage

After these installations in place, you can run automated python script (na-med postgres_python_opc-exe.py) through your favourite terminal with command: 
```
python <path_to_executable.py>
```

within this repository
```
python opc-datafetch\postgres_python_opc-exe.py
```


Program pushes by default TO postgres database with query
```
INSERT INTO { _pgTablename } ( name, value, quality, time ) VALUES ( '{ new_name }', { _value }, '{ _quality }', '{ new_dt }' )
```

You can edit code if needed, and only functional things you need to edit are on top of the code

| variable | meaning |
| ------ | ------ |
| _waitingTime | time before while-loop is getting executed after initial configuration |
| _counter | counter that keeps count of pushes to database at display | 
| _abortKeys | keys to press when user wants to stop programs execution | 
| _defaultHost | rest are self explanatory | 
| _defaultDatabase | ... | 
| _defaultTablename | ... | 
| _defaultUser | ... | 
| _defaultPassword | ... | 
| _defaultOPCServer | ... | 
| _delayBetweenReads | delay (cooldown) between readings from opc server (sql insert is in the same loop as opc read) | 



IF default values in configure above are in place with right values, then you can just press enter-key to pass default value to program when program asks input.

Program wants you to specify a path for data in data that OPC server provides. Program is made so that you can pass next path you want to see inside (kinda like folder structure).
You have to write paths exactly as displayed and DON'T FORGET to put DOTs between "folders".
Like so,
```
<Robot_name>.<folder>.<folder>.<folder_with_data> 
```

After you see the data you want to gather, you can press enter or type number 1 and then press enter.

Now the program will start to read OPC values after a delay and with specified time period it reads data from opc server(robot) and pushes data to database.

