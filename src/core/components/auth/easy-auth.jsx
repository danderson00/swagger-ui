import React, { PropTypes } from "react"
import { MobileServiceClient } from "azure-mobile-apps-client"

export default class EasyAuth extends React.Component {
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

  }

  render() {
    let { schema, getComponent, errSelectors, name } = this.props
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const Markdown = getComponent( "Markdown" )
    const JumpToPath = getComponent("JumpToPath", true)
    let value = this.getValue()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    return (
      <div>
        <h4>Azure App Service authorization<JumpToPath path={[ "securityDefinitions", name ]} /></h4>
        { value && <h6>Authorized</h6>}
        <Row>
          <Markdown options={{html: true, typographer: true, linkify: true, linkTarget: "_blank"}}
                    source={ schema.get("description") } />
        </Row>
        <Row>
          <p>Name: <code>{ schema.get("name") }</code></p>
        </Row>
        <Row>
          <p>In: <code>{ schema.get("in") }</code></p>
        </Row>
        <Row>
          <label>Log in with:</label>
          <p>{['aad'].map(provider =>
              <button key={provider} onClick={() => this.login(provider)}>{provider}</button>
          )}</p>
        </Row>
        {
          errors.valueSeq().map( (error, key) => {
            return <AuthError error={ error }
                              key={ key }/>
          } )
        }
      </div>
    )
  }
}
