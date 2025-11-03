import React from 'react';
import '../hobbiesStyles.css';

export interface TvShowProps {
  title: string;
  season?: number;
  thumb: string;
}

const TvShow: React.FC<TvShowProps> = ({ title, season, thumb }) => {
  return (
    <div className="HobbieContentItem" >
      <div className="hobbieImageContainer" >
        <img className="hobbieImage tvshowImage" src={thumb} alt={`${title} Show`} />
      </div>
      <div className="hobbieItemInfoContainer">
        <div className="hobbieItemInfo" >
          <div className="hobbieItemTitle" >Show:</div>
          <div className="hobbieItemText" >{title}</div>
        </div>
        {season !== undefined && (
          <div className="hobbieItemInfo" >
            <div className="hobbieItemTitle" >Season:</div>
            <div className="hobbieItemText" >{season}</div>
          </div>
        )}
      </div >
    </div>
  );
};

export default TvShow;