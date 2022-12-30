const LoginForm = ({ loginHandler, onNameChange, onPasswordChange }) => {
  return(
    <div>
      <h2>Login</h2>
      <form onSubmit={loginHandler}>
        <div>
            username <input id="username" type="text" placeholder="your username" onChange={onNameChange} />
        </div>
        <div>
            password <input id="password" type="text" placeholder="your passowrd" onChange={onPasswordChange} />
        </div>
        <button id="loginbutton" type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm