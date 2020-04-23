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
`POST /api/blacklist/`
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

### Creating a document
`POST /api/documents/<int:pk>/`
| header         | description   | 
| ------------- |---------------| 
| Authorization      | `JWT <JWT access token>` |

| param         | description   | 
| ------------- |---------------| 
| title (optional)      | <String> document's title, default is "My new document" | 
| contents (optional)      | <String> defaults to empty string |
  | font_family (optional)      | <String> One of: 'georgia', 'serif', 'times_new_roman', 'arial', 'helvetica', 'sans_serif', 'tahoma' |
  | color (optional)      | <String> must be valid 6 digit hex string e.g. `"0a0a0a"` |
| font_size (optional)      | <Integer> font size to be used in px |
  | char_width (optional)      | <Ingeger> char width to be used in ch | 

### Updating a document
`PUT /api/documents/<int:pk>/`
| header         | description   | 
| ------------- |---------------| 
| Authorization      | `JWT <JWT access token>` |

| param         | description   | 
| ------------- |---------------| 
| title (optional)      | <String> document's title, default is "My new document" | 
| contents (optional)      | <String> defaults to empty string |
  | font_family (optional)      | <String> One of: 'georgia', 'serif', 'times_new_roman', 'arial', 'helvetica', 'sans_serif', 'tahoma' |
  | color (optional)      | <String> must be valid 6 digit hex string e.g. `"0a0a0a"` |
| font_size (optional)      | <Integer> font size to be used in px |
  | char_width (optional)      | <Ingeger> char width to be used in ch | 
  
### Getting a document
`GET /api/documents/<int:pk>/`
| header         | description   | 
| ------------- |---------------| 
| Authorization      | `JWT <JWT access token>` |

example response
```
{
    "pk": 2,
    "owner": "sar5498@gmail.com",
    "num_chars": 445,
    "contents": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "title": "Lorem Ipsum document",
    "font_family": "georgia",
    "color": "000000",
    "font_size": 14,
    "char_width": 80
}
```

### Deleting a document
`DELETE /api/document/<int:pk>/`  
  | header         | description   | 
| ------------- |---------------| 
| Authorization      | `JWT <JWT access token>` |

### Listing documents
`GET /api/documents/`
| header         | description   | 
| ------------- |---------------| 
| Authorization      | `JWT <JWT access token>` |

example response
```
[
    {
        "pk": 14,
        "owner": "sar5498@gmail.com",
        "num_chars": 145,
        "contents": "Nostrum est quo voluptatem et iure illo necessitatibus voluptatibus porro. Consectetur nobis odio. Rem temporibus aut ut ex et doloremque soluta.",
        "title": "Try to connect the FTP feed, maybe it will calculate the haptic protocol!",
        "font_family": "georgia",
        "color": "0e0e0e",
        "font_size": 14,
        "char_width": 80
    },
    {
        "pk": 15,
        "owner": "sar5498@gmail.com",
        "num_chars": 203,
        "contents": "Saepe totam ut. Aspernatur culpa consequatur et sequi aperiam aut exercitationem commodi nostrum. Corporis vel sint aut doloribus. Fuga necessitatibus voluptate ut debitis quia quis voluptas mollitia et.",
        "title": "Use the redundant SAS alarm, then you can program the auxiliary driver!",
        "font_family": "georgia",
        "color": "0e0e0e",
        "font_size": 14,
        "char_width": 80
    }
]
```
