/** @jsx React.DOM */


var average = function (myArray) {
    var sum = 0;
    for (var i = 0; i < myArray.length; i++) {
        sum += myArray[i];
    };
    return sum / myArray.length;
};

var saturate = function (value,limits) {
    var min = Math.min(limits[0],limits[1]);
    var max = Math.max(limits[0],limits[1]);
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    };
    return value;
};

var Variable = React.createClass({
    /*
    Required Properties: 
     value
     limits (array with two element: [minimum value and maximum value]
     callback (calls this function on every state change, with current value as argument / use this callback to set the value property of this component)
    
    Optional Properties: 
     sensitivity (the greater the sensitivity, the quicker the mouse moves through the range of provided values)
     format  (a function to prepare numerical value for display - e.g. date/time formatting, currency)
     transformation (function to transform the value itself, rather than just its display. Use for rounding, primarily)
    
    Notes: 
     1. this component produces a <span> element with a class called "variable" (use this for styling)
    */
    getInitialState: function () {
        return {dragging: false};
    },
    componentDidMount: function () {
        var t = this;
        var currentValue = this.props.value;
        $(document).mousemove(function (e) {
            if (t.state.dragging) {
                var range = t.props.limits[1] - t.props.limits[0],
                    dragRange = 100 / (t.props.sensitivity || 1),
                    mouseY = e.clientY || e.pageY;
                currentValue = saturate(t.state.startVal + (range)*(-(mouseY - t.state.mouseY0)/dragRange), t.props.limits);
            };
        });
        var f = t.props.callback;
        var transform = this.props.transformation || function (x) {return x};
        setInterval(function () {
            if (t.state.dragging) {
                f(transform(currentValue));
            }
        }, 10);
    },
    handleMouseDown: function (e) {
        var component = this;
        this.setState({dragging: true, 
                       startVal: this.props.value,
                       mouseY0: (e.clientY || e.pageY)});
        $("body").css({cursor: "ns-resize"});
        $(document).one("mouseup", function () {
            component.setState({dragging: false});
            $("body").css({cursor: ""});
        });
    },
    handleMouseOver: function (e) {
        $(e.target).css({cursor:"ns-resize"});
    },
    render: function () {
        var format = this.props.format || function (x) {return x};
        return (
            <span className="variable" onMouseDown={this.handleMouseDown} onMouseOver={this.handleMouseOver}>
            {format(this.props.value)}
            </span>
        );
    }
});