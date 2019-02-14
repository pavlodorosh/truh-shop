import React, { Component } from 'react'

export default class RegisterForm extends Component {
	state = {}

	render() {
		return (
			<>
				<form>
					<input type="text" name="username" placeholder="Username" onChange={this.props.handleChange} />
					<input type="email" name="email" placeholder="Email Address" onChange={this.props.handleChange} />
					<input type="password" name="password" placeholder="Password" onChange={this.props.handleChange} />
					<input type="password" name="passwordConfirmation" placeholder="Password Confirmation" onChange={this.props.handleChange} />
					<button type="submit">Sign up</button>
				</form>
			</>
		)
	}
}
