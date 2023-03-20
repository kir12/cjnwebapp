import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { readCSV, DataFrame, toJSON, concat} from 'danfojs';
import events from './events.tsv';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { colors } from "./Utils.js"


function Dataset() {
  const [dataSet, setDataSet] = useState(new DataFrame());
  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {

    const fetchData = async () => {
      const data = await readCSV(events);
      // data.head().print();
      if (!dataUpdated) {
        setDataSet(data);
        setDataUpdated(true);
      }
    }

    fetchData().catch(console.error);

  });


  console.log(dataSet.index);
  let output = [];

  if (dataUpdated) {

    let event_types = dataSet["event_type"].unique();
    let num_event_types = dataSet["event_type"].nUnique();
    let badgecolors = concat({dfList: [event_types, colors.head(num_event_types)], axis:1}) //.setIndex({column:"event_type", drop:true});

    let jsonexport = toJSON(dataSet);
    jsonexport.forEach(function (elem, index) {
      let bg_color = badgecolors.iloc(elem["event_type"])["bg"];
      let text_color = badgecolors.iloc(elem["event_type"])["text"];
      output.push(
        <ListGroup.Item key={index}>
          <h2>{elem["event_title"]} <span ><Badge pill style={{ backgroundColor: 'red !important', color:'white !important'}}>{elem["event_type"]}</Badge></span></h2>
        </ListGroup.Item>
      );
    });

  }

  // let df_display = dataSet[["event_title","event_type"]].apply(createEntry, {axis: 1});

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
