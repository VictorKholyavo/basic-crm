import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";
import {activities} from "models/activities";
import ContactActivities from "./contactActivities";
import FileTable from "./filesofContacts";

export default class DetailedView extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					cols: [
						{
							view:"template",
							localId: "detailedInfo",
							template: "<div class='one'><span class='nameOfContact'>#FirstName# #LastName#<span><span><img  class='photo' src='#Photo#'></span><span>#status#</span></div><div class='one'><span></span><span></span><span class='webix_icon fas fa-envelope'> #Email#</span> <span class='webix_icon fab fa-skype'> #Skype#</span> <span class='webix_icon fas fa-tag'> #Job#</span> <span class='webix_icon fas fa-briefcase'> #Company#</span></div> <div class='one'><span></span><span></span><span class='webix_icon far fa-calendar-alt'>#template#</span><span class='webix-icon fas fa-map-marker-alt'> #Address#</span></div>",
						},
						{
							rows: [
								{
									cols: [
										{
											view: "button",
											value: "Delete",
											width: 120,
											click: () => {
												webix.confirm(
													{
														title:"Delete?",
														ok:"Yes",
														cancel:"No",
														text:"Deleting cannot be undone. Delete?",
														callback: (result) => {
															if (result) {
																let id = this.getParam("id", true);
																contacts.remove(id);
																activities.find(function(obj){
																	if (obj.ContactID == id) {
																		activities.remove(obj.id);
																	}
																});
																return false;
															}
														}
													}
												);
											},
											label: _("Delete")
										},
										{
											view: "button",
											value: "Edit",
											width: 120,
											click:() => {
												this.show("formContact?mode=edit");
											},
											label: _("Edit")
										},
									]
								},
								{}
							]
						}
					]
				},
				{
					view:"tabview",
					localId:"tabs",
					cells:[
						{ header:_("Activities"), body: ContactActivities },
						{ header:_("Files"), body: FileTable }
					],
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
			let values = webix.copy(contacts.getItem(id));
			if (values) {
				if (values && values.StatusID && statuses.exists(values.StatusID)) {
					values.status = statuses.getItem(values.StatusID).Value;
				}
				else {
					values.status = "Status not available";
				}
				template.parse(values);
			}
		});
	}
}
