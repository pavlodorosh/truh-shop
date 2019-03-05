import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Front from './pages/Front'
import About from './pages/About'
import Catalog from './pages/Catalog'
import Contacts from './pages/Contacts'
import Header from './components/Header/Header'
import HeaderAdmin from '../src/admin/components/Header/Header'
import FooterAdmin from '../src/admin/components/Footer/Footer'
import Footer from './components/Footer'
import Category from './pages/Category'
import SubCategory from './pages/SubCategory'
import Product from './pages/Product'
import Admin from './admin/pages/Admin'

class App extends Component {
	componentDidUpdate() {
		if (window.location.href.indexOf('/user') > 0) require('./admin.css')
		else require('./index.css')
	}
	componentDidMount() {
		if (window.location.href.indexOf('/user') > 0) require('./admin.css')
		else require('./index.css')
	}
	render() {
		return (
			<>
				<header>
					<Route exact path="/" component={Header} />
					<Route path="/(contacts|about|catalog|category|subcategory|product)/" component={Header} />

					<Route path="/user" component={HeaderAdmin} />
				</header>

				<Route exact path="/" component={Front} />
				<Route path="/contacts" component={Contacts} />
				<Route path="/about" component={About} />
				<Route path="/catalog" component={Catalog} />
				<Route path="/category" component={Category} />
				<Route path="/subcategory" component={SubCategory} />
				<Route path="/product" component={Product} />

				<Route path="/user" component={Admin} />

				<footer>
					<Route exact path="/" component={Footer} />
					<Route path="/(contacts|about|catalog|category|subcategory|product)/" component={Footer} />

					<Route path="/user" component={FooterAdmin} />
				</footer>
			</>
		)
	}
}

export default App
