import React, { Component } from 'react'
import Navbar from '../components/Navbar/Navbar'
import { Route } from 'react-router-dom'
import User from './User'
import UserList from './UserList'
import Dashboard from './Dashboard'
import CategoryList from './CategoryList'
import ProductList from './ProductList'
import EditProduct from '../components/Product/EditProduct'

export default class Admin extends Component {
	render() {
		return (
			<div>
				<Navbar />
				<Route path="/user/dashboard" component={Dashboard} />
				<Route path="/user/profile" component={User} />
				<Route path="/user/users" component={UserList} />
				<Route path="/user/categories" component={CategoryList} />
				<Route path="/user/products" component={ProductList} />
				<Route path="/user/edit/product/:id" component={EditProduct} />
			</div>
		)
	}
}
