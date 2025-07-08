import {Image} from 'react-bootstrap';
import './styles.css';

export default function TitleImg() {
  // return(
  //   <div>TitleImg</div> 
  // );
  return (
    <div className="TitleImage" >
      <Image src="https://s3.us-east-2.amazonaws.com/jeff.ski/title/jeff_villarica_horse_2025.jpg" fluid />
    </div>
  );
}