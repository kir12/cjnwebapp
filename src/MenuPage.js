// generalized Offcanvas to show pages derived from the menu

import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';

export default function MenuPage({ show_var, hide_fxn, children }) {
    return (
        <Offcanvas show={show_var} onHide={hide_fxn} placement={"end"}>
            {children}
        </Offcanvas>
    );
}

function Header({children}) {
    return (
        <Offcanvas.Header>
            <Offcanvas.Title>{children}</Offcanvas.Title>
        </Offcanvas.Header>
    );
}

function Body({children}) {
    return (
        <Offcanvas.Body>
            {children}
        </Offcanvas.Body>
    );
}

MenuPage.Header = Header;
MenuPage.Body = Body;