import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';

export default function FilterOptions({show_var, hide_fxn, param_fxn, filterOptions}) {

  const [stack, setStack] = useState({"event_types":[], "room_list": []});

  // I wasn't able to get form submission to work with checkboxes,
  // so I just tracked each checkbox via state instead.
  // TODO: figure out how to preserve?
  function handleSubmit(e) {
    e.preventDefault();
    param_fxn(stack, "toDataSet");
    hide_fxn();
  }

  function foo(elem, type) {
    if(stack[type].includes(elem)){
      stack[type].splice(stack[type].indexOf(elem), 1);
    }
    else{
      stack[type].push(elem);
    }
  }

  let eventtypes = [];
  let rooms = [];
  if(Object.keys(filterOptions).length !== 0){
    for(const elem of filterOptions["event_types"]) {
      let defaultChecked = stack["event_types"].includes(elem);
      eventtypes.push(<Form.Check defaultChecked={defaultChecked} type="checkbox" id={elem} label={elem} onClick={() => foo(elem, "event_types")}></Form.Check>);
    }

    for (const elem of filterOptions["room_list"]) {
      let defaultChecked = stack["room_list"].includes(elem);
      rooms.push(<Form.Check defaultChecked={defaultChecked} type="checkbox" id={elem} label={elem} onClick={() => foo(elem, "room_list")}></Form.Check>);
    }
  }

  // this function's borked because there's no actual way to get the buttons to programatically change
  // (while also preserving the ability to actually use them)
  // for that reason, resetting forms will not be added until someone wants it badly enough
  // function handleReset(e) {
  //   e.preventDefault();
  //   stack["event_types"] = [];
  //   stack["room_list"] = [];
  //   for(let i = 0; i < eventtypes.length; i++){
  //     // eventtypes[i].useRef().click();
  //     eventtypes[i].props["onClick"]();
  //   }
  // }

  return (
    <Offcanvas show={show_var} onHide={hide_fxn} placement={"end"}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filter Options</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>

        {/* onReset={handleReset} */}
        <Form onSubmit={handleSubmit} id="filterForm">
          <Accordion alwaysOpen className="open">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Filter by Room</Accordion.Header>
              <Accordion.Body>
                <Form.Group>
                  {rooms}
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Filter by Event Type</Accordion.Header>
              <Accordion.Body>
                <Form.Group>
                  {eventtypes}
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Button type="submit" className = "mt-3">Submit</Button>
          {/*<Button variant="secondary" type="reset" className="mt-3 mx-2">Clear Filters</Button>*/}
        </Form>

      </Offcanvas.Body>
    </Offcanvas>
  );
}