import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { readCSV, DataFrame, toJSON, Dt, toDateTime, Series} from 'danfojs';
import events from './events.tsv';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { colors } from "./Utils.js"
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat)

function Dataset() {
  const [dataSet, setDataSet] = useState(new DataFrame());
  const [dataUpdated, setDataUpdated] = useState(false);

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

        data.print();

        // optional: drop original time parameters

        setDataSet(data);
        setDataUpdated(true);
      }
    }

    fetchData().catch(console.error);

  });


  function event_age_badge(type){
    if(type !== null){
      return (<></>);
    }
    else{
      return (<></>);
    }
  }

  let output = [];

  if (dataUpdated) {

    dataSet.print();

    let event_types = toJSON(dataSet["event_type"].unique())[0];

    
    let jsonexport = toJSON(dataSet);
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

      // generate event listing
      output.push(
        <ListGroup.Item key={index}>
          <h3>{elem["event_title"]} </h3>
          <p>{elem["event_room"]}, {startjs.toString()} - {endjs.toString()}</p>
          <p><Badge pill className={css_class}>{elem["event_type"]}</Badge> <Badge pill bg="danger">{elem["event_age_limit"]}</Badge></p>
        </ListGroup.Item>
      );
    });

  }

  return (
    <ListGroup>
      {output}
    </ListGroup>
  );
}

function App() {

  return (
    <div className="App">
      <Container>
        <Dataset></Dataset>
      </Container>
    </div>
  );
}

export default App;
