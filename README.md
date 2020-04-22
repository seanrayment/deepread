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
