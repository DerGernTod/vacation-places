import React from 'react';
import { forwardSearchLocation } from '../utils';

export class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchVal: '',
            searchResults: [],
            isFetching: 0,
            timeoutId: -1
        }
    }
    handleSearchChange(e) {
        clearTimeout(this.state.timeoutId);
        this.setState({
            searchVal: e.target.value,
            timeoutId: setTimeout(async () => {
                const fetchRequest = forwardSearchLocation(this.state.searchVal);
                this.setState({
                    isFetching: this.state.isFetching + 1
                });
                const result = await fetchRequest;
                const resultsArray = result.results;
                resultsArray.sort((a, b) => b.confidence - a.confidence);
                this.setState({
                    isFetching: this.state.isFetching - 1,
                    searchResults: result.results
                });
            }, 1000)
        });
    }
    handleResultClicked(result) {
        console.log('clicked result: ', result);
        this.setState({
            searchResults: [],
            searchVal: ''
        });
        this.props.onResultAdded(result);
    }
    render() {
        return (
            <React.Fragment>
                <div className='search-box flex flex-align-center flex-justify-between'>
                    <label htmlFor='search-input' className='search-label flex flex-align-center flex-justify-center'>
                        <img alt='search' src='images/search-solid.svg' style={
                            {
                                width: '1em',
                                height: '1em',
                                margin: '0 .5em'
                            }} />
                    </label>
                    <input
                        id='search-input'
                        value={this.state.searchVal}
                        onChange={(e) => this.handleSearchChange(e)}
                        placeholder='Search...'
                        className='flex-grow-1 with-icon'
                    ></input>
                </div>
                {this.state.searchResults && (
                    <ul className='search-dropdown'>
                        {this.state.searchResults.map((result, id) => 
                        (<li key={id} onClick={e => this.handleResultClicked(result)}>
                            {result.formatted}
                        </li>)
                        )}
                    </ul>
                )}
            </React.Fragment>
        );
    }
}