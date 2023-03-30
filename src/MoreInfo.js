import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MoreInfo({show, handleClose}) {

  return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>More Con Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4><a href="http://www.conjanai.org/" target="_blank" rel="noreferrer">Con Ja Nai XXVII</a></h4>
            <p>A free mini-anime convention hosted by <a href="https://maizepages.umich.edu/organization/animania" target="_blank" rel="noreferrer">Animania</a>, U of M's anime club</p>
          <h5>Sponsors and Affiliates</h5>
          <ul>
            <li><a href="https://maizepages.umich.edu/organization/ontaku" target="_blank" rel="noreferrer">Ontaku</a> (<a href="https://discord.gg/UQze7V7" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon> Discord</a>)</li>
            <li><a href="https://dreamscomechuu.square.site/" target="_blank" rel="noreferrer">Dreams Come Chuu Maid Cafe</a></li>
            <li><a href="https://ii.umich.edu/cjs" target="_blank" rel="noreferrer">U of M Center of Japanese Studies</a></li>
          </ul>
          <h5>Donate to Animania</h5>
          <p>Animania would appreciate donations of any amount to ensure that large events like Con Ja Nai can continue to be organized into the future.</p>
          <p>If you are interested, please send any monetary contributions to our Venmo at @Animania. Thank you very much for your support!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
           Close 
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

