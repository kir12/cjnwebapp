import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { readCSV, DataFrame, toJSON } from 'danfojs';
import events from './events.csv';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { colors, get_cookie_list, cmp } from "./Utils.js"
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faFilter, faBook } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import EventDescription from './EventDescription';
import Bookmark from "./Bookmark";
import FilterOptions from "./FilterOptions"
import Button from 'react-bootstrap/Button';

dayjs.extend(customParseFormat)

function MoreInfo({show, handleClose}) {

  return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>More Con Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4><a href="http://www.conjanai.org/" target="_blank" rel="noreferrer">Con Ja Nai XXVII</a></h4>
            <p>A free mini-anime convention hosted by Animania, U of M's anime club</p>
          <h5>Sponsors and Affiliates</h5>
          <ul>
            <li><a href="https://maizepages.umich.edu/organization/ontaku" target="_blank" rel="noreferrer">Ontaku</a> (<a href="https://discord.gg/UQze7V7" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon> Discord</a>)</li>
            <li>DCC</li>
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

function Dataset({mode, param_fxn}) {
  const [dataSet, setDataSet] = useState(new DataFrame());
  const [dataUpdated, setDataUpdated] = useState(false);
  const [showEventDescription, setShowEventDescription] = useState(false);
  const [eventDetails, setEventDetails] = useState({});
  const [evtPrint, setEvtPrint] = useState(<></>);


  function handleEventOnClick(index, evtbulk){
    let evt = toJSON(dataSet.loc({rows:[index]}))[0];
    setEventDetails(evt);
    setShowEventDescription(true);
    setEvtPrint(evtbulk);
  };
  const handleEventOnHide = () => setShowEventDescription(false);


  // pull in and construct data table
  function combineTimeColumnsStart(row) {
    return dayjs(row[3] + " " + row[4], "M/D/YY H:mm").toISOString();
  }

  function combineTimeColumnsEnd(row) {
    return dayjs(row[5] + " " + row[6], "M/D/YY H:mm").toISOString();
  }

  useEffect(() => {

    const fetchData = async () => {
      let data = await readCSV(events);
      // data.head().print();
      if (!dataUpdated) {

        data = data.addColumn("combinedStart",data.apply(combineTimeColumnsStart, {axis:1}))
        data = data.addColumn("combinedEnd",data.apply(combineTimeColumnsEnd, {axis:1}))
        data = data.sortValues("combinedStart",{ascending:true});
        data = data.addColumn("uniqueID",data.index, {axis:1});

        let event_types = toJSON(data["event_type"].unique())[0];
        let room_list = toJSON(data["event_room"].unique())[0];
        let params = {'event_types':event_types, 'room_list': room_list};
        param_fxn(params, 'toFilterOptions');
        // optional: drop original time parameters

        setDataSet(data);
        setDataUpdated(true);
      }
    }

    fetchData().catch(console.error);

  });

  let output = [];

  if (dataUpdated) {

    let event_types = toJSON(dataSet["event_type"].unique())[0];

    let displayData = dataSet;
    if(mode === "bookmarks"){
      let cookie_list = get_cookie_list();
      console.log(cookie_list);
      cookie_list = cookie_list.map(Number);
      cookie_list.sort(cmp);
      displayData = dataSet.loc({rows:cookie_list});
    }
    else if(mode === "filter"){

    }
    else{

    }
   
    if(displayData.index.length > 0){
      displayData = displayData.sortValues("combinedStart",{acending: true});
    }

    let jsonexport = toJSON(displayData);
    jsonexport.forEach(function (elem, index_) {

      let index = elem["uniqueID"];

      // compute event type badge styling
      let evttype = (elm) => elm === elem["event_type"];
      let event_idx = event_types.findIndex(evttype);
      let css_class = colors[event_idx];

      // compute time display
      let startjs = dayjs(elem["combinedStart"]);
      let endjs = dayjs(elem["combinedEnd"]);
      let format_str = "";
      if(startjs.day() !== endjs.day()){
        format_str = "D/M h:mm A";
      }
      else{
        format_str = "h:mm A";
      }
      startjs = startjs.format(format_str);
      endjs = endjs.format(format_str);

      let eventbulk = (<>
        <h3>{elem["event_title"]} </h3>
        <p>{elem["event_room"]}, {startjs.toString()} - {endjs.toString()}</p>
        <p><Badge pill className={css_class}>{elem["event_type"]}</Badge> <Badge pill bg="danger">{elem["event_age_limit"]}</Badge></p>
      </>);

      // generate event listing
      output.push(
        <ListGroup.Item key={index}>
          <Row>
            <Col xs="10" onClick={() => handleEventOnClick(index, eventbulk)}>
              {eventbulk}
            </Col>
            <Col xs="2" className="text-center align-self-center">
              <Bookmark index={index}></Bookmark>
            </Col>
          </Row>
       </ListGroup.Item>
      );
    });

  }

  return (
    <>
      <EventDescription show_var={showEventDescription} hide_fxn={handleEventOnHide} event_package={eventDetails} evt_print={evtPrint}></EventDescription>
      <ListGroup>
        {output}
      </ListGroup>
    </>
  );
}

function App() {

  const [mode, setMode] = useState("home");
  const [showFilterPane, setshowFilterPane] = useState(false);
  const [filterOptions, setFilterOptions] = useState({});

  const [showModal, setShowModal] = useState(false);
  const handleModalOnClick = () => setShowModal(true);
  const handleModalOnHide = () => setShowModal(false);

  const handleFilterPaneOnHide = () => setshowFilterPane(false);

  function handleRoleChange(type) {
    setMode(type);
    if(type === "filter" & !('activeFilter' in filterOptions)) {setshowFilterPane(true)};
  }

  function dualLink(params, mode) {
    if(mode === "toFilterOptions"){
      setFilterOptions(params);
    }
  }

  return (
    <>
      <div className="App">
        <Container >
          <Nav fill variant="pills" defaultActiveKey="home" className="sticky-top bg-white shadow-sm">
            <Nav.Item onClick={() => handleRoleChange("home")}>
              <Nav.Link eventKey="home"><FontAwesomeIcon icon={faBook}></FontAwesomeIcon> Events</Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => handleRoleChange("bookmarks")}>
              <Nav.Link eventKey="bookmarks"><FontAwesomeIcon icon={fasStar}></FontAwesomeIcon> Bookmarks</Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => handleRoleChange("filter")}>
              <Nav.Link eventKey="filter"><FontAwesomeIcon icon={faFilter}></FontAwesomeIcon> Filter</Nav.Link>
            </Nav.Item>
          </Nav>
          <FilterOptions show_var={showFilterPane} hide_fxn={handleFilterPaneOnHide} param_fxn={dualLink} filterOptions={filterOptions}></FilterOptions>
          <Dataset mode={mode} param_fxn={dualLink}></Dataset>
        </Container>
      </div>
      <MoreInfo show={showModal} handleClose={handleModalOnHide}></MoreInfo>
      <Container fluid className="d-flex justify-content-evenly footer">
        <p className="mb-0"><a href="https://github.com/kir12/cjnwebapp" target="_blank" className="text-black" rel="noreferrer">About App</a></p>
        <p className="mb-0"><a href="javascript:;" className="text-black" onClick={handleModalOnClick} rel="noreferrer">Con Info</a></p>
        <p className="mb-0"><a href="https://www.google.com/search?q=marisa+kirisame&client=firefox-b-1-d&source=lnms&tbm=isch&sa=X&ved=2ahUKEwioqcvz4fT9AhW2kYkEHTCND3AQ0pQJegQIBBAC&biw=1920&bih=884&dpr=1" target="_blank" className="text-black" rel="noreferrer">Best Waifu</a></p>
      </Container>
    </>
  );
}

export default App;
