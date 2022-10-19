# Voyager-Operation-Dashboard

Dashboard to facilitate voyager operations. This application was developed using a [React framework](https://reactjs.org/) front-end and [Python Django](https://www.djangoproject.com/) back-end.

## Prerequisites

### Setting up beagle

1. Run the Docker image:

```
docker run -it -p 8081:8081 mskcc/beagle:latest
```

2. The beagle swagger page is now running on your local computer

```
http://localhost:8081/
```

### Setting up the Application

1. Clone the repository: `git clone https://github.com/mskcc/Voyager-Operation-Dashboard.git`
2. Navigate to the project directory: `cd Voyager-Operation-Dashboard`

#### Setting up the Python Django Back-End

1. From the project directory, navigate to the Django back-end in the command line: `cd server/voyager_server`

2. Install all the required Python packages using pip: `pip install -r requirements.txt`

3. Create database migrations based on the models in the server that will be synchronized with the PostgreSQL database at step 4 below: `python manage.py makemigrations`

4. Synchronize the PostgreSQL database with the models and migrations from step 3: `python manage.py migrate`

5. Run the development server on port 8000: `python manage.py runserver`

#### Setting up the React Front-End

1. From the project directory, navigate to the React front-end in the command line: `cd voyager-operation-dashboard`

2. Install node packages: `npm install`

3. Runs the application in development mode: `npm start`
