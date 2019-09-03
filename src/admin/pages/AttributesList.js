import React, {useContext, useState, useEffect}  from 'react'
import { Textbox } from 'react-inputs-validation'
import Select from 'react-select'
import { adminData } from './Admin'
import { database } from '../../firebase'
import uuid from 'uuid/v4'

const Attributes = () => {
	const data = useContext(adminData)

	const [newOptionVisible, setNewOptionVisible] = useState(false)
	const [nameOption, setNameOption] = useState('')
	const [typeOption, setTypeOption] = useState('')
	const [variantsOption, setVariantsOption] = useState(false)
	const [optionsArray, addOrRemoveItem] = useState([''])
	const [simpleAttributes, getAttributes] = useState(null)

	useEffect(()=>{
		database.ref('/attributes').on('value', snapshot => {
			getAttributes(snapshot.val())			
		})
	})

	const types = [
		{
			value: 'text',
			label: 'Text'
		},
		{
			value: 'radio',
			label: 'Radio'
		},
		{
			value: 'check',
			label: 'Check'
		},
	]

	const saveAttributeToBase = () => {
		let attribute
		if(typeOption != 'radio'){
			attribute = {
				name: nameOption,
				type: typeOption,
				variants: null,
				id: nameOption + uuid(),
				label: nameOption
			}
		} else {
			attribute = {				
				name: nameOption,
				type: typeOption,
				variants: optionsArray,
				id: nameOption + uuid(),
				label: nameOption
			}
		}

		if(nameOption.length > 2 && typeOption != ''){
			return database
				.ref('/attributes')
				.child(nameOption + uuid())
				.set(attribute)
				.then(() => {
					addOrRemoveItem([''])
					setNewOptionVisible(false)
					setVariantsOption(false)
					setNameOption('')
				})
				.catch(err => {
					console.log(err)
				})
		}		
	}

	const removeAttrFromDatabase = (id) => {
		database
			.ref('/attributes')
			.child(id)
			.remove()
	}

    return (
        <div className="col-md-9">
				<div className="row">
					<div className="content-body">
						<div className="panel-heading">
							<div className="col-6">
								<div className="row">
									<h3 className="panel-title">Attributes List</h3>
								</div>
							</div>
						</div>
						<div className="panel-body">
							<table className="table table-striped table-bordered table-list">
								<thead>
									<tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Variants</th>
                                        <th></th>
									</tr>
								</thead>
								<tbody>
									{
										data.attributes.map((item, index)=> {
											return(
												<tr key={index.toString()}>
													<td>{item.label}</td>
													<td>{item.type}</td>
													<td></td>
													<td></td>	
												</tr>
											)
										})
									}
									{
										simpleAttributes &&
											Object.keys(simpleAttributes).map((id, index)=> {
												return(
													<tr key={index.toString()}>
														<td>{simpleAttributes[id].name}</td>
														<td>{simpleAttributes[id].type}</td>
														<td>
															<ul>
																{
																	simpleAttributes[id].variants &&
																		Object.keys(simpleAttributes[id].variants).map((variant, index) => (
																			<li key={index.toString()}>{simpleAttributes[id].variants[variant]}</li>
																		))
																}
															</ul>
														</td>
														<td>
															{
																<button onClick={()=>{removeAttrFromDatabase(id)}}>X</button>
															}	
														</td>
													</tr>
												)
											})
									}
									{
										newOptionVisible && (
											<tr>
												<td>
													<Textbox 
														type="text"
														className="form-control"
														name="name_new"
														onChange={(val, e) => {
															setNameOption(val)
														}}
														onBlur={() => {}}
														classNameInput="ama_input_validate"
														classNameContainer="ama_input_container"
														classNameWrapper="ama_input_wrapper"
														value={nameOption}
														placeholder="Enter name of option"
													/>
												</td>
												<td>
													<Select 
														placeholder="Choose type" 
														options={types} 
														onChange={e => {
															setTypeOption(e.value)
															if(e.value === 'radio'){
																setVariantsOption(true)
															} else {
																setVariantsOption(false)
															}
														}}
													/>
												</td>
												<td>
													<button onClick={()=>{
														saveAttributeToBase()
													}}>Save</button>
													<button onClick={()=>{
														addOrRemoveItem([''])
														setNewOptionVisible(false)
														setVariantsOption(false)
													}}>Cancel</button>
												</td>													
											</tr>
										)
									}
									{ 
										variantsOption && 												
											optionsArray.map(function(item, index){
												return (
													<tr key={index.toString()}>
														{console.log(index)}
														<td>Enter variants --></td>
														<td>
															{
																index == optionsArray.length - 1 ?																
																	<Textbox 
																		type="text"
																		className="form-control"
																		name="name_new"
																		onChange={(val, e) => {	
																			addOrRemoveItem(prevOptionsArray => {
																				prevOptionsArray[index] = val
																				return prevOptionsArray
																			})		
																		}}
																		onBlur={() => {}}
																		classNameInput="ama_input_validate"
																		classNameContainer="ama_input_container"
																		classNameWrapper="ama_input_wrapper"
																		value={item}
																		placeholder="Enter variant"
																	/>
																: 
																	<p>{item}</p>
															}
														</td>
														<td>
															{
																index == optionsArray.length - 1 && (
																	<div>
																		<button onClick={()=>{
																			if(optionsArray[index].length > 2){
																				addOrRemoveItem([...optionsArray, ''])
																			}
																		}}>+</button>
																		<button onClick={()=>{
																			addOrRemoveItem([''])
																		}}>Clear</button>
																	</div>
																)
																	
															}
															
														</td>
													</tr>
												)
											})
									}
								</tbody>
							</table>
							<button onClick={()=>{setNewOptionVisible(true)}}>Add New Option</button>
						</div>
					</div>
				</div>
			</div>
    )
}

export default Attributes