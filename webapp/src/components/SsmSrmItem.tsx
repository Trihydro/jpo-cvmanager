import React, { useEffect } from 'react'
import { SelectedSrm } from '../types/Srm'

import './css/SsmSrmItem.css'

export type SsmSrmItemProps = {
  elem: SelectedSrm
  setSelectedSrm: (elem: SelectedSrm) => void
}

const SsmSrmItem = (props: SsmSrmItemProps) => {
  const { setSelectedSrm } = props
  useEffect(() => {
    return () => {
      setSelectedSrm({} as SelectedSrm)
    }
  }, [setSelectedSrm])

  return (
    <div id={props.elem['type'] === 'srmTx' ? 'srmitemdiv' : 'ssmitemdiv'}>
      <p className="ssmsrmitemtext">{props.elem['time']}</p>
      <p className="ssmsrmitemtext">{props.elem['requestId']}</p>
      <p className="ssmsrmitemtext">{props.elem['role']}</p>
      <p className="ssmsrmitemtext">{props.elem['status']}</p>
      {props.elem['type'] === 'srmTx' ? (
        <button className="btnActive" onClick={() => props.setSelectedSrm(props.elem)}>
          View
        </button>
      ) : (
        <button className="btnDisabled" disabled={true}>
          View
        </button>
      )}
    </div>
  )
}

export default SsmSrmItem
