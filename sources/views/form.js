import {JetView} from "webix-jet";
import {activitytypes} from "models/activitytypes";
import {contacts} from "models/contacts";
import {activities} from "models/activities";

export default class WindowsView extends JetView {
	config(){
		const form = {
			view:"form",
			localId: "form",
			borderless:true,
			width: 700,
			height: 700,
			elements: [
				{
					view:"textarea",
					height: 200,
					label:"Details",
					name:"Details",
					labelPosition: "left",
					invalidMessage: "Details can not be empty"
				},
				{
					view: "combo",
					localId: "activitytypes",
					label: "Type",
					labelPosition: "left",
					width: 300,
					name: "TypeID",
					required:true,
					options: {
						body:{
							template: "#Value#",
							data: activitytypes
						}
					}
				},
				{
					view: "combo",
					localId: "contactid",
					label: "Contact",
					labelPosition: "left",
					width: 300,
					name: "ContactID",
					required:true,
					options: {
						body:{
							template: "#FirstName# #LastName#",
							data: contacts
						}
					}
				},
				{
					view:"datepicker",
					label:"Date",
					labelPosition: "left",
					name:"date",
					width: 300,
				},
				{
					view:"datepicker",
					localId: "timeF",
					type: "time",
					label:"Time",
					labelPosition: "left",
					name:"time",
					width: 300,
				},
				{
					view:"checkbox",
					labelRight:"Completed",
					name: "State",
					checkValue:"Close",
					uncheckValue:"Open"
				},
				{
					view:"button",
					localId:"updateButton",
					value: "Save",
					width: 100,
					click:() => { this.addOrSave();}
				},
				{
					view:"button",
					localId:"addButton",
					value: "Add",
					width: 100,
					click: () => 	{ this.addOrSave();}
				},
				{
					view:"button",
					localId:"closeButton",
					value: "Close",
					width: 100,
					click:function() {
						this.getTopParentView().hide();
					}
				}

			],
			rules:{
				Details: webix.rules.isNotEmpty,
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty,
			},
			elementsConfig:{
				labelPosition:"top",
			}
		};
		return {
			view:"window",
			localId:"win2",
			width:600,
			position:"center",
			modal:true,
			head: {
				template:"asdasdasd",
				localId: "formTemplate"
			},
			body: form,
			on:{
				onHide:()=>{
					this.$$("form").clear();
					this.$$("form").clearValidation();
				}
			}
		};
	}
	showWindow(mode, idOfContact){
		let form = this.$$("form");
		let addButton = this.$$("addButton");
		let updateButton = this.$$("updateButton");
		let formTemplate = this.$$("formTemplate");
		let id = this.getParam("id", true);
		let values = activities.getItem(id);

		if (mode == "add") {
			form.clear();
			if (idOfContact) {
				this.$$("contactid").setValue(idOfContact);
				this.$$("contactid").disable();
			}
			updateButton.hide();
			addButton.show();
			formTemplate.define({template: "Add activity"});
			formTemplate.refresh();
			this.getRoot().show();
		}
		else if (mode == "edit"){
			webix.promise.all ([
				activities.waitData
			]).then(() => {
				if (values) {
					values.date = webix.Date.copy(values.DueDate);
					values.time = webix.Date.copy(values.DueDate);
					form.setValues(values);
				}
				if (idOfContact) {
					this.$$("contactid").setValue(idOfContact);
					this.$$("contactid").disable();
				}
			});
			addButton.hide();
			updateButton.show();
			formTemplate.define({template: "Edit activity"});
			formTemplate.refresh();
			this.getRoot().show();
		}
	}
	init(){

	}
	urlChange(){

	}
	addOrSave(){
		if (this.$$("form").validate()){
			const filled = this.$$("form").getValues();
			var hours = filled.time.getHours();
			var mins = filled.time.getMinutes();

			filled.DueDate = new Date(filled.date.setHours(hours, mins));
			delete filled.date;
			delete filled.time;

			if(filled.id && activities.exists(filled.id)) {
				activities.updateItem(filled.id, filled);
				webix.message("All is correct");
			}
			else {
				activities.add(filled);
				webix.message("All is correct");

			}

			this.$$("win2").hide();
		}
		else
			webix.message({ type:"error", text:"Form data is invalid" });
	}
}
