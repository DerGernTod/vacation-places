import React from 'react';
import { SearchInput } from './components/SearchInput';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import { MAPBOX_GL_TOKEN } from './api-constants';
const mapboxGl = require('mapbox-gl/dist/mapbox-gl.js');
mapboxGl.accessToken = MAPBOX_GL_TOKEN;

export class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			locations: [],
			locationIds: 0
		};
	}
	componentDidMount() {
		window.map = new mapboxGl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v11'
		});
	}
	handleRLDDChange(newLocations) {
		this.setState({
			locations: newLocations
		});
	}
	handleResultAdded(result) {
		this.setState({
			locations: this.state.locations.concat([ { ...result, id: this.state.locationIds } ]),
			locationIds: this.state.locationIds + 1
		});
	}
	handleDelete(item) {
		this.setState({
			locations: this.state.locations.reduce((allLocations, curItem) => {
				if (curItem !== item) {
					allLocations.push(curItem);
				}
				return allLocations;
			}, [])
		});
	}
	render() {
		return (
			<div className="app flex">
				<aside>
					<SearchInput onResultAdded={(result) => this.handleResultAdded(result)} />
					<RLDD
						className="values"
						items={this.state.locations}
						itemRenderer={(item) => (
							<div className="item">
								<div>
									{item.formatted}
								</div>
								<img alt="delete"
									onClick={() => this.handleDelete(item)}
									src="./images/cross-solid.svg" />
							</div>
						)}
						onChange={(res) => this.handleRLDDChange(res)}
					/>
				</aside>
				<main id="map" className="flex-grow-1" />
			</div>
		);
	}
}
