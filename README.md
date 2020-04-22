Dependencies:

Python 3.7.5

## Setup (macOS)

Create a python virtual environment for this project. This essentially serves as an isolated container for the project's dependencies. 

`sudo pip3 install virtualenvwrapper`

**Note:**  You may need to replace `pip3` with `pip` if python3 is your default install

Choose a location for your future virtual environments in your `.bashrc` or `.bash_profile`
```
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/Devel
source /user/local/bin/virtualenvwrapper.sh
```
Run these changes in the current terminal session with `source ~/.bashrc`

Create a virtual environment for this project

`mkvirtualenv deepread`

If you leave this terminal session, you can access the virtual environment

`workon deepread`

Run the following from within the virtual environment in the project root to install the project's dependencies

`pip install -r requirements.txt`

If you add new python modules while working on the project, register them as dependencies by running

`pip freeze > requirements.txt`

## API

### Creating a user
`POST /api/user/create/`
| param         | description   | 
| ------------- |---------------| 
| username      | <String> must be unique | 
| email      | <String> must be unique and valid email format      |  
| password | <String> at least 8 characters      |  


### Obtaining a JWT token pair (User login) 
`POST /api/token/obtain/`

| param         | description   | 
| ------------- |---------------| 
| username      | <String> must match an existing user | 
| password | <String>      |  

### Refreshing an access token (extending 5-minute user session)
`POST /api/token/refresh/`
| param         | description   | 
| ------------- |---------------| 
| refresh      | <String> valid JWT refresh token from last 2 weeks | 
  
### Blacklisting JWT token (User logout)
`POST /api/blacklist`
| param         | description   | 
| ------------- |---------------| 
| refresh_token      | <String> JWT refresh token | 

### Get User Info
`GET /api/user/`
| header         | description   | 
| ------------- |---------------| 
| Authorization      | `JWT <JWT access token>` | 

example response
```
{
    "email": "Aleen62@gmail.com",
    "username": "Dasia72"
}
```
