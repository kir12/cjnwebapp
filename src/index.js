import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faLocationDot, faMapLocationDot, faSquareParking, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

const root = ReactDOM.createRoot(document.getElementById('root'));

// TODO: export out as prop when con-specific code is ripped out to its own file
let menupagedata = [
  {
    "header": (<><FontAwesomeIcon icon={faLocationDot} fixedWidth></FontAwesomeIcon> Directions</>),
    "body": (<>test</>)
  },
  {
    "header": (<><FontAwesomeIcon icon={faSquareParking} fixedWidth></FontAwesomeIcon> Parking</>),
    "body": (<>test</>)
  },
  {
    "header": (<><FontAwesomeIcon icon={faMapLocationDot} fixedWidth></FontAwesomeIcon> Convention Center & Map</>),
    "body": (<>test</>)
  },
  {
    "header": (<><FontAwesomeIcon icon={faUtensils} fixedWidth></FontAwesomeIcon> Nearby Restaraunts</>),
    "body": (<>test</>)
  },
  {
    "header": (<><FontAwesomeIcon icon={faCircleInfo} fixedWidth></FontAwesomeIcon> About The Con</>),
    "body": (
      <>
        <h4><a href="http://www.conjanai.org/" target="_blank" rel="noreferrer">Con Ja Nai XXVII</a></h4>
          <p>A free mini-anime convention hosted by <a href="https://maizepages.umich.edu/organization/animania" target="_blank" rel="noreferrer">Animania</a>, U of M's anime club</p>
        <h5>Sponsors and Affiliates</h5>
        <ul>
          <li><a href="https://maizepages.umich.edu/organization/ontaku" target="_blank" rel="noreferrer">Ontaku</a> (<a href="https://discord.gg/UQze7V7" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon> Discord</a>)</li>
          <li><a href="https://dreamscomechuu.square.site/" target="_blank" rel="noreferrer">Dreams Come Chuu Maid Cafe</a></li>
          <li><a href="https://ii.umich.edu/cjs" target="_blank" rel="noreferrer">U of M Center of Japanese Studies</a></li>
          <li><a href="https://www.vaultofmidnight.com/" target="_blank" rel="noreferrer">Vault of Midnight</a></li>
          <li><a href="https://maruposeggtarts.square.site/about-us" target="_blank" rel="noreferrer">Marupo's Egg Tarts</a></li>
          <li><a href="https://www.csg.umich.edu/sofc" target="_blank" rel="noreferrer">U of M SOFC</a></li>
        </ul>
        <h5>Donate to Animania</h5>
        <p>Animania would appreciate donations of any amount to ensure that large events like Con Ja Nai can continue to be organized into the future.</p>
        <p>If you are interested, please send any monetary contributions to our Venmo at <b>@Animania</b>. Thank you very much for your support!</p>
      </>
    )
  }
];

let menuheader = (<>Con Ja Nai 2023</>);

root.render(
  <React.StrictMode>
    <App menupagedata={menupagedata} menuheader={menuheader}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
