import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";
import DetailedView from "./detailes.js";
import FormContact from "./formContact";

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
										template: "<div class='list'><img src='#Photo#' class='photo_icon'></div><div class='overall list'><div class='title list'>#FirstName# #LastName#</div><div class='year'>#Company#</div> </div>",
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
								{
									view:"button",
									localId:"addContact",
									value: "Add contact",
									click: () => {
										this.show("formContact");
										this.$$("listForContacts").disable();
									}
								}
							]
						},
						{
							$subview: true
						}
					]
				}
			]
		};
	}
	init(){
		this.$$("listForContacts").sync(contacts);

		const list = this.$$("listForContacts");
		this.on(this.app, "Close", () => {
			this.show("detailes");
			this.$$("listForContacts").enable();
		});
	}
	urlChange(){
		contacts.waitData.then(() => {
			const list = this.$$("listForContacts");
			let id = this.getParam("id");
			if (!id && !contacts.exists(id)) {
				id = contacts.getFirstId();
				this.setParam("id", id, true);
			}
			list.select(id);
		});
	}
}
