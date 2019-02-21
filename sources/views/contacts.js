import {JetView} from "webix-jet";
import {contacts} from "models/contacts";

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
										template: (obj) => {
											let photo = "";
											if (!obj.Photo) {
												photo = "<img class='defaultPhoto'>";
											}
											else {
												photo = "<img src ="+obj.Photo+" class='photo_icon'>";
											}
											return "<div class='list'>" + photo + "</div><div class='overall list'><div class='title list'>"+obj.FirstName + " " + obj.LastName + "</div><div class='year'>" + obj.Company + "</div></div>";
										}
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
		contacts.waitData.then(() => {
			this.show("detailes");
		});
		webix.dp(contacts).attachEvent("onAfterInsert", function(response){
			list.select(response.id);
		});
		this.on(this.app, "CloseTheFormAndShowDetails", () => {
			this.show("detailes");
			list.enable();
		});
	}
	urlChange(){
		contacts.waitData.then(() => {
			const list = this.$$("listForContacts");
			let id = this.getParam("id");
			if (!contacts.exists(id)) {
				id = contacts.getFirstId();
				this.setParam("id", id, true);
			}
			list.select(id);
		});
	}
}
