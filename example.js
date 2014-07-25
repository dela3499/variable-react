/** @jsx React.DOM */

var pluralize = function (singular, plural, num) {
        return num == 1 ? singular : plural;
    };

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

var SomeComponent = React.createClass({
    getInitialState: function () {
        return {payrate: 15,
               hours: 8,
               days: 5,
               weeks: 3};
    },
    render: function () {
        var t = this;
        var format = function (x) {
            var value = Math.floor(x),
                noun = value == 1 ? "banana" : "bananas";
            return value + " " + noun + " ";
        };
        var payrate = <Variable 
                        value={t.state.payrate} 
                        limits={[0,100]} 
                        sensitivity={1} 
                        format={function (value) {return "$" + value}}
                        transformation={function (x) {return Math.floor(x)}}
                        callback={function (x) {t.setState({payrate: x})}}
                      />,
            hours   = <Variable 
                        value={t.state.hours} 
                        limits={[0,24]} 
                        sensitivity={1} 
                        format={function (value) {return value + " " + pluralize("hour", "hours", value)}}
                        transformation={function (x) {return Math.floor(x)}}
                        callback={function (x) {t.setState({hours: x})}}
                      />,
            days    = <Variable 
                        value={t.state.days} 
                        limits={[0,7]} 
                        sensitivity={1} 
                        format={function (value) {
                            return value + " " + pluralize("day", "days", value)}}
                        transformation={function (x) {return Math.floor(x)}}
                        callback={function (x) {t.setState({days: x})}}
                      />, 
            weeks   = <Variable 
                        value={t.state.weeks} 
                        limits={[0,10]} 
                        sensitivity={1} 
                        format={function (value) {return value + " " + pluralize("week", "weeks", value)}}
                        transformation={function (x) {return Math.floor(x)}}
                        callback={function (x) {t.setState({weeks: x})}}
                      />,
            rawTotal = Math.floor(t.state.payrate * t.state.hours * t.state.days * (52 - t.state.weeks)),
            total = "$" + (rawTotal).formatMoney(0);
        return (
            <div>
                I get paid {payrate} per hour. <br/>
                I work {hours} a day. <br/>
                I go to work {days} a week. <br/>
                    
                <div id="total">So I make <span className="value">{total}</span> a year.</div>
            
            </div>
        );
    }
});


React.renderComponent(
    <SomeComponent/>,
    document.getElementById('content')
);