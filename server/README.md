## Setup

### Auth0

1. Create an Auth0 account in the [Auth0 Dashboard](https://manage.auth0.com/#/).
2. Create a new Auth0 API under the APIs section [here](https://manage.auth0.com/dashboard/us/dev-fhwrp4iw/apis).
3. After creating API go to "Quick Start" tab and select "Node.js" as the server language.
4. Copy the `audience`, `issuerBaseURL` and `tokenSigningAlg` values to `.env` file according to the `.env.template` file.
5. If you want to have a protected route in your api you can use `checkJwt` middleware like so:

```typescript
// This route needs authentication
app.get("/api/private", checkJwt, function (req, res) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated to see this.",
  });
});
```
