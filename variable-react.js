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
     limits (array with two element: [minimum value and maximum value]
    
    Optional Properties: 
     callback (calls this function on every state change, with current value as argument)
     init
     dragRange (mouse covers entire range of values after moving this many pixels)
     format  (a function to prepare numerical value for display - e.g. rounding, date/time formatting, currency)
    
    Notes: 
     1. this component produces a <span> element with a class called "variable" (use this for styling)
    */
    getInitialState: function () {
        return {value: this.props.init || average(this.props.limits), 
                dragging: false};
    },
    componentDidMount: function () {
        var t = this;
        $(document).mousemove(function (e) {
            if (t.state.dragging) {
                var range = t.props.limits[1] - t.props.limits[0],
                    dragRange = t.props.dragRange || 100,
                    mouseY = e.clientY || e.pageY,
                    value = saturate(t.state.startVal + (range)*(-(mouseY - t.state.mouseY0)/dragRange), t.props.limits);
                t.setState({value: value});
            };
        });
        var f = t.props.callback;
        setInterval(function () {
            if (t.state.dragging) {
                if (f) { f(t.state.value) }; //not sure how to handle callback. If callback sets parent state, then child component updates again without needing to.
            }
        }, 100);
    },
    handleMouseDown: function (e) {
        var component = this;
        this.setState({dragging: true, 
                       startVal: this.state.value,
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
            {format(this.state.value)}
            </span>
        );
    }
});