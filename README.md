# Swagger UI

This is a customized fork of the [swagger-ui](https://github.com/swagger-api/swagger-ui) repository that includes functionality for authenticating against Azure App Service authentication.

The original README for this project contains useful documentation and can be found [here](https://github.com/swagger-api/swagger-ui/blob/master/README.md).

## Installation

Currently, the easiest way to use the customized package is to copy the contents of the `/dist` folder into your own application and serve the contents statically.

## Usage

If you include a security definition with the name `EasyAuth`, this will be picked up by the authentication plugin and a custom dialog section will be displayed when clicking the `Authorize` button.

Note that for the authentication to work correctly, the security definition must have a type of `apiKey` with an authorization header called `Authorization`. The `securityDefintion` attribute should look as follows:

```JSON
"securityDefinitions": {
  "EasyAuth": {
    "type": "apiKey",
    "in": "header",
    "name": "Authorization"
  }
}
```

## Modifications / How it Works

There are two main modifications that have been made:
- an `EasyAuth` component has been added to the `src/core/components/auth` folder.
  - This component consumes the Azure Mobile Apps Javascript client SDK to perform authentication against the selected social provider
- the `Auths` component in the same folder has been modified to recognize EasyAuth configurations, as described in the Usage section above

Other minor modifications:
- Addition of the `azure-mobile-apps` npm package to the `package.json` file
- Inclusion of SVG icons for corresponding social identity providers