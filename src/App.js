import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { readCSV, DataFrame, toJSON } from 'danfojs';
import events from './events.tsv';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { colors, get_cookie_list } from "./Utils.js"
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faFilter, faBook } from '@fortawesome/free-solid-svg-icons';
import EventDescription from './EventDescription';
import Bookmark from "./Bookmark";

dayjs.extend(customParseFormat)


function Dataset({mode}) {
  const [dataSet, setDataSet] = useState(new DataFrame());
  const [dataUpdated, setDataUpdated] = useState(false);
  const [showEventDescription, setShowEventDescription] = useState(false);
  const [eventDetails, setEventDetails] = useState({});
  const [evtPrint, setEvtPrint] = useState(<></>);

  function handleEventOnClick(index, evtbulk){
    let evt = toJSON(dataSet.iloc({rows:[index]}))[0];
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
      cookie_list = cookie_list.map(Number);
      displayData = displayData.iloc({rows:cookie_list});
      // TODO: account for positions of indexes changing due to changing length of dataframe
    }
    else if(mode === "filter"){

    }
    else{

    }
    
    let jsonexport = toJSON(displayData);
    jsonexport.forEach(function (elem, index) {

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

  function handleRoleChange(type) {
    setMode(type);
  }

  return (
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
        <Dataset mode={mode}></Dataset>
      </Container>
    </div>
  );
}

export default App;
