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
									editable: true,
									type: {
										height: 65,
										template: "<div class='overall'><div class='title'>#FirstName# #LastName#</div><div class='year'>#Company#</div> </div>",
									},
									autoConfig:true,
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
	init(view, url){
		this.$$("listForContacts").sync(contacts);
		const list = this.$$("listForContacts");
		contacts.waitData.then(() => {
			var id = contacts.getFirstId();
			list.select(id);
		});
	}
	urlChange(view){
		contacts.waitData.then(() => {
			const list = this.$$("listForContacts");
			var id = this.getParam("id");
			id = id || contacts.getFirstId();
			if (id && list.exists(id)) {
				this.setParam("id", id, true);
			}
		});
	}
}