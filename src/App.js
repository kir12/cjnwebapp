import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faFilter, faBook, faMagnifyingGlass, faCircleInfo, faHeart, faLocationDot, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import FilterOptions from "./FilterOptions"
import MenuPage from "./MenuPage"
import MoreInfo from "./MoreInfo";
import Dataset from "./Dataset";
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

function App() {

  const [mode, setMode] = useState("home");
  const [filterOptions, setFilterOptions] = useState({});

  const [showModal, setShowModal] = useState(false);
  const handleModalOnClick = () => setShowModal(true);
  const handleModalOnHide = () => setShowModal(false);

  const [showFilterPane, setshowFilterPane] = useState(false);
  const handleFilterPaneOnHide = () => setshowFilterPane(false);

  const [appliedFilters, setAppliedFilters] = useState({"event_types": [], "room_list": []});

  // TODO: when con-specific data is ripped to its own file, this will need to be adjusted
  // to be automatically set to the number of detected MenuPage components
  const [menupagebools, setMenuPages] = useState([false, false]);

  function handleRoleChange(type) {
    setMode(type);
    if(type === "filter" & !('activeFilter' in filterOptions)) {setshowFilterPane(true)};
  }

  function dualLink(params, mode) {
    if(mode === "toFilterOptions"){
      setFilterOptions(params);
    }
    else if(mode === "toDataSet"){
      setAppliedFilters(params);
    }
  }

  // TODO: apparently this is possible???
  let test = {"test": (<p>hello world</p>)};

  let menupages = (
    <div>
      <MenuPage>
        <MenuPage.Header><FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon> Directions & Parking</MenuPage.Header>
        <MenuPage.Body>test</MenuPage.Body>
      </MenuPage> 
      <MenuPage>
        <MenuPage.Header><FontAwesomeIcon icon={faMapLocationDot}></FontAwesomeIcon> Convention Center Map</MenuPage.Header>
        <MenuPage.Body>test</MenuPage.Body>
      </MenuPage>
    </div>
  );

  return (
    <>
      <div className="App">

        <Navbar collapseOnSelect expand={false} className="sticky-top mb-2 shadow-sm" bg="light" data-bs-theme="light">
          <Container fluid>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-false`} />
            <Navbar.Brand className="ms-2">
              <NavDropdown title="7/26">
                <NavDropdown.Item>7/25</NavDropdown.Item>
                <NavDropdown.Item>7/26</NavDropdown.Item>
                <NavDropdown.Item>7/27</NavDropdown.Item>
              </NavDropdown>
            </Navbar.Brand>
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-false`}
              aria-labelledby={`offcanvasNavbarLabel-expand-false`}
              placement="start"
            >
              <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-false`}>
                    Con Ja Nai 2023 
                  </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="#action1" onClick={handleModalOnClick}><FontAwesomeIcon icon={faCircleInfo}></FontAwesomeIcon> About The Con</Nav.Link>
                  <Nav.Link href="https://github.com/kir12/cjnwebapp" target="_blank"><FontAwesomeIcon icon={faGithub}></FontAwesomeIcon> About App</Nav.Link>
                  <Nav.Link href="https://www.google.com/search?q=marisa+kirisame&client=firefox-b-1-d&source=lnms&tbm=isch&sa=X&ved=2ahUKEwioqcvz4fT9AhW2kYkEHTCND3AQ0pQJegQIBBAC&biw=1920&bih=884&dpr=1" target="_blank"><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon> Best Girl</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
            <div className="d-flex order-1 ms-auto">
              <Nav className="flex-row">
                <Nav.Link href="#home" className="me-2" onClick={() => handleRoleChange("filter")}><FontAwesomeIcon icon={faFilter}></FontAwesomeIcon> Filter</Nav.Link>
                <Nav.Link href="#home" className="me-2" onClick={() => handleRoleChange("filter")}><FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon> Search</Nav.Link>
              </Nav>
            </div>
          </Container>
        </Navbar> 

        <Container id="infobody2">
          <FilterOptions show_var={showFilterPane} hide_fxn={handleFilterPaneOnHide} param_fxn={dualLink} filterOptions={filterOptions}></FilterOptions>
          <Dataset mode={mode} param_fxn={dualLink} appliedFilters={appliedFilters}></Dataset>
          <Nav fill variant="pills" defaultActiveKey="home" className="sticky-bottom bg-white shadow-sm mt-2">
            <Nav.Item onClick={() => handleRoleChange("home")}>
              <Nav.Link eventKey="home"><FontAwesomeIcon icon={faBook}></FontAwesomeIcon> Events</Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => handleRoleChange("bookmarks")}>
              <Nav.Link eventKey="bookmarks"><FontAwesomeIcon icon={fasStar}></FontAwesomeIcon> Bookmarks</Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
      </div>
      <MoreInfo show={showModal} handleClose={handleModalOnHide}></MoreInfo>
    </>
  );
}

export default App;
