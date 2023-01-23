#!/usr/bin/env python

from configparser import ConfigParser

file = 'config.ini'

config = ConfigParser()

config.read(file)

_waitingTime = int(config['default']['_waitingTime'])
_counter = int(config['default']['_counter'])
_abortKeys = config['default']['_abortKeys']
_defaultOPCServer = config['default']['_opcServer']
_delayBetweenReads = int(config['default']['_delayBetweenReads'])

_defaultHost = config['postgresql']['_defaultHost']
_defaultDatabase = config['postgresql']['_defaultDatabase']
_defaultTablename = config['postgresql']['_defaultTableName']
_defaultUser = config['postgresql']['_defaultUser']
_defaultPassword = config['postgresql']['_defaultPassword']

# print(config.sections())