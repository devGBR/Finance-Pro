import { Check, X } from "react-feather"
import { Fragment } from "react"
export default function SuccessToast(props) {
  return (
    <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <h6 className='toast-title ' >{props.title}</h6>
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
