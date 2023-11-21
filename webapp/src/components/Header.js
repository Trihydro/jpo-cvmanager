import React, { useEffect, useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import logo from '../images/logo.png'
import { useSelector, useDispatch } from 'react-redux'
import { DotName } from '../constants'
import {
  selectOrganizationName,
  selectName,
  selectEmail,
  selectAuthLoginData,
  selectLoginFailure,
  selectKcFailure,
  selectLoading,

  // actions
  logout,
  changeOrganization,
  setLoginFailure,
  setKcFailure,
} from '../generalSlices/userSlice'
import { useKeycloak } from '@react-keycloak/web'

import './css/Header.css'

import ContactSupportMenu from './ContactSupportMenu'

const Header = () => {
  const dispatch = useDispatch()
  const { keycloak } = useKeycloak()

  const authLoginData = useSelector(selectAuthLoginData)
  const organizationName = useSelector(selectOrganizationName)
  const userName = useSelector(selectName)
  const userEmail = useSelector(selectEmail)
  const loginFailure = useSelector(selectLoginFailure)
  const kcFailure = useSelector(selectKcFailure)
  const loading = useSelector(selectLoading)

  // useEffect(() => {
  //   const delay = 1000;
  //   console.log('Header -loading', authLoginData, loading)

  //   if (loading == false) {
  //     dispatch(setLoginFailure(!authLoginData))
  //   }
  // }, [authLoginData, loading])

  useEffect(() => {
    const initialMessageDelay = 500000 // Adjust the delay (in milliseconds) as needed

    const timer = setTimeout(() => {
      if (!loading) {
        //setShowLoginFailureMessage(true)
        //dispatch(setLoginFailure(!authLoginData))
      }
    }, initialMessageDelay)

    return () => {
      clearTimeout(timer)
      //setShowLoginFailureMessage(false)
    }
  }, [authLoginData, loading, dispatch])

  useEffect(() => {
    const kcFailureDelay = 500000 // Adjust the delay (in milliseconds) as needed
    const kcFailureTimer = setTimeout(() => {
      if (!keycloak?.authenticated) {
        console.debug('Login failure logic: User is not authenticated with Keycloak')
        dispatch(setKcFailure(true))
      } else {
        console.debug('Login failure logic: User is now authenticated with Keycloak')
        dispatch(setKcFailure(false))
      }
    }, kcFailureDelay)

    return () => clearTimeout(kcFailureTimer)
  }, [keycloak, keycloak?.authenticated, dispatch])

  const handleUserLogout = () => {
    console.debug('handleUserLogout')
    dispatch(logout())
    keycloak?.logout()
  }

  return (
    <div>
      {authLoginData && keycloak?.authenticated ? (
        <header id="header">
          <Grid container alignItems="center">
            <img id="logo" src={logo} alt="Logo" />
            <h1 id="header-text">{DotName} CV Manager</h1>
            <div id="login">
              <Grid container alignItems="center">
                <Grid id="userInfoGrid">
                  <h3 id="nameText">{userName}</h3>
                  <h3 id="emailText">{userEmail}</h3>
                  <select
                    id="organizationDropdown"
                    value={organizationName}
                    onChange={(event) => dispatch(changeOrganization(event.target.value))}
                  >
                    {(authLoginData?.data?.organizations ?? []).map((permission) => (
                      <option key={permission.name + 'Option'} value={permission.name}>
                        {permission.name} ({permission.role})
                      </option>
                    ))}
                  </select>
                </Grid>
                <button id="logout" onClick={() => handleUserLogout()}>
                  Logout
                </button>
              </Grid>
            </div>
          </Grid>
        </header>
      ) : (
        <div id="frontpage">
          <Grid container id="frontgrid" alignItems="center" direction="column">
            <Grid container justifyContent="center" alignItems="center">
              <img id="frontpagelogo" src={logo} alt="Logo" />
              <h1 id="header-text">{DotName} CV Manager</h1>
            </Grid>

            <div id="keycloakbtndiv">
              {keycloak?.authenticated && (
                <button className="keycloak-button" onClick={() => handleUserLogout()}>
                  Logout User
                </button>
              )}
            </div>
            {loginFailure && <h3 id="loginMessage">User Unauthorized, Please Contact Support</h3>}
            {kcFailure && <h3 id="loginMessage">Application Authentication Error!</h3>}

            <br />
            <ContactSupportMenu />
          </Grid>
        </div>
      )}
    </div>
  )
}

export default Header
