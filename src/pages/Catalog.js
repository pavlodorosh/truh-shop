import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { database } from '../firebase'

class Catalog extends Component {
	constructor(props) {
		super(props)
		this.state = {
			products: {}
		}
	}

	getProductsFromDatabase = () => {
		database.ref('/products').on('value', snapshot => {
			this.setState({
				products: snapshot.val()
			})
		})
	}

	componentWillMount = () => {
		this.getProductsFromDatabase()
	}

	toLowerCaseString = data => {
		return data.toLowerCase()
	}

	filteredAndReducedProducts = () => {
		const { match } = this.props

		if (this.state.products !== null) {
			let f = Object.keys(this.state.products)
			console.log(f)

			const filtered = Object.keys(this.state.products)
				.filter(item => match.url === `/catalog/${this.toLowerCaseString(this.state.products[item].parentCategory)}/${this.toLowerCaseString(this.state.products[item].category)}`)
				.reduce((obj, key) => {
					return {
						...obj,
						[key]: this.state.products[key]
					}
				}, {})

			return filtered
		}
		return null
	}

	renderProducts = () => {
		let array = this.filteredAndReducedProducts()
		// console.log(match.path)
		// console.log(match.url.toString())

		if (this.state.products !== null) {
			return Object.keys(array).map((id, index) => (
				<div className="col-lg-3 col-md-3 col-sm-6 col-12" key={id}>
					<div>
						<Link
							to={`/product/${this.toLowerCaseString(this.state.products[id].parentCategory)}/${this.state.products[id].category}/${this.toLowerCaseString(
								this.state.products[id].name.en
							)}`}>
							<img alt="" className="card-img" src={this.state.products[id].mainImageUrl} />
						</Link>
						<div className="caption">
							<div className="title">{this.state.products[id].name.en}</div>
							<div className="price">{this.state.products[id].price}</div>
						</div>
					</div>
				</div>
			))
		}
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="container">
					<div className="row no-gutter">{this.renderProducts()}</div>
				</div>
			</div>
		)
	}
}
export default Catalog
