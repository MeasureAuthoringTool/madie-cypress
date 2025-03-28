# Setting up the Workspace
The QA team uses Intellij IDE as the main development ide for cypress.

## First, clone the repository into your intellij
## NOTE: DO NOT INSTALL CYPRESS OR ITS RELATED TOOLS AS SUDO/ADMINISTRATOR
Once the repo has been cloned, you can begin working with the repository.
To begin working with the repository, first run `npm install` in the console. It might be necessary 
to Delete the node_modules folder and run npm install to ensure all dependencies are added.

## Cypress - Running Tests

`npm run cypress:open:dev` - opens cypress with the dev config. Different environments will have different config files. 
You can also setup local debug configs in intellij to run this command.
`npm run dev:all:ui:tests:report` - running this command CLI will run all tests located in WebInterface folder. This will
also create a mochawesome report which will be placed into mochawesome-report folder. MOre test scripts can be added and 
configured in the package.json file.

## Congifuration and Permissions for MADiE
This project is setup to use environment variables to ensure data security.

For MADiE currently you will need the following variables setup for the DEV config. More variables will need to be added to support more 
environments and more features.

In your .bash_profile add the following but include the DEV HARP user and PW that you plan to use in DEV env in the quotes:

export CYPRESS_DEV_USERNAME=""
export CYPRESS_DEV_PASSWORD=""

NOTE: In case the user does not own their bash profile, run the following command: `sudo chown your_user_name ~/.bash_profile`

Cypress environment variables should begin with the word `CYPRESS`, for example: `CYPRESS_DEV_PASSWORD`
However, when the environment variable is referenced within the automation suite, the `CYPRESS` portion of the variable should be left out.

### Alternate approach

See file [cypress.env.default.json](./cypress.env.default.json) for a list of all possible environment variables.

Execute the command `cp cypress.env.default.json cypress.env.json` to create your own copy of the file.

Obtain the values for each variable from the team, as needed.

