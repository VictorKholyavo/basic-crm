import {JetView} from "webix-jet";
import {activitytypes} from "models/activitytypes";
import {contacts} from "models/contacts";
import {activities} from "models/activities";
import {statuses} from "models/statuses";

export default class FormContact extends JetView {
	config(){
		return {
			view:"form",
			localId: "formContact",
			borderless:true,
			autoheight: false,
			elements: [
				{
					rows: [
						{
							view: "template",
							template: "Add new contact",
							localId: "formTemplate",
							height: 40
						},
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
											width: 300,
										},
										{
											view: "combo",
											localId: "contactid",
											label: "Status",
											labelPosition: "left",
											width: 300,
											name: "StatusID",
											required:true,
											options: {
												body:{
													template: "#Value#",
													data: statuses
												}
											}
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
											view:"datepicker",
											label:"Birthday",
											labelPosition: "left",
											name:"Birthday",
										},
										{
											cols: [
												{
													rows: [
														{
															view: "template",
															localId: "photo",
															name: "Photo",
															template: "<img class='photo' src='#src#'>"
														},
														{

														},
														{

														}
													]
												},
												{
													rows: [
														{
															view:"uploader",
															localId:"changePhoto",
															value:"Change Photo",
															autosend: false,
															on: {
																onBeforeFileAdd: (upload) => {
																	var file = upload.file;
																	var reader = new FileReader();
																	reader.onload = (event) => {
																		const values = this.$$("formContact").getValues();
																		values.Photo = event.target.result;
																		this.$$("photo").setValues({src: event.target.result});
																		this.$$("formContact").setValues(values)
																	};
																	reader.readAsDataURL(file)
																	return false;
																}
															}

														},
														{
															view:"button",
															localId:"deletePhoto",
															value: "Delete Photo",
															click:() => {

															}
														},
														{
															view: "spacer"
														}
													]
												}
											]
										},
									]
								}
							]
						}
					]
				},
				{
					view:"button",
					localId:"updateButton",
					value: "Save",
					click:() => {
						this.addOrSave();
					}
				},
				{
					view:"button",
					localId:"addButton",
					value: "Add",
					click: () => 	{
						this.addOrSave();
					}
				},
				{
					view:"button",
					localId:"closeButton",
					value: "Close",
					click:() => {
						this.app.callEvent("Close", []);
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
		}
	}
	init(){

	}
	urlChange(view, url){
		var id = this.getParam("id", true );
		let template = this.$$("formTemplate");
		if(url[0].params.mode) {
			template.define({template: "Edit contact"});
			template.refresh();
			var form = this.$$("formContact");
			var values = contacts.getItem(id);
			this.$$("addButton").hide();
			webix.promise.all ([
				contacts.waitData
			]).then(() => {
				if (values) {
					form.setValues(values);
				}
			});
		}
		else {
			this.$$("updateButton").hide();
		}
	}
	changePhoto (photo) {
		let id = this.getParam("id", true);
		const filled = this.$$("formContact").getValues();
		console.log(id);
		contacts.updateItem(filled.id, photo)
	}
	addOrSave(){
		if (this.$$("formContact").validate()){

			const filled = this.$$("formContact").getValues();
			if(filled.id) {
				console.log(filled);
				contacts.updateItem(filled.id, filled);
			}
			else {
				contacts.add(filled);
			}
			webix.message("All is correct");
		}
		else {
			webix.message({ type:"error", text:"Form data is invalid" });
		}
		this.app.callEvent("Close", []);
	}
}
