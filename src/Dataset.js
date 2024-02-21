import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import EventDescription from './EventDescription';
import { useEffect, useState } from 'react';
import Bookmark from "./Bookmark";
import { ListGroup } from 'react-bootstrap';
import { colors, get_cookie_list, cmp } from "./Utils.js"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import { readCSV, DataFrame, toJSON } from 'danfojs';
import events from './events.csv';
import Papa from 'papaparse';

dayjs.extend(customParseFormat)



export default function Dataset({mode, param_fxn, appliedFilters}) {
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

  function addColumn(data, column_name, data_column) {
    let output = data.map(function(row, index) {
      row[column_name] = data_column[index];
      return row;
    })
    return output;
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

    Papa.parse(events, {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: function(results) {
        let newdata = results.data;
        newdata = addColumn(newdata, "combinedStart", newdata.map((row) => {
          return dayjs(row["event_start_day"] + " " + row["event_start_time"], "M/D/YY H:mm").toISOString();
        }));
        newdata = addColumn(newdata, "combinedEnd", newdata.map((row) => {
          return dayjs(row["event_end_day"] + " " + row["event_end_time"], "M/D/YY H:mm").toISOString();
        }));
        // TODO: sort function, add unique id
        // check for correctness on parsing CSV files and make corrections as necessary

        console.log(newdata);
      }
    });

    fetchData().catch(console.error);

  });

  function noResults() {
    return (
      <div className="row d-flex align-items-center justify-content-center" id="infobody">
        <div className="col-sm-6 text-center opacity-75">
          <p className="small mb-0"><a href="https://twitter.com/sobamushi_mo/status/1399661514043232259" target="blank" rel="noreferrer">Source</a></p>
          <img src = "/noresults.jpg" className="img-fluid"></img>
          <h5>No Results</h5>
          <p>Try setting some bookmarks or adjusting your filter options</p>
        </div>
      </div>
    );
  }

  // const reader = new FileReader();
  // reader.addEventListener("load", () => {
  //   console.log(reader.result);
  // },"false",);
  // reader.readAsText(events);

  
  let output = [];
  // const records = parse(events, {columns: true, skip_empty_lines: true});
  // console.log(records);

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
        
        if(appliedFilters["event_types"].length > 0){
            let result = dataSet.event_type.map((param) => {return appliedFilters["event_types"].includes(param)});
            displayData = dataSet.loc({rows: result.values});
        }

        if(appliedFilters["room_list"].length > 0){
            let result = displayData.event_room.map((param) => {return appliedFilters["room_list"].includes(param)});
            displayData = displayData.loc({rows: result.values});
        }
 
        // if(appliedFilters["room_list"] !== []){
        //     displayData = displayData[displayData.event_room.ne(eventSeries)];
        // }
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
      {output.length < 1 ? noResults() : <></>}
    </>
  );
}

