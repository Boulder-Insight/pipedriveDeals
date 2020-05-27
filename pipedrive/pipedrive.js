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
        //schemas were getting large so I made a seperate schema file titled pipedriveSchemas.js
        cols = schema(arg.selected)
        var tableSchema = {
            id: "pipedriveDealTimeline",
            alias: "Timeline of deals divided into blocks of time",
            columns: cols
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
                    "total_currency_converted_value": feat.total_currency_converted_value,
                    "total_weighted_currency_converted_value": feat.total_weighted_currency_converted_value,
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
                    //this giant block of code gives me pain, but idk any other way
                    for (var j = 0, lenj = feat[i].deals.length; j < lenj; j++) {
                        tableData.push({
                            "period_start": feat[i].period_start,
                            "period_end": feat[i].period_end,
                            "id": feat[i].deals[j].id,
                            "creator_user_id": feat[i].deals[j].creator_user_id,
                            "user_id": feat[i].deals[j].user_id,
                            "person_id": feat[i].deals[j].person_id,
                            "org_id": feat[i].deals[j].org_id,
                            "stage_id": feat[i].deals[j].stage_id,
                            "title": feat[i].deals[j].title,
                            "value": feat[i].deals[j].value,
                            "add_time": feat[i].deals[j].add_time,
                            "update_time": feat[i].deals[j].update_time,
                            "active": feat[i].deals[j].active,
                            "status": feat[i].deals[j].status,
                            "probability": feat[i].deals[j].probability,
                            "last_activity_id": feat[i].deals[j].last_activity_id,
                            "last_activity_date": feat[i].deals[j].last_activity_date,
                            "pipeline_id": feat[i].deals[j].pipeline_id,
                            "won_time": feat[i].deals[j].won_time,
                            "first_won_time": feat[i].deals[j].first_won_time,
                            "lost_time": feat[i].deals[j].lost_time,
                            "notes_count": feat[i].deals[j].notes_count,
                            "email_messages_count": feat[i].deals[j].email_messages_count,
                            "activities_count": feat[i].deals[j].activities_count,
                            "done_activities_count": feat[i].deals[j].done_activities_count,
                            "undone_activities_count": feat[i].deals[j].undone_activities_count,
                            "reference_activities_count": feat[i].deals[j].reference_activities_count,
                            "participants_count": feat[i].deals[j].participants_count,
                            "expected_close_date": feat[i].deals[j].expected_close_date,
                            "last_incoming_mail_time": feat[i].deals[j].last_incoming_mail_time,
                            "last_outgoing_mail_time": feat[i].deals[j].last_outgoing_mail_time,
                            "stage_order_nr": feat[i].deals[j].stage_order_nr,
                            "person_name": feat[i].deals[j].person_name,
                            "org_name": feat[i].deals[j].org_name,
                            "formatted_value": feat[i].deals[j].formatted_value,
                            "weighted_value": feat[i].deals[j].weighted_value,
                            "formatted_weighted_value": feat[i].deals[j].formatted_weighted_value,
                            "rotten_time": feat[i].deals[j].rotten_time,
                            "owner_name": feat[i].deals[j].owner_name,
                            "cc_email": feat[i].deals[j].cc_email
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
