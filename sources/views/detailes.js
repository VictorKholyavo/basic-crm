import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";
import FormContact from "./formContact";
import ContactActivities from "./contactActivities";

export default class DetailedView extends JetView{
	config(){
		return {
			rows: [
				{
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
											click:() => {
												this.win2.showWindow();
											}
										},
									]
								},
								{}
							]
						}
					]
				},
				{
					 view:"tabview", localId:"tabs", cells:[
              { header:"Activities", body: ContactActivities  },
              { header:"Files" }
          ]
				}
			]

		};
	}
	init(){
		this.win2 = this.ui(FormContact);
	}
	urlChange() {
		webix.promise.all ([
			contacts.waitData,
			statuses.waitData,
		]).then(() => {
			var template = this.$$("detailedInfo");
			var id = this.getParam("id", true);
			var values = contacts.getItem(id);
			if (values) {
				var item = contacts.getItem(id);
				item.status = statuses.getItem(item.StatusID).Value;
				this.$$("detailedInfo").parse(item);
				template.setValues(values);
			}
		});
	}
}
