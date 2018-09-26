#!/bin/bash

mysql -uroot -p$MYSQL_ROOT_PASSWORD library_db < schema.sql
mysql -uroot -p$MYSQL_ROOT_PASSWORD library_db < data_load.sql

