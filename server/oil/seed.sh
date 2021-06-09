#!/bin/bash

rm -rf oilapi/migrations
rm db.sqlite3
python manage.py makemigrations oilapi
python manage.py migrate
python manage.py loaddata users
python manage.py loaddata tokens
python manage.py loaddata job_types
python manage.py loaddata jobs
python manage.py loaddata job_users