import React, { Component } from 'react';
import { forwardSearchLocation } from '../utils';

export class SearchInput extends Component {
    state = {
		searchVal: '',
		searchResults: [],
		isFetching: 0,
		timeoutId: -1
    }

    async search(val) {
        const fetchRequest = forwardSearchLocation(val || this.state.searchVal);
        this.setState({
            isFetching: this.state.isFetching + 1
        });
        const result = await fetchRequest;
        // if it's 0, we aborted the search basically
        if (this.state.isFetching > 0) {
            const resultsArray = result.results;
            resultsArray.sort((a, b) => b.confidence - a.confidence);
            this.setState({
                isFetching: Math.max(0, this.state.isFetching - 1),
                searchResults: result.results
            });
        }
    }
    handleSearchChange(e) {
        clearTimeout(this.state.timeoutId);
        const val = e.target.value;
        this.setState({
            searchVal: val,
            timeoutId: setTimeout(() => {
                this.search(val);
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
    handleSearchBlur() {
    }
    handleSearchKeyUp(e) {
        if (e.key === 'Enter') {
            this.setState({
                searchVal: e.target.value
            });
            this.search(e.target.value);
        }
    }
    render() {
        return (
            <>
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
                        onKeyUp={(e) => this.handleSearchKeyUp(e)}
                        onBlur={(e) => this.handleSearchBlur(e)}
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
            </>
        );
    }
}