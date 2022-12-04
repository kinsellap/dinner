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
1. Navigate to the ***frontend*** directory just below the root directory 
1. Run `npm install`
1. Navigate to the ***backend*** directory just below the root directory 
1. Run `npm install`

## Start Application ##
1. Start the database eg: `brew services start mongodb-community`
1. Navigate to the root folder (dinner) of the directory
1. Run `npm start`
    1. Navigate to the package.json in the root directory to see the script that starts both backend and frontend

## Backend ##  
* The backend is configured to run on port 8080
* The entry point to the backend is server.js
* The resources available via the API are:
     * recipes - http://localhost:8080/api/recipes
     * users - http://localhost:8080/api/users
* The data model is found in the model directory and supports two schemas
     * recipeModel
     * userModel
* Passwords in the user model are hashed using bcrypt
* There are controllers for each resource to specify the supported routes
* There are services provided for each resource to manage access to the data models
     * there is an additional service provided for jwt authorisation
        * authentication tokens are returned to register/login requests
        * this token is used to verify the user for all api calls that require authorisation
        * this token is passed in the request header [x-access-token]

## User Manual ##  
* The frontend is configured to run on port 3000.
* Upon start up the user will be directed to http://localhost:3000 in a browser which presents a login page
* At this point the user has the option to go to: 
    * the recipes page (http://localhost:3000/recipes) to view and search the repository of recipes
    * the register page (http://localhost:3000/users/register) to create an account 
* After login/register the user is brought to the recipes page (http://localhost:3000/recipes) 
    * At this point they have the option to:
        * mark certain recipes as favourites
        * delete recipes (if the user is an administrator)
        * filter their favourite recipes
        * double click a recipe row to view the details of the recipe (http://localhost:3000/recipes/:id) and edit the recipe if desired
        * click a button to be brought to the add recipe page (http://localhost:3000/recipes/new)
* In the navigation bar the user also has the option to view their profile (http://localhost:3000/users)
    * On this page the will see:
        * the number of recipes they have added and edited
        * the number of recipes they have favourited
        * their registration and date related details
    * On this page they will have the option to
        * add / remove a profile photo
        * delete their account
        * clear their favourites
        * change their password
* In the navigation bar the user also has the option to logout
    * when pressed it will end the user session and bring them back to the login page
    * a user session can last up to 2 hours
         * after that point the user will be asked to sign back in to renew their authorisation credentials.  
