-----------------------------------------------------------------------------------------------------

 FieldLab container v1.0
 06/11/2020 TV

-----------------------------------------------------------------------------------------------------

Before running docker, run script runFirst.sh to alter config files to suit docker networking better.


The docker-compose.yml contains the following elements:

PostgreSQL database
  Database name         test_db
  Tablename             robottidata
  Username              postgres
  Password              Robotti123
  Port                  5432

  Persistent data       /pgdata
  Configuration         /init   Initializes the database with table robottidata if not already there

Grafana
  Accessable on port 3000

Adminer
  Accessable on port 8080

Nodeapi
  Accessable on port 9080

React-front
  Currently only the development version accessable on port 3100


USAGE:
  docker-compose up              To start the services
  docker-compose -build up       To rebuild service (node, react)
  docker-compose ps              Current status of service
  docker-compose stop            Stop the services
  docker-compose start           Start the services
  docker-compose down            Stop service and remove images

