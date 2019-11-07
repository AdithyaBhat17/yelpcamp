# YelpCamp
YelpCamp is a dynamic website which provides information about campgrounds

**Checkout the [old-code](https://github.com/AdithyaBhat17/yelpcamp/tree/old-code) branch for node, express and ejs codebase**

## Installation Guide

**Setup the backend server**

Requirements - Node.js, npm, nodemon (`npm i -g nodemon`) 

* install the required dependencies - `npm install`
* create an account at mlab.com and create a database with aws cloud us-east-1.
* copy and paste the generated database url to a .env file at the root folder of the application  
    ```.env
    DB_URL = mongodb://<dbuser>:<dbpassword>@ds111476.mlab.com:11476/<db_name>
    BASE_URL = http://localhost:3000
    ```
* create an account at cloudinary.com and create a folder called campgrounds. Copy/paste your cloudinary credentials to the .env file  
    ```.env
    DB_URL = mongodb://<dbuser>:<dbpassword>@ds111476.mlab.com:11476/<db_name>
    BASE_URL = http://localhost:3000
    cloud_name = <cloud_name_here>
    api_key = <api_key_here>
    api_secret = <api_secret>
    ```
* now start the server - `npm start`

**Setup the front-end server**

* Open a new terminal window and move to the *ui* folder and install dependencies - `cd ui && npm install`
* create a `.env` file in the root of `ui/` and add the following inside it  
    ```.env
    REACT_APP_BASE_URL = http://localhost:8080
    ```
* start the server - `npm start`

Happy coding!! Feel free to contribute to the repository by sending a Pull Request.


## TODO

* [x] - style the application (micro-interactions included)
* [x] - handle auth errors in the UI
* [ ] - add a 404 page
* [ ] - refactor backend code

## License

    Copyright 2019 Adithya NR

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.  

## Contributors

[Adithya NR](https://www.adithyabhat.com) - Front-end Engineer, IDF certified UX Designer.


