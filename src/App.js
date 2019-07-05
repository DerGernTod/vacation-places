import React from 'react';
import { SearchInput } from './components/SearchInput';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import { MAPBOX_GL_TOKEN } from './api-constants';
import { SolidCrossSvg } from './components/SolidCrossSvg';
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
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
		const stored = JSON.parse(localStorage.getItem('travel'));
		if (stored) {
			this.setState(stored);
		}
	}
	componentDidUpdate() {
		localStorage.setItem('travel', JSON.stringify(this.state));

		// this.state.locations.forEach(item => new mapboxGl.Marker()
		// 	.setLngLat([item.geometry.lng, item.geometry.lat])
		// 	.addTo(window.map));

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
		const { markers, lineLocations } = this.state.locations.reduce((result, location, index) => {
			const point = [location.geometry.lat, location.geometry.lng];
			result.markers.push(
				<Marker key={index} position={point}>
					<Popup>
						<span>{location.formatted}</span>
					</Popup>
				</Marker>
			);
			result.lineLocations.push(point);
			return result;
		}, { markers: [], lineLocations: [] });
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
					<Map center={lineLocations.reduce((avg, loc) => {
						avg[0] = avg[0] + loc[0] / lineLocations.length;
						avg[1] = avg[1] + loc[1] / lineLocations.length;
						return avg;
					}, [0, 0])} zoom={7}>
						<TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
						  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
						{markers}
						{lineLocations.length > 1 && <Polyline positions={lineLocations} />}
					</Map>
				</main>
			</div>
		);
	}
}
