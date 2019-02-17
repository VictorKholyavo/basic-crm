import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
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
								{
									view:"button",
									localId:"addContact",
									value: "Add contact",
									click:() => {
										this.show("formContact");
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
		});
	}
	urlChange(){
		contacts.waitData.then(() => {
			const list = this.$$("listForContacts");
			var id = this.getParam("id");
			id = id || contacts.getFirstId();
			if (id && list.exists(id)) {
				list.select(id);
			}
			if (!contacts.exists(id)) {
				id = contacts.getFirstId();
				this.setParam("id", id, true);
			}
			// this.show("detailes");
		});
	}
}
