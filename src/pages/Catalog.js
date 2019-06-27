import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { database } from '../firebase'
import Filter from '../components/Filter'

class Catalog extends Component {
	constructor(props) {
		super(props)
		this.state = {
			products: {},
			colors: [],
			brands: [],
			sizes: [],
			priceValue: {
				min: 0,
				max: 100
			},
			priceRange: {
				min: 0,
				max: 100
			},
			filterGender: '',
			filterColor: [],
			filterBrand: [],
			filterSize: []
		}
	}

	getProductsFromDatabase = () => {
		database.ref('/products').on('value', snapshot => {
			this.setState(
				{
					products: snapshot.val()
				},
				() => {
					if (this.state.products != undefined) {
						this.getAllColors()
						this.getAllBrands()
						this.getAllSizes()
						this.getMinMaxPrice()
					}
				}
			)
		})
	}

	componentWillMount = () => {
		this.getProductsFromDatabase()
	}

	getMinMaxPrice = () => {
		let array = Object.values(this.state.products)
		let prices = []
		array.map((item, index) => {
			for (let i = 0; i < item.groups.length; i++) {
				for (let j = 0; j < item.groups[i].attributes.length; j++) {
					prices.push(item.groups[i].attributes[j].price)
				}
			}
		})
		let min = Math.min(...prices)
		let max = Math.max(...prices)
		let value = {
			min,
			max
		}
		this.setState({
			priceValue: value,
			priceRange: value
		})
	}

	getAllColors = () => {
		let array = Object.values(this.state.products)
		let colorsArr = []
		array.map((item, index) => {
			for (let i = 0; i < item.groups.length; i++) {
				colorsArr.push(item.groups[i].color)
			}
		})
		colorsArr = colorsArr.filter(color => color.length)
		colorsArr = [...new Set(colorsArr)]
		this.setState({
			colors: colorsArr
		})
	}

	getAllBrands = () => {
		let array = Object.values(this.state.products)
		let brandsArr = []
		array.map((item, index) => {
			brandsArr.push(item.brend)
		})
		brandsArr = brandsArr.filter(brand => brand.length)
		brandsArr = [...new Set(brandsArr)]
		this.setState({
			brands: brandsArr
		})
	}

	getAllSizes = () => {
		let array = Object.values(this.state.products)
		let sizesArr = []
		array.map((item, index) => {
			for (let i = 0; i < item.groups.length; i++) {
				for (let j = 0; j < item.groups[i].attributes.length; j++) {
					sizesArr.push(item.groups[i].attributes[j].size)
				}
			}
		})
		sizesArr = sizesArr.filter(size => size.length)
		sizesArr = [...new Set(sizesArr)]
		this.setState({
			sizes: sizesArr
		})
	}

	updateDataFilter = (group, value) => {
		if (group === 'price') {
			this.setState({
				priceRange: value
			})
		}
		if (group === 'gender') {
			this.setState({
				filterGender: value
			})
		}
		if (group === 'color') {
			this.setState(prevState => {
				let colors = [...prevState.filterColor]
				if (colors.indexOf(value) == -1) {
					colors.push(value)
				} else {
					let index = colors.indexOf(value)
					colors.splice(index, 1)
				}
				return { filterColor: colors }
			})
		}
		if (group === 'size') {
			this.setState(prevState => {
				let sizes = [...prevState.filterSize]
				if (sizes.indexOf(value) == -1) {
					sizes.push(value)
				} else {
					let index = sizes.indexOf(value)
					sizes.splice(index, 1)
				}
				return { filterSize: sizes }
			})
		}
		if (group === 'brand') {
			this.setState(prevState => {
				let brands = [...prevState.filterBrand]
				if (brands.indexOf(value) == -1) {
					brands.push(value)
				} else {
					let index = brands.indexOf(value)
					brands.splice(index, 1)
				}
				return { filterBrand: brands }
			})
		}

		if (group === 'reset') {
			this.setState({
				filterGender: '',
				filterSize: [],
				filterColor: [],
				filterBrand: []
			})
			this.getMinMaxPrice()
		}
	}

	toLowerCaseString = data => {
		return data.toLowerCase()
	}

	checkFilter = product => {
		let prices = []
		for (let i = 0; i < product.groups.length; i++) {
			for (let j = 0; j < product.groups[i].attributes.length; j++) {
				prices.push(product.groups[i].attributes[j].price)
			}
		}

		let sizes = []
		for (let i = 0; i < product.groups.length; i++) {
			for (let j = 0; j < product.groups[i].attributes.length; j++) {
				sizes.push(product.groups[i].attributes[j].size)
			}
		}

		let colors = []
		for (let j = 0; j < product.groups.length; j++) {
			colors.push(product.groups[j].color)
		}

		if (Math.min(...prices) >= this.state.priceRange.min && Math.max(...prices) <= this.state.priceRange.max) {
			if (!this.state.filterGender.length || product.gender == this.state.filterGender) {
				if (this.isBrend(product) && this.isColor(colors) && this.isSize(sizes)) {
					return true
				}
			}
		}
		return false
	}

	isBrend = product => {
		if (!this.state.filterBrand.length) {
			return true
		} else {
			for (let k = 0; k < this.state.filterBrand.length; k++) {
				if (this.state.filterBrand[k] == product.brend) {
					return true
				}
			}
		}
		return false
	}

	isColor = array => {
		if (!this.state.filterColor.length) {
			return true
		} else {
			for (let j = 0; j < array.length; j++) {
				for (let i = 0; i < this.state.filterColor.length; i++) {
					if (this.state.filterColor[i] === array[j]) {
						return true
					}
				}
			}
		}
		return false
	}

	isSize = array => {
		if (!this.state.filterSize.length) {
			return true
		} else {
			for (let j = 0; j < array.length; j++) {
				for (let i = 0; i < this.state.filterSize.length; i++) {
					if (this.state.filterSize[i] === array[j]) {
						return true
					}
				}
			}
		}
		return false
	}

	renderProducts = () => {
		const { match } = this.props
		if (this.state.products !== null) {
			let generateArray = Object.values(this.state.products)
			let array = generateArray.filter(product => product.active && this.checkFilter(product))
			return array.map((item, index) => (
				<div className="col-lg-3 col-md-3 col-sm-3 col-3" key={item.id}>
					<div>
						<Link to={`/product/${match.params.parentCat}/${match.params.cat}/${item.name.en.toLowerCase()}`}>
							<img alt="" className="card-img" src={item.groups[0].imagesUrls[0]} />
						</Link>
						<div className="caption">
							<div className="title">{item.name.en}</div>
						</div>
					</div>
				</div>
			))
		}
	}

	render() {
		return (
			<div className="container-fluid catalog">
				<div className="container">
					<div className="row">
						<div className="col-lg-3 col-md-3 col-sm-6 col-12">
							<Filter
								colors={this.state.colors}
								brands={this.state.brands}
								sizes={this.state.sizes}
								price={this.state.priceValue}
								priceRange={this.state.priceRange}
								updateDataFilter={this.updateDataFilter}
							/>
						</div>
						<div className="col-lg-9 col-md-9 col-sm-6 col-12">{this.renderProducts()}</div>
					</div>
				</div>
			</div>
		)
	}
}
export default Catalog
