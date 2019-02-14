import {JetView} from "webix-jet";
import {activitytypes} from "models/activitytypes";
import {contacts} from "models/contacts";
import {activities} from "models/activities";

export default class WindowsView extends JetView {
	config(){

		var form = {
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
					name:"DueDate",
					width: 300,
					timepicker: true,
					stringResult:true,
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
					click:function(){
						if (this.getParentView().validate()){
							const filled = this.getParentView().getValues();
							if(filled.id && activities.exists(filled.id)) {
								activities.updateItem(filled.id, filled);
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
					width: 100,
					click:function(){
						if (this.getParentView().validate()){
							const filled = this.getParentView().getValues();
							activities.add(filled);
							webix.message("All is correct");
							this.getTopParentView().hide();
						}
						else {
							webix.message({ type:"error", text:"Form data is invalid" });
						}
							this.app.callEvent("Filter");
					}
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
			body: form
		};
	}
	showWindow(){
		var form = this.$$("form");
		var id = this.getParam("id", true);
		var values = activities.getItem(id);
		webix.promise.all ([
			activities.waitData
		]).then(() => {
			if (values) {
				form.setValues(values);
			}
		});
		this.$$("addButton").hide();
		this.$$("updateButton").show();
		this.$$("formTemplate").define({template: "Edit activity"});
		this.$$("formTemplate").refresh();
		this.getRoot().show();
	}
	showEmptyWindow(id){
		var form = this.$$("form");
		form.clear();
		console.log(id);
		if (id) {
			this.$$("contactid").setValue(id);
			this.$$("contactid").disable()
		}
		this.$$("updateButton").hide();
		this.$$("addButton").show();
		this.$$("formTemplate").define({template: "Add activity"});
		this.$$("formTemplate").refresh();
		this.getRoot().show();
	}
	init(){

	}
	urlChange(){

	}
}
