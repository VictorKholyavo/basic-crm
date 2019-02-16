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
				template:" ",
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
		let id = this.getParam("id", true);
		let values = activities.getItem(id);

		if (mode == "add") {
			if (idOfContact) {
				this.$$("contactid").setValue(idOfContact);
				this.$$("contactid").disable()
			}
			this.$$("updateButton").hide();
			this.$$("addButton").show();
			this.$$("formTemplate").define({template: "Add activity"});
		}
		else if (mode == "edit"){
			webix.promise.all ([
				activities.waitData
			]).then(() => {
				if (values) {
					form.setValues(values);
				}
				if (idOfContact) {
					this.$$("contactid").setValue(idOfContact);
					this.$$("contactid").disable()
				}
			});
			this.$$("addButton").hide();
			this.$$("updateButton").show();
			this.$$("formTemplate").define({template: "Edit activity"});
		}
		this.$$("formTemplate").refresh();
		this.getRoot().show();
	}
	init(){

	}
	urlChange(){

	}
	addOrSave(){
		if (this.$$("form").validate()){
			const filled = this.$$("form").getValues();
			let hours = filled.time.getHours();
			let mins = filled.time.getMinutes();
			console.log(hours);
			console.log(filled.date);
			filled.DueDate = new Date(filled.date.setHours(hours, mins));
			delete filled.date;
			delete filled.time;

			if(filled.id) {
				activities.updateItem(filled.id, filled);
			}
			else {
				activities.add(filled);
			}
			webix.message("All is correct");
			this.$$("win2").hide();
		}
		else
			webix.message({ type:"error", text:"Form data is invalid" });
	}
}
