import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faFilter, faBook, faMagnifyingGlass, faCircleInfo, faHeart, faLocationDot, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';
import FilterOptions from "./FilterOptions"
import MenuPage from "./MenuPage"
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
  const [menupagebools, setMenuPages] = useState([false, false, false]);

  function changeMenuPageState(idx, isDisplayed) {
    let newstate = [...menupagebools];
    newstate[idx] = isDisplayed;
    setMenuPages(newstate);
  }
  function getMenuState(idx) {return menupagebools[idx];}

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

  // TODO: export out as prop when con-specific code is ripped out to its own file
  let menupagedata = [
    {
      "header": (<><FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon> Directions & Parking</>),
      "body": (<>test</>)
    },
    {
      "header": (<><FontAwesomeIcon icon={faMapLocationDot}></FontAwesomeIcon> Convention Center Map</>),
      "body": (<>test</>)
    },
    {
      "header": (<><FontAwesomeIcon icon={faCircleInfo}></FontAwesomeIcon> About The Con</>),
      "body": (
        <>
          <h4><a href="http://www.conjanai.org/" target="_blank" rel="noreferrer">Con Ja Nai XXVII</a></h4>
            <p>A free mini-anime convention hosted by <a href="https://maizepages.umich.edu/organization/animania" target="_blank" rel="noreferrer">Animania</a>, U of M's anime club</p>
          <h5>Sponsors and Affiliates</h5>
          <ul>
            <li><a href="https://maizepages.umich.edu/organization/ontaku" target="_blank" rel="noreferrer">Ontaku</a> (<a href="https://discord.gg/UQze7V7" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon> Discord</a>)</li>
            <li><a href="https://dreamscomechuu.square.site/" target="_blank" rel="noreferrer">Dreams Come Chuu Maid Cafe</a></li>
            <li><a href="https://ii.umich.edu/cjs" target="_blank" rel="noreferrer">U of M Center of Japanese Studies</a></li>
            <li><a href="https://www.vaultofmidnight.com/" target="_blank" rel="noreferrer">Vault of Midnight</a></li>
            <li><a href="https://maruposeggtarts.square.site/about-us" target="_blank" rel="noreferrer">Marupo's Egg Tarts</a></li>
            <li><a href="https://www.csg.umich.edu/sofc" target="_blank" rel="noreferrer">U of M SOFC</a></li>
          </ul>
          <h5>Donate to Animania</h5>
          <p>Animania would appreciate donations of any amount to ensure that large events like Con Ja Nai can continue to be organized into the future.</p>
          <p>If you are interested, please send any monetary contributions to our Venmo at <b>@Animania</b>. Thank you very much for your support!</p>
        </>
      )
    }
  ];

  let menunavs = [];
  let menupages = [];

  for (const [i, entry] of menupagedata.entries()) {
    menunavs.push(<Nav.Link href="#action1" onClick = {() => changeMenuPageState(i, true)} key={i}>{entry["header"]}</Nav.Link>);
    menupages.push(
      <MenuPage show_var = {() => getMenuState(i)} hide_fxn = {changeMenuPageState} idx={i}>
        <MenuPage.Header >{entry["header"]}</MenuPage.Header>
        <MenuPage.Body>{entry["body"]}</MenuPage.Body>
      </MenuPage>
    );
  }

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
                  {menunavs} 
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
      {menupages}
    </>
  );
}

export default App;
