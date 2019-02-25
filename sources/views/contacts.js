import {JetView} from "webix-jet";
import {contacts} from "models/contacts";

export default class StartView extends JetView {
	config(){
		const _ = this.app.getService("locale")._;

		return {
			cols: [
				{
					cols: [
						{
							rows: [
								{
									height: 35,
									view:"toolbar",
									elements:[
										{
											view:"text",
											localId:"list_input",
											css:"fltr",
										}
									]
								},
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
									},
									label: _("Add Contact")
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
		contacts.filter();
		const list = this.$$("listForContacts");
		list.sync(contacts);

		function equals(a,b){
			a = a.toString().toLowerCase();
			return a.indexOf(b) !== -1;
		}

		contacts.waitData.then(() => {
			this.show("detailes");
			this.$$("list_input").attachEvent("onTimedKeyPress",function(){
				let value = this.getValue().toLowerCase();
				if (!value) return contacts.filter();


				contacts.filter(function(obj){
					if (equals(obj.FirstName, value)) return true;
					if (equals(obj.LastName, value)) return true;
					if (equals(obj.Company, value)) return true;
					if (equals(obj.Job, value)) return true;
					if (equals(obj.Birthday, value)) return true;
					if (equals(obj.StartDate, value)) return true;
				});
			});
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
