### Virtual Environment
- Run `virtualenv venv --python=python3` to create a virtual environment (if not created yet)
- Run `source venv/bin/activate` to activate the virtual environment

### Required Packages and Modules
- Run `pip install -r requirements.txt` to install all the required packages.

### Database Migrations
- Run `python manage.py makemigrations socialdistribution` to create migrations
- Run `python manage.py migrate` to run pending migrations

### Django Tests
- Run `python manage.py test socialdistribution` to run all the tests in the app directory
- Run `python manage.py test socialdistribution.tests.views.test_file_name` to run a view test file, likewise for models

### Fixtures and Seeding Data
- NOT REQUIRED, only if you need seed data 
- Naming convention: DATE_desired_file_name.json
- Run `python manage.py loaddata socialdistribution/fixtures/file_name.json` to add data in file_name to your local db