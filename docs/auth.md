# App Setup

- Initialized our backend using npm and installed necessary packages
- Set up a MongoDB database
- Set up a server with `Node.js` and `Express`
- Created a database schema to define a `User` for registration and login purposes
- Set up two API routes, `register` and `login`, using `passport` + `jsonwebtokens` for authentication and `validator` for input validation

## Initialize npm and install necessary packages

### Dependencies

- `bcryptjs`: used to hash passwords before we store them in our database
- `body-parser`: used to parse incoming request bodies in a middleware
- `concurrently`: allows us to run our backend and frontend concurrently and on different ports
- `express`: sits on top of Node to make the routing, request handling, and responding easier to write
- `is-empty`: global function that will come in handy when we use validator
- `jsonwebtoken`: used for authorization
- `mongoose`: used to interact with MongoDB
- `passport`: used to authenticate requests, which it does through an extensible set of plugins known as strategies
- `passport-jwt`: passport strategy for authenticating with a JSON Web Token (JWT); lets you authenticate endpoints using a JWT
- `validator`: used to validate inputs (e.g. check for valid email format, confirming passwords match)

### Dev Dependencies

- nodemon: a utility that will monitor for any changes in your code and automatically restart your server

# Setting up our backend with API routes using `passport` and `jsonwebtoken`s for authentication

## Set up a MongoDB database

To install and run MongoDB on Mac:https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

Note that the param `compressors=disabled&` is removed from mongoURI below due to error in Terminal: { MongoParseError: Value for `compressors` must be at least one of: `snappy`, `zlib`

To run:
```
mongo
nodemon run server
```

In `config/keys.js`:

```
module.exports = {
  mongoURI: "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb",
  secretOrKey: "secret"
};
```

## Set up a server with Node.js and Express

### Server setup: `server.js`

- Pull in our required dependencies (namely `express`, `mongoose` and `bodyParser`)
- Initialize our app using `express()`
- Apply the middleware function for `bodyparser` so we can use it
- Pull in our `MongoURI` from our `keys.js` file and connect to our MongoDB database
- Set the port for our server to run on and have our app listen on this port
- Pulls `api/users` routes and `passport` initializations

## Create a database schema to define a User for registration and login purposes

`models/User.js`: Pulls in our required dependencies: `mongoose.model` and `mongoose.Schema`

- Contains a Schema to represent a User, defining fields and types as objects of the Schema
- Exports the model so we can access it outside of this file

## Two validators for form input validation, `validation/register.js` and `validation/login.js`, using `passport` + `jsonwebtoken`s for authentication

- Pull in `validator` and `is-empty` dependencies
- Export the function `validateRegisterInput`, which takes in `data` as a parameter (sent from our frontend registration form)
- Instantiate our `errors` object
- Convert all empty fields to an empty string before running validation checks (`validator` only works with strings)
- Check for empty fields, valid email formats, password requirements and confirm password equality using `validator` functions
- Return our `errors` object with any and all errors contained as well as an `isValid` boolean that checks to see if we have any errors

## API routes setups

### Register Endpoint

- Pull the `errors` and `isValid` variables from our `validateRegisterInput(req.body)` function and check input validation
- If valid input, use MongoDB’s `User.findOne()` to see if the user already exists
- If `user` is a new user, fill in the fields (`name`, `email`, `password`) with data sent in the body of the request
- Use `bcryptjs` to hash the password before storing it in your database

`routes/api/users.js`: Load input validations and user models.

### Setup `passport` middleware in `config/passport.js` and `config/keys.js`

More about the passport-jwt strategy: http://www.passportjs.org/packages/passport-jwt/

The jwt_payload will be sent via our `login` endpoint.

### Create the Login endpoint

For our login endpoint, we will:

- Pull the `errors` and `isValid` variables from our `validateLoginInput(req.body)` function and check input validation
- If valid input, use MongoDB’s `User.findOne()` to see if the user exists
- If user exists, use `bcryptjs` to compare submitted password with hashed password in our database
- If passwords match, create our `JWT Payload`
- Sign our `jwt`, including our `payload`, `keys.secretOrKey` from `keys.js`, and setting an `expiresIn` time (in seconds)
- If successful, append the token to a `Bearer` string (remember in our `passport.js` file, we set `opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();`)

This is in `routes/api/users.js` too.

# Frontend

- Static components for our `Navbar`, `Landing`, `Login` and `Register` pages
- Setup `Redux` for global state management

## Initialize npm and install necessary packages

```
"scripts": {
    "client-install": "npm install --prefix client",
    "start": "node server.js",
    "server": "nodemon server.js",
    "client": "npm start --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\""
},
```

When we make requests from React with `axios`, we want to make requests to relative URLs like:

```
axios.post('/api/users/register');
```

So `client/package.json` has the following under the `scripts` object:

```
"proxy": "http://localhost:8802",
```

### Dependencies

- `axios`: promise based HTTP client for making requests to our backend
- `classnames`: used for conditional classes in our `JSX`
- `jwt-decode`: used to decode our `jwt` so we can get user data from it
- `react-redux`: allows us to use `Redux` with `React`
- `react-router-dom`: used for routing purposes
- `redux`: used to manage state between components (can be used with React or any other view library)
- `redux-thunk`: middleware for `Redux` that allows us to directly access the dispatch method to make asynchronous calls from our actions

## Components

- Navbar
- Landing
- Register
- Login

## Documentation sources

- Forms in React: https://reactjs.org/docs/forms.html
- Handling events in React: https://reactjs.org/docs/handling-events.html

Every `form` element has an `onChange` event that ties its value to our components state
In our `onSubmit` event, we’ll use `e.preventDefault()` to stop the page from reloading when the submit button is clicked

We define routing paths using `react-router-dom`:

`<Route exact path=”/register” component={Register} /> `

At `localhost:3000/register`, render the `Register` component.

## Redux for state management

Instead of passing `state` from `component` to `component`, `Redux` provides a single source of truth that you can dispatch to any of your components.

![Here's a helpful React-Redux data flow diagram from @nikgraf.](https://miro.medium.com/max/960/0*iTKm2WNdmSD_qKQj.jpg)

We import the following into `App.js`:

```
import { Provider } from "react-redux";
import store from "./store";
```

And enclose the `JSX` in `App.js` with the following tag:

```
<Provider store={store}>
</Provider>
```

### Redux file structure

- `src/store.js`
- `reducers/index.js`, `reducers/authReducers.js`, `reducers/errorReducers.js`
- `actions/authActions.js`, `actions/types.js`

`createStore()` creates a `Redux` store that holds the complete state tree of the app. There should only be a single store in the app.

- `src/store.js` contains a `rootReducer`
- `actions/types.js` contains actions, which are dispatched to the store when a user clicks a button or submits a form

`Reducers` are pure functions that specify how application state should change in response to an `action`. `Reducers` respond with the new `state`, which is passed to our `store` and, in turn, our UI.

Our flow for reducers is:
- Import all our `actions` from our `types.js` file
- Define our `initialState`
- Define how `state` should change based on `action`s with a `switch` statement

`reducers/index.js` uses `combinedReducers` from `redux` to combine our `authReducer` and `errorReducer` into one `rootReducer`.

#### `auth` token

- `utils/setAuthToken.js`

We use this to set and delete the `Authorization` header for our `axios` requests depending on whether a user is logged in or not.

#### `Action`s

The general flow for `action`s is:

- Import dependencies and `action` definitions from `types.js`
- Use `axios` to make `HTTPRequest`s within certain action
- Use `dispatch` to send `action`s to our `reducers`

# Linking Redux with React Components

## Using `connect` from `react-redux`

`connect()` connects our `React` components to our `Redux store` provided by the `Provider` component

You can read more here: https://react-redux.js.org/api/connect

### `components/auth/Register.js` and `components/auth/Login.js`

In `components/auth/Register.js`, we wrap our Register with a `withRouter()`. While it is easy to redirect within a component (can simply say `this.props.history.push('/dashboard')` for example), we can’t do that by default within an `action`. To allow us to redirect within an action, we:

- used `withRouter` from `react-router-dom`, wrapping our component in our `export withRouter()`
- add a parameter to `this.props.history` within our call to `this.props.registerUser(newUser, this.props.history)` in our `onSubmit` event so we can easily access it within our action

Similar logic applies to `components/auth/Login.js`.

#### `mapStateToProps`

`mapStateToProps` allows us to get our `state` from `Redux` and map it to `props` which we can use inside components, allowing us to call `this.props.auth` or `this.props.errors` within our `Register` component.

#### `propTypes`

Since we cannot define types in our `constructor`, it is considered good convention to do so using the `prop-types` package.

#### `componentWillReceiveProps(nextProps)`

Per the first conditional statement of our `componentWillReceiveProps(nextProps)` lifecycle method, when the user logs in, the app redirects us to `/dashboard`. The `Dashboard` component is a `PrivateRoute` so that only a logged in user can view it.

#### `componentDidMount`

It wouldn't make sense for logged in users to be able to access the `/login` and `/register` pages. If a logged in user navigates to either of these, we immediately redirect them to the dashboard using `componentDidMount()`.

### Protected Routes

There is no standard way of creating protected routes in `React`. We created authenticated routes (routes that only certain users can access based on their auth status) using `PrivateRoute.js`.

In `App.js`, we:
- check `localStorage` for a token to keep the user logged in even if they close or refresh the app (e.g. until they log out or the token expires)
- pull in our `Dashboard` component and define it as a `PrivateRoute`

# Source

https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669
