import React from 'react';
import { SearchInput } from './components/SearchInput';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import { MAPBOX_GL_TOKEN } from './api-constants';
import { SolidCrossSvg } from './components/SolidCrossSvg';
import L from 'leaflet';
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
		// const myMap = L.map('map').setView([51.505, -0.09], 13);
		// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		// 	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		// 	maxZoom: 18,
		// 	id: 'mapbox.streets',
		// 	accessToken: MAPBOX_GL_TOKEN
		// }).addTo(myMap);
		window.map = new mapboxGl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v11'
		});
	}
	componentDidUpdate() {
		
		this.state.locations.forEach(item => new mapboxGl.Marker()
			.setLngLat([item.geometry.lng, item.geometry.lat])
			.addTo(window.map));

		// var polyline = L.polyline(latlngs, {color: 'red'}).addTo(window.map);
		// zoom the map to the polyline
		// window.map.fitBounds(polyline.getBounds());
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
								<div className="flex-gap-1em"></div>
								<div className="delete-item">
									<SolidCrossSvg
										onClick={() => this.handleDelete(item)}
									/>
								</div>
							</div>
						)}
						onChange={(res) => this.handleRLDDChange(res)}
					/>
				</aside>
				<main className="flex-grow-1">
					<div id="map"></div>
				</main>
			</div>
		);
	}
}
