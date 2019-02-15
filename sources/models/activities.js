const parser = webix.Date.strToDate("%d-%m-%Y %H:%i");

export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: function(obj){
			obj.DueDate = parser(obj.DueDate);
		}
	},
});
