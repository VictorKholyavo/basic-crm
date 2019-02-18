export const files = new webix.DataCollection({
	data: [],
	scheme: {
		$init: function(obj){
			obj.date = obj.file.lastModifiedDate
		}
	}
});
