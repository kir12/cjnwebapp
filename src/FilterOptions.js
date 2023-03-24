import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function FilterOptions({show_var, hide_fxn, param_fxn, filterOptions}) {
  // NOTE: form is just a placeholder for now

  let formOut = <></>;
  if(Object.keys(filterOptions).length !== 0){
    console.log(filterOptions);
  }

  return (
    <Offcanvas show={show_var} onHide={hide_fxn} placement={"end"}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filter Options</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>

        <Form>
          <Accordion alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Filter by Room</Accordion.Header>
              <Accordion.Body>
                <Form.Group>
                  <Form.Check type='checkbox' id = 'test1' label='Test Label' />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Filter by Event Type</Accordion.Header>
              <Accordion.Body>
                <Form.Group>
                  <Form.Check type='checkbox' id = 'test2' label='Test Label 2' />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Button type="submit" className = "mt-3">Submit</Button>
        </Form>

      </Offcanvas.Body>
    </Offcanvas>
  );
}