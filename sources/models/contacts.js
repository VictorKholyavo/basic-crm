export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: function(obj){
			obj.value = obj.FirstName + " " + obj.LastName;
			if (obj.id) {
				var parser = webix.Date.strToDate("%d-%m-%Y");
				obj.StartDate = parser(obj.StartDate);
			}
		},
	},
});
