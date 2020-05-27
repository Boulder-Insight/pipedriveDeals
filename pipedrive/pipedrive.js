(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();
    // // Init function for connector, called during every phase
    // myConnector.init = function(initCallback) {
    // tableau.authType = tableau.authTypeEnum.custom;
    // initCallback();
    // }

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var arg = JSON.parse(tableau.connectionData);
        if (arg.selected == "summary?") {
            //schema for summary function
            var cols = [{
                id: "total_count",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "total_currency_converted_value_formatted",
                alias: "value",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "total_weighted_currency_converted_value_formatted",
                alias: "weighted_value",
                dataType: tableau.dataTypeEnum.string
            }];
            
            var tableSchema = {
                id: "pipedriveDealSummary",
                alias: "Summary of all deals within criteria",
                columns: cols
            };

        } else {
            //schema for timeline function
            var cols = [{
                id: "period_start",
                dataType: tableau.dataTypeEnum.datetime
            }, {
                id: "period_end",
                dataType: tableau.dataTypeEnum.datetime
            }, {
                id: "id",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "add_time",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "active",
                dataType: tableau.dataTypeEnum.bool
            }, {
                id: "formatted_value",
                dataType: tableau.dataTypeEnum.string
            }];

            var tableSchema = {
                id: "pipedriveDealTimeline",
                alias: "Timeline of deals divided into blocks of time",
                columns: cols
            };
        };


        

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        //variable declarations
        var arg = JSON.parse(tableau.connectionData);
        var argString;
        var apicall;

        //sets the api call depending on which option was selected
        if (arg.selected == "summary?") {
            //api call for summary function
            argString = arg.selected + "status=" + arg.status + "&filter_id=" + arg.filter + "&user_id=" + arg.user + "&stage_id=" 
            + arg.stage + "&api_token=" + arg.key;
        } else {
            //api call for timeline function
            argString = arg.selected + "start_date=" + arg.startDate + "&interval="+ arg.increment +"&&amount=" + arg.amount 
            + "&field_key=add_time" + "&user_id=" + arg.user + "&pipeline_id=" + arg.pipeline + "&filter_id=" + arg.filter +"&api_token=" + arg.key;
        };
        apicall = "https://api.pipedrive.com/v1/deals/" + argString;
        tableau.log(apicall)
        $.getJSON(apicall, function(resp) {
            var feat = resp.data,
                tableData = [];
            if (arg.selected == "summary?") {
                //value assignment for summary function
                tableData.push({
                    "total_count": feat.total_count,
                    "total_currency_converted_value_formatted": feat.total_currency_converted_value_formatted,
                    "total_weighted_currency_converted_value_formatted": feat.total_weighted_currency_converted_value_formatted
                });
                    
            } else {
                //Value assignment for timeline function
                // Iterate over the blocks of time
                for (var i = 0, len = feat.length; i < len; i++) {
                    if (feat[i].deals.length == 0){
                        tableData.push({
                            "period_start": feat[i].period_start,
                            "period_end": feat[i].period_end
                        });
                    };
                    //Iterate over the inner blocks of deals within each specified block of time
                    for (var j = 0, lenj = feat[i].deals.length; j < lenj; j++) {
                        tableData.push({
                            "period_start": feat[i].period_start,
                            "period_end": feat[i].period_end,
                            "id": feat[i].deals[j].id,
                            "add_time": feat[i].deals[j].add_time,
                            "active": feat[i].deals[j].active,
                            "formatted_value": feat[i].deals[j].formatted_value
                        });
                    };
                };
            };

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            if ($("#selector").val() == "summary?") {
                //argument handling for summary function
                var arg = {
                    key: $('#key').val().trim(),
                    selected: $('#selector').val().trim(),
                    status: $('#summary_status').val().trim(),
                    filter: $('#summary_filter').val().trim(),
                    user: $('#summary_user').val().trim(),
                    stage: $('#summary_stage').val().trim()
                };
                //error catching for incorrect types of arguments
                try {
                    if (!Number.isInteger(Number(arg.filter))) throw "Filter ID must be int";
                    if (!Number.isInteger(Number(arg.user))) throw "User ID must be int";
                    if (!Number.isInteger(Number(arg.stage))) throw "Stage ID must be int";
                    tableau.connectionData = JSON.stringify(arg);
                    tableau.connectionName = "Pipedrive deal summary";
                    tableau.submit();
                } catch(err) {
                    $('#errorMsg').html(err);
                };

            } else {
                //Argument handling for timeline function
                var arg = {
                    key: $('#key').val().trim(),
                    selected: $('#selector').val().trim(),
                    startDate: $('#timeline_startDate').val().trim(),
                    increment: $('#timeline_increment').val().trim(),
                    amount: $('#timeline_amount').val().trim(),
                    user: $('#timeline_user').val().trim(),
                    pipeline: $('#timeline_pipeline').val().trim(),
                    filter: $('#timeline_filter').val().trim()
                };
                
                function isValidDate(dateStr) {
                    var d = new Date(dateStr);
                    return !isNaN(d.getDate());
                }
                //error catching for incorrect types of arguments
                try {
                    if (!isValidDate(arg.startDate)) throw "Date must be in form YYYY-MM-DD";
                    if (!Number.isInteger(Number(arg.amount))) throw "Increment must be int";
                    if (!Number.isInteger(Number(arg.user))) throw "User ID must be int";
                    if (!Number.isInteger(Number(arg.pipeline))) throw "Pipeline ID must be int";
                    if (!Number.isInteger(Number(arg.filter))) throw "Filter ID must be int";
                    tableau.connectionData = JSON.stringify(arg);
                    tableau.connectionName = "Pipedrive deal timeline";
                    tableau.submit();
                } catch(err) {
                    $('#errorMsg').html(err);
                }
            };
            
            
        });
        //changes the available arguments dependent on which function is selected
        $("#selector").on('change', function() {
            if ($("#selector").val() == "summary?") {
                $('#summary').show();
                $('#timeline').hide();
            } else {
                $('#summary').hide();
                $('#timeline').show();
            };
        });
    });
})();
