export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: function(obj){
			if (obj.id) {
				var parser = webix.Date.strToDate("%d-%m-%Y %H:%i");
				obj.DueDate = parser(obj.DueDate);
			}
		}
	},
});
