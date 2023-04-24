## Setup

### Auth0

1. First do the steps in the server/README.md
2. When you are done go to [here](https://manage.auth0.com/#/applications) and choose an application you created in the previous step.
3. You should be in `Settings` tab. In the `Basic Information` section you will see `Domain`, `Client ID` and `ClientSecret`. Copy them to `.env` file according to the `.env.example` file.
4. In the `Application URI` section you will see `Allowed Callback URLs`, `Allowed Logout URLs` and `Allowed Web Origins`. Fill them out accordingly:

- Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
- Allowed Logout URLs: `http://localhost:3000/`
- Allowed Web Origins: `http://localhost:3000/`

and save the changes.

5. In the `Advanced Settings` go to `Grant Types` and check `Authorisation code` box and save the changes.
