class EnvironmentVars {
  static getBaseApiUrl() {
    return process.env.REACT_APP_GATEWAY_BASE_URL
  }

  static getMessageTypes() {
    const COUNT_MESSAGE_TYPES = process.env.REACT_APP_COUNT_MESSAGE_TYPES
    if (!COUNT_MESSAGE_TYPES) {
      return []
    }
    const messageTypes = COUNT_MESSAGE_TYPES.split(',').map((item) => item.trim())
    return messageTypes
  }

  static getMessageViewerTypes() {
    const VIEWER_MESSAGE_TYPES = process.env.REACT_APP_VIEWER_MESSAGE_TYPES
    if (!VIEWER_MESSAGE_TYPES) {
      return ['BSM'] // default to BSM if not set
    }
    const messageTypes = VIEWER_MESSAGE_TYPES.split(',').map((item) => item.trim())
    return messageTypes
  }

  static getMapboxInitViewState() {
    const MAPBOX_INIT_LATITUDE = Number(process.env.REACT_APP_MAPBOX_INIT_LATITUDE)
    const MAPBOX_INIT_LONGITUDE = Number(process.env.REACT_APP_MAPBOX_INIT_LONGITUDE)
    const MAPBOX_INIT_ZOOM = Number(process.env.REACT_APP_MAPBOX_INIT_ZOOM)

    const viewState = {
      latitude: MAPBOX_INIT_LATITUDE,
      longitude: MAPBOX_INIT_LONGITUDE,
      zoom: MAPBOX_INIT_ZOOM,
    }

    return viewState
  }

  static MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN
  static KEYCLOAK_HOST_URL = process.env.REACT_APP_KEYCLOAK_URL
  static DOT_NAME = process.env.REACT_APP_DOT_NAME

  static rsuInfoEndpoint = `${this.getBaseApiUrl()}/rsuinfo`
  static rsuOnlineEndpoint = `${this.getBaseApiUrl()}/rsu-online-status`
  static rsuCountsEndpoint = `${this.getBaseApiUrl()}/rsucounts`
  static rsuMsgFwdQueryEndpoint = `${this.getBaseApiUrl()}/rsu-msgfwd-query`
  static rsuCommandEndpoint = `${this.getBaseApiUrl()}/rsu-command`
  static wzdxEndpoint = `${this.getBaseApiUrl()}/wzdx-feed`
  static rsuMapInfoEndpoint = `${this.getBaseApiUrl()}/rsu-map-info`
  static rsuGeoQueryEndpoint = `${this.getBaseApiUrl()}/rsu-geo-query`
  static geoMsgDataEndpoint = `${this.getBaseApiUrl()}/rsu-geo-msg-data`
  static issScmsStatusEndpoint = `${this.getBaseApiUrl()}/iss-scms-status`
  static ssmSrmEndpoint = `${this.getBaseApiUrl()}/rsu-ssm-srm-data`
  static authEndpoint = `${this.getBaseApiUrl()}/user-auth`
  static adminAddRsu = `${this.getBaseApiUrl()}/admin-new-rsu`
  static adminRsu = `${this.getBaseApiUrl()}/admin-rsu`
  static adminAddUser = `${this.getBaseApiUrl()}/admin-new-user`
  static adminUser = `${this.getBaseApiUrl()}/admin-user`
  static adminAddOrg = `${this.getBaseApiUrl()}/admin-new-org`
  static adminOrg = `${this.getBaseApiUrl()}/admin-org`
  static contactSupport = `${this.getBaseApiUrl()}/contact-support`
}

export default EnvironmentVars
