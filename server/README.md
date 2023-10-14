### Virtual Environment
- Run `virtualenv venv --python=python3` to create a virtual environment (if not created yet)
- Run `source venv/bin/activate` to activate the virtual environment

### Required Packages and Modules
- Run `pip install -r requirements.txt` to install all the required packages.

### Database Migrations
- Run `python manage.py makemigrations socialdistribution` to create migrations
- Run `python manage.py migrate` to run pending migrations