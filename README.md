# *What's for Dinner* Application #  
## Overview ## 
Web application used to add, edit, delete and search recipes.

Recipies are added and maintained by registered users. 

Non-registered users can search and view the existing list of recipies but to interact further they will need an account.

Users register with their email address and a password. The first user registered is considered the administrator.
The administrator has permissions that standard users do not (such as deleting recipes).

## Dependencies ## 
* mongodb-community@6.0
  * installation instructions [here](https://www.mongodb.com/docs/manual/administration/install-community/)
* node v18.11.0
* npm v8.19.2

## Installation ##
1. Navigate to the root directory (dinner) of the project
1. Run `npm install` 
1. Navigate to the frontend directory just below the root directory 
1. Run `npm install`
1. Navigate to the backend directory just below the root directory 
1. Run `npm install`

## Start Application ##
1. Start the database eg: `brew services start mongodb-community`
1. Navigate to the root folder (dinner) of the directory
1. Run `npm start`
    1. Navigate to the package.json in the root directory to see the script that starts both backend and frontend

