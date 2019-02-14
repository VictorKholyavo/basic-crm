import {JetView} from "webix-jet";
import {activitytypes} from "models/activitytypes";
import {contacts} from "models/contacts";
import {activities} from "models/activities";

export default class FormContact extends JetView {
	config(){
		var form = {
			view:"form",
			localId: "formContact",
			borderless:true,
			elements: [
				{
					cols: [
						{
							rows: [
								{
									view:"text",
									label:"FirstName",
									name:"FirstName",
									labelPosition: "left",
								},
								{
									view:"text",
									label:"LastName",
									name:"LastName",
									labelPosition: "left",
								},
								{
									view:"datepicker",
									label:"StartDate",
									labelPosition: "left",
									name:"StartDate",
									stringResult:true,
								},
								{
									view:"text",
									label:"StatusID",
									name:"StatusID",
									labelPosition: "left",
								},
								{
									view:"text",
									label:"Job",
									name:"Job",
									labelPosition: "left",
								},
								{
									view:"text",
									label:"Company",
									name:"Company",
									labelPosition: "left",
								},
								{
									view:"text",
									label:"Website",
									name:"Website",
									labelPosition: "left",
								},
								{
									view:"text",
									label:"Address",
									name:"Address",
									labelPosition: "left",
								},
								{

								},
							]
						},
						{
							rows: [
								{
									view:"text",
									label:"Email",
									name:"Email",
									labelPosition: "left",
								},
								{
									view:"text",
									label:"Skype",
									name:"Skype",
									labelPosition: "left",
								},
								{
									view:"text",
									label:"Phone",
									name:"Phone",
									labelPosition: "left",
								},
								{
									view:"text",
									label:"Birthday",
									name:"Birthday",
									labelPosition: "left",
								},
							]
						}
					]
				},
				{
					view:"button",
					localId:"updateButton",
					value: "Save",
					click:function(){
						if (this.getParentView().validate()){
							const filled = this.getParentView().getValues();
							if(filled.id && contacts.exists(filled.id)) {
								contacts.updateItem(filled.id, filled);
							}
							webix.message("All is correct");
							this.getTopParentView().hide();
						}
						else
							webix.message({ type:"error", text:"Form data is invalid" });
					}
				},
				{
					view:"button",
					localId:"addButton",
					value: "Add",
					click:function(){
						if (this.getParentView().validate()){
							const filled = this.getParentView().getValues();
							contacts.add(filled);
							webix.message("All is correct");
							this.getTopParentView().hide();
						}
						else
							webix.message({ type:"error", text:"Form data is invalid" });
					}
				},
				{
					view:"button",
					localId:"closeButton",
					value: "Close",
					click:function() {
						this.getTopParentView().hide();
					}
				}

			],
			rules:{
				// Details: webix.rules.isNotEmpty,
				// TypeID: webix.rules.isNotEmpty,
				// ContactID: webix.rules.isNotEmpty,
			},
			elementsConfig:{
				labelPosition:"top",
			}
		};
		return {
			view:"window",
			localId:"win2",
			//position:"center",
			//modal:true,
			width: 700,
			height: 700,
			head: {
				template:"asdasdasd",
				localId: "formTemplate"
			},
			body: form
		};
	}
	showWindow(){
		var form = this.$$("formContact");
		var id = this.getParam("id", true);
		var values = contacts.getItem(id);
		webix.promise.all ([
			contacts.waitData
		]).then(() => {
			if (values) {
				form.setValues(values);
			}
		});
		this.$$("addButton").hide();
		this.$$("updateButton").show();
		this.$$("formTemplate").define({template: "Edit contact"});
		this.$$("formTemplate").refresh();
		this.getRoot().show();
	}
	showEmptyWindow(){
		var form = this.$$("formContact");
		form.clear();
		this.$$("updateButton").hide();
		this.$$("addButton").show();
		this.$$("formTemplate").define({template: "Add new contact"});
		this.$$("formTemplate").refresh();
		this.getRoot().show();
	}
	init(){

	}
	urlChange(){

	}
}
