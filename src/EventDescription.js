import Offcanvas from 'react-bootstrap/Offcanvas';

function EventDescription({show_var, hide_fxn, event_package}) {

  let output = (<></>);

  if (event_package !== {}){
    output = <p>im stuff :blush:</p>
  }

  return (
    <Offcanvas show={show_var} onHide={hide_fxn}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {output}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default EventDescription;