[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# Auraverse Backend

Auraverse is an independent central hub and place to discover everything in the Aura Network Blockchain ecosystem (NFTs, projects, DeFi, DAOs etc).

This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

## Usage

Start the project with `npm run dev` command.
After starting, open the http://localhost:3000/ URL in your browser.
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

In the terminal, try the following commands:

-   `nodes` - List all connected nodes.
-   `actions` - List all registered service actions.
-   `call auth.signUp` - Call the `auth.signUp` action.
-   `call auth.forgotPassword --email doquockhanhan@gmail.com` - Call the `auth.forgotPassword` action with the `email` parameter.

## Services

-   **api**: API Gateway services
-   **openapi**: OpenAPI service
-   **account**: Service with actions to handle an account's information.
-   **auth**: Service with actions to interact with guest users.
-   **project**: Service with CRUD actions for projects.
-   **request**: Service with actions for admin to approve/reject requests.

## Useful links

-   Moleculer website: https://moleculer.services/
-   Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

-   `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
-   `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
-   `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
-   `npm run lint`: Run ESLint
-   `npm run ci`: Run continuous test mode with watching
-   `npm run test`: Run tests & generate coverage report
-   `npm run dc:up`: Start the stack with Docker Compose
-   `npm run dc:down`: Stop the stack with Docker Compose
