/**
 * @jsx React.DOM
 */

(function() {

var cx               = React.addons.classSet;
var cloneWithProps   = React.addons.cloneWithProps;

window.ShowValue = React.createClass({displayName: 'ShowValue',

  propTypes: {
    children: React.PropTypes.component.isRequired
  },

  getInitialState: function() {
    return {
      value: this.props.children.props.value,
      validation: this.props.children.props.validation,
      serializedValue: this.props.children.props.serializedValue,
      showDebugInfo: false
    };
  },

  onUpdate: function(value, validation, serializedValue) {
    var nextState = {
      validation: validation,
      serializedValue: serializedValue
    };

    if (validation.isSuccess) {
      nextState.value = value;
    }

    this.setState(nextState);
  },

  toggleDebugInfo: function() {
    this.setState({showDebugInfo: !this.state.showDebugInfo});
  },

  render: function() {
    var props = {
      value: this.state.value,
      validation: this.state.validation,
      serializedValue: this.state.serializedValue,
      onUpdate: this.onUpdate
    };

    var horizontal = this.props.horizontal;

    return this.transferPropsTo(
      React.DOM.div( {className:cx({ShowValue: true, row: horizontal})}, 

        React.DOM.div( {className:cx({ShowValueComponent: true, 'col-md-6': horizontal})}, 
          React.DOM.p( {className:"text"}, "Component:"),
          cloneWithProps(this.props.children, props)
        ),

        React.DOM.div( {className:cx({ShowValueValue: true, 'col-md-6': horizontal})}, 
          React.DOM.div( {className:"ShowDebugInfoToggle"}, 
            React.DOM.label(null, 
              React.DOM.input(
                {type:"checkbox",
                checked:this.state.showDebugInfo,
                onChange:this.toggleDebugInfo} ), " Show debug info"
            )
          ),
          React.DOM.p( {className:"text"}, "Value:"),
          React.DOM.pre( {className:"value"}, 
            this.state.value === undefined ?
              'null' :
              JSON.stringify(this.state.value, undefined, 2)
          ),
          this.state.showDebugInfo &&
            React.DOM.div( {className:"DebugInfo"}, 
              React.DOM.p( {className:"text"}, "Serialized value:"),
              React.DOM.pre( {className:"value"}, 
                this.state.serializedValue === undefined ?
                  'null' :
                  JSON.stringify(this.state.serializedValue, undefined, 2)
              ),
              React.DOM.p( {className:"text"}, "Validation:"),
              React.DOM.pre( {className:"value"}, 
                this.state.validation === undefined ?
                  'null' :
                  JSON.stringify(this.state.validation, undefined, 2)
              )
            )
        )
      )
    );
  }
});

})();
