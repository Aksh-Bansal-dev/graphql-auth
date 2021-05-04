# graphql-auth

A learning project that implements authentication using graphql and jwt following [this](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/)
article.

## Details about the implementation

Handling JWTs on the client-side has always been difficult. Storing it in localstorage or cookies will make your app vulnerable to CSRF & XSS attacks.
In order to prevent these attacks, we can store our access-token in memory. But now access-token will be deleted as soon as we refresh the website. So to solve this problem,
we can use refresh-tokens. We can make an API call to the backend along with refresh-token to get a fresh access-token. But now where will we store this refresh token? 
HttpOnly Cookie. It will allow refresh token to persist on the client-side for a long time and it will also keep the refresh-token safe as javascript cannot read or steal 
an HttpOnly Cookie. 
