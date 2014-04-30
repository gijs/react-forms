(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react'], factory);
  } else {
    root.ReactForms = factory(root.React);
  }
})(window, function(React) {

  var __ReactShim = window.__ReactShim = window.__ReactShim || {};

  __ReactShim.React = React;

  __ReactShim.cloneWithProps = React.addons.cloneWithProps;

  __ReactShim.cx = React.addons.classSet;

  __ReactShim.invariant = function(check, msg) {
    if (!check) {
      throw new Error(msg);
    }
  }

  var mergeInto = __ReactShim.mergeInto = function(dst, src) {
    for (var k in src) {
      if (src.hasOwnProperty(k)) {
        dst[k] = src[k];
      }
    }
  }

  __ReactShim.merge = function(a, b) {
    var c = {};
    mergeInto(c, a);
    mergeInto(c, b);
    return c;
  }

  __ReactShim.emptyFunction = function() {
  }

  __ReactShim.emptyFunction.thatReturnsTrue = function() {
    return true;
  }

  __ReactShim.ReactUpdates = {
    batchedUpdates: function(cb) { cb(); }
  };

  return require('./lib/');
});

},{"./lib/":18}],2:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React           = (window.__ReactShim.React);
var cx              = (window.__ReactShim.cx);
var mergeInto       = (window.__ReactShim.mergeInto);
var FieldMixin      = require('./FieldMixin');
var Message         = require('./Message');

var Field = React.createClass({displayName: 'Field',
  mixins: [FieldMixin],

  propTypes: {
    label: React.PropTypes.string
  },

  renderLabel: function(props) {
    var schema = this.schema();
    var label = this.props.label ? this.props.label : schema.props.label;
    var hint = this.props.hint ? this.props.hint : schema.props.hint;
    var labelProps = {className: 'react-forms-label'};
    if (props) {
      mergeInto(labelProps, props);
    }
    return (label || hint) && React.DOM.label(labelProps,
      label,
      hint && React.DOM.span( {className:"react-forms-hint"}, hint));
  },

  render: function() {
    var validation = this.validationLens().val();

    var className = cx({
      'react-forms-field': true,
      'invalid': validation.isFailure
    });

    var id = this._rootNodeID;

    return (
      React.DOM.div( {className:className}, 
        this.renderLabel({htmlFor: id}),
        this.transferPropsTo(this.renderInputComponent({id:id})),
        validation.isFailure &&
          Message(null, validation.validation.failure)
      )
    );
  }
});

module.exports = Field;

},{"./FieldMixin":3,"./Message":11}],3:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React             = (window.__ReactShim.React);
var cloneWithProps    = (window.__ReactShim.cloneWithProps);
var mergeInto         = (window.__ReactShim.mergeInto);
var FormElementMixin  = require('./FormElementMixin');

/**
 * Mixin for implementing fieldcomponents.
 *
 * See <Field /> component for the basic implementation example.
 */
var FieldMixin = {
  mixins: [FormElementMixin],

  propTypes: {
    input: React.PropTypes.component
  },

  onChange: function(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    var value = getValueFromEvent(e);

    this.updateValue(value);
  },

  /**
   * Render input component.
   *
   * @returns {ReactComponent}
   */
  renderInputComponent: function(props) {
    var value = this.serializedValueLens().val();
    var schema = this.schema();

    var input = this.props.input || schema && schema.props.input;
    var inputProps = {value:value, onChange: this.onChange};

    if (props) {
      mergeInto(inputProps, props);
    }

    if (input) {
      return cloneWithProps(input, inputProps);
    } else {
      inputProps.type = 'text';
      return React.DOM.input(inputProps);
    }
  }
};

/**
 * Extract value from event
 *
 * We support both React.DOM 'change' events and custom change events
 * emitted from custom components.
 *
 * This function also normalizes empty strings to null.
 *
 * @param {Event} e
 */
function getValueFromEvent(e) {
  return e && e.target && e.target.value !== undefined ?
    e.target.value : e;
}

module.exports = FieldMixin;

},{"./FormElementMixin":8}],4:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React         = (window.__ReactShim.React);
var FieldsetMixin = require('./FieldsetMixin');

var Fieldset = React.createClass({displayName: 'Fieldset',
  mixins: [FieldsetMixin],

  render: function() {
    var schema = this.schema();
    return this.transferPropsTo(
      React.DOM.div( {className:"react-forms-fieldset"}, 
        schema.props.label && React.DOM.h4(null, schema.props.label),
        schema.map(this.renderField)
      )
    );
  }
});

module.exports = Fieldset;

},{"./FieldsetMixin":5}],5:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var FormElementMixin  = require('./FormElementMixin');
var FormContextMixin  = require('./FormContextMixin');

/**
 * Mixin for implementing fieldcomponents.
 *
 * See <Fieldset /> component for the basic implementation example.
 */
var FieldsetMixin = {
  mixins: [FormElementMixin, FormContextMixin],

  /**
   * Render field given a schema node
   *
   * @param {Schema} node
   * @returns {ReactComponent}
   */
  renderField: function(node) {
    // prevent circular require
    var createComponentFromSchema = require('./createComponentFromSchema');
    return createComponentFromSchema(node);
  }
};

module.exports = FieldsetMixin;

},{"./FormContextMixin":7,"./FormElementMixin":8,"./createComponentFromSchema":15}],6:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React     = (window.__ReactShim.React);
var FormMixin = require('./FormMixin');
var FormFor   = require('./FormFor');

var Form = React.createClass({displayName: 'Form',
  mixins: [FormMixin],

  render: function() {
    return this.transferPropsTo(
      React.DOM.form(null, 
        FormFor(null )
      )
    );
  }
});

module.exports = Form;

},{"./FormFor":9,"./FormMixin":10}],7:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React = (window.__ReactShim.React);

/**
 * Mixin for components which exposes form context.
 *
 * See Form (via FormMixin), Fieldset (via FieldsetMixin) and RepeatingFieldset
 * (via RepeatingFieldsetMixin) for components which expose form context.
 */
var FormContextMixin = {

  childContextTypes: {
    serializedValueLens: React.PropTypes.object,
    valueLens: React.PropTypes.object,
    validationLens: React.PropTypes.object,
    schema: React.PropTypes.object,
    onValueUpdate: React.PropTypes.func
  },

  getChildContext: function() {
    return {
      serializedValueLens: this.serializedValueLens(),
      valueLens: this.valueLens(),
      validationLens: this.validationLens(),
      schema: this.schema(),
      onValueUpdate: this.onValueUpdate
    };
  }
};

module.exports = FormContextMixin;

},{}],8:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React                     = (window.__ReactShim.React);
var invariant                 = (window.__ReactShim.invariant);
var schema                    = require('./schema');
var ValidatedMixin            = require('./ValidatedMixin');
var getDefaultValueForSchema  = require('./getDefaultValueForSchema');
var validationM               = require('./validation');

var success = validationM.success;
var serialize = validationM.serialize;

/**
 * Mixin for the form element (form field, fieldset of repeating fieldset).
 */
var FormElementMixin = {

  mixins: [ValidatedMixin],

  propTypes: {
    name: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  },

  contextTypes: {
    serializedValueLens: React.PropTypes.object,
    valueLens: React.PropTypes.object,
    validationLens: React.PropTypes.object,
    schema: React.PropTypes.object,
    onValueUpdate: React.PropTypes.func
  },

  /**
   * Return lens for the form element value or for the value passed as an
   * argument.
   *
   * @param {Any?} value
   * @returns {Lens}
   */
  serializedValueLens: function(value) {
    var lens = this.context.serializedValueLens;
    if (this.props.name !== undefined) {
      lens = lens.get(
        this.props.name,
        serialize(this.schema(), this.valueLens(value).val())
      );
    }
    return value ? lens.for(value) : lens;
  },

  valueLens: function(value) {
    var lens = this.context.valueLens;
    if (this.props.name !== undefined) {
      lens = lens.get(this.props.name, getDefaultValueForSchema(this.schema()));
    }
    return value ? lens.for(value) : lens;
  },

  /**
   * Return lens for the form element validation state or for the validation
   * state passed as an argument.
   *
   * @param {Validation?} validation
   * @returns {Lens}
   */
  validationLens: function(validation) {
    var lens = this.context.validationLens;
    if (this.props.name !== undefined) {
      lens = lens.get('children', {}).get(this.props.name, success);
    }
    return validation ? lens.for(validation) : lens;
  },

  /**
   * Return form element schema.
   *
   * @returns {Schema}
   */
  schema: function() {
    var node = this.context.schema;

    if (node && this.props.name !== undefined) {
      if (schema.isSchema(node)) {
        node = node.children[this.props.name];
      } else if (schema.isList(node)) {
        node = node.children;
      } else {
        invariant(false, 'invalid field used for schema');
      }
    }

    return node;
  },

  /**
   * Called when the form value and validation state is being updated.
   *
   * This method intercepts updated value and validation state and perform its
   * own local validation and deserialization. Then passes everything up the
   * owner.
   *
   * @param {Any} value
   * @param {Validation} validation
   */
  onValueUpdate: function(value, validation, serializedValue) {
    var validationLens = this.validationLens(validation);
    var valueLens = this.valueLens(value);

    var local = this.validateOnly(
      valueLens.val(),
      validationLens.val().children
    );

    valueLens = valueLens.mod(local.value);
    validationLens = validationLens.update(local.validation);

    this.context.onValueUpdate(
      valueLens.root(),
      validationLens.root(),
      serializedValue
    );
  },

  /**
   * Update the serialized value for the current form element.
   *
   * @param {Any} serializedValue
   */
  updateValue: function(serializedValue) {
    this.onValueUpdate(
      this.valueLens().mod(serializedValue).root(),
      this.validationLens().root(),
      this.serializedValueLens().mod(serializedValue).root()
    );
  }

};

module.exports = FormElementMixin;

},{"./ValidatedMixin":14,"./getDefaultValueForSchema":16,"./schema":24,"./validation":26}],9:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React                     = (window.__ReactShim.React);
var FormElementMixin          = require('./FormElementMixin');
var createComponentFromSchema = require('./createComponentFromSchema');

/**
 * A "proxy" component which renders into field, fieldset or repeating fieldset
 * based on a current schema node.
 */
var FormFor = React.createClass({displayName: 'FormFor',
  mixins: [FormElementMixin],

  propTypes: {
    name: React.PropTypes.string
  },

  render: function() {
    return this.transferPropsTo(createComponentFromSchema(this.schema()));
  }
});

module.exports = FormFor;

},{"./FormElementMixin":8,"./createComponentFromSchema":15}],10:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React                     = (window.__ReactShim.React);
var ReactUpdates              = (window.__ReactShim.ReactUpdates);
var lens                      = require('./lens');
var ValidatedMixin            = require('./ValidatedMixin');
var FormContextMixin          = require('./FormContextMixin');
var getDefaultValueForSchema  = require('./getDefaultValueForSchema');
var validationM               = require('./validation');

var serialize = validationM.serialize;
var success = validationM.success;

/**
 * Mixin which handles form value and form validation state.
 *
 * @private
 */
var FormStateMixin = {
  mixins: [ValidatedMixin],

  propTypes: {
    defaultValue: React.PropTypes.any,
    value: React.PropTypes.any,
    serializedValue: React.PropTypes.any,
    schema: React.PropTypes.object,
    onChange: React.PropTypes.func,
    onUpdate: React.PropTypes.func
  },

  getInitialState: function() {
    var value = this.props.value ||
      this.props.defaultValue ||
      getDefaultValueForSchema(this.props.schema);
    var state = this.getFormState(value);
    return state;
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.value !== undefined) {
      var nextState;
      if (nextProps.validation !== undefined &&
          nextProps.serializedValue !== undefined) {
        nextState = {
          serializedValue: nextProps.serializedValue,
          validation: nextProps.validation,
          value: nextProps.value
        };
      } else {
        nextState = this.getFormState(nextProps.value);
      }
      this.setState(nextState);
    }
  },

  getFormState: function(value) {
    var validation = this.validate(value);
    return {
      value: validation.value,
      validation: validation.validation,
      serializedValue: serialize(this.schema(), validation.value)
    };
  },

  /**
   * Return lens for the form value or for the value passed as an argument.
   *
   * @param {Any?} value
   * @returns {Lens}
   */
  serializedValueLens: function(value) {
    return lens(value !== undefined ? value : this.state.serializedValue);
  },

  valueLens: function(value) {
    return lens(value !== undefined ? value : this.state.value);
  },

  /**
   * Return lens for the form validation state or for the validation state
   * passed as an argument.
   *
   * @param {Validation?} validation
   * @returns {Lens}
   */
  validationLens: function(validation) {
    return lens(validation !== undefined ? validation : this.state.validation);
  },

  /**
   * Form schema.
   *
   * @returns {Schema}
   */
  schema: function() {
    return this.props.schema;
  },

  /**
   * Called when the form value and validation state is being updated.
   *
   * @param {Any} value
   * @param {Validation} validation
   * @param {Any} convertedValue
   */
  onValueUpdate: function(value, validation, serializedValue) {
    validation = validation || success;
    ReactUpdates.batchedUpdates(function()  {
      if (this.props.onUpdate) {
        this.props.onUpdate(value, validation, serializedValue);
      }
      if (this.props.onChange && validation.isSuccess) {
        this.props.onChange(value, validation, serializedValue);
      }
      this.setState({value:value, validation:validation, serializedValue:serializedValue});
    }.bind(this));
  }
};

var FormMixin = {
  mixins: [FormStateMixin, FormContextMixin]
};

module.exports = FormMixin;

},{"./FormContextMixin":7,"./ValidatedMixin":14,"./getDefaultValueForSchema":16,"./lens":23,"./validation":26}],11:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React = (window.__ReactShim.React);

var Message = React.createClass({displayName: 'Message',

  render: function() {
    return this.transferPropsTo(
      React.DOM.span( {className:"react-forms-message"}, 
        this.props.children
      )
    );
  }
});

module.exports = Message;

},{}],12:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React                   = (window.__ReactShim.React);
var RepeatingFieldsetMixin  = require('./RepeatingFieldsetMixin');

var Item = React.createClass({displayName: 'Item',

  render: function() {
    return this.transferPropsTo(
      React.DOM.div( {className:"react-forms-repeating-fieldset-item"}, 
        this.props.children,
        React.DOM.button(
          {onClick:this.onRemove,
          type:"button",
          className:"react-forms-repeating-fieldset-remove"}, "×")
      )
    );
  },

  onRemove: function() {
    if (this.props.onRemove) {
      this.props.onRemove(this.props.name);
    }
  }

});

var RepeatingFieldset = React.createClass({displayName: 'RepeatingFieldset',

  mixins: [RepeatingFieldsetMixin],

  getDefaultProps: function() {
    return {
      item: Item
    };
  },

  render: function() {
    var schema = this.schema();
    var Component = this.props.item;
    var fields = this.renderFields().map(function(item) 
      {return Component(
        {key:item.props.name,
        name:item.props.name,
        onRemove:this.remove}, 
        item
      );}.bind(this)
    );
    return this.transferPropsTo(
      React.DOM.div( {className:"react-forms-repeating-fieldset"}, 
        schema.props.label && React.DOM.h4(null, schema.props.label),
        fields,
        React.DOM.button(
          {type:"button",
          onClick:this.add,
          className:"react-forms-repeating-fieldset-add"}, "Add")
      )
    );
  }

});

module.exports = RepeatingFieldset;
module.exports.Item = Item;

},{"./RepeatingFieldsetMixin":13}],13:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React                     = (window.__ReactShim.React);
var cloneWithProps            = (window.__ReactShim.cloneWithProps);
var FormElementMixin          = require('./FormElementMixin');
var FormContextMixin          = require('./FormContextMixin');
var getDefaultValueForSchema  = require('./getDefaultValueForSchema');

/**
 * Mixin for implementing repeating fieldsets.
 *
 * See <RepeatingFieldset /> component for the basic implementation example.
 */
var RepeatingFieldsetMixin = {
  mixins: [FormElementMixin, FormContextMixin],

  propTypes: {
    onRemove: React.PropTypes.func,
    onAdd: React.PropTypes.func
  },

  /**
   * Return an array of React components rendered for all the values in an array
   * this fieldset owns.
   *
   * @returns {Array.<ReactComponent>}
   */
  renderFields: function() {
    // prevent circular require
    var createComponentFromSchema = require('./createComponentFromSchema');
    var schema = this.schema();
    var children = createComponentFromSchema(schema.children);
    return this.serializedValueLens().val().map(function(item, name) 
      {return cloneWithProps(children, {name:name, key: name});});
  },

  /**
   * Remove a value from fieldset's value by index
   *
   * @param {String|Number} name
   */
  remove: function(name) {
    var value = this.serializedValueLens().val().slice(0);
    value.splice(name, 1);
    this.updateValue(value);
    if (this.props.onRemove) {
      this.props.onRemove(name);
    }
  },

  /**
   * Add new value to fieldset's value.
   */
  add: function() {
    var schema = this.schema();
    var defaultValue = getDefaultValueForSchema(schema.children);
    this.updateValue(this.valueLens().val().concat(defaultValue));
    if (this.props.onAdd) {
      this.props.onAdd();
    }
  }
};

module.exports = RepeatingFieldsetMixin;

},{"./FormContextMixin":7,"./FormElementMixin":8,"./createComponentFromSchema":15,"./getDefaultValueForSchema":16}],14:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var validation = require('./validation');

/**
 * Common validation routines.
 *
 * @private
 */
var ValidatedMixin = {

  /**
   * Validate value incrementally
   *
   * @param {Any} value
   * @param {Object.<{<name>: Validation}>} children
   * @returns {Object.<{value: Any, validation: Validation}>}
   */
  validateOnly: function(value, children) {
    return this._validateWith(validation.validateOnly, value, children);
  },

  /**
   * Validate value.
   *
   * @param {Any} value
   * @returns {Object.<{value: Any, validation: Validation}>}
   */
  validate: function(value) {
    return this._validateWith(validation.validate, value);
  },

  _validateWith: function(validate, value, children) {
    value = value !== undefined ? value : this.serializedValueLens().val();
    var schema = this.schema();
    return schema ?
      validate(schema, value, children) :
      {validation: validation.success, value:value};
  }
};

module.exports = ValidatedMixin;

},{"./validation":26}],15:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var invariant         = (window.__ReactShim.invariant);
var schema            = require('./schema');
var Field             = require('./Field');
var Fieldset          = require('./Fieldset');
var RepeatingFieldset = require('./RepeatingFieldset');

/**
 * Create a component which represents provided schema node
 *
 * @private
 * @param {SchemaNode} node
 * @returns {ReactComponent}
 */
function createComponentFromSchema(node) {
  if (node.props.component) {
    return node.props.component({key: node.name, name: node.name});
  }

  if (schema.isList(node)) {
    return RepeatingFieldset( {key:node.name, name:node.name} );
  } else if (schema.isSchema(node)) {
    return Fieldset( {key:node.name, name:node.name} );
  } else if (schema.isProperty(node)) {
    return Field( {key:node.name, name:node.name} );
  } else {
    invariant(false, 'invalid schema node: %s', node);
  }
}

module.exports = createComponentFromSchema;

},{"./Field":2,"./Fieldset":4,"./RepeatingFieldset":12,"./schema":24}],16:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var invariant = (window.__ReactShim.invariant);
var schema    = require('./schema');

/**
 * Get default value for schema node
 *
 * @param {SchemaNode} node
 * @returns {Any}
 */
function getDefaultValueForSchema(node) {
  if (node && node.props && node.props.defaultValue !== undefined) {
    return node.props.defaultValue;
  }
  if (schema.isSchema(node)) {
    return {};
  } else if (schema.isList(node)) {
    return [];
  } else if (schema.isProperty(node)) {
    return null;
  } else {
    invariant(
      false,
      'do not know how to infer default value for %s', node
    );
  }
}

module.exports = getDefaultValueForSchema;

},{"./schema":24}],17:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var invariant = (window.__ReactShim.invariant);
var isString  = require('./isString');
var types     = require('./types');
var schema    = require('./schema');

/**
 * Return a type which corresponds to a given schema node.
 *
 * @param {Schema} node
 * @return {Type}
 */
function getTypeFromSchema(node) {
  if (node && node.props.type) {

    invariant(
      schema.isProperty(node),
      'only Property schema nodes can have types'
    );

    if (isString(node.props.type)) {
      var type = types[node.props.type];
      invariant(type, 'unknown type %s', node.props.type);
      return type;
    }

    return node.props.type;
  }

  return types.any;
}

module.exports = getTypeFromSchema;

},{"./isString":22,"./schema":24,"./types":25}],18:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var Form                    = require('./Form');
var Fieldset                = require('./Fieldset');
var RepeatingFieldset       = require('./RepeatingFieldset');
var Field                   = require('./Field');
var FormFor                 = require('./FormFor');
var Message                 = require('./Message');

var FormMixin               = require('./FormMixin');
var FormContextMixin        = require('./FormContextMixin');
var FormElementMixin        = require('./FormElementMixin');
var FieldMixin              = require('./FieldMixin');
var FieldsetMixin           = require('./FieldsetMixin');
var RepeatingFieldsetMixin  = require('./RepeatingFieldsetMixin');

var validators              = require('./validators');
var types                   = require('./types');
var schema                  = require('./schema');
var input                   = require('./input');

module.exports = {
  FormMixin:FormMixin, FormContextMixin:FormContextMixin, FormElementMixin:FormElementMixin,
  FieldMixin:FieldMixin, FieldsetMixin:FieldsetMixin, RepeatingFieldsetMixin:RepeatingFieldsetMixin,

  Form:Form, Field:Field, Fieldset:Fieldset, RepeatingFieldset:RepeatingFieldset,

  FormFor:FormFor, Message:Message,

  schema:schema, types:types, validators:validators, input:input
};

},{"./Field":2,"./FieldMixin":3,"./Fieldset":4,"./FieldsetMixin":5,"./Form":6,"./FormContextMixin":7,"./FormElementMixin":8,"./FormFor":9,"./FormMixin":10,"./Message":11,"./RepeatingFieldset":12,"./RepeatingFieldsetMixin":13,"./input":21,"./schema":24,"./types":25,"./validators":27}],19:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React = (window.__ReactShim.React);

var CheckboxGroup = React.createClass({displayName: 'CheckboxGroup',

  propTypes: {
    options: React.PropTypes.array.isRequired,
    value: React.PropTypes.array,
    onChange: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {value: []};
  },

  onChange: function(e) {
    if (!this.props.onChange) {
      return;
    }

    var nextValue = this.props.value.slice(0);

    if (e.target.checked) {
      nextValue.push(e.target.value);
    } else {
      var idx = nextValue.indexOf(e.target.value);
      if (idx > -1) {
        nextValue.splice(idx, 1);
      }
    }

    var values = this.props.options.map(function(o)  {return o.value;});
    nextValue.sort(function(a, b)  {return values.indexOf(a) - values.indexOf(b);});

    this.props.onChange(nextValue);
  },

  render: function() {
    var name = this._rootNodeID;
    var value = this.props.value;
    var options = this.props.options.map(function(option)  {
      var checked = value && value.indexOf(option.value) > -1;
      return (
        React.DOM.div(
          {className:"react-forms-checkbox-group-button",
          key:option.value}, 
          React.DOM.label( {className:"react-forms-checkbox-group-label"}, 
            React.DOM.input(
              {onChange:this.onChange,
              checked:checked,
              className:"react-forms-checkbox-group-checkbox",
              type:"checkbox",
              name:name,
              value:option.value} ),
            React.DOM.span( {className:"react-forms-checkbox-group-caption"}, 
              option.name
            )
          )
        )
      );
    }.bind(this));

    return (
      React.DOM.div( {className:"react-forms-checkbox-group"}, 
        options
      )
    );
  }
});

module.exports = CheckboxGroup;

},{}],20:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var React = (window.__ReactShim.React);

function renderEmptyOption(props, onChange) {
  return (
    React.DOM.div(
        {className:"react-forms-radio-button-group-button",
        key:""}, 
      React.DOM.label(
        {className:"react-forms-radio-button-group-label"}, 
        React.DOM.input(
          {checked:props.checked,
          className:"react-forms-radio-button-group-radio",
          type:"radio",
          name:props.name,
          onChange:onChange.bind(null, null),
          value:""} ),
        React.DOM.span( {className:"react-forms-radio-button-group-caption"}, 
          "none"
        )
      )
    )
  );
}

var RadioButtonGroup = React.createClass({displayName: 'RadioButtonGroup',

    propTypes: {
      options: React.PropTypes.array.isRequired,
      allowEmpty: React.PropTypes.bool,
      value: React.PropTypes.string,
      onChange: React.PropTypes.func
    },

    render: function() {
      var options = this.props.options.map(this.renderOption);

      if (this.props.allowEmpty) {
        options.unshift(renderEmptyOption({
            name: this._rootNodeID,
            checked: !this.props.value
        }, this.onChange));
      }

      return (
        React.DOM.div( {className:"react-forms-radio-button-group"}, 
          options
        )
      );
    },

    renderOption: function(option) {
      var name = this._rootNodeID;
      var checked = this.props.value ?
          this.props.value === option.value :
          false;
      return (
        React.DOM.div(
          {className:"react-forms-radio-button-group-button",
          key:option.value}, 
          React.DOM.label(
            {className:"react-forms-radio-button-group-label"}, 
            React.DOM.input(
              {checked:checked,
              className:"react-forms-radio-button-group-radio",
              type:"radio",
              name:name,
              onChange:this.onChange.bind(null, option.value),
              value:option.value} ),
            React.DOM.span( {className:"react-forms-radio-button-group-caption"}, 
              option.name
            )
          )
        )
      );
    },

    onChange: function(value) {
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
});

module.exports = RadioButtonGroup;

},{}],21:[function(require,module,exports){
'use strict';
/**
 * @jsx React.DOM
 */
module.exports = {
  CheckboxGroup: require('./CheckboxGroup'),
  RadioButtonGroup: require('./RadioButtonGroup')
};

},{"./CheckboxGroup":19,"./RadioButtonGroup":20}],22:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var toString = Object.prototype.toString;

function isString(o) {
  return toString.call(o) === '[object String]';
}

module.exports = isString;

},{}],23:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';



  function Lens(data, path) {
    this.__data = data;
    this.__path = path;
  }

  /**
   * Return a value this lense points to
   */
  Lens.prototype.val=function() {
    var value = this.__data;
    for (var i = 0, len = this.__path.length; i < len; i++) {
      var key = this.__path[i];
      value = value[key.key];
      if (value === undefined && key.defaultValue !== undefined) {
        value = key.defaultValue;
      }
    }
    return value;
  };

  Lens.prototype.root=function() {
    return this.__data;
  };

  Lens.prototype.parent=function() {
    if (this.__path.length === 0) {
      return undefined;
    } else {
      var path = this.__path.slice(0, this.__path.length - 1);
      return new this.constructor(this.__data, path);
    }
  };

  /**
   * Get a lens by a specified key
   *
   * @param {Key} key
   * @param {Any} defaultValue
   */
  Lens.prototype.get=function(key, defaultValue) {
    return new this.constructor(
      this.__data, this.__path.concat({key:key, defaultValue:defaultValue}));
  };

  /**
   * Shortcut for lens.get(key).mod(value)
   *
   * @param {Key} key
   * @param {Any} value
   */
  Lens.prototype.set=function(key, value) {
    return this.get(key).mod(value);
  };

  Lens.prototype.update=function(values) {
    var data = this.val();
    var copy = {};
    var k;
    for (k in data) {
      copy[k] = data[k];
    }
    for (k in values) {
      copy[k] = values[k];
    }
    return this.mod(copy);
  };

  /**
   * Return lens for a new data which points to the same location.
   *
   * @param {Any} data
   */
  Lens.prototype.for=function(data) {
    return new this.constructor(data, this.__path);
  };

  /**
   * Return a new copy of data by replacing a value this lens points to with a
   * new value.
   *
   * @param {Any} value
   */
  Lens.prototype.mod=function(value) {
    var updated, newData, prevData;
    var data = this.__data;
    var path = this.__path;

    if (path.length === 0) {
      return this.for(value);
    }

    for (var i = 0, len = path.length; i < len; i++) {
      var key = path[i];

      // copy through changed path
      if (Array.isArray(data)) {
        updated = data.slice(0);
      } else if (typeof data === 'object') {
        updated = {};
        for (var k in data) {
          updated[k] = data[k];
        }
      }

      // store reference to newly created root data
      if (newData === undefined) {
        newData = updated;
      }

      // mutate previously copied data with updated value
      if (prevData !== undefined) {
        prevData[path[i - 1].key] = updated;
      }

      // if we are at the last path key update data with a new value
      if (i === len - 1) {
        updated[key.key] = value;
      } else {
        data = updated[key.key];
        if (data === undefined && key.defaultValue !== undefined) {
          data = key.defaultValue;
        }
      }

      prevData = updated;
    }

    return this.for(newData);
  };

  /**
   * Make a new lens for data
   *
   * @param {Any} data
   */
  Lens.make=function(data) {
    return new this(data, []);
  };


module.exports = Lens.make.bind(Lens);

},{}],24:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var merge       = (window.__ReactShim.merge);
var invariant   = (window.__ReactShim.invariant);

function Node(){}



for(var Node____Key in Node){if(Node.hasOwnProperty(Node____Key)){PropertyNode[Node____Key]=Node[Node____Key];}}var ____SuperProtoOfNode=Node===null?null:Node.prototype;PropertyNode.prototype=Object.create(____SuperProtoOfNode);PropertyNode.prototype.constructor=PropertyNode;PropertyNode.__superConstructor__=Node;

  function PropertyNode(props) {
    props = props ? merge({}, props) : {};

    this.name = props.name;
    this.props = props;
  }


for(Node____Key in Node){if(Node.hasOwnProperty(Node____Key)){SchemaNode[Node____Key]=Node[Node____Key];}}SchemaNode.prototype=Object.create(____SuperProtoOfNode);SchemaNode.prototype.constructor=SchemaNode;SchemaNode.__superConstructor__=Node;

  function SchemaNode(props) {
    props = props ? merge({}, props) : {};

    var args = Array.prototype.slice.call(arguments, 1);
    var children = {};

    if (args.length !== 0) {
      forEachNested(args, function(arg)  {
        invariant(
          arg.name,
          'props fields should specify name property'
        );
        children[arg.name] = arg;
      });
    }

    this.name = props.name;
    this.props = props;
    this.children = children;
  }

  SchemaNode.prototype.map=function(func, context) {
    var results = [];
    for (var name in this.children) {
      results.push(func.call(context, this.children[name], name, this));
    }
    return results;
  };


for(Node____Key in Node){if(Node.hasOwnProperty(Node____Key)){ListNode[Node____Key]=Node[Node____Key];}}ListNode.prototype=Object.create(____SuperProtoOfNode);ListNode.prototype.constructor=ListNode;ListNode.__superConstructor__=Node;

  function ListNode(props) {
    props = props ? merge({}, props) : {};

    var args = Array.prototype.slice.call(arguments, 1);

    invariant(
      args.length === 1,
      'props for array must contain exactly one child props props'
    );

    this.name = props.name;
    this.props = props;
    this.children = args[0];
  }


function forEachNested(collection, func, context) {
  for (var i = 0, len = collection.length; i < len; i++) {
    if (Array.isArray(collection[i])) {
      forEachNested(collection[i], func, context);
    } else {
      func.call(context, collection[i], i, collection);
    }
  }
}

function makeFactory(constructor) {
  function factory() {
    var node = Object.create(constructor.prototype);
    constructor.apply(node, arguments);
    return node;
  }
  // we do this to support instanceof check
  factory.prototype = constructor.prototype;
  return factory;
}

var Property  = makeFactory(PropertyNode);
var List      = makeFactory(ListNode);
var Schema    = makeFactory(SchemaNode);

function createType(spec) {
  return function(props) {
    props = props || {};
    return spec(props);
  };
}

function isSchema(node) {
  return node instanceof SchemaNode;
}

function isList(node) {
  return node instanceof ListNode;
}

function isProperty(node) {
  return node instanceof PropertyNode;
}

module.exports = {
  Node:Node,
  Property:Property, isProperty:isProperty,
  Schema:Schema, isSchema:isSchema,
  List:List, isList:isList,
  createType:createType
};

},{}],25:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

function idSerialize(value) {
  return value === null ? '' : value;
}

function idDeserialize(value) {
  return value === '' ? null : value;
}

var any = {
  serialize: idSerialize,
  deserialize: idDeserialize
};

var string = any;

var number = {
  serialize: idSerialize,
  deserialize: function(value) {
    if (value === '') {
      return null;
    // based on http://stackoverflow.com/a/1830844/182954
    } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
      return parseFloat(value);
    } else {
      throw new Error('invalid value');
    }
  }
};

var isDateRe = /^\d\d\d\d-\d\d-\d\d$/;

var date = {
  serialize: function(value) {
    if (value === null) {
      return '';
    }
    var year = value.getFullYear();
    var month = value.getMonth() + 1;
    var day = value.getDate();
    return (year + "-" + pad(month, 2) + "-" + pad(day, 2));
  },
  deserialize: function(value) {
    if (value === '') {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    if (!isDateRe.exec(value)) {
      throw new Error('should be a date in YYYY-MM-DD format');
    }

    value = new Date(value);

    if (isNaN(value.getTime())) {
      throw new Error('invalid date');
    }

    return value;
  }
};

function pad(num, size) {
  return ('0000' + num).substr(-size);
}

module.exports = {any:any, string:string, number:number, date:date};

},{}],26:[function(require,module,exports){
/**
 * Schema validation
 *
 * @jsx React.DOM
 */
'use strict';

var invariant         = (window.__ReactShim.invariant);
var schema            = require('./schema');
var getTypeFromSchema = require('./getTypeFromSchema');
var validators        = require('./validators');

var exists     = validators.exists;
var nonEmpty   = validators.nonEmpty;

function serialize(node, value) {
  var result;

  if (schema.isProperty(node)) {
    result = getTypeFromSchema(node).serialize(value);
  } else if (schema.isSchema(node)) {
    result = {};
    for (var k in value) {
      if (node.children[k]) {
        result[k] = serialize(node.children[k], value[k]);
      } else {
        result[k] = value[k];
      }
    }
  } else if (schema.isList(node)) {
    result = new Array(value.length);
    for (var i = 0, len = value.length; i < len; i++) {
      result[i] = serialize(node.children, value[i]);
    }
  } else {
    invariant(false, 'unknown schema passed');
  }

  return result;
}

function deserializeOnly(node, value) {
  if (value === undefined || value === null) {
    return {value:value, validation: success};
  }
  var type = getTypeFromSchema(node);
  try {
    value = type.deserialize(value);
  } catch(e) {
    return {
      validation: failure(e.message),
      value:value
    };
  }
  return {
    validation: success,
    value:value
  };
}

/**
 * Validate value against schema
 *
 * @param {Schema} node
 * @param {Any} value
 * @returns {Validation}
 */
function validate(node, value) {
  if (schema.isSchema(node)) {
    return validateSchema(node, value);
  } else if (schema.isList(node)) {
    return validateList(node, value);
  } else if (schema.isProperty(node)) {
    return validateProperty(node, value);
  } else {
    invariant(
      false,
      'do not know how to validate %s of type %s', node, node.constructor
    );
  }
}

/**
 * Validate value against schema but only using the root schema node.
 *
 * This method is useful when doing an incremental validation.
 *
 * @param {Schema} node
 * @param {Any} value
 * @returns {Validation}
 */
function validateOnly(node, value, children) {
  if (schema.isSchema(node)) {
    return validateSchemaOnly(node, value, children);
  } else if (schema.isList(node)) {
    return validateListOnly(node, value, children);
  } else if (schema.isProperty(node)) {
    return validateProperty(node, value, children);
  } else {
    invariant(
      false,
      'do not know how to validate %s of type %s', node, node.constructor
    );
  }
}

function validateSchema(node, value) {
  var childrenValidation = validateSchemaChildren(node, value);

  var convertedValue = value;

  if (Object.keys(childrenValidation.children).length > 0) {
    convertedValue = {};
    for (var k in value) {
      convertedValue[k] = childrenValidation.children[k] !== undefined ?
        childrenValidation.children[k] :
        value[k];
    }
  }

  var validation = validateSchemaOnly(
      node,
      convertedValue,
      childrenValidation.validation
  );

  return validation;
}

function validateSchemaOnly(node, value, children) {

  if (!areChildrenValid(children)) {
    return {
      value:value,
      validation: {
        isSuccess: false,
        isFailure: true,
        validation: {failure: undefined},
        children: children
      }
    };
  }

  var deserialized = deserializeOnly(node, value);

  if (deserialized.validation.isFailure) {
    return deserialized;
  }

  var validator = exists.andThen(node.props.validate);
  var validation = validator(value, node.props);

  var isSuccess = validators.isSuccess(validation);

  return {
    value: deserialized.value,
    validation: {
      validation:validation,
      isSuccess:isSuccess,
      isFailure: !isSuccess
    }
  };
}

function validateSchemaChildren(node, value) {
  var validation = {};
  var children = {};

  if (value && node.children) {
    for (var name in node.children) {
      var childValidation = validate(node.children[name], value[name]);

      if (childValidation.validation.isFailure) {
        validation[name] = childValidation.validation;
      }

      children[name] = childValidation.value;
    }
  }

  return {validation:validation, children:children};
}

function validateList(node, value) {
  var childrenValidation = validateListChildren(node, value);

  var validation = validateListOnly(
      node,
      childrenValidation.children,
      childrenValidation.validation
  );
  return validation;
}

function validateListOnly(node, value, children) {

  if (!areChildrenValid(children)) {
    return {
      value:value,
      validation: {
        isSuccess: false,
        isFailure: true,
        validation: {failure: undefined},
        children: children
      }
    };
  }

  var deserialized = deserializeOnly(node, value);

  if (deserialized.validation.isFailure) {
    return deserialized;
  }

  var validator = nonEmpty.andThen(node.props.validate);
  var validation = validator(deserialized.value, node.props);
  var isSuccess = validators.isSuccess(validation);

  return {
    value: deserialized.value,
    validation: {
      validation:validation,
      isSuccess:isSuccess,
      isFailure: !isSuccess
    }
  };
}

function validateListChildren(node, value) {
  var validation = {};
  var children = [];

  if (value && node.children) {
    for (var idx = 0, len = value.length; idx < len; idx++) {
      var childValidation = validate(node.children, value[idx]);
      if (childValidation.validation.isFailure) {
        validation[idx] = childValidation.validation;
      }
      children[idx] = childValidation.value;
    }
  }

  return {validation:validation, children:children};
}

function validateProperty(node, value) {

  var deserialized = deserializeOnly(node, value);

  if (deserialized.validation.isFailure) {
    return deserialized;
  }

  var validator = exists.andThen(node.props.validate);
  var validation = validator(deserialized.value, node.props);
  var isSuccess = validators.isSuccess(validation);

  return {
    value: deserialized.value,
    validation: {
      validation:validation,
      isSuccess:isSuccess,
      isFailure: !isSuccess
    }
  };
}

function areChildrenValid(children) {
  for (var k in children) {
    if (children[k].isFailure) {
      return false;
    }
  }
  return true;
}

var success = {
  isSuccess: true,
  isFailure: false,
  children: {}
};

function failure(failure) {
  return {
    validation: {failure:failure},
    isSuccess: false,
    isFailure: true
  };
}

module.exports = {
  validate:validate, validateOnly:validateOnly,
  success:success, failure:failure,
  deserializeOnly:deserializeOnly, serialize:serialize
};

},{"./getTypeFromSchema":17,"./schema":24,"./validators":27}],27:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
'use strict';

var emptyFunction = (window.__ReactShim.emptyFunction);
var isString      = require('./isString');

var success = {failure: undefined};
var commonFailure = {failure: 'invalid value'};

function isSuccess(validation) {
  return validation.failure === undefined;
}

function isFailure(validation) {
  return validation.failure !== undefined;
}

function make(func) {
  var wrapper = function(value, schema)  {
    var maybeFailure = func(value, schema);
    if (maybeFailure === true) {
      return success;
    }
    if (maybeFailure === false) {
      return commonFailure;
    }
    if (isString(maybeFailure)) {
      return {failure: maybeFailure};
    }
    return maybeFailure;
  };
  wrapper.andThen = andThen.bind(null, wrapper);
  wrapper.isValidator = true;
  return wrapper;
}

function validatorEmpty(func) {
  if (!func) {
    return emptyFunction.thatReturnsTrue;
  }
  if (func.isValidator) {
    return func;
  }

  return make(func);
}

function validator(func) {
  if (!func) {
    return emptyFunction.thatReturnsTrue;
  }
  if (func.isValidator) {
    return func;
  }

  var wrapper = function(value, schema) 
    {return value === null || value === undefined ?
      true :
      func(value, schema);};

  return make(wrapper);
}

function andThen(first, second) {
  if (!second) {
    return first;
  }

  second = validator(second);

  var wrapper = function(value, schema)  {
    var validation = first(value, schema);
    return isFailure(validation) ?
      validation :
      second(value, schema);
  };

  return make(wrapper);
}

var exists = validatorEmpty(function(value, schema) 
  {return schema.required && (value === null || value === undefined) ?
    'value is required' :
    true;});

var nonEmpty = validator(function(value, schema) 
  {return schema.nonEmpty && value.length === 0 ?
    'at least one item is required' :
    true;});

module.exports = {
  validatorEmpty:validatorEmpty,
  validator:validator,

  isSuccess:isSuccess,
  isFailure:isFailure,

  success:success,
  exists:exists,
  nonEmpty:nonEmpty
};

},{"./isString":22}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYW5kcmV5cG9wcC8udmlydHVhbGVudnMvZGVmYXVsdC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbmRyZXlwb3BwL1dvcmtzcGFjZS9wcm9tZXRoZXVzL3JlYWN0LWZvcm1zL3N0YW5kYWxvbmUvaW5kZXguanMiLCIvVXNlcnMvYW5kcmV5cG9wcC9Xb3Jrc3BhY2UvcHJvbWV0aGV1cy9yZWFjdC1mb3Jtcy9zdGFuZGFsb25lL2xpYi9GaWVsZC5qcyIsIi9Vc2Vycy9hbmRyZXlwb3BwL1dvcmtzcGFjZS9wcm9tZXRoZXVzL3JlYWN0LWZvcm1zL3N0YW5kYWxvbmUvbGliL0ZpZWxkTWl4aW4uanMiLCIvVXNlcnMvYW5kcmV5cG9wcC9Xb3Jrc3BhY2UvcHJvbWV0aGV1cy9yZWFjdC1mb3Jtcy9zdGFuZGFsb25lL2xpYi9GaWVsZHNldC5qcyIsIi9Vc2Vycy9hbmRyZXlwb3BwL1dvcmtzcGFjZS9wcm9tZXRoZXVzL3JlYWN0LWZvcm1zL3N0YW5kYWxvbmUvbGliL0ZpZWxkc2V0TWl4aW4uanMiLCIvVXNlcnMvYW5kcmV5cG9wcC9Xb3Jrc3BhY2UvcHJvbWV0aGV1cy9yZWFjdC1mb3Jtcy9zdGFuZGFsb25lL2xpYi9Gb3JtLmpzIiwiL1VzZXJzL2FuZHJleXBvcHAvV29ya3NwYWNlL3Byb21ldGhldXMvcmVhY3QtZm9ybXMvc3RhbmRhbG9uZS9saWIvRm9ybUNvbnRleHRNaXhpbi5qcyIsIi9Vc2Vycy9hbmRyZXlwb3BwL1dvcmtzcGFjZS9wcm9tZXRoZXVzL3JlYWN0LWZvcm1zL3N0YW5kYWxvbmUvbGliL0Zvcm1FbGVtZW50TWl4aW4uanMiLCIvVXNlcnMvYW5kcmV5cG9wcC9Xb3Jrc3BhY2UvcHJvbWV0aGV1cy9yZWFjdC1mb3Jtcy9zdGFuZGFsb25lL2xpYi9Gb3JtRm9yLmpzIiwiL1VzZXJzL2FuZHJleXBvcHAvV29ya3NwYWNlL3Byb21ldGhldXMvcmVhY3QtZm9ybXMvc3RhbmRhbG9uZS9saWIvRm9ybU1peGluLmpzIiwiL1VzZXJzL2FuZHJleXBvcHAvV29ya3NwYWNlL3Byb21ldGhldXMvcmVhY3QtZm9ybXMvc3RhbmRhbG9uZS9saWIvTWVzc2FnZS5qcyIsIi9Vc2Vycy9hbmRyZXlwb3BwL1dvcmtzcGFjZS9wcm9tZXRoZXVzL3JlYWN0LWZvcm1zL3N0YW5kYWxvbmUvbGliL1JlcGVhdGluZ0ZpZWxkc2V0LmpzIiwiL1VzZXJzL2FuZHJleXBvcHAvV29ya3NwYWNlL3Byb21ldGhldXMvcmVhY3QtZm9ybXMvc3RhbmRhbG9uZS9saWIvUmVwZWF0aW5nRmllbGRzZXRNaXhpbi5qcyIsIi9Vc2Vycy9hbmRyZXlwb3BwL1dvcmtzcGFjZS9wcm9tZXRoZXVzL3JlYWN0LWZvcm1zL3N0YW5kYWxvbmUvbGliL1ZhbGlkYXRlZE1peGluLmpzIiwiL1VzZXJzL2FuZHJleXBvcHAvV29ya3NwYWNlL3Byb21ldGhldXMvcmVhY3QtZm9ybXMvc3RhbmRhbG9uZS9saWIvY3JlYXRlQ29tcG9uZW50RnJvbVNjaGVtYS5qcyIsIi9Vc2Vycy9hbmRyZXlwb3BwL1dvcmtzcGFjZS9wcm9tZXRoZXVzL3JlYWN0LWZvcm1zL3N0YW5kYWxvbmUvbGliL2dldERlZmF1bHRWYWx1ZUZvclNjaGVtYS5qcyIsIi9Vc2Vycy9hbmRyZXlwb3BwL1dvcmtzcGFjZS9wcm9tZXRoZXVzL3JlYWN0LWZvcm1zL3N0YW5kYWxvbmUvbGliL2dldFR5cGVGcm9tU2NoZW1hLmpzIiwiL1VzZXJzL2FuZHJleXBvcHAvV29ya3NwYWNlL3Byb21ldGhldXMvcmVhY3QtZm9ybXMvc3RhbmRhbG9uZS9saWIvaW5kZXguanMiLCIvVXNlcnMvYW5kcmV5cG9wcC9Xb3Jrc3BhY2UvcHJvbWV0aGV1cy9yZWFjdC1mb3Jtcy9zdGFuZGFsb25lL2xpYi9pbnB1dC9DaGVja2JveEdyb3VwLmpzIiwiL1VzZXJzL2FuZHJleXBvcHAvV29ya3NwYWNlL3Byb21ldGhldXMvcmVhY3QtZm9ybXMvc3RhbmRhbG9uZS9saWIvaW5wdXQvUmFkaW9CdXR0b25Hcm91cC5qcyIsIi9Vc2Vycy9hbmRyZXlwb3BwL1dvcmtzcGFjZS9wcm9tZXRoZXVzL3JlYWN0LWZvcm1zL3N0YW5kYWxvbmUvbGliL2lucHV0L2luZGV4LmpzIiwiL1VzZXJzL2FuZHJleXBvcHAvV29ya3NwYWNlL3Byb21ldGhldXMvcmVhY3QtZm9ybXMvc3RhbmRhbG9uZS9saWIvaXNTdHJpbmcuanMiLCIvVXNlcnMvYW5kcmV5cG9wcC9Xb3Jrc3BhY2UvcHJvbWV0aGV1cy9yZWFjdC1mb3Jtcy9zdGFuZGFsb25lL2xpYi9sZW5zLmpzIiwiL1VzZXJzL2FuZHJleXBvcHAvV29ya3NwYWNlL3Byb21ldGhldXMvcmVhY3QtZm9ybXMvc3RhbmRhbG9uZS9saWIvc2NoZW1hLmpzIiwiL1VzZXJzL2FuZHJleXBvcHAvV29ya3NwYWNlL3Byb21ldGhldXMvcmVhY3QtZm9ybXMvc3RhbmRhbG9uZS9saWIvdHlwZXMuanMiLCIvVXNlcnMvYW5kcmV5cG9wcC9Xb3Jrc3BhY2UvcHJvbWV0aGV1cy9yZWFjdC1mb3Jtcy9zdGFuZGFsb25lL2xpYi92YWxpZGF0aW9uLmpzIiwiL1VzZXJzL2FuZHJleXBvcHAvV29ya3NwYWNlL3Byb21ldGhldXMvcmVhY3QtZm9ybXMvc3RhbmRhbG9uZS9saWIvdmFsaWRhdG9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyhmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsncmVhY3QnXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5SZWFjdEZvcm1zID0gZmFjdG9yeShyb290LlJlYWN0KTtcbiAgfVxufSkod2luZG93LCBmdW5jdGlvbihSZWFjdCkge1xuXG4gIHZhciBfX1JlYWN0U2hpbSA9IHdpbmRvdy5fX1JlYWN0U2hpbSA9IHdpbmRvdy5fX1JlYWN0U2hpbSB8fCB7fTtcblxuICBfX1JlYWN0U2hpbS5SZWFjdCA9IFJlYWN0O1xuXG4gIF9fUmVhY3RTaGltLmNsb25lV2l0aFByb3BzID0gUmVhY3QuYWRkb25zLmNsb25lV2l0aFByb3BzO1xuXG4gIF9fUmVhY3RTaGltLmN4ID0gUmVhY3QuYWRkb25zLmNsYXNzU2V0O1xuXG4gIF9fUmVhY3RTaGltLmludmFyaWFudCA9IGZ1bmN0aW9uKGNoZWNrLCBtc2cpIHtcbiAgICBpZiAoIWNoZWNrKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICB9XG4gIH1cblxuICB2YXIgbWVyZ2VJbnRvID0gX19SZWFjdFNoaW0ubWVyZ2VJbnRvID0gZnVuY3Rpb24oZHN0LCBzcmMpIHtcbiAgICBmb3IgKHZhciBrIGluIHNyYykge1xuICAgICAgaWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICBkc3Rba10gPSBzcmNba107XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX19SZWFjdFNoaW0ubWVyZ2UgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIGMgPSB7fTtcbiAgICBtZXJnZUludG8oYywgYSk7XG4gICAgbWVyZ2VJbnRvKGMsIGIpO1xuICAgIHJldHVybiBjO1xuICB9XG5cbiAgX19SZWFjdFNoaW0uZW1wdHlGdW5jdGlvbiA9IGZ1bmN0aW9uKCkge1xuICB9XG5cbiAgX19SZWFjdFNoaW0uZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RydWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIF9fUmVhY3RTaGltLlJlYWN0VXBkYXRlcyA9IHtcbiAgICBiYXRjaGVkVXBkYXRlczogZnVuY3Rpb24oY2IpIHsgY2IoKTsgfVxuICB9O1xuXG4gIHJldHVybiByZXF1aXJlKCcuL2xpYi8nKTtcbn0pO1xuIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCAgICAgICAgICAgPSAod2luZG93Ll9fUmVhY3RTaGltLlJlYWN0KTtcbnZhciBjeCAgICAgICAgICAgICAgPSAod2luZG93Ll9fUmVhY3RTaGltLmN4KTtcbnZhciBtZXJnZUludG8gICAgICAgPSAod2luZG93Ll9fUmVhY3RTaGltLm1lcmdlSW50byk7XG52YXIgRmllbGRNaXhpbiAgICAgID0gcmVxdWlyZSgnLi9GaWVsZE1peGluJyk7XG52YXIgTWVzc2FnZSAgICAgICAgID0gcmVxdWlyZSgnLi9NZXNzYWdlJyk7XG5cbnZhciBGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0ZpZWxkJyxcbiAgbWl4aW5zOiBbRmllbGRNaXhpbl0sXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgfSxcblxuICByZW5kZXJMYWJlbDogZnVuY3Rpb24ocHJvcHMpIHtcbiAgICB2YXIgc2NoZW1hID0gdGhpcy5zY2hlbWEoKTtcbiAgICB2YXIgbGFiZWwgPSB0aGlzLnByb3BzLmxhYmVsID8gdGhpcy5wcm9wcy5sYWJlbCA6IHNjaGVtYS5wcm9wcy5sYWJlbDtcbiAgICB2YXIgaGludCA9IHRoaXMucHJvcHMuaGludCA/IHRoaXMucHJvcHMuaGludCA6IHNjaGVtYS5wcm9wcy5oaW50O1xuICAgIHZhciBsYWJlbFByb3BzID0ge2NsYXNzTmFtZTogJ3JlYWN0LWZvcm1zLWxhYmVsJ307XG4gICAgaWYgKHByb3BzKSB7XG4gICAgICBtZXJnZUludG8obGFiZWxQcm9wcywgcHJvcHMpO1xuICAgIH1cbiAgICByZXR1cm4gKGxhYmVsIHx8IGhpbnQpICYmIFJlYWN0LkRPTS5sYWJlbChsYWJlbFByb3BzLFxuICAgICAgbGFiZWwsXG4gICAgICBoaW50ICYmIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwicmVhY3QtZm9ybXMtaGludFwifSwgaGludCkpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbGlkYXRpb24gPSB0aGlzLnZhbGlkYXRpb25MZW5zKCkudmFsKCk7XG5cbiAgICB2YXIgY2xhc3NOYW1lID0gY3goe1xuICAgICAgJ3JlYWN0LWZvcm1zLWZpZWxkJzogdHJ1ZSxcbiAgICAgICdpbnZhbGlkJzogdmFsaWRhdGlvbi5pc0ZhaWx1cmVcbiAgICB9KTtcblxuICAgIHZhciBpZCA9IHRoaXMuX3Jvb3ROb2RlSUQ7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpjbGFzc05hbWV9LCBcbiAgICAgICAgdGhpcy5yZW5kZXJMYWJlbCh7aHRtbEZvcjogaWR9KSxcbiAgICAgICAgdGhpcy50cmFuc2ZlclByb3BzVG8odGhpcy5yZW5kZXJJbnB1dENvbXBvbmVudCh7aWQ6aWR9KSksXG4gICAgICAgIHZhbGlkYXRpb24uaXNGYWlsdXJlICYmXG4gICAgICAgICAgTWVzc2FnZShudWxsLCB2YWxpZGF0aW9uLnZhbGlkYXRpb24uZmFpbHVyZSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWVsZDtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgICAgICAgICAgICAgPSAod2luZG93Ll9fUmVhY3RTaGltLlJlYWN0KTtcbnZhciBjbG9uZVdpdGhQcm9wcyAgICA9ICh3aW5kb3cuX19SZWFjdFNoaW0uY2xvbmVXaXRoUHJvcHMpO1xudmFyIG1lcmdlSW50byAgICAgICAgID0gKHdpbmRvdy5fX1JlYWN0U2hpbS5tZXJnZUludG8pO1xudmFyIEZvcm1FbGVtZW50TWl4aW4gID0gcmVxdWlyZSgnLi9Gb3JtRWxlbWVudE1peGluJyk7XG5cbi8qKlxuICogTWl4aW4gZm9yIGltcGxlbWVudGluZyBmaWVsZGNvbXBvbmVudHMuXG4gKlxuICogU2VlIDxGaWVsZCAvPiBjb21wb25lbnQgZm9yIHRoZSBiYXNpYyBpbXBsZW1lbnRhdGlvbiBleGFtcGxlLlxuICovXG52YXIgRmllbGRNaXhpbiA9IHtcbiAgbWl4aW5zOiBbRm9ybUVsZW1lbnRNaXhpbl0sXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgaW5wdXQ6IFJlYWN0LlByb3BUeXBlcy5jb21wb25lbnRcbiAgfSxcblxuICBvbkNoYW5nZTogZnVuY3Rpb24oZSkge1xuICAgIGlmIChlLnN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBnZXRWYWx1ZUZyb21FdmVudChlKTtcblxuICAgIHRoaXMudXBkYXRlVmFsdWUodmFsdWUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW5kZXIgaW5wdXQgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcmV0dXJucyB7UmVhY3RDb21wb25lbnR9XG4gICAqL1xuICByZW5kZXJJbnB1dENvbXBvbmVudDogZnVuY3Rpb24ocHJvcHMpIHtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLnNlcmlhbGl6ZWRWYWx1ZUxlbnMoKS52YWwoKTtcbiAgICB2YXIgc2NoZW1hID0gdGhpcy5zY2hlbWEoKTtcblxuICAgIHZhciBpbnB1dCA9IHRoaXMucHJvcHMuaW5wdXQgfHwgc2NoZW1hICYmIHNjaGVtYS5wcm9wcy5pbnB1dDtcbiAgICB2YXIgaW5wdXRQcm9wcyA9IHt2YWx1ZTp2YWx1ZSwgb25DaGFuZ2U6IHRoaXMub25DaGFuZ2V9O1xuXG4gICAgaWYgKHByb3BzKSB7XG4gICAgICBtZXJnZUludG8oaW5wdXRQcm9wcywgcHJvcHMpO1xuICAgIH1cblxuICAgIGlmIChpbnB1dCkge1xuICAgICAgcmV0dXJuIGNsb25lV2l0aFByb3BzKGlucHV0LCBpbnB1dFByb3BzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXRQcm9wcy50eXBlID0gJ3RleHQnO1xuICAgICAgcmV0dXJuIFJlYWN0LkRPTS5pbnB1dChpbnB1dFByb3BzKTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogRXh0cmFjdCB2YWx1ZSBmcm9tIGV2ZW50XG4gKlxuICogV2Ugc3VwcG9ydCBib3RoIFJlYWN0LkRPTSAnY2hhbmdlJyBldmVudHMgYW5kIGN1c3RvbSBjaGFuZ2UgZXZlbnRzXG4gKiBlbWl0dGVkIGZyb20gY3VzdG9tIGNvbXBvbmVudHMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBhbHNvIG5vcm1hbGl6ZXMgZW1wdHkgc3RyaW5ncyB0byBudWxsLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGVcbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWVGcm9tRXZlbnQoZSkge1xuICByZXR1cm4gZSAmJiBlLnRhcmdldCAmJiBlLnRhcmdldC52YWx1ZSAhPT0gdW5kZWZpbmVkID9cbiAgICBlLnRhcmdldC52YWx1ZSA6IGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmllbGRNaXhpbjtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgICAgICAgICA9ICh3aW5kb3cuX19SZWFjdFNoaW0uUmVhY3QpO1xudmFyIEZpZWxkc2V0TWl4aW4gPSByZXF1aXJlKCcuL0ZpZWxkc2V0TWl4aW4nKTtcblxudmFyIEZpZWxkc2V0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnRmllbGRzZXQnLFxuICBtaXhpbnM6IFtGaWVsZHNldE1peGluXSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY2hlbWEgPSB0aGlzLnNjaGVtYSgpO1xuICAgIHJldHVybiB0aGlzLnRyYW5zZmVyUHJvcHNUbyhcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJyZWFjdC1mb3Jtcy1maWVsZHNldFwifSwgXG4gICAgICAgIHNjaGVtYS5wcm9wcy5sYWJlbCAmJiBSZWFjdC5ET00uaDQobnVsbCwgc2NoZW1hLnByb3BzLmxhYmVsKSxcbiAgICAgICAgc2NoZW1hLm1hcCh0aGlzLnJlbmRlckZpZWxkKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpZWxkc2V0O1xuIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBGb3JtRWxlbWVudE1peGluICA9IHJlcXVpcmUoJy4vRm9ybUVsZW1lbnRNaXhpbicpO1xudmFyIEZvcm1Db250ZXh0TWl4aW4gID0gcmVxdWlyZSgnLi9Gb3JtQ29udGV4dE1peGluJyk7XG5cbi8qKlxuICogTWl4aW4gZm9yIGltcGxlbWVudGluZyBmaWVsZGNvbXBvbmVudHMuXG4gKlxuICogU2VlIDxGaWVsZHNldCAvPiBjb21wb25lbnQgZm9yIHRoZSBiYXNpYyBpbXBsZW1lbnRhdGlvbiBleGFtcGxlLlxuICovXG52YXIgRmllbGRzZXRNaXhpbiA9IHtcbiAgbWl4aW5zOiBbRm9ybUVsZW1lbnRNaXhpbiwgRm9ybUNvbnRleHRNaXhpbl0sXG5cbiAgLyoqXG4gICAqIFJlbmRlciBmaWVsZCBnaXZlbiBhIHNjaGVtYSBub2RlXG4gICAqXG4gICAqIEBwYXJhbSB7U2NoZW1hfSBub2RlXG4gICAqIEByZXR1cm5zIHtSZWFjdENvbXBvbmVudH1cbiAgICovXG4gIHJlbmRlckZpZWxkOiBmdW5jdGlvbihub2RlKSB7XG4gICAgLy8gcHJldmVudCBjaXJjdWxhciByZXF1aXJlXG4gICAgdmFyIGNyZWF0ZUNvbXBvbmVudEZyb21TY2hlbWEgPSByZXF1aXJlKCcuL2NyZWF0ZUNvbXBvbmVudEZyb21TY2hlbWEnKTtcbiAgICByZXR1cm4gY3JlYXRlQ29tcG9uZW50RnJvbVNjaGVtYShub2RlKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWVsZHNldE1peGluO1xuIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCAgICAgPSAod2luZG93Ll9fUmVhY3RTaGltLlJlYWN0KTtcbnZhciBGb3JtTWl4aW4gPSByZXF1aXJlKCcuL0Zvcm1NaXhpbicpO1xudmFyIEZvcm1Gb3IgICA9IHJlcXVpcmUoJy4vRm9ybUZvcicpO1xuXG52YXIgRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Zvcm0nLFxuICBtaXhpbnM6IFtGb3JtTWl4aW5dLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmZXJQcm9wc1RvKFxuICAgICAgUmVhY3QuRE9NLmZvcm0obnVsbCwgXG4gICAgICAgIEZvcm1Gb3IobnVsbCApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRm9ybTtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSAod2luZG93Ll9fUmVhY3RTaGltLlJlYWN0KTtcblxuLyoqXG4gKiBNaXhpbiBmb3IgY29tcG9uZW50cyB3aGljaCBleHBvc2VzIGZvcm0gY29udGV4dC5cbiAqXG4gKiBTZWUgRm9ybSAodmlhIEZvcm1NaXhpbiksIEZpZWxkc2V0ICh2aWEgRmllbGRzZXRNaXhpbikgYW5kIFJlcGVhdGluZ0ZpZWxkc2V0XG4gKiAodmlhIFJlcGVhdGluZ0ZpZWxkc2V0TWl4aW4pIGZvciBjb21wb25lbnRzIHdoaWNoIGV4cG9zZSBmb3JtIGNvbnRleHQuXG4gKi9cbnZhciBGb3JtQ29udGV4dE1peGluID0ge1xuXG4gIGNoaWxkQ29udGV4dFR5cGVzOiB7XG4gICAgc2VyaWFsaXplZFZhbHVlTGVuczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICB2YWx1ZUxlbnM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgdmFsaWRhdGlvbkxlbnM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgc2NoZW1hOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgIG9uVmFsdWVVcGRhdGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgZ2V0Q2hpbGRDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2VyaWFsaXplZFZhbHVlTGVuczogdGhpcy5zZXJpYWxpemVkVmFsdWVMZW5zKCksXG4gICAgICB2YWx1ZUxlbnM6IHRoaXMudmFsdWVMZW5zKCksXG4gICAgICB2YWxpZGF0aW9uTGVuczogdGhpcy52YWxpZGF0aW9uTGVucygpLFxuICAgICAgc2NoZW1hOiB0aGlzLnNjaGVtYSgpLFxuICAgICAgb25WYWx1ZVVwZGF0ZTogdGhpcy5vblZhbHVlVXBkYXRlXG4gICAgfTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb3JtQ29udGV4dE1peGluO1xuIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCAgICAgICAgICAgICAgICAgICAgID0gKHdpbmRvdy5fX1JlYWN0U2hpbS5SZWFjdCk7XG52YXIgaW52YXJpYW50ICAgICAgICAgICAgICAgICA9ICh3aW5kb3cuX19SZWFjdFNoaW0uaW52YXJpYW50KTtcbnZhciBzY2hlbWEgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9zY2hlbWEnKTtcbnZhciBWYWxpZGF0ZWRNaXhpbiAgICAgICAgICAgID0gcmVxdWlyZSgnLi9WYWxpZGF0ZWRNaXhpbicpO1xudmFyIGdldERlZmF1bHRWYWx1ZUZvclNjaGVtYSAgPSByZXF1aXJlKCcuL2dldERlZmF1bHRWYWx1ZUZvclNjaGVtYScpO1xudmFyIHZhbGlkYXRpb25NICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL3ZhbGlkYXRpb24nKTtcblxudmFyIHN1Y2Nlc3MgPSB2YWxpZGF0aW9uTS5zdWNjZXNzO1xudmFyIHNlcmlhbGl6ZSA9IHZhbGlkYXRpb25NLnNlcmlhbGl6ZTtcblxuLyoqXG4gKiBNaXhpbiBmb3IgdGhlIGZvcm0gZWxlbWVudCAoZm9ybSBmaWVsZCwgZmllbGRzZXQgb2YgcmVwZWF0aW5nIGZpZWxkc2V0KS5cbiAqL1xudmFyIEZvcm1FbGVtZW50TWl4aW4gPSB7XG5cbiAgbWl4aW5zOiBbVmFsaWRhdGVkTWl4aW5dLFxuXG4gIHByb3BUeXBlczoge1xuICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIFJlYWN0LlByb3BUeXBlcy5udW1iZXJcbiAgICBdKVxuICB9LFxuXG4gIGNvbnRleHRUeXBlczoge1xuICAgIHNlcmlhbGl6ZWRWYWx1ZUxlbnM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgdmFsdWVMZW5zOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgIHZhbGlkYXRpb25MZW5zOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgIHNjaGVtYTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICBvblZhbHVlVXBkYXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm4gbGVucyBmb3IgdGhlIGZvcm0gZWxlbWVudCB2YWx1ZSBvciBmb3IgdGhlIHZhbHVlIHBhc3NlZCBhcyBhblxuICAgKiBhcmd1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtBbnk/fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7TGVuc31cbiAgICovXG4gIHNlcmlhbGl6ZWRWYWx1ZUxlbnM6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIGxlbnMgPSB0aGlzLmNvbnRleHQuc2VyaWFsaXplZFZhbHVlTGVucztcbiAgICBpZiAodGhpcy5wcm9wcy5uYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxlbnMgPSBsZW5zLmdldChcbiAgICAgICAgdGhpcy5wcm9wcy5uYW1lLFxuICAgICAgICBzZXJpYWxpemUodGhpcy5zY2hlbWEoKSwgdGhpcy52YWx1ZUxlbnModmFsdWUpLnZhbCgpKVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlID8gbGVucy5mb3IodmFsdWUpIDogbGVucztcbiAgfSxcblxuICB2YWx1ZUxlbnM6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIGxlbnMgPSB0aGlzLmNvbnRleHQudmFsdWVMZW5zO1xuICAgIGlmICh0aGlzLnByb3BzLm5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbGVucyA9IGxlbnMuZ2V0KHRoaXMucHJvcHMubmFtZSwgZ2V0RGVmYXVsdFZhbHVlRm9yU2NoZW1hKHRoaXMuc2NoZW1hKCkpKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlID8gbGVucy5mb3IodmFsdWUpIDogbGVucztcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJuIGxlbnMgZm9yIHRoZSBmb3JtIGVsZW1lbnQgdmFsaWRhdGlvbiBzdGF0ZSBvciBmb3IgdGhlIHZhbGlkYXRpb25cbiAgICogc3RhdGUgcGFzc2VkIGFzIGFuIGFyZ3VtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge1ZhbGlkYXRpb24/fSB2YWxpZGF0aW9uXG4gICAqIEByZXR1cm5zIHtMZW5zfVxuICAgKi9cbiAgdmFsaWRhdGlvbkxlbnM6IGZ1bmN0aW9uKHZhbGlkYXRpb24pIHtcbiAgICB2YXIgbGVucyA9IHRoaXMuY29udGV4dC52YWxpZGF0aW9uTGVucztcbiAgICBpZiAodGhpcy5wcm9wcy5uYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxlbnMgPSBsZW5zLmdldCgnY2hpbGRyZW4nLCB7fSkuZ2V0KHRoaXMucHJvcHMubmFtZSwgc3VjY2Vzcyk7XG4gICAgfVxuICAgIHJldHVybiB2YWxpZGF0aW9uID8gbGVucy5mb3IodmFsaWRhdGlvbikgOiBsZW5zO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm4gZm9ybSBlbGVtZW50IHNjaGVtYS5cbiAgICpcbiAgICogQHJldHVybnMge1NjaGVtYX1cbiAgICovXG4gIHNjaGVtYTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLmNvbnRleHQuc2NoZW1hO1xuXG4gICAgaWYgKG5vZGUgJiYgdGhpcy5wcm9wcy5uYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChzY2hlbWEuaXNTY2hlbWEobm9kZSkpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuY2hpbGRyZW5bdGhpcy5wcm9wcy5uYW1lXTtcbiAgICAgIH0gZWxzZSBpZiAoc2NoZW1hLmlzTGlzdChub2RlKSkge1xuICAgICAgICBub2RlID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGludmFyaWFudChmYWxzZSwgJ2ludmFsaWQgZmllbGQgdXNlZCBmb3Igc2NoZW1hJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBmb3JtIHZhbHVlIGFuZCB2YWxpZGF0aW9uIHN0YXRlIGlzIGJlaW5nIHVwZGF0ZWQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGludGVyY2VwdHMgdXBkYXRlZCB2YWx1ZSBhbmQgdmFsaWRhdGlvbiBzdGF0ZSBhbmQgcGVyZm9ybSBpdHNcbiAgICogb3duIGxvY2FsIHZhbGlkYXRpb24gYW5kIGRlc2VyaWFsaXphdGlvbi4gVGhlbiBwYXNzZXMgZXZlcnl0aGluZyB1cCB0aGVcbiAgICogb3duZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7QW55fSB2YWx1ZVxuICAgKiBAcGFyYW0ge1ZhbGlkYXRpb259IHZhbGlkYXRpb25cbiAgICovXG4gIG9uVmFsdWVVcGRhdGU6IGZ1bmN0aW9uKHZhbHVlLCB2YWxpZGF0aW9uLCBzZXJpYWxpemVkVmFsdWUpIHtcbiAgICB2YXIgdmFsaWRhdGlvbkxlbnMgPSB0aGlzLnZhbGlkYXRpb25MZW5zKHZhbGlkYXRpb24pO1xuICAgIHZhciB2YWx1ZUxlbnMgPSB0aGlzLnZhbHVlTGVucyh2YWx1ZSk7XG5cbiAgICB2YXIgbG9jYWwgPSB0aGlzLnZhbGlkYXRlT25seShcbiAgICAgIHZhbHVlTGVucy52YWwoKSxcbiAgICAgIHZhbGlkYXRpb25MZW5zLnZhbCgpLmNoaWxkcmVuXG4gICAgKTtcblxuICAgIHZhbHVlTGVucyA9IHZhbHVlTGVucy5tb2QobG9jYWwudmFsdWUpO1xuICAgIHZhbGlkYXRpb25MZW5zID0gdmFsaWRhdGlvbkxlbnMudXBkYXRlKGxvY2FsLnZhbGlkYXRpb24pO1xuXG4gICAgdGhpcy5jb250ZXh0Lm9uVmFsdWVVcGRhdGUoXG4gICAgICB2YWx1ZUxlbnMucm9vdCgpLFxuICAgICAgdmFsaWRhdGlvbkxlbnMucm9vdCgpLFxuICAgICAgc2VyaWFsaXplZFZhbHVlXG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBzZXJpYWxpemVkIHZhbHVlIGZvciB0aGUgY3VycmVudCBmb3JtIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7QW55fSBzZXJpYWxpemVkVmFsdWVcbiAgICovXG4gIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbihzZXJpYWxpemVkVmFsdWUpIHtcbiAgICB0aGlzLm9uVmFsdWVVcGRhdGUoXG4gICAgICB0aGlzLnZhbHVlTGVucygpLm1vZChzZXJpYWxpemVkVmFsdWUpLnJvb3QoKSxcbiAgICAgIHRoaXMudmFsaWRhdGlvbkxlbnMoKS5yb290KCksXG4gICAgICB0aGlzLnNlcmlhbGl6ZWRWYWx1ZUxlbnMoKS5tb2Qoc2VyaWFsaXplZFZhbHVlKS5yb290KClcbiAgICApO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRm9ybUVsZW1lbnRNaXhpbjtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgICAgICAgICAgICAgICAgICAgICA9ICh3aW5kb3cuX19SZWFjdFNoaW0uUmVhY3QpO1xudmFyIEZvcm1FbGVtZW50TWl4aW4gICAgICAgICAgPSByZXF1aXJlKCcuL0Zvcm1FbGVtZW50TWl4aW4nKTtcbnZhciBjcmVhdGVDb21wb25lbnRGcm9tU2NoZW1hID0gcmVxdWlyZSgnLi9jcmVhdGVDb21wb25lbnRGcm9tU2NoZW1hJyk7XG5cbi8qKlxuICogQSBcInByb3h5XCIgY29tcG9uZW50IHdoaWNoIHJlbmRlcnMgaW50byBmaWVsZCwgZmllbGRzZXQgb3IgcmVwZWF0aW5nIGZpZWxkc2V0XG4gKiBiYXNlZCBvbiBhIGN1cnJlbnQgc2NoZW1hIG5vZGUuXG4gKi9cbnZhciBGb3JtRm9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnRm9ybUZvcicsXG4gIG1peGluczogW0Zvcm1FbGVtZW50TWl4aW5dLFxuXG4gIHByb3BUeXBlczoge1xuICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZmVyUHJvcHNUbyhjcmVhdGVDb21wb25lbnRGcm9tU2NoZW1hKHRoaXMuc2NoZW1hKCkpKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRm9ybUZvcjtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgICAgICAgICAgICAgICAgICAgICA9ICh3aW5kb3cuX19SZWFjdFNoaW0uUmVhY3QpO1xudmFyIFJlYWN0VXBkYXRlcyAgICAgICAgICAgICAgPSAod2luZG93Ll9fUmVhY3RTaGltLlJlYWN0VXBkYXRlcyk7XG52YXIgbGVucyAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vbGVucycpO1xudmFyIFZhbGlkYXRlZE1peGluICAgICAgICAgICAgPSByZXF1aXJlKCcuL1ZhbGlkYXRlZE1peGluJyk7XG52YXIgRm9ybUNvbnRleHRNaXhpbiAgICAgICAgICA9IHJlcXVpcmUoJy4vRm9ybUNvbnRleHRNaXhpbicpO1xudmFyIGdldERlZmF1bHRWYWx1ZUZvclNjaGVtYSAgPSByZXF1aXJlKCcuL2dldERlZmF1bHRWYWx1ZUZvclNjaGVtYScpO1xudmFyIHZhbGlkYXRpb25NICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL3ZhbGlkYXRpb24nKTtcblxudmFyIHNlcmlhbGl6ZSA9IHZhbGlkYXRpb25NLnNlcmlhbGl6ZTtcbnZhciBzdWNjZXNzID0gdmFsaWRhdGlvbk0uc3VjY2VzcztcblxuLyoqXG4gKiBNaXhpbiB3aGljaCBoYW5kbGVzIGZvcm0gdmFsdWUgYW5kIGZvcm0gdmFsaWRhdGlvbiBzdGF0ZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG52YXIgRm9ybVN0YXRlTWl4aW4gPSB7XG4gIG1peGluczogW1ZhbGlkYXRlZE1peGluXSxcblxuICBwcm9wVHlwZXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IFJlYWN0LlByb3BUeXBlcy5hbnksXG4gICAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5hbnksXG4gICAgc2VyaWFsaXplZFZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYW55LFxuICAgIHNjaGVtYTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICBvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25VcGRhdGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLnByb3BzLnZhbHVlIHx8XG4gICAgICB0aGlzLnByb3BzLmRlZmF1bHRWYWx1ZSB8fFxuICAgICAgZ2V0RGVmYXVsdFZhbHVlRm9yU2NoZW1hKHRoaXMucHJvcHMuc2NoZW1hKTtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLmdldEZvcm1TdGF0ZSh2YWx1ZSk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuICAgIGlmIChuZXh0UHJvcHMudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIG5leHRTdGF0ZTtcbiAgICAgIGlmIChuZXh0UHJvcHMudmFsaWRhdGlvbiAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgbmV4dFByb3BzLnNlcmlhbGl6ZWRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5leHRTdGF0ZSA9IHtcbiAgICAgICAgICBzZXJpYWxpemVkVmFsdWU6IG5leHRQcm9wcy5zZXJpYWxpemVkVmFsdWUsXG4gICAgICAgICAgdmFsaWRhdGlvbjogbmV4dFByb3BzLnZhbGlkYXRpb24sXG4gICAgICAgICAgdmFsdWU6IG5leHRQcm9wcy52YWx1ZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dFN0YXRlID0gdGhpcy5nZXRGb3JtU3RhdGUobmV4dFByb3BzLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUobmV4dFN0YXRlKTtcbiAgICB9XG4gIH0sXG5cbiAgZ2V0Rm9ybVN0YXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciB2YWxpZGF0aW9uID0gdGhpcy52YWxpZGF0ZSh2YWx1ZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB2YWxpZGF0aW9uLnZhbHVlLFxuICAgICAgdmFsaWRhdGlvbjogdmFsaWRhdGlvbi52YWxpZGF0aW9uLFxuICAgICAgc2VyaWFsaXplZFZhbHVlOiBzZXJpYWxpemUodGhpcy5zY2hlbWEoKSwgdmFsaWRhdGlvbi52YWx1ZSlcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm4gbGVucyBmb3IgdGhlIGZvcm0gdmFsdWUgb3IgZm9yIHRoZSB2YWx1ZSBwYXNzZWQgYXMgYW4gYXJndW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7QW55P30gdmFsdWVcbiAgICogQHJldHVybnMge0xlbnN9XG4gICAqL1xuICBzZXJpYWxpemVkVmFsdWVMZW5zOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBsZW5zKHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHRoaXMuc3RhdGUuc2VyaWFsaXplZFZhbHVlKTtcbiAgfSxcblxuICB2YWx1ZUxlbnM6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGxlbnModmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogdGhpcy5zdGF0ZS52YWx1ZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybiBsZW5zIGZvciB0aGUgZm9ybSB2YWxpZGF0aW9uIHN0YXRlIG9yIGZvciB0aGUgdmFsaWRhdGlvbiBzdGF0ZVxuICAgKiBwYXNzZWQgYXMgYW4gYXJndW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7VmFsaWRhdGlvbj99IHZhbGlkYXRpb25cbiAgICogQHJldHVybnMge0xlbnN9XG4gICAqL1xuICB2YWxpZGF0aW9uTGVuczogZnVuY3Rpb24odmFsaWRhdGlvbikge1xuICAgIHJldHVybiBsZW5zKHZhbGlkYXRpb24gIT09IHVuZGVmaW5lZCA/IHZhbGlkYXRpb24gOiB0aGlzLnN0YXRlLnZhbGlkYXRpb24pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGb3JtIHNjaGVtYS5cbiAgICpcbiAgICogQHJldHVybnMge1NjaGVtYX1cbiAgICovXG4gIHNjaGVtYTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc2NoZW1hO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgZm9ybSB2YWx1ZSBhbmQgdmFsaWRhdGlvbiBzdGF0ZSBpcyBiZWluZyB1cGRhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0gdmFsdWVcbiAgICogQHBhcmFtIHtWYWxpZGF0aW9ufSB2YWxpZGF0aW9uXG4gICAqIEBwYXJhbSB7QW55fSBjb252ZXJ0ZWRWYWx1ZVxuICAgKi9cbiAgb25WYWx1ZVVwZGF0ZTogZnVuY3Rpb24odmFsdWUsIHZhbGlkYXRpb24sIHNlcmlhbGl6ZWRWYWx1ZSkge1xuICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9uIHx8IHN1Y2Nlc3M7XG4gICAgUmVhY3RVcGRhdGVzLmJhdGNoZWRVcGRhdGVzKGZ1bmN0aW9uKCkgIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLm9uVXBkYXRlKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25VcGRhdGUodmFsdWUsIHZhbGlkYXRpb24sIHNlcmlhbGl6ZWRWYWx1ZSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZSAmJiB2YWxpZGF0aW9uLmlzU3VjY2Vzcykge1xuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHZhbHVlLCB2YWxpZGF0aW9uLCBzZXJpYWxpemVkVmFsdWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7dmFsdWU6dmFsdWUsIHZhbGlkYXRpb246dmFsaWRhdGlvbiwgc2VyaWFsaXplZFZhbHVlOnNlcmlhbGl6ZWRWYWx1ZX0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH1cbn07XG5cbnZhciBGb3JtTWl4aW4gPSB7XG4gIG1peGluczogW0Zvcm1TdGF0ZU1peGluLCBGb3JtQ29udGV4dE1peGluXVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb3JtTWl4aW47XG4iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gKHdpbmRvdy5fX1JlYWN0U2hpbS5SZWFjdCk7XG5cbnZhciBNZXNzYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTWVzc2FnZScsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2ZlclByb3BzVG8oXG4gICAgICBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcInJlYWN0LWZvcm1zLW1lc3NhZ2VcIn0sIFxuICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZTtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgICAgICAgICAgICAgICAgICAgPSAod2luZG93Ll9fUmVhY3RTaGltLlJlYWN0KTtcbnZhciBSZXBlYXRpbmdGaWVsZHNldE1peGluICA9IHJlcXVpcmUoJy4vUmVwZWF0aW5nRmllbGRzZXRNaXhpbicpO1xuXG52YXIgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0l0ZW0nLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmZXJQcm9wc1RvKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJlYWN0LWZvcm1zLXJlcGVhdGluZy1maWVsZHNldC1pdGVtXCJ9LCBcbiAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbixcbiAgICAgICAgUmVhY3QuRE9NLmJ1dHRvbihcbiAgICAgICAgICB7b25DbGljazp0aGlzLm9uUmVtb3ZlLFxuICAgICAgICAgIHR5cGU6XCJidXR0b25cIixcbiAgICAgICAgICBjbGFzc05hbWU6XCJyZWFjdC1mb3Jtcy1yZXBlYXRpbmctZmllbGRzZXQtcmVtb3ZlXCJ9LCBcIsOXXCIpXG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICBvblJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMucHJvcHMub25SZW1vdmUpIHtcbiAgICAgIHRoaXMucHJvcHMub25SZW1vdmUodGhpcy5wcm9wcy5uYW1lKTtcbiAgICB9XG4gIH1cblxufSk7XG5cbnZhciBSZXBlYXRpbmdGaWVsZHNldCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ1JlcGVhdGluZ0ZpZWxkc2V0JyxcblxuICBtaXhpbnM6IFtSZXBlYXRpbmdGaWVsZHNldE1peGluXSxcblxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtOiBJdGVtXG4gICAgfTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY2hlbWEgPSB0aGlzLnNjaGVtYSgpO1xuICAgIHZhciBDb21wb25lbnQgPSB0aGlzLnByb3BzLml0ZW07XG4gICAgdmFyIGZpZWxkcyA9IHRoaXMucmVuZGVyRmllbGRzKCkubWFwKGZ1bmN0aW9uKGl0ZW0pIFxuICAgICAge3JldHVybiBDb21wb25lbnQoXG4gICAgICAgIHtrZXk6aXRlbS5wcm9wcy5uYW1lLFxuICAgICAgICBuYW1lOml0ZW0ucHJvcHMubmFtZSxcbiAgICAgICAgb25SZW1vdmU6dGhpcy5yZW1vdmV9LCBcbiAgICAgICAgaXRlbVxuICAgICAgKTt9LmJpbmQodGhpcylcbiAgICApO1xuICAgIHJldHVybiB0aGlzLnRyYW5zZmVyUHJvcHNUbyhcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJyZWFjdC1mb3Jtcy1yZXBlYXRpbmctZmllbGRzZXRcIn0sIFxuICAgICAgICBzY2hlbWEucHJvcHMubGFiZWwgJiYgUmVhY3QuRE9NLmg0KG51bGwsIHNjaGVtYS5wcm9wcy5sYWJlbCksXG4gICAgICAgIGZpZWxkcyxcbiAgICAgICAgUmVhY3QuRE9NLmJ1dHRvbihcbiAgICAgICAgICB7dHlwZTpcImJ1dHRvblwiLFxuICAgICAgICAgIG9uQ2xpY2s6dGhpcy5hZGQsXG4gICAgICAgICAgY2xhc3NOYW1lOlwicmVhY3QtZm9ybXMtcmVwZWF0aW5nLWZpZWxkc2V0LWFkZFwifSwgXCJBZGRcIilcbiAgICAgIClcbiAgICApO1xuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcGVhdGluZ0ZpZWxkc2V0O1xubW9kdWxlLmV4cG9ydHMuSXRlbSA9IEl0ZW07XG4iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ICAgICAgICAgICAgICAgICAgICAgPSAod2luZG93Ll9fUmVhY3RTaGltLlJlYWN0KTtcbnZhciBjbG9uZVdpdGhQcm9wcyAgICAgICAgICAgID0gKHdpbmRvdy5fX1JlYWN0U2hpbS5jbG9uZVdpdGhQcm9wcyk7XG52YXIgRm9ybUVsZW1lbnRNaXhpbiAgICAgICAgICA9IHJlcXVpcmUoJy4vRm9ybUVsZW1lbnRNaXhpbicpO1xudmFyIEZvcm1Db250ZXh0TWl4aW4gICAgICAgICAgPSByZXF1aXJlKCcuL0Zvcm1Db250ZXh0TWl4aW4nKTtcbnZhciBnZXREZWZhdWx0VmFsdWVGb3JTY2hlbWEgID0gcmVxdWlyZSgnLi9nZXREZWZhdWx0VmFsdWVGb3JTY2hlbWEnKTtcblxuLyoqXG4gKiBNaXhpbiBmb3IgaW1wbGVtZW50aW5nIHJlcGVhdGluZyBmaWVsZHNldHMuXG4gKlxuICogU2VlIDxSZXBlYXRpbmdGaWVsZHNldCAvPiBjb21wb25lbnQgZm9yIHRoZSBiYXNpYyBpbXBsZW1lbnRhdGlvbiBleGFtcGxlLlxuICovXG52YXIgUmVwZWF0aW5nRmllbGRzZXRNaXhpbiA9IHtcbiAgbWl4aW5zOiBbRm9ybUVsZW1lbnRNaXhpbiwgRm9ybUNvbnRleHRNaXhpbl0sXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgb25SZW1vdmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIG9uQWRkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gYXJyYXkgb2YgUmVhY3QgY29tcG9uZW50cyByZW5kZXJlZCBmb3IgYWxsIHRoZSB2YWx1ZXMgaW4gYW4gYXJyYXlcbiAgICogdGhpcyBmaWVsZHNldCBvd25zLlxuICAgKlxuICAgKiBAcmV0dXJucyB7QXJyYXkuPFJlYWN0Q29tcG9uZW50Pn1cbiAgICovXG4gIHJlbmRlckZpZWxkczogZnVuY3Rpb24oKSB7XG4gICAgLy8gcHJldmVudCBjaXJjdWxhciByZXF1aXJlXG4gICAgdmFyIGNyZWF0ZUNvbXBvbmVudEZyb21TY2hlbWEgPSByZXF1aXJlKCcuL2NyZWF0ZUNvbXBvbmVudEZyb21TY2hlbWEnKTtcbiAgICB2YXIgc2NoZW1hID0gdGhpcy5zY2hlbWEoKTtcbiAgICB2YXIgY2hpbGRyZW4gPSBjcmVhdGVDb21wb25lbnRGcm9tU2NoZW1hKHNjaGVtYS5jaGlsZHJlbik7XG4gICAgcmV0dXJuIHRoaXMuc2VyaWFsaXplZFZhbHVlTGVucygpLnZhbCgpLm1hcChmdW5jdGlvbihpdGVtLCBuYW1lKSBcbiAgICAgIHtyZXR1cm4gY2xvbmVXaXRoUHJvcHMoY2hpbGRyZW4sIHtuYW1lOm5hbWUsIGtleTogbmFtZX0pO30pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSB2YWx1ZSBmcm9tIGZpZWxkc2V0J3MgdmFsdWUgYnkgaW5kZXhcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBuYW1lXG4gICAqL1xuICByZW1vdmU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLnNlcmlhbGl6ZWRWYWx1ZUxlbnMoKS52YWwoKS5zbGljZSgwKTtcbiAgICB2YWx1ZS5zcGxpY2UobmFtZSwgMSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZSh2YWx1ZSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25SZW1vdmUpIHtcbiAgICAgIHRoaXMucHJvcHMub25SZW1vdmUobmFtZSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgbmV3IHZhbHVlIHRvIGZpZWxkc2V0J3MgdmFsdWUuXG4gICAqL1xuICBhZGQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY2hlbWEgPSB0aGlzLnNjaGVtYSgpO1xuICAgIHZhciBkZWZhdWx0VmFsdWUgPSBnZXREZWZhdWx0VmFsdWVGb3JTY2hlbWEoc2NoZW1hLmNoaWxkcmVuKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlKHRoaXMudmFsdWVMZW5zKCkudmFsKCkuY29uY2F0KGRlZmF1bHRWYWx1ZSkpO1xuICAgIGlmICh0aGlzLnByb3BzLm9uQWRkKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQWRkKCk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcGVhdGluZ0ZpZWxkc2V0TWl4aW47XG4iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHZhbGlkYXRpb24gPSByZXF1aXJlKCcuL3ZhbGlkYXRpb24nKTtcblxuLyoqXG4gKiBDb21tb24gdmFsaWRhdGlvbiByb3V0aW5lcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG52YXIgVmFsaWRhdGVkTWl4aW4gPSB7XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHZhbHVlIGluY3JlbWVudGFsbHlcbiAgICpcbiAgICogQHBhcmFtIHtBbnl9IHZhbHVlXG4gICAqIEBwYXJhbSB7T2JqZWN0Ljx7PG5hbWU+OiBWYWxpZGF0aW9ufT59IGNoaWxkcmVuXG4gICAqIEByZXR1cm5zIHtPYmplY3QuPHt2YWx1ZTogQW55LCB2YWxpZGF0aW9uOiBWYWxpZGF0aW9ufT59XG4gICAqL1xuICB2YWxpZGF0ZU9ubHk6IGZ1bmN0aW9uKHZhbHVlLCBjaGlsZHJlbikge1xuICAgIHJldHVybiB0aGlzLl92YWxpZGF0ZVdpdGgodmFsaWRhdGlvbi52YWxpZGF0ZU9ubHksIHZhbHVlLCBjaGlsZHJlbik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0gdmFsdWVcbiAgICogQHJldHVybnMge09iamVjdC48e3ZhbHVlOiBBbnksIHZhbGlkYXRpb246IFZhbGlkYXRpb259Pn1cbiAgICovXG4gIHZhbGlkYXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl92YWxpZGF0ZVdpdGgodmFsaWRhdGlvbi52YWxpZGF0ZSwgdmFsdWUpO1xuICB9LFxuXG4gIF92YWxpZGF0ZVdpdGg6IGZ1bmN0aW9uKHZhbGlkYXRlLCB2YWx1ZSwgY2hpbGRyZW4pIHtcbiAgICB2YWx1ZSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHRoaXMuc2VyaWFsaXplZFZhbHVlTGVucygpLnZhbCgpO1xuICAgIHZhciBzY2hlbWEgPSB0aGlzLnNjaGVtYSgpO1xuICAgIHJldHVybiBzY2hlbWEgP1xuICAgICAgdmFsaWRhdGUoc2NoZW1hLCB2YWx1ZSwgY2hpbGRyZW4pIDpcbiAgICAgIHt2YWxpZGF0aW9uOiB2YWxpZGF0aW9uLnN1Y2Nlc3MsIHZhbHVlOnZhbHVlfTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWYWxpZGF0ZWRNaXhpbjtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW52YXJpYW50ICAgICAgICAgPSAod2luZG93Ll9fUmVhY3RTaGltLmludmFyaWFudCk7XG52YXIgc2NoZW1hICAgICAgICAgICAgPSByZXF1aXJlKCcuL3NjaGVtYScpO1xudmFyIEZpZWxkICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9GaWVsZCcpO1xudmFyIEZpZWxkc2V0ICAgICAgICAgID0gcmVxdWlyZSgnLi9GaWVsZHNldCcpO1xudmFyIFJlcGVhdGluZ0ZpZWxkc2V0ID0gcmVxdWlyZSgnLi9SZXBlYXRpbmdGaWVsZHNldCcpO1xuXG4vKipcbiAqIENyZWF0ZSBhIGNvbXBvbmVudCB3aGljaCByZXByZXNlbnRzIHByb3ZpZGVkIHNjaGVtYSBub2RlXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7U2NoZW1hTm9kZX0gbm9kZVxuICogQHJldHVybnMge1JlYWN0Q29tcG9uZW50fVxuICovXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnRGcm9tU2NoZW1hKG5vZGUpIHtcbiAgaWYgKG5vZGUucHJvcHMuY29tcG9uZW50KSB7XG4gICAgcmV0dXJuIG5vZGUucHJvcHMuY29tcG9uZW50KHtrZXk6IG5vZGUubmFtZSwgbmFtZTogbm9kZS5uYW1lfSk7XG4gIH1cblxuICBpZiAoc2NoZW1hLmlzTGlzdChub2RlKSkge1xuICAgIHJldHVybiBSZXBlYXRpbmdGaWVsZHNldCgge2tleTpub2RlLm5hbWUsIG5hbWU6bm9kZS5uYW1lfSApO1xuICB9IGVsc2UgaWYgKHNjaGVtYS5pc1NjaGVtYShub2RlKSkge1xuICAgIHJldHVybiBGaWVsZHNldCgge2tleTpub2RlLm5hbWUsIG5hbWU6bm9kZS5uYW1lfSApO1xuICB9IGVsc2UgaWYgKHNjaGVtYS5pc1Byb3BlcnR5KG5vZGUpKSB7XG4gICAgcmV0dXJuIEZpZWxkKCB7a2V5Om5vZGUubmFtZSwgbmFtZTpub2RlLm5hbWV9ICk7XG4gIH0gZWxzZSB7XG4gICAgaW52YXJpYW50KGZhbHNlLCAnaW52YWxpZCBzY2hlbWEgbm9kZTogJXMnLCBub2RlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUNvbXBvbmVudEZyb21TY2hlbWE7XG4iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGludmFyaWFudCA9ICh3aW5kb3cuX19SZWFjdFNoaW0uaW52YXJpYW50KTtcbnZhciBzY2hlbWEgICAgPSByZXF1aXJlKCcuL3NjaGVtYScpO1xuXG4vKipcbiAqIEdldCBkZWZhdWx0IHZhbHVlIGZvciBzY2hlbWEgbm9kZVxuICpcbiAqIEBwYXJhbSB7U2NoZW1hTm9kZX0gbm9kZVxuICogQHJldHVybnMge0FueX1cbiAqL1xuZnVuY3Rpb24gZ2V0RGVmYXVsdFZhbHVlRm9yU2NoZW1hKG5vZGUpIHtcbiAgaWYgKG5vZGUgJiYgbm9kZS5wcm9wcyAmJiBub2RlLnByb3BzLmRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG5vZGUucHJvcHMuZGVmYXVsdFZhbHVlO1xuICB9XG4gIGlmIChzY2hlbWEuaXNTY2hlbWEobm9kZSkpIHtcbiAgICByZXR1cm4ge307XG4gIH0gZWxzZSBpZiAoc2NoZW1hLmlzTGlzdChub2RlKSkge1xuICAgIHJldHVybiBbXTtcbiAgfSBlbHNlIGlmIChzY2hlbWEuaXNQcm9wZXJ0eShub2RlKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2Uge1xuICAgIGludmFyaWFudChcbiAgICAgIGZhbHNlLFxuICAgICAgJ2RvIG5vdCBrbm93IGhvdyB0byBpbmZlciBkZWZhdWx0IHZhbHVlIGZvciAlcycsIG5vZGVcbiAgICApO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RGVmYXVsdFZhbHVlRm9yU2NoZW1hO1xuIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBpbnZhcmlhbnQgPSAod2luZG93Ll9fUmVhY3RTaGltLmludmFyaWFudCk7XG52YXIgaXNTdHJpbmcgID0gcmVxdWlyZSgnLi9pc1N0cmluZycpO1xudmFyIHR5cGVzICAgICA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcbnZhciBzY2hlbWEgICAgPSByZXF1aXJlKCcuL3NjaGVtYScpO1xuXG4vKipcbiAqIFJldHVybiBhIHR5cGUgd2hpY2ggY29ycmVzcG9uZHMgdG8gYSBnaXZlbiBzY2hlbWEgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge1NjaGVtYX0gbm9kZVxuICogQHJldHVybiB7VHlwZX1cbiAqL1xuZnVuY3Rpb24gZ2V0VHlwZUZyb21TY2hlbWEobm9kZSkge1xuICBpZiAobm9kZSAmJiBub2RlLnByb3BzLnR5cGUpIHtcblxuICAgIGludmFyaWFudChcbiAgICAgIHNjaGVtYS5pc1Byb3BlcnR5KG5vZGUpLFxuICAgICAgJ29ubHkgUHJvcGVydHkgc2NoZW1hIG5vZGVzIGNhbiBoYXZlIHR5cGVzJ1xuICAgICk7XG5cbiAgICBpZiAoaXNTdHJpbmcobm9kZS5wcm9wcy50eXBlKSkge1xuICAgICAgdmFyIHR5cGUgPSB0eXBlc1tub2RlLnByb3BzLnR5cGVdO1xuICAgICAgaW52YXJpYW50KHR5cGUsICd1bmtub3duIHR5cGUgJXMnLCBub2RlLnByb3BzLnR5cGUpO1xuICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGUucHJvcHMudHlwZTtcbiAgfVxuXG4gIHJldHVybiB0eXBlcy5hbnk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VHlwZUZyb21TY2hlbWE7XG4iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIEZvcm0gICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9Gb3JtJyk7XG52YXIgRmllbGRzZXQgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL0ZpZWxkc2V0Jyk7XG52YXIgUmVwZWF0aW5nRmllbGRzZXQgICAgICAgPSByZXF1aXJlKCcuL1JlcGVhdGluZ0ZpZWxkc2V0Jyk7XG52YXIgRmllbGQgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL0ZpZWxkJyk7XG52YXIgRm9ybUZvciAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL0Zvcm1Gb3InKTtcbnZhciBNZXNzYWdlICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vTWVzc2FnZScpO1xuXG52YXIgRm9ybU1peGluICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL0Zvcm1NaXhpbicpO1xudmFyIEZvcm1Db250ZXh0TWl4aW4gICAgICAgID0gcmVxdWlyZSgnLi9Gb3JtQ29udGV4dE1peGluJyk7XG52YXIgRm9ybUVsZW1lbnRNaXhpbiAgICAgICAgPSByZXF1aXJlKCcuL0Zvcm1FbGVtZW50TWl4aW4nKTtcbnZhciBGaWVsZE1peGluICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vRmllbGRNaXhpbicpO1xudmFyIEZpZWxkc2V0TWl4aW4gICAgICAgICAgID0gcmVxdWlyZSgnLi9GaWVsZHNldE1peGluJyk7XG52YXIgUmVwZWF0aW5nRmllbGRzZXRNaXhpbiAgPSByZXF1aXJlKCcuL1JlcGVhdGluZ0ZpZWxkc2V0TWl4aW4nKTtcblxudmFyIHZhbGlkYXRvcnMgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi92YWxpZGF0b3JzJyk7XG52YXIgdHlwZXMgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL3R5cGVzJyk7XG52YXIgc2NoZW1hICAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL3NjaGVtYScpO1xudmFyIGlucHV0ICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRm9ybU1peGluOkZvcm1NaXhpbiwgRm9ybUNvbnRleHRNaXhpbjpGb3JtQ29udGV4dE1peGluLCBGb3JtRWxlbWVudE1peGluOkZvcm1FbGVtZW50TWl4aW4sXG4gIEZpZWxkTWl4aW46RmllbGRNaXhpbiwgRmllbGRzZXRNaXhpbjpGaWVsZHNldE1peGluLCBSZXBlYXRpbmdGaWVsZHNldE1peGluOlJlcGVhdGluZ0ZpZWxkc2V0TWl4aW4sXG5cbiAgRm9ybTpGb3JtLCBGaWVsZDpGaWVsZCwgRmllbGRzZXQ6RmllbGRzZXQsIFJlcGVhdGluZ0ZpZWxkc2V0OlJlcGVhdGluZ0ZpZWxkc2V0LFxuXG4gIEZvcm1Gb3I6Rm9ybUZvciwgTWVzc2FnZTpNZXNzYWdlLFxuXG4gIHNjaGVtYTpzY2hlbWEsIHR5cGVzOnR5cGVzLCB2YWxpZGF0b3JzOnZhbGlkYXRvcnMsIGlucHV0OmlucHV0XG59O1xuIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9ICh3aW5kb3cuX19SZWFjdFNoaW0uUmVhY3QpO1xuXG52YXIgQ2hlY2tib3hHcm91cCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0NoZWNrYm94R3JvdXAnLFxuXG4gIHByb3BUeXBlczoge1xuICAgIG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gICAgb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge3ZhbHVlOiBbXX07XG4gIH0sXG5cbiAgb25DaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMub25DaGFuZ2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dFZhbHVlID0gdGhpcy5wcm9wcy52YWx1ZS5zbGljZSgwKTtcblxuICAgIGlmIChlLnRhcmdldC5jaGVja2VkKSB7XG4gICAgICBuZXh0VmFsdWUucHVzaChlLnRhcmdldC52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBpZHggPSBuZXh0VmFsdWUuaW5kZXhPZihlLnRhcmdldC52YWx1ZSk7XG4gICAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgICAgbmV4dFZhbHVlLnNwbGljZShpZHgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciB2YWx1ZXMgPSB0aGlzLnByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKG8pICB7cmV0dXJuIG8udmFsdWU7fSk7XG4gICAgbmV4dFZhbHVlLnNvcnQoZnVuY3Rpb24oYSwgYikgIHtyZXR1cm4gdmFsdWVzLmluZGV4T2YoYSkgLSB2YWx1ZXMuaW5kZXhPZihiKTt9KTtcblxuICAgIHRoaXMucHJvcHMub25DaGFuZ2UobmV4dFZhbHVlKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBuYW1lID0gdGhpcy5fcm9vdE5vZGVJRDtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLnByb3BzLnZhbHVlO1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zLm1hcChmdW5jdGlvbihvcHRpb24pICB7XG4gICAgICB2YXIgY2hlY2tlZCA9IHZhbHVlICYmIHZhbHVlLmluZGV4T2Yob3B0aW9uLnZhbHVlKSA+IC0xO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmRpdihcbiAgICAgICAgICB7Y2xhc3NOYW1lOlwicmVhY3QtZm9ybXMtY2hlY2tib3gtZ3JvdXAtYnV0dG9uXCIsXG4gICAgICAgICAga2V5Om9wdGlvbi52YWx1ZX0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5sYWJlbCgge2NsYXNzTmFtZTpcInJlYWN0LWZvcm1zLWNoZWNrYm94LWdyb3VwLWxhYmVsXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5pbnB1dChcbiAgICAgICAgICAgICAge29uQ2hhbmdlOnRoaXMub25DaGFuZ2UsXG4gICAgICAgICAgICAgIGNoZWNrZWQ6Y2hlY2tlZCxcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOlwicmVhY3QtZm9ybXMtY2hlY2tib3gtZ3JvdXAtY2hlY2tib3hcIixcbiAgICAgICAgICAgICAgdHlwZTpcImNoZWNrYm94XCIsXG4gICAgICAgICAgICAgIG5hbWU6bmFtZSxcbiAgICAgICAgICAgICAgdmFsdWU6b3B0aW9uLnZhbHVlfSApLFxuICAgICAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJyZWFjdC1mb3Jtcy1jaGVja2JveC1ncm91cC1jYXB0aW9uXCJ9LCBcbiAgICAgICAgICAgICAgb3B0aW9uLm5hbWVcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicmVhY3QtZm9ybXMtY2hlY2tib3gtZ3JvdXBcIn0sIFxuICAgICAgICBvcHRpb25zXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hlY2tib3hHcm91cDtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSAod2luZG93Ll9fUmVhY3RTaGltLlJlYWN0KTtcblxuZnVuY3Rpb24gcmVuZGVyRW1wdHlPcHRpb24ocHJvcHMsIG9uQ2hhbmdlKSB7XG4gIHJldHVybiAoXG4gICAgUmVhY3QuRE9NLmRpdihcbiAgICAgICAge2NsYXNzTmFtZTpcInJlYWN0LWZvcm1zLXJhZGlvLWJ1dHRvbi1ncm91cC1idXR0b25cIixcbiAgICAgICAga2V5OlwiXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS5sYWJlbChcbiAgICAgICAge2NsYXNzTmFtZTpcInJlYWN0LWZvcm1zLXJhZGlvLWJ1dHRvbi1ncm91cC1sYWJlbFwifSwgXG4gICAgICAgIFJlYWN0LkRPTS5pbnB1dChcbiAgICAgICAgICB7Y2hlY2tlZDpwcm9wcy5jaGVja2VkLFxuICAgICAgICAgIGNsYXNzTmFtZTpcInJlYWN0LWZvcm1zLXJhZGlvLWJ1dHRvbi1ncm91cC1yYWRpb1wiLFxuICAgICAgICAgIHR5cGU6XCJyYWRpb1wiLFxuICAgICAgICAgIG5hbWU6cHJvcHMubmFtZSxcbiAgICAgICAgICBvbkNoYW5nZTpvbkNoYW5nZS5iaW5kKG51bGwsIG51bGwpLFxuICAgICAgICAgIHZhbHVlOlwiXCJ9ICksXG4gICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwicmVhY3QtZm9ybXMtcmFkaW8tYnV0dG9uLWdyb3VwLWNhcHRpb25cIn0sIFxuICAgICAgICAgIFwibm9uZVwiXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG4gICk7XG59XG5cbnZhciBSYWRpb0J1dHRvbkdyb3VwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnUmFkaW9CdXR0b25Hcm91cCcsXG5cbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgIG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgICAgYWxsb3dFbXB0eTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIG9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnMubWFwKHRoaXMucmVuZGVyT3B0aW9uKTtcblxuICAgICAgaWYgKHRoaXMucHJvcHMuYWxsb3dFbXB0eSkge1xuICAgICAgICBvcHRpb25zLnVuc2hpZnQocmVuZGVyRW1wdHlPcHRpb24oe1xuICAgICAgICAgICAgbmFtZTogdGhpcy5fcm9vdE5vZGVJRCxcbiAgICAgICAgICAgIGNoZWNrZWQ6ICF0aGlzLnByb3BzLnZhbHVlXG4gICAgICAgIH0sIHRoaXMub25DaGFuZ2UpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJlYWN0LWZvcm1zLXJhZGlvLWJ1dHRvbi1ncm91cFwifSwgXG4gICAgICAgICAgb3B0aW9uc1xuICAgICAgICApXG4gICAgICApO1xuICAgIH0sXG5cbiAgICByZW5kZXJPcHRpb246IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgdmFyIG5hbWUgPSB0aGlzLl9yb290Tm9kZUlEO1xuICAgICAgdmFyIGNoZWNrZWQgPSB0aGlzLnByb3BzLnZhbHVlID9cbiAgICAgICAgICB0aGlzLnByb3BzLnZhbHVlID09PSBvcHRpb24udmFsdWUgOlxuICAgICAgICAgIGZhbHNlO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmRpdihcbiAgICAgICAgICB7Y2xhc3NOYW1lOlwicmVhY3QtZm9ybXMtcmFkaW8tYnV0dG9uLWdyb3VwLWJ1dHRvblwiLFxuICAgICAgICAgIGtleTpvcHRpb24udmFsdWV9LCBcbiAgICAgICAgICBSZWFjdC5ET00ubGFiZWwoXG4gICAgICAgICAgICB7Y2xhc3NOYW1lOlwicmVhY3QtZm9ybXMtcmFkaW8tYnV0dG9uLWdyb3VwLWxhYmVsXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5pbnB1dChcbiAgICAgICAgICAgICAge2NoZWNrZWQ6Y2hlY2tlZCxcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOlwicmVhY3QtZm9ybXMtcmFkaW8tYnV0dG9uLWdyb3VwLXJhZGlvXCIsXG4gICAgICAgICAgICAgIHR5cGU6XCJyYWRpb1wiLFxuICAgICAgICAgICAgICBuYW1lOm5hbWUsXG4gICAgICAgICAgICAgIG9uQ2hhbmdlOnRoaXMub25DaGFuZ2UuYmluZChudWxsLCBvcHRpb24udmFsdWUpLFxuICAgICAgICAgICAgICB2YWx1ZTpvcHRpb24udmFsdWV9ICksXG4gICAgICAgICAgICBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcInJlYWN0LWZvcm1zLXJhZGlvLWJ1dHRvbi1ncm91cC1jYXB0aW9uXCJ9LCBcbiAgICAgICAgICAgICAgb3B0aW9uLm5hbWVcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSxcblxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmFkaW9CdXR0b25Hcm91cDtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENoZWNrYm94R3JvdXA6IHJlcXVpcmUoJy4vQ2hlY2tib3hHcm91cCcpLFxuICBSYWRpb0J1dHRvbkdyb3VwOiByZXF1aXJlKCcuL1JhZGlvQnV0dG9uR3JvdXAnKVxufTtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhvKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG8pID09PSAnW29iamVjdCBTdHJpbmddJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmluZztcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5cblxuICBmdW5jdGlvbiBMZW5zKGRhdGEsIHBhdGgpIHtcbiAgICB0aGlzLl9fZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5fX3BhdGggPSBwYXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIHZhbHVlIHRoaXMgbGVuc2UgcG9pbnRzIHRvXG4gICAqL1xuICBMZW5zLnByb3RvdHlwZS52YWw9ZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5fX2RhdGE7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuX19wYXRoLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0gdGhpcy5fX3BhdGhbaV07XG4gICAgICB2YWx1ZSA9IHZhbHVlW2tleS5rZXldO1xuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgJiYga2V5LmRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhbHVlID0ga2V5LmRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIExlbnMucHJvdG90eXBlLnJvb3Q9ZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX19kYXRhO1xuICB9O1xuXG4gIExlbnMucHJvdG90eXBlLnBhcmVudD1mdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fX3BhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcGF0aCA9IHRoaXMuX19wYXRoLnNsaWNlKDAsIHRoaXMuX19wYXRoLmxlbmd0aCAtIDEpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMuX19kYXRhLCBwYXRoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBhIGxlbnMgYnkgYSBzcGVjaWZpZWQga2V5XG4gICAqXG4gICAqIEBwYXJhbSB7S2V5fSBrZXlcbiAgICogQHBhcmFtIHtBbnl9IGRlZmF1bHRWYWx1ZVxuICAgKi9cbiAgTGVucy5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxuICAgICAgdGhpcy5fX2RhdGEsIHRoaXMuX19wYXRoLmNvbmNhdCh7a2V5OmtleSwgZGVmYXVsdFZhbHVlOmRlZmF1bHRWYWx1ZX0pKTtcbiAgfTtcblxuICAvKipcbiAgICogU2hvcnRjdXQgZm9yIGxlbnMuZ2V0KGtleSkubW9kKHZhbHVlKVxuICAgKlxuICAgKiBAcGFyYW0ge0tleX0ga2V5XG4gICAqIEBwYXJhbSB7QW55fSB2YWx1ZVxuICAgKi9cbiAgTGVucy5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoa2V5KS5tb2QodmFsdWUpO1xuICB9O1xuXG4gIExlbnMucHJvdG90eXBlLnVwZGF0ZT1mdW5jdGlvbih2YWx1ZXMpIHtcbiAgICB2YXIgZGF0YSA9IHRoaXMudmFsKCk7XG4gICAgdmFyIGNvcHkgPSB7fTtcbiAgICB2YXIgaztcbiAgICBmb3IgKGsgaW4gZGF0YSkge1xuICAgICAgY29weVtrXSA9IGRhdGFba107XG4gICAgfVxuICAgIGZvciAoayBpbiB2YWx1ZXMpIHtcbiAgICAgIGNvcHlba10gPSB2YWx1ZXNba107XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm1vZChjb3B5KTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIGxlbnMgZm9yIGEgbmV3IGRhdGEgd2hpY2ggcG9pbnRzIHRvIHRoZSBzYW1lIGxvY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0gZGF0YVxuICAgKi9cbiAgTGVucy5wcm90b3R5cGUuZm9yPWZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoZGF0YSwgdGhpcy5fX3BhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBuZXcgY29weSBvZiBkYXRhIGJ5IHJlcGxhY2luZyBhIHZhbHVlIHRoaXMgbGVucyBwb2ludHMgdG8gd2l0aCBhXG4gICAqIG5ldyB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtBbnl9IHZhbHVlXG4gICAqL1xuICBMZW5zLnByb3RvdHlwZS5tb2Q9ZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgdXBkYXRlZCwgbmV3RGF0YSwgcHJldkRhdGE7XG4gICAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YTtcbiAgICB2YXIgcGF0aCA9IHRoaXMuX19wYXRoO1xuXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5mb3IodmFsdWUpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYXRoLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0gcGF0aFtpXTtcblxuICAgICAgLy8gY29weSB0aHJvdWdoIGNoYW5nZWQgcGF0aFxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgdXBkYXRlZCA9IGRhdGEuc2xpY2UoMCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICB1cGRhdGVkID0ge307XG4gICAgICAgIGZvciAodmFyIGsgaW4gZGF0YSkge1xuICAgICAgICAgIHVwZGF0ZWRba10gPSBkYXRhW2tdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBuZXdseSBjcmVhdGVkIHJvb3QgZGF0YVxuICAgICAgaWYgKG5ld0RhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBuZXdEYXRhID0gdXBkYXRlZDtcbiAgICAgIH1cblxuICAgICAgLy8gbXV0YXRlIHByZXZpb3VzbHkgY29waWVkIGRhdGEgd2l0aCB1cGRhdGVkIHZhbHVlXG4gICAgICBpZiAocHJldkRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwcmV2RGF0YVtwYXRoW2kgLSAxXS5rZXldID0gdXBkYXRlZDtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgd2UgYXJlIGF0IHRoZSBsYXN0IHBhdGgga2V5IHVwZGF0ZSBkYXRhIHdpdGggYSBuZXcgdmFsdWVcbiAgICAgIGlmIChpID09PSBsZW4gLSAxKSB7XG4gICAgICAgIHVwZGF0ZWRba2V5LmtleV0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEgPSB1cGRhdGVkW2tleS5rZXldO1xuICAgICAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkICYmIGtleS5kZWZhdWx0VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGRhdGEgPSBrZXkuZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHByZXZEYXRhID0gdXBkYXRlZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5mb3IobmV3RGF0YSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIE1ha2UgYSBuZXcgbGVucyBmb3IgZGF0YVxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0gZGF0YVxuICAgKi9cbiAgTGVucy5tYWtlPWZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMoZGF0YSwgW10pO1xuICB9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTGVucy5tYWtlLmJpbmQoTGVucyk7XG4iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIG1lcmdlICAgICAgID0gKHdpbmRvdy5fX1JlYWN0U2hpbS5tZXJnZSk7XG52YXIgaW52YXJpYW50ICAgPSAod2luZG93Ll9fUmVhY3RTaGltLmludmFyaWFudCk7XG5cbmZ1bmN0aW9uIE5vZGUoKXt9XG5cblxuXG5mb3IodmFyIE5vZGVfX19fS2V5IGluIE5vZGUpe2lmKE5vZGUuaGFzT3duUHJvcGVydHkoTm9kZV9fX19LZXkpKXtQcm9wZXJ0eU5vZGVbTm9kZV9fX19LZXldPU5vZGVbTm9kZV9fX19LZXldO319dmFyIF9fX19TdXBlclByb3RvT2ZOb2RlPU5vZGU9PT1udWxsP251bGw6Tm9kZS5wcm90b3R5cGU7UHJvcGVydHlOb2RlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKF9fX19TdXBlclByb3RvT2ZOb2RlKTtQcm9wZXJ0eU5vZGUucHJvdG90eXBlLmNvbnN0cnVjdG9yPVByb3BlcnR5Tm9kZTtQcm9wZXJ0eU5vZGUuX19zdXBlckNvbnN0cnVjdG9yX189Tm9kZTtcblxuICBmdW5jdGlvbiBQcm9wZXJ0eU5vZGUocHJvcHMpIHtcbiAgICBwcm9wcyA9IHByb3BzID8gbWVyZ2Uoe30sIHByb3BzKSA6IHt9O1xuXG4gICAgdGhpcy5uYW1lID0gcHJvcHMubmFtZTtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIH1cblxuXG5mb3IoTm9kZV9fX19LZXkgaW4gTm9kZSl7aWYoTm9kZS5oYXNPd25Qcm9wZXJ0eShOb2RlX19fX0tleSkpe1NjaGVtYU5vZGVbTm9kZV9fX19LZXldPU5vZGVbTm9kZV9fX19LZXldO319U2NoZW1hTm9kZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShfX19fU3VwZXJQcm90b09mTm9kZSk7U2NoZW1hTm9kZS5wcm90b3R5cGUuY29uc3RydWN0b3I9U2NoZW1hTm9kZTtTY2hlbWFOb2RlLl9fc3VwZXJDb25zdHJ1Y3Rvcl9fPU5vZGU7XG5cbiAgZnVuY3Rpb24gU2NoZW1hTm9kZShwcm9wcykge1xuICAgIHByb3BzID0gcHJvcHMgPyBtZXJnZSh7fSwgcHJvcHMpIDoge307XG5cbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGNoaWxkcmVuID0ge307XG5cbiAgICBpZiAoYXJncy5sZW5ndGggIT09IDApIHtcbiAgICAgIGZvckVhY2hOZXN0ZWQoYXJncywgZnVuY3Rpb24oYXJnKSAge1xuICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgYXJnLm5hbWUsXG4gICAgICAgICAgJ3Byb3BzIGZpZWxkcyBzaG91bGQgc3BlY2lmeSBuYW1lIHByb3BlcnR5J1xuICAgICAgICApO1xuICAgICAgICBjaGlsZHJlblthcmcubmFtZV0gPSBhcmc7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lO1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH1cblxuICBTY2hlbWFOb2RlLnByb3RvdHlwZS5tYXA9ZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICByZXN1bHRzLnB1c2goZnVuYy5jYWxsKGNvbnRleHQsIHRoaXMuY2hpbGRyZW5bbmFtZV0sIG5hbWUsIHRoaXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cblxuZm9yKE5vZGVfX19fS2V5IGluIE5vZGUpe2lmKE5vZGUuaGFzT3duUHJvcGVydHkoTm9kZV9fX19LZXkpKXtMaXN0Tm9kZVtOb2RlX19fX0tleV09Tm9kZVtOb2RlX19fX0tleV07fX1MaXN0Tm9kZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShfX19fU3VwZXJQcm90b09mTm9kZSk7TGlzdE5vZGUucHJvdG90eXBlLmNvbnN0cnVjdG9yPUxpc3ROb2RlO0xpc3ROb2RlLl9fc3VwZXJDb25zdHJ1Y3Rvcl9fPU5vZGU7XG5cbiAgZnVuY3Rpb24gTGlzdE5vZGUocHJvcHMpIHtcbiAgICBwcm9wcyA9IHByb3BzID8gbWVyZ2Uoe30sIHByb3BzKSA6IHt9O1xuXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgaW52YXJpYW50KFxuICAgICAgYXJncy5sZW5ndGggPT09IDEsXG4gICAgICAncHJvcHMgZm9yIGFycmF5IG11c3QgY29udGFpbiBleGFjdGx5IG9uZSBjaGlsZCBwcm9wcyBwcm9wcydcbiAgICApO1xuXG4gICAgdGhpcy5uYW1lID0gcHJvcHMubmFtZTtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgdGhpcy5jaGlsZHJlbiA9IGFyZ3NbMF07XG4gIH1cblxuXG5mdW5jdGlvbiBmb3JFYWNoTmVzdGVkKGNvbGxlY3Rpb24sIGZ1bmMsIGNvbnRleHQpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvbGxlY3Rpb24ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uW2ldKSkge1xuICAgICAgZm9yRWFjaE5lc3RlZChjb2xsZWN0aW9uW2ldLCBmdW5jLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVuYy5jYWxsKGNvbnRleHQsIGNvbGxlY3Rpb25baV0sIGksIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtYWtlRmFjdG9yeShjb25zdHJ1Y3Rvcikge1xuICBmdW5jdGlvbiBmYWN0b3J5KCkge1xuICAgIHZhciBub2RlID0gT2JqZWN0LmNyZWF0ZShjb25zdHJ1Y3Rvci5wcm90b3R5cGUpO1xuICAgIGNvbnN0cnVjdG9yLmFwcGx5KG5vZGUsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgLy8gd2UgZG8gdGhpcyB0byBzdXBwb3J0IGluc3RhbmNlb2YgY2hlY2tcbiAgZmFjdG9yeS5wcm90b3R5cGUgPSBjb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIHJldHVybiBmYWN0b3J5O1xufVxuXG52YXIgUHJvcGVydHkgID0gbWFrZUZhY3RvcnkoUHJvcGVydHlOb2RlKTtcbnZhciBMaXN0ICAgICAgPSBtYWtlRmFjdG9yeShMaXN0Tm9kZSk7XG52YXIgU2NoZW1hICAgID0gbWFrZUZhY3RvcnkoU2NoZW1hTm9kZSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVR5cGUoc3BlYykge1xuICByZXR1cm4gZnVuY3Rpb24ocHJvcHMpIHtcbiAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xuICAgIHJldHVybiBzcGVjKHByb3BzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNTY2hlbWEobm9kZSkge1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIFNjaGVtYU5vZGU7XG59XG5cbmZ1bmN0aW9uIGlzTGlzdChub2RlKSB7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgTGlzdE5vZGU7XG59XG5cbmZ1bmN0aW9uIGlzUHJvcGVydHkobm9kZSkge1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIFByb3BlcnR5Tm9kZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE5vZGU6Tm9kZSxcbiAgUHJvcGVydHk6UHJvcGVydHksIGlzUHJvcGVydHk6aXNQcm9wZXJ0eSxcbiAgU2NoZW1hOlNjaGVtYSwgaXNTY2hlbWE6aXNTY2hlbWEsXG4gIExpc3Q6TGlzdCwgaXNMaXN0OmlzTGlzdCxcbiAgY3JlYXRlVHlwZTpjcmVhdGVUeXBlXG59O1xuIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGlkU2VyaWFsaXplKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gbnVsbCA/ICcnIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGlkRGVzZXJpYWxpemUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSAnJyA/IG51bGwgOiB2YWx1ZTtcbn1cblxudmFyIGFueSA9IHtcbiAgc2VyaWFsaXplOiBpZFNlcmlhbGl6ZSxcbiAgZGVzZXJpYWxpemU6IGlkRGVzZXJpYWxpemVcbn07XG5cbnZhciBzdHJpbmcgPSBhbnk7XG5cbnZhciBudW1iZXIgPSB7XG4gIHNlcmlhbGl6ZTogaWRTZXJpYWxpemUsXG4gIGRlc2VyaWFsaXplOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIC8vIGJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE4MzA4NDQvMTgyOTU0XG4gICAgfSBlbHNlIGlmICghaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpICYmIGlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgdmFsdWUnKTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBpc0RhdGVSZSA9IC9eXFxkXFxkXFxkXFxkLVxcZFxcZC1cXGRcXGQkLztcblxudmFyIGRhdGUgPSB7XG4gIHNlcmlhbGl6ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHllYXIgPSB2YWx1ZS5nZXRGdWxsWWVhcigpO1xuICAgIHZhciBtb250aCA9IHZhbHVlLmdldE1vbnRoKCkgKyAxO1xuICAgIHZhciBkYXkgPSB2YWx1ZS5nZXREYXRlKCk7XG4gICAgcmV0dXJuICh5ZWFyICsgXCItXCIgKyBwYWQobW9udGgsIDIpICsgXCItXCIgKyBwYWQoZGF5LCAyKSk7XG4gIH0sXG4gIGRlc2VyaWFsaXplOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWlzRGF0ZVJlLmV4ZWModmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Nob3VsZCBiZSBhIGRhdGUgaW4gWVlZWS1NTS1ERCBmb3JtYXQnKTtcbiAgICB9XG5cbiAgICB2YWx1ZSA9IG5ldyBEYXRlKHZhbHVlKTtcblxuICAgIGlmIChpc05hTih2YWx1ZS5nZXRUaW1lKCkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGF0ZScpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufTtcblxuZnVuY3Rpb24gcGFkKG51bSwgc2l6ZSkge1xuICByZXR1cm4gKCcwMDAwJyArIG51bSkuc3Vic3RyKC1zaXplKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7YW55OmFueSwgc3RyaW5nOnN0cmluZywgbnVtYmVyOm51bWJlciwgZGF0ZTpkYXRlfTtcbiIsIi8qKlxuICogU2NoZW1hIHZhbGlkYXRpb25cbiAqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBpbnZhcmlhbnQgICAgICAgICA9ICh3aW5kb3cuX19SZWFjdFNoaW0uaW52YXJpYW50KTtcbnZhciBzY2hlbWEgICAgICAgICAgICA9IHJlcXVpcmUoJy4vc2NoZW1hJyk7XG52YXIgZ2V0VHlwZUZyb21TY2hlbWEgPSByZXF1aXJlKCcuL2dldFR5cGVGcm9tU2NoZW1hJyk7XG52YXIgdmFsaWRhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL3ZhbGlkYXRvcnMnKTtcblxudmFyIGV4aXN0cyAgICAgPSB2YWxpZGF0b3JzLmV4aXN0cztcbnZhciBub25FbXB0eSAgID0gdmFsaWRhdG9ycy5ub25FbXB0eTtcblxuZnVuY3Rpb24gc2VyaWFsaXplKG5vZGUsIHZhbHVlKSB7XG4gIHZhciByZXN1bHQ7XG5cbiAgaWYgKHNjaGVtYS5pc1Byb3BlcnR5KG5vZGUpKSB7XG4gICAgcmVzdWx0ID0gZ2V0VHlwZUZyb21TY2hlbWEobm9kZSkuc2VyaWFsaXplKHZhbHVlKTtcbiAgfSBlbHNlIGlmIChzY2hlbWEuaXNTY2hlbWEobm9kZSkpIHtcbiAgICByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBrIGluIHZhbHVlKSB7XG4gICAgICBpZiAobm9kZS5jaGlsZHJlbltrXSkge1xuICAgICAgICByZXN1bHRba10gPSBzZXJpYWxpemUobm9kZS5jaGlsZHJlbltrXSwgdmFsdWVba10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2tdID0gdmFsdWVba107XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHNjaGVtYS5pc0xpc3Qobm9kZSkpIHtcbiAgICByZXN1bHQgPSBuZXcgQXJyYXkodmFsdWUubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHJlc3VsdFtpXSA9IHNlcmlhbGl6ZShub2RlLmNoaWxkcmVuLCB2YWx1ZVtpXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGludmFyaWFudChmYWxzZSwgJ3Vua25vd24gc2NoZW1hIHBhc3NlZCcpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVPbmx5KG5vZGUsIHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHt2YWx1ZTp2YWx1ZSwgdmFsaWRhdGlvbjogc3VjY2Vzc307XG4gIH1cbiAgdmFyIHR5cGUgPSBnZXRUeXBlRnJvbVNjaGVtYShub2RlKTtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IHR5cGUuZGVzZXJpYWxpemUodmFsdWUpO1xuICB9IGNhdGNoKGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvbjogZmFpbHVyZShlLm1lc3NhZ2UpLFxuICAgICAgdmFsdWU6dmFsdWVcbiAgICB9O1xuICB9XG4gIHJldHVybiB7XG4gICAgdmFsaWRhdGlvbjogc3VjY2VzcyxcbiAgICB2YWx1ZTp2YWx1ZVxuICB9O1xufVxuXG4vKipcbiAqIFZhbGlkYXRlIHZhbHVlIGFnYWluc3Qgc2NoZW1hXG4gKlxuICogQHBhcmFtIHtTY2hlbWF9IG5vZGVcbiAqIEBwYXJhbSB7QW55fSB2YWx1ZVxuICogQHJldHVybnMge1ZhbGlkYXRpb259XG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlKG5vZGUsIHZhbHVlKSB7XG4gIGlmIChzY2hlbWEuaXNTY2hlbWEobm9kZSkpIHtcbiAgICByZXR1cm4gdmFsaWRhdGVTY2hlbWEobm9kZSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKHNjaGVtYS5pc0xpc3Qobm9kZSkpIHtcbiAgICByZXR1cm4gdmFsaWRhdGVMaXN0KG5vZGUsIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChzY2hlbWEuaXNQcm9wZXJ0eShub2RlKSkge1xuICAgIHJldHVybiB2YWxpZGF0ZVByb3BlcnR5KG5vZGUsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICBmYWxzZSxcbiAgICAgICdkbyBub3Qga25vdyBob3cgdG8gdmFsaWRhdGUgJXMgb2YgdHlwZSAlcycsIG5vZGUsIG5vZGUuY29uc3RydWN0b3JcbiAgICApO1xuICB9XG59XG5cbi8qKlxuICogVmFsaWRhdGUgdmFsdWUgYWdhaW5zdCBzY2hlbWEgYnV0IG9ubHkgdXNpbmcgdGhlIHJvb3Qgc2NoZW1hIG5vZGUuXG4gKlxuICogVGhpcyBtZXRob2QgaXMgdXNlZnVsIHdoZW4gZG9pbmcgYW4gaW5jcmVtZW50YWwgdmFsaWRhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1NjaGVtYX0gbm9kZVxuICogQHBhcmFtIHtBbnl9IHZhbHVlXG4gKiBAcmV0dXJucyB7VmFsaWRhdGlvbn1cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVPbmx5KG5vZGUsIHZhbHVlLCBjaGlsZHJlbikge1xuICBpZiAoc2NoZW1hLmlzU2NoZW1hKG5vZGUpKSB7XG4gICAgcmV0dXJuIHZhbGlkYXRlU2NoZW1hT25seShub2RlLCB2YWx1ZSwgY2hpbGRyZW4pO1xuICB9IGVsc2UgaWYgKHNjaGVtYS5pc0xpc3Qobm9kZSkpIHtcbiAgICByZXR1cm4gdmFsaWRhdGVMaXN0T25seShub2RlLCB2YWx1ZSwgY2hpbGRyZW4pO1xuICB9IGVsc2UgaWYgKHNjaGVtYS5pc1Byb3BlcnR5KG5vZGUpKSB7XG4gICAgcmV0dXJuIHZhbGlkYXRlUHJvcGVydHkobm9kZSwgdmFsdWUsIGNoaWxkcmVuKTtcbiAgfSBlbHNlIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICBmYWxzZSxcbiAgICAgICdkbyBub3Qga25vdyBob3cgdG8gdmFsaWRhdGUgJXMgb2YgdHlwZSAlcycsIG5vZGUsIG5vZGUuY29uc3RydWN0b3JcbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlU2NoZW1hKG5vZGUsIHZhbHVlKSB7XG4gIHZhciBjaGlsZHJlblZhbGlkYXRpb24gPSB2YWxpZGF0ZVNjaGVtYUNoaWxkcmVuKG5vZGUsIHZhbHVlKTtcblxuICB2YXIgY29udmVydGVkVmFsdWUgPSB2YWx1ZTtcblxuICBpZiAoT2JqZWN0LmtleXMoY2hpbGRyZW5WYWxpZGF0aW9uLmNoaWxkcmVuKS5sZW5ndGggPiAwKSB7XG4gICAgY29udmVydGVkVmFsdWUgPSB7fTtcbiAgICBmb3IgKHZhciBrIGluIHZhbHVlKSB7XG4gICAgICBjb252ZXJ0ZWRWYWx1ZVtrXSA9IGNoaWxkcmVuVmFsaWRhdGlvbi5jaGlsZHJlbltrXSAhPT0gdW5kZWZpbmVkID9cbiAgICAgICAgY2hpbGRyZW5WYWxpZGF0aW9uLmNoaWxkcmVuW2tdIDpcbiAgICAgICAgdmFsdWVba107XG4gICAgfVxuICB9XG5cbiAgdmFyIHZhbGlkYXRpb24gPSB2YWxpZGF0ZVNjaGVtYU9ubHkoXG4gICAgICBub2RlLFxuICAgICAgY29udmVydGVkVmFsdWUsXG4gICAgICBjaGlsZHJlblZhbGlkYXRpb24udmFsaWRhdGlvblxuICApO1xuXG4gIHJldHVybiB2YWxpZGF0aW9uO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVNjaGVtYU9ubHkobm9kZSwgdmFsdWUsIGNoaWxkcmVuKSB7XG5cbiAgaWYgKCFhcmVDaGlsZHJlblZhbGlkKGNoaWxkcmVuKSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTp2YWx1ZSxcbiAgICAgIHZhbGlkYXRpb246IHtcbiAgICAgICAgaXNTdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgaXNGYWlsdXJlOiB0cnVlLFxuICAgICAgICB2YWxpZGF0aW9uOiB7ZmFpbHVyZTogdW5kZWZpbmVkfSxcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHZhciBkZXNlcmlhbGl6ZWQgPSBkZXNlcmlhbGl6ZU9ubHkobm9kZSwgdmFsdWUpO1xuXG4gIGlmIChkZXNlcmlhbGl6ZWQudmFsaWRhdGlvbi5pc0ZhaWx1cmUpIHtcbiAgICByZXR1cm4gZGVzZXJpYWxpemVkO1xuICB9XG5cbiAgdmFyIHZhbGlkYXRvciA9IGV4aXN0cy5hbmRUaGVuKG5vZGUucHJvcHMudmFsaWRhdGUpO1xuICB2YXIgdmFsaWRhdGlvbiA9IHZhbGlkYXRvcih2YWx1ZSwgbm9kZS5wcm9wcyk7XG5cbiAgdmFyIGlzU3VjY2VzcyA9IHZhbGlkYXRvcnMuaXNTdWNjZXNzKHZhbGlkYXRpb24pO1xuXG4gIHJldHVybiB7XG4gICAgdmFsdWU6IGRlc2VyaWFsaXplZC52YWx1ZSxcbiAgICB2YWxpZGF0aW9uOiB7XG4gICAgICB2YWxpZGF0aW9uOnZhbGlkYXRpb24sXG4gICAgICBpc1N1Y2Nlc3M6aXNTdWNjZXNzLFxuICAgICAgaXNGYWlsdXJlOiAhaXNTdWNjZXNzXG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVNjaGVtYUNoaWxkcmVuKG5vZGUsIHZhbHVlKSB7XG4gIHZhciB2YWxpZGF0aW9uID0ge307XG4gIHZhciBjaGlsZHJlbiA9IHt9O1xuXG4gIGlmICh2YWx1ZSAmJiBub2RlLmNoaWxkcmVuKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICB2YXIgY2hpbGRWYWxpZGF0aW9uID0gdmFsaWRhdGUobm9kZS5jaGlsZHJlbltuYW1lXSwgdmFsdWVbbmFtZV0pO1xuXG4gICAgICBpZiAoY2hpbGRWYWxpZGF0aW9uLnZhbGlkYXRpb24uaXNGYWlsdXJlKSB7XG4gICAgICAgIHZhbGlkYXRpb25bbmFtZV0gPSBjaGlsZFZhbGlkYXRpb24udmFsaWRhdGlvbjtcbiAgICAgIH1cblxuICAgICAgY2hpbGRyZW5bbmFtZV0gPSBjaGlsZFZhbGlkYXRpb24udmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHt2YWxpZGF0aW9uOnZhbGlkYXRpb24sIGNoaWxkcmVuOmNoaWxkcmVufTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVMaXN0KG5vZGUsIHZhbHVlKSB7XG4gIHZhciBjaGlsZHJlblZhbGlkYXRpb24gPSB2YWxpZGF0ZUxpc3RDaGlsZHJlbihub2RlLCB2YWx1ZSk7XG5cbiAgdmFyIHZhbGlkYXRpb24gPSB2YWxpZGF0ZUxpc3RPbmx5KFxuICAgICAgbm9kZSxcbiAgICAgIGNoaWxkcmVuVmFsaWRhdGlvbi5jaGlsZHJlbixcbiAgICAgIGNoaWxkcmVuVmFsaWRhdGlvbi52YWxpZGF0aW9uXG4gICk7XG4gIHJldHVybiB2YWxpZGF0aW9uO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUxpc3RPbmx5KG5vZGUsIHZhbHVlLCBjaGlsZHJlbikge1xuXG4gIGlmICghYXJlQ2hpbGRyZW5WYWxpZChjaGlsZHJlbikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6dmFsdWUsXG4gICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgIGlzU3VjY2VzczogZmFsc2UsXG4gICAgICAgIGlzRmFpbHVyZTogdHJ1ZSxcbiAgICAgICAgdmFsaWRhdGlvbjoge2ZhaWx1cmU6IHVuZGVmaW5lZH0sXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlblxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICB2YXIgZGVzZXJpYWxpemVkID0gZGVzZXJpYWxpemVPbmx5KG5vZGUsIHZhbHVlKTtcblxuICBpZiAoZGVzZXJpYWxpemVkLnZhbGlkYXRpb24uaXNGYWlsdXJlKSB7XG4gICAgcmV0dXJuIGRlc2VyaWFsaXplZDtcbiAgfVxuXG4gIHZhciB2YWxpZGF0b3IgPSBub25FbXB0eS5hbmRUaGVuKG5vZGUucHJvcHMudmFsaWRhdGUpO1xuICB2YXIgdmFsaWRhdGlvbiA9IHZhbGlkYXRvcihkZXNlcmlhbGl6ZWQudmFsdWUsIG5vZGUucHJvcHMpO1xuICB2YXIgaXNTdWNjZXNzID0gdmFsaWRhdG9ycy5pc1N1Y2Nlc3ModmFsaWRhdGlvbik7XG5cbiAgcmV0dXJuIHtcbiAgICB2YWx1ZTogZGVzZXJpYWxpemVkLnZhbHVlLFxuICAgIHZhbGlkYXRpb246IHtcbiAgICAgIHZhbGlkYXRpb246dmFsaWRhdGlvbixcbiAgICAgIGlzU3VjY2Vzczppc1N1Y2Nlc3MsXG4gICAgICBpc0ZhaWx1cmU6ICFpc1N1Y2Nlc3NcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTGlzdENoaWxkcmVuKG5vZGUsIHZhbHVlKSB7XG4gIHZhciB2YWxpZGF0aW9uID0ge307XG4gIHZhciBjaGlsZHJlbiA9IFtdO1xuXG4gIGlmICh2YWx1ZSAmJiBub2RlLmNoaWxkcmVuKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoOyBpZHggPCBsZW47IGlkeCsrKSB7XG4gICAgICB2YXIgY2hpbGRWYWxpZGF0aW9uID0gdmFsaWRhdGUobm9kZS5jaGlsZHJlbiwgdmFsdWVbaWR4XSk7XG4gICAgICBpZiAoY2hpbGRWYWxpZGF0aW9uLnZhbGlkYXRpb24uaXNGYWlsdXJlKSB7XG4gICAgICAgIHZhbGlkYXRpb25baWR4XSA9IGNoaWxkVmFsaWRhdGlvbi52YWxpZGF0aW9uO1xuICAgICAgfVxuICAgICAgY2hpbGRyZW5baWR4XSA9IGNoaWxkVmFsaWRhdGlvbi52YWx1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge3ZhbGlkYXRpb246dmFsaWRhdGlvbiwgY2hpbGRyZW46Y2hpbGRyZW59O1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVByb3BlcnR5KG5vZGUsIHZhbHVlKSB7XG5cbiAgdmFyIGRlc2VyaWFsaXplZCA9IGRlc2VyaWFsaXplT25seShub2RlLCB2YWx1ZSk7XG5cbiAgaWYgKGRlc2VyaWFsaXplZC52YWxpZGF0aW9uLmlzRmFpbHVyZSkge1xuICAgIHJldHVybiBkZXNlcmlhbGl6ZWQ7XG4gIH1cblxuICB2YXIgdmFsaWRhdG9yID0gZXhpc3RzLmFuZFRoZW4obm9kZS5wcm9wcy52YWxpZGF0ZSk7XG4gIHZhciB2YWxpZGF0aW9uID0gdmFsaWRhdG9yKGRlc2VyaWFsaXplZC52YWx1ZSwgbm9kZS5wcm9wcyk7XG4gIHZhciBpc1N1Y2Nlc3MgPSB2YWxpZGF0b3JzLmlzU3VjY2Vzcyh2YWxpZGF0aW9uKTtcblxuICByZXR1cm4ge1xuICAgIHZhbHVlOiBkZXNlcmlhbGl6ZWQudmFsdWUsXG4gICAgdmFsaWRhdGlvbjoge1xuICAgICAgdmFsaWRhdGlvbjp2YWxpZGF0aW9uLFxuICAgICAgaXNTdWNjZXNzOmlzU3VjY2VzcyxcbiAgICAgIGlzRmFpbHVyZTogIWlzU3VjY2Vzc1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gYXJlQ2hpbGRyZW5WYWxpZChjaGlsZHJlbikge1xuICBmb3IgKHZhciBrIGluIGNoaWxkcmVuKSB7XG4gICAgaWYgKGNoaWxkcmVuW2tdLmlzRmFpbHVyZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxudmFyIHN1Y2Nlc3MgPSB7XG4gIGlzU3VjY2VzczogdHJ1ZSxcbiAgaXNGYWlsdXJlOiBmYWxzZSxcbiAgY2hpbGRyZW46IHt9XG59O1xuXG5mdW5jdGlvbiBmYWlsdXJlKGZhaWx1cmUpIHtcbiAgcmV0dXJuIHtcbiAgICB2YWxpZGF0aW9uOiB7ZmFpbHVyZTpmYWlsdXJlfSxcbiAgICBpc1N1Y2Nlc3M6IGZhbHNlLFxuICAgIGlzRmFpbHVyZTogdHJ1ZVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdmFsaWRhdGU6dmFsaWRhdGUsIHZhbGlkYXRlT25seTp2YWxpZGF0ZU9ubHksXG4gIHN1Y2Nlc3M6c3VjY2VzcywgZmFpbHVyZTpmYWlsdXJlLFxuICBkZXNlcmlhbGl6ZU9ubHk6ZGVzZXJpYWxpemVPbmx5LCBzZXJpYWxpemU6c2VyaWFsaXplXG59O1xuIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gKHdpbmRvdy5fX1JlYWN0U2hpbS5lbXB0eUZ1bmN0aW9uKTtcbnZhciBpc1N0cmluZyAgICAgID0gcmVxdWlyZSgnLi9pc1N0cmluZycpO1xuXG52YXIgc3VjY2VzcyA9IHtmYWlsdXJlOiB1bmRlZmluZWR9O1xudmFyIGNvbW1vbkZhaWx1cmUgPSB7ZmFpbHVyZTogJ2ludmFsaWQgdmFsdWUnfTtcblxuZnVuY3Rpb24gaXNTdWNjZXNzKHZhbGlkYXRpb24pIHtcbiAgcmV0dXJuIHZhbGlkYXRpb24uZmFpbHVyZSA9PT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBpc0ZhaWx1cmUodmFsaWRhdGlvbikge1xuICByZXR1cm4gdmFsaWRhdGlvbi5mYWlsdXJlICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIG1ha2UoZnVuYykge1xuICB2YXIgd3JhcHBlciA9IGZ1bmN0aW9uKHZhbHVlLCBzY2hlbWEpICB7XG4gICAgdmFyIG1heWJlRmFpbHVyZSA9IGZ1bmModmFsdWUsIHNjaGVtYSk7XG4gICAgaWYgKG1heWJlRmFpbHVyZSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHN1Y2Nlc3M7XG4gICAgfVxuICAgIGlmIChtYXliZUZhaWx1cmUgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gY29tbW9uRmFpbHVyZTtcbiAgICB9XG4gICAgaWYgKGlzU3RyaW5nKG1heWJlRmFpbHVyZSkpIHtcbiAgICAgIHJldHVybiB7ZmFpbHVyZTogbWF5YmVGYWlsdXJlfTtcbiAgICB9XG4gICAgcmV0dXJuIG1heWJlRmFpbHVyZTtcbiAgfTtcbiAgd3JhcHBlci5hbmRUaGVuID0gYW5kVGhlbi5iaW5kKG51bGwsIHdyYXBwZXIpO1xuICB3cmFwcGVyLmlzVmFsaWRhdG9yID0gdHJ1ZTtcbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRvckVtcHR5KGZ1bmMpIHtcbiAgaWYgKCFmdW5jKSB7XG4gICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlO1xuICB9XG4gIGlmIChmdW5jLmlzVmFsaWRhdG9yKSB7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cblxuICByZXR1cm4gbWFrZShmdW5jKTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdG9yKGZ1bmMpIHtcbiAgaWYgKCFmdW5jKSB7XG4gICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlO1xuICB9XG4gIGlmIChmdW5jLmlzVmFsaWRhdG9yKSB7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cblxuICB2YXIgd3JhcHBlciA9IGZ1bmN0aW9uKHZhbHVlLCBzY2hlbWEpIFxuICAgIHtyZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/XG4gICAgICB0cnVlIDpcbiAgICAgIGZ1bmModmFsdWUsIHNjaGVtYSk7fTtcblxuICByZXR1cm4gbWFrZSh3cmFwcGVyKTtcbn1cblxuZnVuY3Rpb24gYW5kVGhlbihmaXJzdCwgc2Vjb25kKSB7XG4gIGlmICghc2Vjb25kKSB7XG4gICAgcmV0dXJuIGZpcnN0O1xuICB9XG5cbiAgc2Vjb25kID0gdmFsaWRhdG9yKHNlY29uZCk7XG5cbiAgdmFyIHdyYXBwZXIgPSBmdW5jdGlvbih2YWx1ZSwgc2NoZW1hKSAge1xuICAgIHZhciB2YWxpZGF0aW9uID0gZmlyc3QodmFsdWUsIHNjaGVtYSk7XG4gICAgcmV0dXJuIGlzRmFpbHVyZSh2YWxpZGF0aW9uKSA/XG4gICAgICB2YWxpZGF0aW9uIDpcbiAgICAgIHNlY29uZCh2YWx1ZSwgc2NoZW1hKTtcbiAgfTtcblxuICByZXR1cm4gbWFrZSh3cmFwcGVyKTtcbn1cblxudmFyIGV4aXN0cyA9IHZhbGlkYXRvckVtcHR5KGZ1bmN0aW9uKHZhbHVlLCBzY2hlbWEpIFxuICB7cmV0dXJuIHNjaGVtYS5yZXF1aXJlZCAmJiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgP1xuICAgICd2YWx1ZSBpcyByZXF1aXJlZCcgOlxuICAgIHRydWU7fSk7XG5cbnZhciBub25FbXB0eSA9IHZhbGlkYXRvcihmdW5jdGlvbih2YWx1ZSwgc2NoZW1hKSBcbiAge3JldHVybiBzY2hlbWEubm9uRW1wdHkgJiYgdmFsdWUubGVuZ3RoID09PSAwID9cbiAgICAnYXQgbGVhc3Qgb25lIGl0ZW0gaXMgcmVxdWlyZWQnIDpcbiAgICB0cnVlO30pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdmFsaWRhdG9yRW1wdHk6dmFsaWRhdG9yRW1wdHksXG4gIHZhbGlkYXRvcjp2YWxpZGF0b3IsXG5cbiAgaXNTdWNjZXNzOmlzU3VjY2VzcyxcbiAgaXNGYWlsdXJlOmlzRmFpbHVyZSxcblxuICBzdWNjZXNzOnN1Y2Nlc3MsXG4gIGV4aXN0czpleGlzdHMsXG4gIG5vbkVtcHR5Om5vbkVtcHR5XG59O1xuIl19
