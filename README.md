# Fastify Server Scaffold
## Table of Contents
* Features
* Running the Template
* Architecture Overview
* Important Workflows

## Features
This template is intended to take care of all the classical boilerplate code a RESTful API usually requires.
In detail, it offers these features:
* HTTP/S frontend based on Fastify
* Automatic Swagger generaton based on Fastify-Swagger
* ORM database connection based on TypeOrm
* Quick development with the help of sqlite3 in-memory database
* Working unit test setup including coverage based on Mocha, Chai and Istanbul
* Linting by Eslint (recommended rules are activated)
* Prettier config for prettier code
* Start script setting up all needed environment variables (requires bash-like shell)
* Generation of DTO and Config interfaces from JSON Schema
* Architecture suggestion following MVC pattern
* AbstractCrudView helper class to get a standard REST interface up in no time

## Running the Template
* Install the required modules with your package manager of choice (e.g. "npm install")
* If you have a bash-like shell: run the start script ("npm run start")
* If you don't have such a shell:
    + build the server ("npm run build")
    + setup all required environment variables (see ./scripts/startDev.sh)
    + run the server (node ./dist/server.js)
    
* Go to "localhost:3000/documentation" for the swagger docs
* User Postman or similar tools to send HTTP requests to the server
* NOTE: authorization header is required, but its content is not checked, anything is valid

## Architecture Overview
All source files are in "src", all unit tests are in "test".
The unit tests should ideally follow the same directory structure that is used in "srt" to quickly
 locate all tests for a given sourcefile.
The "src" folder contains 4 subdirectories: "model", "view", "controller" and scaffolding.
* "Scaffolding" contains all kinds of helper functions, interfaces and classes that are not directly related
 to the different MVC modules.
* "View" contains all "View" classes. Since we're talking about REST APIs, a "view" is simply the definition of a REST resource
* "Controller" contains all the businesslogic required by the API.
* "Model" contains the entity definitions and all logic related to your persistence (default: Typeorm)

The entire server is started in the "src/main.ts" file.
That file basically reads the config and invokes the "init" functions that are exported by each of the three modules (MVC).

#### Views
Views are supposed to be the REST endpoints that take a fastify request, extract all required data from it to get a valid DTO
(Data Transfer Object), pass that DTO on to the Controllers and return the Controller's answer to the client.

#### Controllers
Controllers are the businesslogic of the server. They receive a DTO from a view, perform some actions (usually involving
communication with the Model layer) and return a DTO as answer to the view.

#### Models
Models are the persistence system of the server. By default this is a database connected via TypeOrm.
Most of the implementation is covered by Typeorm, but the Model still needs to define entities and their relations.
*NOTE*: using the EntitySchema<X> way of defining metadata is **mandatory** because decorator based metadata won't work with
webpack.

#### Scaffolding
Probably the most useful utility functions in this folder are *exists*, *notExists* and *errorIfNotExists*.
Since the included tsconfig enables strictNullChecks these functions offer a very fast and easy way to ensure everything is defined.

Another helpful class is the *AbstractCrudView* that allows to start a normal CRUD endpoint / view simply by declaring a base URL
and a JSON schema of the entity it should manage.


## Important Workflows
#### Adding an entity
* create a Entity class in model/entities/
* include the Entity Schema in that class file
* add the EntitySchema to the "getEntities()" function in model/entities/get-entities.ts

#### Adding a DTO
* create a valid JSON schema for your DTO in view/dtos/schemas/
* run "npm run generate:dtos" to generate the corresponding Typescript interface from it

#### Adding a CRUD view
* create the corresponding DTO for the new view
* create a new class in view/ and have it extend **AbstractCrudView**
* the type parameter should be the Interface corresponding to your DTO
* implement the CRUD functions the **AbstractCrudView** asks for
* add the new view to the *getViews()* function in /src/view/init-views.ts

#### Adding a controller
* create your new controller in *controller/*
* add your controller to the *initControllers()* function in */src/controller/init-controllers.ts*

#### Changing the config
* update the Config JSON Schema in */scaffold/config/config.json*
* run "npm run generate:config" to update the typescript interface
* add your new environment variables to *scripts/startDev.sh*
* **NOTE** the config is based on environment variables and thus only supports *boolean*, *number* and *string* types.
Complex types like *object* or *array* will not work.

#### Add a unit test
* create a unit test file in *test/*

#### Adjust Swagger behavior
* change the *swagger.config.ts* in *src/scaffold/config*


