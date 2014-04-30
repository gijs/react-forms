/**
 * @jsx React.DOM
 */

(function() {
'use strict';

var Form             = ReactForms.Form;
var FormFor          = ReactForms.FormFor;
var Schema           = ReactForms.schema.Schema;
var List             = ReactForms.schema.List;
var Property         = ReactForms.schema.Property;
var RadioButtonGroup = ReactForms.input.RadioButtonGroup;

function SexField(props) {
  props = props || {};
  var options = [
    {value: 'male', name: 'Male'},
    {value: 'female', name: 'Female'}
  ];
  return (
    Property(
      {name:props.name || 'sex',
      label:props.label || 'Sex',
      required:props.required,
      input:RadioButtonGroup( {options:options} )}
      )
  );
}

var NameInput = React.createClass({displayName: 'NameInput',

  getInitialState: function() {
    return {selection: {start: 0, end: 0}};
  },

  onChange: function(e) {
    var value = e.target.value;
    var node = this.getDOMNode();
    this.setState({
      selection: {start: node.selectionStart, end: node.selectionEnd}
    });
    this.props.onChange(value);
  },

  componentDidUpdate: function() {
    var node = this.getDOMNode();
    if (document.activeElement === node) {
      node.setSelectionRange(this.state.selection.start, this.state.selection.end);
    }
  },

  format: function(value) {
    return value.split(/\s+/)
      .map(function(s)  {return s.charAt(0).toUpperCase() + s.slice(1);})
      .join(' ');
  },

  render: function() {
    var value = this.format(this.props.value);
    return this.transferPropsTo(
      React.DOM.input(
        {type:"text",
        value:value,
        onChange:this.onChange} )
    );
  }
});

function validateName(v) {
  return /^[a-z\s]+$/i.test(v);
}

function NameField(props) {
  props = props || {};
  return (
    Property(
      {name:props.name || 'name',
      label:props.label || 'Name',
      hint:"Should contain only alphanumeric characters",
      input:NameInput(null ),
      validate:validateName}
      )
  );
}

function DateOfBirthField(props) {
  props = props || {};
  return (
    Property(
      {name:props.name || 'dob',
      label:props.label || 'Date of Birth',
      hint:"Should be in YYYY-MM-DD format",
      type:"date"}
      )
  );
}

function Adult(props) {
  props = props || {};
  return (
    Schema( {label:props.label || 'Adult', name:props.name}, 
      NameField(null ),
      DateOfBirthField(null )
    )
  );
}

function Child(props) {
  props = props || {};
  return (
    Schema( {component:ChildFieldset, name:props.name}, 
      NameField(null ),
      DateOfBirthField(null ),
      SexField( {required:true} ),
      Property( {label:"Female specific value", name:"femaleSpecificValue"} ),
      Property( {label:"Male specific value", name:"maleSpecificValue"} )
    )
  );
}

function Family(props) {
  props = props || {};
  return (
    Schema( {name:props.name}, 
      Adult( {name:"mother", label:"Mother"} ),
      Adult( {name:"father", label:"Father"} ),
      List( {label:"Children", name:"children"}, 
        Child(null )
      )
    )
  );
}

var ChildFieldset = React.createClass({displayName: 'ChildFieldset',
  mixins: [ReactForms.FieldsetMixin],

  render: function() {
    var sex = this.valueLens().val().sex;
    return this.transferPropsTo(
      React.DOM.div( {className:"react-forms-fieldset"}, 
        FormFor( {name:"name"} ),
        FormFor( {name:"dob"} ),
        FormFor( {name:"sex"} ),
        sex === 'male' ?
         FormFor( {name:"maleSpecificValue"} ) :
         sex === 'female' ?
         FormFor( {name:"femaleSpecificValue"} ) :
         null
      )
    );
  }
});

React.renderComponent(
  ShowValue( {horizontal:true, onUpdate:true}, 
    Form( {schema:Family(null )} )
  ),
  document.getElementById('example')
);

})();
