const parser = webix.Date.strToDate("%d-%m-%Y %H:%i");
const saveParser = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: function(obj){
			obj.DueDate = parser(obj.DueDate);
		},
		$save: function(obj){
			obj.DueDate = saveParser(obj.DueDate);
		}
	},
});
