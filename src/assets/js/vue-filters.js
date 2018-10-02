import Vue from 'Vue'

Vue.filter(
    'dateFormat', function (value) {
        if(value) {
            value = value.replace(/T/, ' ');
            return value;
        }
    }
);
var dateFormat = Vue.filter('dateFormat');

export {dateFormat}

