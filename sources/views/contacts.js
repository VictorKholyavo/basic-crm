import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import DetailedView from "./detailes.js";

export default class StartView extends JetView {
	config(){
		return {
			cols: [
				{
					cols: [
						{
							rows: [
								{
									view:"list",
									localId:"listForContacts",
									type: {
										height: 65,
										template: "<div class='overall'><div class='title'>#FirstName# #LastName#</div><div class='year'>#Company#</div> </div>",
									},
									width: 400,
									select: true,
									borderless: true,
									css:"webix_shadow_medium",
									on:{
										onAfterSelect: (id) => {
											this.setParam("id", id, true);
										}
									},
								},
								{
									view:"button",
									localId:"addContact",
									value: "Add contact"
								}
							]
						},
						{
							rows: [
								DetailedView
							]
						}
					]
				}
			]
		};
	}
	init(){
		this.$$("listForContacts").sync(contacts);
	}
	urlChange(){
		contacts.waitData.then(() => {
			const list = this.$$("listForContacts");
			let id = this.getParam("id");
			if (!id || !contacts.exists(id)) {
				id = contacts.getFirstId();
				this.setParam("id", id, true);
			}
			list.select(id);
		});
	}
}
