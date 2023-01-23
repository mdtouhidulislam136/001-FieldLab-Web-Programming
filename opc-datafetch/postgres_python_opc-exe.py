from os import system, name 
import sys

# First, let's clear the screen
def clearScreen():

    # for windows 
    if name == 'nt': 
        _ = system('cls') 

    # for mac and linux(here, os.name is 'posix') 
    else: 
        _ = system('clear')
    pass

clearScreen()
# WILL PUSH TO DATABASE WITH THIS STRING
#
# INSERT INTO { _pgTablename }  ( name, value, quality, time ) 
# VALUES ( '{ new_name }', { _value }, '{ _quality }', '{ new_dt }' )


# Configuration
import config

# OPC
import OpenOPC
import time
import pywintypes
import datetime

pywintypes.datetime = pywintypes.TimeType
opc=OpenOPC.client()

# postgres
import psycopg2

_pgHost = str(input(f"\nWrite IP for Postgres database ( default { config._defaultHost } ): ") or config._defaultHost)
_pgDatabase = str(input(f"\nWrite Postgres database to use ( default { config._defaultDatabase } ): ") or config._defaultDatabase)
_pgTablename = str(input(f"\nWrite Postgres table to use ( default { config._defaultTablename } ): ") or config._defaultTablename)
_pgUser = str(input(f"\nPostgres database Username ( default { config._defaultUser } ): ") or config._defaultUser)
_pgPassword = str(input(f"\nPostgres database Password ( default { config._defaultPassword } ): ") or config._defaultPassword)


con = psycopg2.connect( host=_pgHost, database=_pgDatabase, user=_pgUser, password=_pgPassword )
cur = con.cursor()

# opc.servers() should give 'ABB.IRC5.OPC.Server.DA'
print("\nList of OPC Servers: ")
print("\n")
print(opc.servers())

_opcserver = str(input(f"\nWrite OPC server from the list (default { config._defaultOPCServer }): ") or config._defaultOPCServer)

# Should now connect to right opc-server -  TRY CATCH HERE

opc.connect(_opcserver)

print("\nHere is list of OPC datasources: ")
print("\n")
print(opc.list())

_opcDatafolder = str(input("\nWrite right datasource from the list (if we are in path where the data is, type 1): ") or "1")

_opcInput = _opcDatafolder

while _opcInput != "1" :
    print("\nList of data in specific source: ")
    print("\n")
    print(opc.list(_opcInput))
    _opcInput = str(input("\nWrite right datasource from the list (if we are in path where the data is, type 1): ") or "1")
    if _opcInput != "1":
        _opcDatafolder = _opcInput
    else : break
    pass

tags = opc.list(_opcDatafolder)

print(opc.read(tags, group='test'))

while 0 < config._waitingTime:
    print(f"\nSTARTING THE PROGRAM TO PUSH DATA TO DATABASE in { config._waitingTime }...")
    time.sleep(1)
    config._waitingTime = config._waitingTime-1
    pass

while True:
    config._counter = config._counter+1
    clearScreen()

    print( f'PRINTING DATA \t AND SENDING IT TO DATABASE \t TIMES: { config._counter }' )
    print( f'PRESS \t { config._abortKeys } \t TO INTERRUPT THE PROGRAM' )
    print( "\n" )

    try:
    # reading data once (iread is iterable-read) 
    # value = opc.read(tags,group='test',update=1)
    # print (value)
        for _name, _value, _quality, _time in opc.iread( group='test', update=1 ):
            print( f'{ _name }\t { _value }\t { _time }' )
            new_name = _name.split(".")[-1]
            new_dt = _time[:19]
            datetime.datetime.isoformat(datetime.datetime.strptime(new_dt, '%Y-%m-%d %H:%M:%S'))
            sql=f"INSERT INTO { _pgTablename }  ( name, value, quality, time ) VALUES ( '{ new_name }', { _value }, '{ _quality }', '{ new_dt }' )"
            cur.execute(sql, (new_name, _value, _quality, new_dt))
            con.commit()
    except OpenOPC.TimeoutError:
        print("\nTimeoutError occured")
    time.sleep(config._delayBetweenReads)


