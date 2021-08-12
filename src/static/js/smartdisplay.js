var Screendle = function() {
    var that = this;

    /***
     * Clock Module
     * 
     * Displays current time and Date, with localizable months and weekdays.
     * Seconds are not displayed to avoid updating the ePaper screen too often.
     * The displayed time is still accurate to about 1 second.
     * 
     * Depends on Clock Offset Module
     */
     that.clock = new function(screendle) {
        var that = this;

        that.dateElem = null;
        that.timeElem = null;

        /**
         * attach to a DOM element
         * @access private
         * @param {DOMNode} elem
         */
        that._attach = function(elem) {
            elem.innerHTML = '<div id="date"></div><div id="time"></div>';
            that.dateElem = elem.querySelector('#date');
            that.timeElem = elem.querySelector('#time');
        };

        /**
         * Update the Clock
         * @access private
         */
        that._tick = function() {
            // this function gets called every second, so we try to make it cheap
            // - no DOM lookups
            // - also no jQuery
            // - only update HTML if it actually has changed (prevents screen updates and conserves energy)

            $.get('/time', function(data, textStatus, jqXHR) {
                time = data;

                var formattedTime = time;
    
                if (that.timeElem.innerHTML != formattedTime) {
                    // time has changed
                    that.timeElem.innerHTML = formattedTime;
                }
            });

            $.get('/date', function(data, textStatus, jqXHR) {
                date = data;

                var formattedDate = date;
    
                if (that.dateElem.innerHTML != formattedDate) {
                    // date has changed
                    that.dateElem.innerHTML = formattedDate;
                }
            });


        };

        /**
         * Start the clock module
         * @param {DOMNode} elem - DOM Node into which the output will be rendered
         */
        that.start = function(elem) {
            that._attach(elem);
            that._tick();
            window.setInterval(that._tick, 10 * 1000);
        };

    }(that);

    /***
     * Blackout Module
     *
     * The Kindle ePaper screen accumulates ghosting and shadows of old contents over time.
     * The easiest way to get rid of that is to periodically fill the entire screen with solid black.
     * We do this by setting the background color to black and hiding the body for 500ms every 3 hours.
     */
     that.blackout = new function(screendle) {
        var that = this;

        that.$body = null;

        /**
         * Attach to HTML Body
         * @access private
         * @param {DOMNode} body - DOM Node of HTML body element
         */
        that._attach = function(body) {
            that.$body = $(body);
        };

        /**
         * black out the entire body
         * @access private
         */
        that._blackout = function() {
            that.$body.css('background', '#000').css('opacity', 0);
        };

        /**
         * reactivate the body (undoes the blackout)
         * @access private
         */
        that._reactivate = function() {
            that.$body.css('background', '').css('opacity', 1)
        };

        /**
         * black out and reactivate after a short period
         * @access private
         */
        that._tick = function() {
            that._blackout();
            window.setTimeout(that._reactivate, 500);
        };

        /**
         * Start the blackout module
         * @param {DOMNode} body - DOM Node of HTML body element
         */
        that.start = function(body) {
            that._attach(body);
            window.setInterval(that._tick, 3 * 60 * 60 * 1000);
        };

    }(that);    

        /***
     * Weather Module
     * 
     * Shows the current temperature and weather conditions as well as a 
     * (scrollable) forecast of the next few hours.
     * 
     * Depends on Clock Offset Module
     */
         that.weather = new function(screendle) {
            var that = this;
    
            that._data = null;
            that.$tempElem = null;
            that.$summaryElem = null;
            that.$forecastSummaryElem = null;
            that.$forecastElem = null;
            that._numForecastHours = 14;
    
            /**
             * attach to HTML element
             * @access private
             * @param {DOMNode} weatherElem - DOM Node into which the output will be rendered
             */
            that._attach = function(weatherElem) {
                var html = '';
                html += '<table><tbody>';
                html += '  <tr><td id="temp" rowspan="2"><td id="forecasticon" rowspan="2"></td><td id="summary"></td></tr>';
                html += '  <tr><td id="forecast-summary"></td></tr>';
                html += '</tbody></table>';
                html += '<hr>';
                html += '<div id="forecast"></div>';
                weatherElem.innerHTML = html;
                that.$tempElem = $('#temp', weatherElem);
                that.$summaryElem = $('#summary', weatherElem);
                that.$forecastSummaryElem = $('#forecast-summary', weatherElem);
                that.$forecastElem = $('#forecast', weatherElem);
                that.$forecastIcon = $('#forecasticon', weatherElem);
            };
    
            /**
             * render weather data into HTML output
             * @access private
             * @param {object} weather - weather data as returned from the API
             * @returns {string} weather data HTML
             */
            that._render = function(weather) {
                if (!weather) {
                    // this function might get called before data has been loaded
                    return;
                }
    
                // render current temperature, summary and broad forecast
                that.$tempElem.html(Math.round(weather.current.temp) + '° C');
                that.$summaryElem.html(weather.current.weather[0].description);
                that.$forecastSummaryElem.html(weather.daily[0].weather[0].description);
                that.$forecastIcon.html('<img src="https://openweathermap.org/img/wn/' + weather.current.weather[0].icon + '@2x.png">')
    
                // render hourly forecast
                var forecastHtml = '';
                forecastHtml += '<table><tbody>';
    
                // render the hour labels
                forecastHtml += '<tr class="hours">';
                for (var i = 1; i < that._numForecastHours; ++i) {
                    var hour = weather.hourly[i];
                    var hourTs = hour.dt;
                    forecastHtml += '<td>';
                    forecastHtml += hourTs;
                    forecastHtml += '</td>';
                }
                forecastHtml += '</tr>';
    
                // render the temperatures for every hour
                forecastHtml += '<tr class="temperatures">';
                for (var i = 1; i < that._numForecastHours; ++i) {
                    var hour = weather.hourly[i];
                    forecastHtml += '<td>' + Math.round(hour.temp) + '°' +'</td>';
                }
                forecastHtml += '</tr>';
    

                // render the icon for every hour
                forecastHtml += '<tr class="summaries">';
                for (var i = 1; i < that._numForecastHours; ++i) {
                    var hour = weather.hourly[i];
                    forecastHtml += '<td>' + '<img src="' +
                                    'https://openweathermap.org/img/wn/' +
                                    hour.weather[0].icon + '@2x.png">'
                                    +'</td>';
                }
                forecastHtml += '</tr>';

                // render the short summaries for every hour
                forecastHtml += '<tr class="summaries">';
                for (var i = 1; i < that._numForecastHours; ++i) {
                    var hour = weather.hourly[i];
                    forecastHtml += '<td>' + hour.weather[0].description +'</td>';
                }
                forecastHtml += '</tr>';
    
                forecastHtml += '</tbody></table>';
                that.$forecastElem.html(forecastHtml);
            };
    
            /**
             * fetch new weather data from backend and render it
             * @access private
             */
            that._tick = function() {
                $.get('/weather', function(data, textStatus, jqXHR) {
                    that._data = data;
                    that._render(data);
                });
            };
    
            /**
             * Start the weather module
             * @param {DOMNode} elem - DOM Node into which the output will be rendered
             */
            that.start = function(elem) {
                that._attach(elem);
                that._tick();
                window.setInterval(that._tick, 3 * 60 * 1000);
            };
        }(that);
    
        /***
         * Public Transport Module
         */
        that.publicTransport = new function(screendle) {
            var that = this;
    
            that.$bussesElem = null;
            that.$trainsElem = null;
    
            /**
             * attach to HTML Element
             * @access private
             * @param {DOMNode} elem - DOM Node into which the output will be rendered
             */
            that._attach = function(elem) {
                var html = '';
                html += '<table id="departures">';
                html += '    <tr>';
                html += '        <td id="busses"></td>';
                html += '        <td id="trains"></td>';
                html += '    </tr>';
                html += '</table>';
                elem.innerHTML = html;
                that.$bussesElem = $('#busses', elem);
                that.$trainsElem = $('#trains', elem);
            };
    
            /**
             * render departure data into HTML
             * @access private
             * @param {object} departures - departure data received from API
             * @param {string} caption - caption for output table
             * @returns {string} HTML of rendered output
             */
            that._render = function(departures, caption) {
                var html = '';
                html += '<table>';
                html += '<caption>' + caption + '</caption>';
                html += '<tbody>'
                for (var i in departures) {
                    if (i >= 5) {
                        break;
                    }
                    html += '<tr class="' + (i%2 == 0 ? 'even' : 'odd') + '">';
                    html += '<td class="line">' + departures[i].label + '</td>';
                    html += '<td class="direction">' + departures[i].destination.replace(/ \(.*\)$|, .*$/, '') + '</td>';
                    html += '<td class="time">';
                    if (departures[i].cancelled) {
                        html += '<del>' + departures[i].formatedTime + '</del>';
                    }
                    else {
                        html += departures[i].formatedTime;
                    }
                    if (departures[i].delay) {
                        html += '<span class="delay"> ' + departures[i].delay + '</span>';
                    }
                    html += '</td>';
                    html += '</tr>';
                }
                html += '</tbody></table>';
                return html;
            };
    
            /**
             * get new departure data from backend
             * @access private
             * @param {string} endpoint - API endpoint (URL or path) to call
             * @param {string} $elem - jQuery object into which the output will be rendered
             * @param {string} caption - caption for output HTML
             */
            that._tick = function(endpoint, $elem, caption) {
                $.get(endpoint, function(data, textStatus, jqXHR) {
                    $elem.html(that._render(data, caption));
                });
            };
    
            /**
             * Start public transport module
             * @param {DOMNode} elem - DOM Node into which the output will be rendered
             * @param {string} bussesCaption - caption for busses output
             * @param {string} trainsCaption - caption for trains output
             */
            that.start = function(elem, bussesCaption, trainsCaption) {
                that._attach(elem);
                that._tick('/busses', that.$bussesElem, bussesCaption);
                that._tick('/trains', that.$trainsElem, trainsCaption);
                window.setInterval(that._tick, 1 * 60 * 1000, '/busses', that.$bussesElem, bussesCaption);
                window.setInterval(that._tick, 2 * 60 * 1000, '/trains', that.$trainsElem, trainsCaption);
            };
    
        }(that);

};