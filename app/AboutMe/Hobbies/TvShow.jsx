import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

class TvShow extends React.Component {
  render() {

    let seasonRender = null;
    if (this.props.season) {
      seasonRender = (<div className="tvshowInfo" >
        <div className="tvshowTitle" >Season:</div>
        <div className="tvshowText" >{this.props.season}</div>
      </div>
      );
    }

    return (
      <div className="TvShow" >
        <div className="tvshowImageContainer" >
          <img className="hobbieImage tvshowImage" src={this.props.thumb} alt={`${this.props.title} Show`} />
        </div>
        <div className="tvshowInfoContainer">
          <div className="tvshowInfo" >
            <div className="tvshowTitle" >Show:</div>
            <div className="tvshowText" >{this.props.title}</div>
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