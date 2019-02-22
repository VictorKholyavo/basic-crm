const parser = webix.Date.strToDate("%d-%m-%Y %H:%i");
const saveParser = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: function(obj){
			obj.StartDate = parser(obj.StartDate);
			obj.Birthday = parser(obj.Birthday);
			obj.value = obj.FirstName + " " + obj.LastName;
		},
		$save: function(obj){
			obj.StartDate = saveParser(obj.StartDate);
			obj.Birthday = saveParser(obj.Birthday);
		}
	},
});
