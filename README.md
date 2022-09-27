# Voyager-Operation-Dashboard

Dashboard to facilitate voyager operations. This application was developed using [React framework](https://reactjs.org/).

## Prerequisites

### Setting up beagle

1. Pull the docker image: `docker pull mskcc/beagle:latest`
2. Run the docker image: `docker run -it -p 8000:8000 -p 8081:8081 mskcc/beagle:latest /bin/bash`
3. Start the postgres server: `pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/log start`
4. gunicorn beagle.wsgi --log-file /usr/bin/beagle/log --bind 0.0.0.0:8081 --threads 10 --pythonpath /usr/bin/beagle

## Setting up the Application

1. Navigate to the project directory: `cd voyager-operation-dashboard`

2. Clone the repository: `git clone https://github.com/mskcc/Voyager-Operation-Dashboard.git`

3. Install node packages: `npm install`

4. Runs the application in development mode: `npm start`
