import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";

export default class DetailedView extends JetView{
	config(){
		return {
			cols: [
				{
					view:"template",
					localId: "detailedInfo",
					template: "<div class='one'><span class='nameOfContact'>#FirstName# #LastName#<span><span class='photo'>#Photo#</span><span>#status#</span></div><div class='one'><span></span><span></span><span class='webix_icon fas fa-envelope'> #Email#</span> <span class='webix_icon fab fa-skype'> #Skype#</span> <span class='webix_icon fas fa-tag'> #Job#</span> <span class='webix_icon fas fa-briefcase'> #Company#</span></div> <div class='one'><span></span><span></span><span class='webix_icon far fa-calendar-alt'> #Birthday#</span><span class='webix-icon fas fa-map-marker-alt'> #Address#</span></div>",
				},
				{
					rows: [
						{
							cols: [
								{
									view: "button",
									value: "Delete",
									width: 70,
								},
								{
									view: "button",
									value: "Edit",
									width: 70,
								},
							]
						},
						{}
					]
				}
			]
		};
	}
	init(){

	}
	urlChange() {
		webix.promise.all ([
			contacts.waitData,
			statuses.waitData,
		]).then(() => {
			let id = this.getParam("id", true);
			let template = this.$$("detailedInfo");
			id = id || contacts.getFirstId();
			if (!contacts.exists(id)) {
				id = contacts.getFirstId();
				this.setParam("id", id, true);
			}
			let values = webix.copy(contacts.getItem(id));
			if (values) {
				if (values && values.StatusID && statuses.getItem(values.StatusID).Value) {
						values.status = statuses.getItem(values.StatusID).Value;
				}
				else {
					values.status = "data is not available"
				}
				template.parse(values);
			}
		});
	}
}
