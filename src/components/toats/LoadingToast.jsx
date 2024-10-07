import { Check, X } from "react-feather"
import { Fragment } from "react"
import { Spinner } from "reactstrap"
import { Icon } from "@mui/material"
export default function LoadingToast(props) {
  return (
    <Fragment>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Spinner color="secondary" size={"sm"} />
          <h6 className='toast-title text-secondary' >{props.title}</h6>
        </div>
      </div>
      <div className='toastify-body'>
        <span role='img' aria-label='toast-text'>
          {props.message}
        </span>
      </div>
    </Fragment>
  )
}
