import React, { useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Multiselect, DropdownList } from 'react-widgets'
import {
  selectSuccessMsg,
  selectApiData,
  selectErrorState,
  selectErrorMsg,
  selectPrimaryRoutes,
  selectSelectedRoute,
  selectOtherRouteDisabled,
  selectRsuModels,
  selectSelectedModel,
  selectSshCredentialGroups,
  selectSelectedSshGroup,
  selectSnmpCredentialGroups,
  selectSelectedSnmpGroup,
  selectSnmpVersions,
  selectSelectedSnmpVersion,
  selectOrganizations,
  selectSelectedOrganizations,
  selectSubmitAttempt,

  // actions
  getRsuInfo,
  submitForm,
  updateSelectedRoute,
  setSelectedRoute,
  setSelectedModel,
  setSelectedSshGroup,
  setSelectedSnmpGroup,
  setSelectedSnmpVersion,
  setSelectedOrganizations,
} from './adminEditRsuSlice'
import { useSelector, useDispatch } from 'react-redux'

import '../adminRsuTab/Admin.css'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { AdminRsu } from '../../types/Rsu'
import { Link, useParams } from 'react-router-dom'
import { selectTableData, updateTableData } from '../adminRsuTab/adminRsuTabSlice'
import { Typography } from '@material-ui/core'
import { ThemeProvider } from '@mui/material'
import { theme } from '../../styles'

export type AdminEditRsuFormType = {
  orig_ip: string
  ip: string
  geo_position: {
    latitude: string
    longitude: string
  }
  milepost: string | number
  primary_route: string
  serial_number: string
  model: string
  scms_id: string
  ssh_credential_group: string
  snmp_credential_group: string
  snmp_version_group: string
  organizations: string[]
  organizations_to_add: string[]
  organizations_to_remove: string[]
}

const AdminEditRsu = () => {
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch()
  const successMsg = useSelector(selectSuccessMsg)
  const apiData = useSelector(selectApiData)
  const errorState = useSelector(selectErrorState)
  const errorMsg = useSelector(selectErrorMsg)
  const primaryRoutes = useSelector(selectPrimaryRoutes)
  const selectedRoute = useSelector(selectSelectedRoute)
  const otherRouteDisabled = useSelector(selectOtherRouteDisabled)
  const rsuModels = useSelector(selectRsuModels)
  const selectedModel = useSelector(selectSelectedModel)
  const sshCredentialGroups = useSelector(selectSshCredentialGroups)
  const selectedSshGroup = useSelector(selectSelectedSshGroup)
  const snmpCredentialGroups = useSelector(selectSnmpCredentialGroups)
  const selectedSnmpGroup = useSelector(selectSelectedSnmpGroup)
  const snmpVersions = useSelector(selectSnmpVersions)
  const selectedSnmpVersion = useSelector(selectSelectedSnmpVersion)
  const organizations = useSelector(selectOrganizations)
  const selectedOrganizations = useSelector(selectSelectedOrganizations)
  const submitAttempt = useSelector(selectSubmitAttempt)
  const rsuTableData = useSelector(selectTableData)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AdminEditRsuFormType>({
    defaultValues: {
      orig_ip: '',
      ip: '',
      geo_position: {
        latitude: '',
        longitude: '',
      },
      milepost: '',
      primary_route: '',
      serial_number: '',
      model: '',
      scms_id: '',
      ssh_credential_group: '',
      snmp_credential_group: '',
      snmp_version_group: '',
      organizations_to_add: [],
      organizations_to_remove: [],
    },
  })

  const { rsuIp } = useParams<{ rsuIp: string }>()

  useEffect(() => {
    if ((rsuTableData ?? []).find((rsu: AdminRsu) => rsu.ip === rsuIp) && Object.keys(apiData).length == 0) {
      dispatch(getRsuInfo(rsuIp))
    }
  }, [dispatch, rsuIp, rsuTableData])

  useEffect(() => {
    if (apiData && Object.keys(apiData).length !== 0) {
      setValue('orig_ip', apiData.rsu_data.ip)
      setValue('ip', apiData.rsu_data.ip)
      setValue('geo_position.latitude', apiData.rsu_data.geo_position.latitude.toString())
      setValue('geo_position.longitude', apiData.rsu_data.geo_position.longitude.toString())
      setValue('milepost', String(apiData.rsu_data.milepost))
      setValue('serial_number', apiData.rsu_data.serial_number)
      setValue('scms_id', apiData.rsu_data.scms_id)
    }
  }, [apiData, setValue])

  useEffect(() => {
    dispatch(updateSelectedRoute(selectedRoute))
  }, [selectedRoute, dispatch])

  useEffect(() => {
    dispatch(updateTableData())
  }, [dispatch])

  const onSubmit = (data: AdminEditRsuFormType) => {
    dispatch(submitForm(data))
  }

  return (
    <div>
      {Object.keys(apiData ?? {}).length != 0 ? (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="ip">
            <Form.Label>RSU IP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter RSU IP"
              {...register('ip', {
                required: "Please enter the RSU's IP address",
                pattern: {
                  value:
                    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                  message: 'Please enter a valid IP address',
                },
              })}
            />
            <ErrorMessage
              errors={errors}
              name="ip"
              render={({ message }) => (
                <p className="errorMsg" role="alert">
                  {' '}
                  {message}{' '}
                </p>
              )}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="geo_position.latitude">
            <Form.Label>Latitude</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter RSU Latitude"
              {...register('geo_position.latitude', {
                required: 'Please enter the RSU latitude',
                pattern: {
                  value: /^(\+|-)?(?:90(?:(?:\.0{1,8})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,8})?))$/,
                  message: 'Please enter a valid latitude',
                },
              })}
            />
            <ErrorMessage
              errors={errors}
              name="geo_position.latitude"
              render={({ message }) => (
                <p className="errorMsg" role="alert">
                  {' '}
                  {message}{' '}
                </p>
              )}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="geo_position.longitude">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter RSU Longitude"
              {...register('geo_position.longitude', {
                required: 'Please enter the RSU longitude',
                pattern: {
                  value: /^(\+|-)?(?:180(?:(?:\.0{1,8})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,8})?))$/,
                  message: 'Please enter a valid longitude',
                },
              })}
            />
            <ErrorMessage
              errors={errors}
              name="geo_position.longitude"
              render={({ message }) => (
                <p className="errorMsg" role="alert">
                  {' '}
                  {message}{' '}
                </p>
              )}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="milepost">
            <Form.Label>Milepost</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter RSU Milepost"
              {...register('milepost', {
                required: 'Please enter the RSU milepost',
                pattern: {
                  value: /^\d*\.?\d*$/,
                  message: 'Please enter a valid milepost',
                },
              })}
            />
            <ErrorMessage
              errors={errors}
              name="milepost"
              render={({ message }) => (
                <p className="errorMsg" role="alert">
                  {' '}
                  {message}{' '}
                </p>
              )}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="primary_route">
            <Form.Label>Primary Route</Form.Label>
            <DropdownList
              className="form-dropdown"
              dataKey="name"
              textField="name"
              data={primaryRoutes}
              value={selectedRoute}
              onChange={(value) => {
                dispatch(setSelectedRoute(value.name))
              }}
            />
            {selectedRoute === '' && submitAttempt && (
              <p className="error-msg" role="alert">
                Must select a primary route
              </p>
            )}
            {(() => {
              if (selectedRoute === 'Other') {
                return (
                  <Form.Control
                    type="text"
                    placeholder="Enter Other Route"
                    disabled={otherRouteDisabled}
                    {...register('primary_route', {
                      required: 'Please enter the other route',
                    })}
                  />
                )
              }
            })()}
          </Form.Group>

          <Form.Group className="mb-3" controlId="serial_number">
            <Form.Label>Serial Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter RSU Serial Number"
              {...register('serial_number', {
                required: 'Please enter the RSU serial number',
              })}
            />
            {errors.serial_number && (
              <p className="errorMsg" role="alert">
                {errors.serial_number.message}
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="model">
            <Form.Label>RSU Model</Form.Label>
            <DropdownList
              className="form-dropdown"
              dataKey="name"
              textField="name"
              data={rsuModels}
              value={selectedModel}
              onChange={(value) => {
                dispatch(setSelectedModel(value.name))
              }}
            />
            {selectedModel === '' && submitAttempt && (
              <p className="error-msg" role="alert">
                Must select a RSU model
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="scms_id">
            <Form.Label>SCMS ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter SCMS ID"
              {...register('scms_id', {
                required: 'Please enter the SCMS ID',
              })}
            />
            {errors.scms_id && (
              <p className="errorMsg" role="alert">
                {errors.scms_id.message}
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="ssh_credential_group">
            <Form.Label>SSH Credential Group</Form.Label>
            <DropdownList
              className="form-dropdown"
              dataKey="name"
              textField="name"
              data={sshCredentialGroups}
              value={selectedSshGroup}
              onChange={(value) => {
                dispatch(setSelectedSshGroup(value.name))
              }}
            />
            {selectedSshGroup === '' && submitAttempt && (
              <p className="error-msg" role="alert">
                Must select a SSH credential group
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="snmp_credential_group">
            <Form.Label>SNMP Credential Group</Form.Label>
            <DropdownList
              className="form-dropdown"
              dataKey="name"
              textField="name"
              data={snmpCredentialGroups}
              value={selectedSnmpGroup}
              onChange={(value) => {
                dispatch(setSelectedSnmpGroup(value.name))
              }}
            />
            {selectedSnmpGroup === '' && submitAttempt && (
              <p className="error-msg" role="alert">
                Must select a SNMP credential group
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="snmp_version_group">
            <Form.Label>SNMP Version</Form.Label>
            <DropdownList
              className="form-dropdown"
              dataKey="name"
              textField="name"
              data={snmpVersions}
              value={selectedSnmpVersion}
              onChange={(value) => {
                dispatch(setSelectedSnmpVersion(value.name))
              }}
            />
            {selectedSnmpVersion === '' && submitAttempt && (
              <p className="error-msg" role="alert">
                Must select a SNMP version
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="organizations">
            <Form.Label>Organization</Form.Label>
            <Multiselect
              className="form-dropdown"
              dataKey="name"
              textField="name"
              data={organizations}
              placeholder="Select organizations"
              value={selectedOrganizations}
              onChange={(value) => {
                dispatch(setSelectedOrganizations(value))
              }}
            />
            {selectedOrganizations.length === 0 && submitAttempt && (
              <p className="error-msg" role="alert">
                Must select an organization
              </p>
            )}
          </Form.Group>

          {successMsg && (
            <p className="success-msg" role="status">
              {successMsg}
            </p>
          )}
          {errorState && (
            <p className="error-msg" role="alert">
              Failed to apply changes due to error: {errorMsg}
            </p>
          )}

          <div className="form-control">
            <label></label>
            <button type="submit" className="admin-button">
              Apply Changes
            </button>
          </div>
        </Form>
      ) : (
        <Typography variant={'h4'} style={{ color: '#fff' }}>
          Unknown RSU IP address. Either this RSU does not exist, or you do not have access to it.{' '}
          <Link to="../">RSUs</Link>
        </Typography>
      )}
    </div>
  )
}

export default AdminEditRsu
