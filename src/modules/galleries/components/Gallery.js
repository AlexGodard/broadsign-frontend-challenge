import React, { Component } from "react";
import "./Gallery.css";
import { chunk, debounce } from "../../../helpers";
import logo from "../../../logo.svg";

const getNumberOfColumns = () => {
  if (window.innerWidth < 480) {
    return 1;
  } else if (window.innerWidth < 960) {
    return 2;
  } else if (window.innerWidth < 1200) {
    return 3;
  } else {
    return 4;
  }
};

class Gallery extends Component {
  state = {
    numberOfColumns: getNumberOfColumns(),
    imageChunks: []
  };


  // This lifecycle method is appropriate here, as the state depends on changes in props over time
  static getDerivedStateFromProps(props, state) {
    const oldChunks = state.imageChunks;
    const oldImageCount = oldChunks.reduce(
      (sum, chunk) => sum + chunk.length,
      0
    );
    const gotNewImages = props.images && props.images.length !== oldImageCount;

    if (gotNewImages) {
      // Concatenates the new images in the appropriate column (chunk) so the old ones stay where they are
      const newImages = props.images.slice(oldImageCount);
      const newChunks = chunk(
        newImages,
        newImages.length / state.numberOfColumns
      );

      return {
        imageChunks: oldChunks.length
          ? newChunks.map((newChunk, i) => oldChunks[i].concat(newChunk))
          : newChunks
      };
    }

    const colsChanged = oldChunks.length !== state.numberOfColumns;
    if (colsChanged && props.images) {
      // Recompute the chunks
      return {
        imageChunks: chunk(
          props.images,
          props.images.length / state.numberOfColumns
        )
      };
    }
    return {};
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const el = document.getElementById("image-container");
    // Increase the innerHeight a bit to fetch before we reach the end of page
    if (el.getBoundingClientRect().bottom <= window.innerHeight * 1.5) {
      this.props.onBottomReached();
    }
  };

  handleResize = () => {
    this.setState({ numberOfColumns: getNumberOfColumns() });
  };

  render() {
    const { error, loading, images, onInputChange, searchTerm } = this.props;

    return (
      <React.Fragment>
        <h1>Type anything!</h1>
        <input
          className="input-large"
          type="text"
          value={searchTerm}
          onChange={onInputChange}
        />
        {images && Boolean(images.length) && (
          <div id="image-container">
            {this.state.imageChunks.map((imageChunk, i) => (
              <div key={i} className="column">
                {imageChunk.map(image => (
                  <img
                    key={image.id}
                    className="image"
                    alt={image.description}
                    src={image.urls.small}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        {images && !images.length && <h4>No results found</h4>}
        {loading && (
          <div>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        )}
        {error && <h4 className="error-message">An error occurred: {error}</h4>}
      </React.Fragment>
    );
  }
}

export default Gallery;
