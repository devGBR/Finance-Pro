import { X } from "react-feather"

import { Fragment } from "react"
import { Avatar } from "@mui/material"
export default function ErrorToast(props) {
  return (
    <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <h6 className='toast-title' style={{color:"red"}}>{props.title}</h6>
      </div>
    </div>
    <div  className='toastify-body'>
      <span aria-label='toast-text' >
       {props.error}
       {props.children}
      </span>
    </div>
  </Fragment>
  )
}
