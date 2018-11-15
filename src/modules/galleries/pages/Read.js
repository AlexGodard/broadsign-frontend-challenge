import React, { Component } from "react";
import { debounce, handleErrors, throttle } from '../../../helpers';
import Gallery from "../components/Gallery";

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";

let currentPage = 0;

class Read extends Component {
  state = {
    searchTerm: "",
    images: null,
    error: null,
    loading: null,
    totalPages: null,
  };

  handleInputChange = event => {
    this.setState({ searchTerm: event.target.value });
    currentPage = 0;

    // Only send a request when the user has stopped typing for one second
    this.fetchNewImagesDebounced(event.target.value);
  };

  handleBottomReached = event => {
    if (this.state.totalPages > currentPage) {
      // The bottom reached event will trigger multiple times when scrolling, so we need to throttle
      // Debounce won't work here as we would need to wait for the user to stop scrolling for 1 second before fetching more
      this.fetchNewImagesThrottled(this.state.searchTerm);
    }
  };

  fetchNewImages = async searchTerm => {
    const firstFetch = currentPage === 0;
    currentPage += 1;

    this.setState({ loading: true });
    if (firstFetch) {
      this.setState({ images: null });
    }

    fetch(
      `${UNSPLASH_API_URL}?query=${searchTerm}&per_page=30&page=${currentPage}`,
      {
        method: "GET",
        headers: {
          "Accept-Version": "v1", // Prevents the app from breaking in case their API changes
          Authorization: `Client-ID ${
            process.env.REACT_APP_UNSPLASH_ACCESS_KEY
            }`
        }
      }
    )
    .then(handleErrors)
    .then(
      result => {
        this.setState({
          error: null,
          images: firstFetch
            ? result.results
            : [].concat(this.state.images).concat(result.results),
          loading: false,
          totalPages: result.total_pages,
        });
      },
    )
    .catch(error => {
      this.setState({
        error,
        loading: false
      });
    });
  };

  fetchNewImagesDebounced = debounce(this.fetchNewImages, 1000);
  fetchNewImagesThrottled = throttle(this.fetchNewImages, 1000);

  render() {
    const { error, loading, images, searchTerm } = this.state;

    return (
      <Gallery
        loading={loading}
        error={error}
        images={images}
        searchTerm={searchTerm}
        onInputChange={this.handleInputChange}
        onBottomReached={this.handleBottomReached}
      />
    );
  }
}

export default Read;
