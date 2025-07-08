import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

class TvShow extends React.Component {
  render() {

    let seasonRender = null;
    if (this.props.season) {
      seasonRender = (<div className="hobbieItemInfo" >
        <div className="hobbieItemTitle" >Season:</div>
        <div className="hobbieItemText" >{this.props.season}</div>
      </div>
      );
    }

    return (
      <div className="HobbieContentItem" >
        <div className="hobbieImageContainer" >
          <img className="hobbieImage tvshowImage" src={this.props.thumb} alt={`${this.props.title} Show`} />
        </div>
        <div className="hobbieItemInfoContainer">
          <div className="hobbieItemInfo" >
            <div className="hobbieItemTitle" >Show:</div>
            <div className="hobbieItemText" >{this.props.title}</div>
          </div>
          {seasonRender}
        </div >
      </div>
    );
  }
}

TvShow.propTypes = {
  title: PropTypes.string.isRequired,
  season: PropTypes.number,
  thumb: PropTypes.string
}

export default TvShow;