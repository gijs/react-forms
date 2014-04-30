/**
 * @jsx React.DOM
 */

(function() {
'use strict';

var Form              = ReactForms.Form;
var FormFor           = ReactForms.FormFor;
var Schema            = ReactForms.schema.Schema;
var List              = ReactForms.schema.List;
var Property          = ReactForms.schema.Property;
var RepeatingFieldset = ReactForms.RepeatingFieldset;

var UndoStack = {

  getInitialState: function() {
    return {undo: [], redo: []};
  },

  snapshot: function() {
    var undo = this.state.undo.concat(this.getStateSnapshot());
    this.setState({undo:undo, redo: []});
  },

  hasUndo: function() {
    return this.state.undo.length > 0;
  },

  hasRedo: function() {
    return this.state.redo.length > 0;
  },

  redo: function() {
    this._undoImpl(true);
  },

  undo: function() {
    this._undoImpl();
  },

  _undoImpl: function(isRedo) {
    var undo = this.state.undo.slice(0);
    var redo = this.state.redo.slice(0);
    var snapshot;

    if (isRedo) {
      if (redo.length === 0) {
        return
      }
      snapshot = redo.pop();
      undo.push(this.getStateSnapshot());
    } else {
      if (undo.length === 0) {
        return
      }
      snapshot = undo.pop();
      redo.push(this.getStateSnapshot());
    }

    this.setStateSnapshot(snapshot);
    this.setState({undo:undo, redo:redo});
  }
};

function Product(props) {
  props = props || {};
  return (
    Schema( {required:props.required, name:props.name, label:props.label}, 
      Property( {name:"name", label:"Name"} ),
      Property( {type:"number", name:"price", label:"Price"} )
    )
  );
}

var Products = (
  List( {label:"Products"}, 
    Product(null )
  )
);

var UndoControls = React.createClass({displayName: 'UndoControls',
  render: function() {
    return (
      React.DOM.div( {className:"UndoControls"}, 
        React.DOM.button(
          {disabled:!this.props.hasUndo,
          onClick:this.props.onUndo,
          type:"button", className:"btn btn-info btn-xs"}, 
          "⟲ Undo"
        ),
        React.DOM.button(
          {disabled:!this.props.hasRedo,
          onClick:this.props.onRedo,
          type:"button", className:"btn btn-info btn-xs"}, 
          "⟳ Redo"
        )
      )
    );
  }
});

var FormWithUndo = React.createClass({displayName: 'FormWithUndo',
  mixins: [ReactForms.FormMixin, UndoStack],

  getStateSnapshot: function() {
    return {value: this.valueLens().val()};
  },

  setStateSnapshot: function(snapshot) {
    this.onValueUpdate(snapshot.value);
  },

  render: function() {
    return this.transferPropsTo(
      React.DOM.form( {className:"Form"}, 
        UndoControls(
          {hasUndo:this.hasUndo(),
          hasRedo:this.hasRedo(),
          onUndo:this.undo,
          onRedo:this.redo}
          ),
        RepeatingFieldset(
          {onRemove:this.snapshot,
          onAdd:this.snapshot} )
      )
    );
  }
});

React.renderComponent(
  ShowValue( {onUpdate:true, horizontal:true}, 
    FormWithUndo( {schema:Products, value:[{name: 'TV', price: 1000}]} )
  ),
  document.getElementById('example')
);

})();
