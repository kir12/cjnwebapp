import { faStar as fasStar, faFilter, faBook } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import Cookies from 'universal-cookie';
import { colors, COOKIE_NAME } from "./Utils.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

const cookies = new Cookies();

export default function Bookmark({index}) {
  const [starType, setStarType] = useState(faStar);

  function get_cookie_list(){
    let current_cookie_list = cookies.get(COOKIE_NAME);
    if(current_cookie_list === undefined){
      current_cookie_list = [];
    }
    else{
      current_cookie_list = current_cookie_list.split(",");
    }
    return current_cookie_list;
  }

  function handleOnClick(){
    let current_cookie_list = get_cookie_list();
    if(starType === faStar){ // add cookie
      current_cookie_list.push(index);
      cookies.set(COOKIE_NAME, current_cookie_list.join(","));
      setStarType(fasStar);
      console.log(get_cookie_list());
    }
    else{ // remove cookie
      let cookie_idx_rm = current_cookie_list.indexOf(index.toString());
      if (cookie_idx_rm > -1){
        current_cookie_list.splice(cookie_idx_rm, 1);
      }
      cookies.set(COOKIE_NAME, current_cookie_list.join(","));
      setStarType(faStar);
      console.log(get_cookie_list());
    }
  } 

  useEffect(function(){
    let current_cookie_list = get_cookie_list();
    if(current_cookie_list.indexOf(index.toString()) > -1){
      setStarType(fasStar);
    }
  })


  return (<FontAwesomeIcon onClick = {handleOnClick} icon={starType} size="lg" />);
}