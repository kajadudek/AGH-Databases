## Setup

### Auth0

1. First do the steps in the server/README.md
2. When you are done go to [here](https://manage.auth0.com/#/applications) and choose an application you created in the previous step.
3. You should be in `Settings` tab. In the `Basic Information` section you will see `Domain`, `Client ID` and `ClientSecret`. Copy them to `.env.local` file according to the `.env.local.template` file.
4. In the `Application URI` section you will see `Allowed Callback URLs`, `Allowed Logout URLs` and `Allowed Web Origins`. Fill them out accordingly:

- Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
- Allowed Logout URLs: `http://localhost:3000/`
- Allowed Web Origins: `http://localhost:3000/`

and save the changes.

5. In the `Advanced Settings` go to `Grant Types` and check `Authorisation code` box and save the changes.

### Flowbite React

1. Install the main Flowbite package and Flowbite React via NPM by running the following command:
   npm install flowbite flowbite-react --save

2. Require Flowbite as a plugin inside the tailwind.config.js file: type `require("flowbite/plugin")` inside `plugins`.

3. Add the source code in the template paths to make sure that dynamic classes from the library will be compiled: type `./node_modules/flowbite-react/**/*.js` inside `content`
