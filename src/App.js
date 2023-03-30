import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faFilter, faBook } from '@fortawesome/free-solid-svg-icons';
import FilterOptions from "./FilterOptions"
import MoreInfo from "./MoreInfo";
import Dataset from "./Dataset";

function App() {

  const [mode, setMode] = useState("home");
  const [filterOptions, setFilterOptions] = useState({});

  const [showModal, setShowModal] = useState(false);
  const handleModalOnClick = () => setShowModal(true);
  const handleModalOnHide = () => setShowModal(false);

  const [showFilterPane, setshowFilterPane] = useState(false);
  const handleFilterPaneOnHide = () => setshowFilterPane(false);

  const [appliedFilters, setAppliedFilters] = useState({"event_types": [], "room_list": []});

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
          <Dataset mode={mode} param_fxn={dualLink} appliedFilters={appliedFilters}></Dataset>
        </Container>
      </div>
      <MoreInfo show={showModal} handleClose={handleModalOnHide}></MoreInfo>
      <Container fluid className="d-flex justify-content-evenly footer">
        <p className="mb-0"><a href="https://github.com/kir12/cjnwebapp" target="_blank" className="text-black" rel="noreferrer">About App</a></p>
        <p className="mb-0"><a href="#0" className="text-black" onClick={handleModalOnClick} rel="noreferrer">Con Info</a></p>
        <p className="mb-0"><a href="https://www.google.com/search?q=marisa+kirisame&client=firefox-b-1-d&source=lnms&tbm=isch&sa=X&ved=2ahUKEwioqcvz4fT9AhW2kYkEHTCND3AQ0pQJegQIBBAC&biw=1920&bih=884&dpr=1" target="_blank" className="text-black" rel="noreferrer">Best Waifu</a></p>
      </Container>
    </>
  );
}

export default App;
