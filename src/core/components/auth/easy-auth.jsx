import React, { PropTypes } from "react"
var WindowsAzure = require("azure-mobile-apps-client")

export class EasyAuth extends React.Component {
  static propTypes = {
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    errSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
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
      setTimeout(() => document.getElementById('submitAuth').click())
    })
  }

  render() {
    let { schema, getComponent, errSelectors, name } = this.props
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const JumpToPath = getComponent("JumpToPath", true)
    const Button = getComponent("Button")
    let value = this.getValue()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    return (
      <div>
        <h4>Azure App Service authorization<JumpToPath path={[ "securityDefinitions", name ]} /></h4>
        { value && <h6>Authorized</h6>}
        <Row>
          
        </Row>
        <Row>
          <label>Log in with:</label>
          <p>{
            ['aad'].map(provider =>
              <button key={provider} onClick={() => this.login(provider)}>{provider}</button>
            )
          }</p>
          <input id="submitAuth" type="submit" style={{ display: 'none' }} />
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
