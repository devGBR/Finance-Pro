import { AlertCircle, X } from "react-feather"
import Avatar from '@components/avatar'
import { Fragment } from "react"
export default function AlertToast(props) {
  return (
    <div >
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Avatar size='sm' color='warning' icon={<AlertCircle size={12} />} />
          <h6 className='text-warning toast-title' style={{ color: "red" }}>{props.title}</h6>
        </div>
      </div>
      <div className='toastify-body' style={{minHeight: '90px'}}>
        <p role='img' className=" mb-0" style={{
          wordBreak: " break-all"
        }} aria-label='toast-text'>
          {props.message}
          {props.children}
        </p>
      </div>
    </div >
  )
}
