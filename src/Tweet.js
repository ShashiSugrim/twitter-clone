import React from 'react'

const Tweet = ({title, username, description, time_stamp}) => {
  return (
    <>
    <h2>{title}</h2>
    <h3>{username}</h3>
    <div>{description}</div>
    <h4>{time_stamp}</h4>
    </>
  )
}

export default Tweet