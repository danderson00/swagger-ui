import React, { PropTypes } from "react"
var WindowsAzure = require("azure-mobile-apps-client")

import Azure from "../../../img/azure.svg"
import Facebook from "../../../img/facebook-box.svg"
import Google from "../../../img/google.svg"
import Microsoft from "../../../img/microsoft.svg"
import Twitter from "../../../img/twitter-box.svg"
const logos = {
  'aad': Azure,
  'facebook': Facebook,
  'google': Google,
  'microsoftaccount': Microsoft,
  'twitter': Twitter
}

export class EasyAuth extends React.Component {
  static propTypes = {
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    errSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    submitAuth: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context)
    let { name, schema } = this.props
    let value = this.getValue()

    this.state = {
      name: name,
      schema: schema,
      value: value
    }
  }

  // this will ONLY work for sites with swagger-ui embedded
  // this needs to be updated to take the applicationUrl from the swagger URL
  client = new WindowsAzure.MobileServiceClient(window.location.origin)

  getValue () {
    let { name, authorized } = this.props

    return authorized && authorized.getIn([name, "value"])
  }

  onChange = value => {
    let { onChange } = this.props
    let newState = Object.assign({}, this.state, { value: value })

    this.setState(newState)
    onChange(newState)
  }

  login = provider => {
    this.client.login(provider).then(user => {
      console.log("Logged in with user ID " + user.userId)
      this.onChange("Bearer " + user.mobileServiceAuthenticationToken)
      setTimeout(() => this.props.submitAuth(new Event("")))
    })
  }

  render() {
    let { schema, getComponent, errSelectors, name } = this.props
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const JumpToPath = getComponent("JumpToPath", true)
    const Button = getComponent("Button")
    const styles = {
      width: '23px',
      height: '23px',
      padding: '2px',
      cursor: 'pointer'
    }

    let value = this.getValue()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    return (
      <div>
        <h4>Azure App Service authorization<JumpToPath path={[ "securityDefinitions", name ]} /></h4>
        { value && <h6>Authorized</h6>}
        { value && <h6>{value}</h6>}
        <Row>
          
        </Row>
        <Row>
          <label>Log in with:</label>
          <p>{
            ['aad', 'facebook', 'google', 'microsoftaccount', 'twitter'].map(provider =>
              <img key={provider} src={logos[provider]} alt={provider} style={styles} onClick={() => this.login(provider)} />
            )
          }</p>
        </Row>
        {
          errors.valueSeq().map( (error, key) => 
            <AuthError error={ error } key={ key }/> 
          )
        }
      </div>
    )
  }
}
