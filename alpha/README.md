# nx-node-react-bagley

### Client Id
```
25544
```
This Id identifies your application to the Stack Exchange API. Your application client id is not secret, and may be safely embeded in distributed binaries.

Pass this as client_id in our OAuth 2.0 flow.

### Client Secret (reset)
```
sIXY97zsYaQp*ToZ*cj7aQ((
```
Pass this as client_secret in our OAuth 2.0 flow if your app uses the explicit path.

This must be kept secret. Do not embed it in client side code or binaries you intend to distribute. If you need client side authentication, use the implicit OAuth 2.0 flow.

### Key
```
Ijr)ZtMKpCUuuApkMRw2ug((
```
Pass this as key when making requests against the Stack Exchange API to receive a higher request quota.

This is not considered a secret, and may be safely embed in client side code or distributed binaries.

### Description
```
coding exercise
```
This text-only blurb will be shown to users during authentication.

### OAuth Domain
```
swenswen.com
```
Whenever a redirect occurs during an authentication sessions (as specified by redirect_uri) it must reside under this domain.

For the purposes of redirection, subdomains are considered to be under their parent domain. Registering example.com would allow a redirect_uri of foo.example.com for example.

### Application Website
```
swenswen.com
```
A link to this website will accompany most displays of your application on the Stack Exchange network.

### Application Icon
`Not Set`

This image will accompany most displays of your application on the Stack Exchange network.

### Stack Apps Post
`Not Set`

When you've published your application, it should be listed on Stack Apps with the app or script tags.

### Client Side Flow
`Disabled`

An application can either be configured for client side or server side authentication flows.

Changing to one will disable the other flow.

### Desktop OAuth Redirect Uri
`Enabled`

Applications that have the client side flow enabled can use https://stackexchange.com/oauth/login_success as their redirect_uri by default.

This is provided so non-web clients can participate in OAuth 2.0 without requiring a full fledged web server. Applications that do not need this behavior can disable it.