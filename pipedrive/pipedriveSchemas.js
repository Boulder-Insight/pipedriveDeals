schema = function(selected){
    if (selected == "summary?") {
        //schema for summary function
        var cols = [{
            id: "total_count",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "total_currency_converted_value",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "total_weighted_currency_converted_value",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "total_currency_converted_value_formatted",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "total_weighted_currency_converted_value_formatted",
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
            id: "creator_user_id",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "user_id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "person_id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "org_id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "stage_id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "title",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "value",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "add_time",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "update_time",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "active",
            dataType: tableau.dataTypeEnum.bool
        }, {
            id: "status",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "probability",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "last_activity_id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "last_activity_date",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "pipeline_id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "won_time",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "first_won_time",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "lost_time",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "notes_count",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "email_messages_count",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "activities_count",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "done_activities_count",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "undone_activities_count",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "reference_activities_count",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "participants_count",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "expected_close_date",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "last_incoming_mail_time",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "last_outgoing_mail_time",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "stage_order_nr",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "person_name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "org_name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "formatted_value",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "weighted_value",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "formatted_weighted_value",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "rotten_time",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "owner_name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "cc_email",
            dataType: tableau.dataTypeEnum.string
        }];
    };
    return cols;
};