import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";

export default class FormContact extends JetView {
	config(){
		const _ = this.app.getService("locale")._;

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
							template: " ",
							localId: "formTemplate",
							css: "formTemplate",
							height: 40,
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
											view: "richselect",
											localId: "contactid",
											label: "Status",
											labelPosition: "left",
											width: 300,
											name: "StatusID",
											options: {
												filter:function(item, value){
													if(item.Value.toString().toLowerCase().indexOf(value.toLowerCase())===0)
														return true;
													return false;
												},
												body:{
													template: "<span class='fas fa-#Icon#'> #Value#</span>",
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
															template: (obj)=> {
																let photo = "";
																if (obj.src) {
																	photo = "<img class='photo' src="+obj.src+">";
																}
																else {
																	photo = "<img class='defaultPhotoBig'>";
																}
																return photo;
															}
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
															value: _("Change photo"),
															autosend: false,
															on: {
																onBeforeFileAdd: (upload) => {
																	var file = upload.file;
																	var reader = new FileReader();
																	reader.onload = (event) => {
																		const values = this.$$("formContact").getValues();
																		values.Photo = event.target.result;
																		this.$$("photo").setValues({src: event.target.result});
																		this.$$("formContact").setValues(values);
																	};
																	reader.readAsDataURL(file);
																	return false;
																}
															}

														},
														{
															view:"button",
															localId:"deletePhoto",
															value: _("Delete photo"),
															click:() => {
																this.$$("photo").setValues({src: " "});
																const values = this.$$("formContact").getValues();
																values.Photo = " ";
																this.$$("formContact").setValues(values);
																return false;
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
					value: _("Save"),
					click:() => {
						this.addOrSave();
					}
				},
				{
					view:"button",
					localId:"addButton",
					value: _("Add"),
					click: () => 	{
						this.addOrSave();
					}
				},
				{
					view:"button",
					localId:"closeButton",
					value: _("Close"),
					click:() => {
						this.app.callEvent("CloseTheFormAndShowDetails", []);
					}
				}
			],
			rules:{
				$all: webix.rules.isNotEmpty,
			},
			elementsConfig:{
				labelPosition:"top",
			}
		};
	}
	init(){

	}
	urlChange(){
		const _ = this.app.getService("locale")._;
		let id = this.getParam("id", true );
		let mode = this.getParam("mode");

		let template = this.$$("formTemplate");
		let updateButton = this.$$("updateButton");
		let addButton = this.$$("addButton");
		const form = this.$$("formContact");

		form.clear();
		form.clearValidation();

		if(mode == "edit") {
			template.define({template: _("Edit contact")});
			addButton.hide();
			webix.promise.all ([
				contacts.waitData
			]).then(() => {
				const values = contacts.getItem(id);
				if (values) {
					form.setValues(values);
					this.$$("photo").setValues({src: values.Photo});
				}
			});
		}
		else {
			updateButton.hide();
			addButton.show();
			template.define({template: "Add new contact"});
		}
		template.refresh();
	}
	addOrSave(){
		if (this.$$("formContact").validate()){

			const filled = this.$$("formContact").getValues();
			if(filled.id) {
				contacts.updateItem(filled.id, filled);
			}
			else {
				contacts.add(filled);
			}
			webix.message("All is correct");
			this.app.callEvent("CloseTheFormAndShowDetails", []);
		}
		else {
			webix.message({ type:"error", text:"Form data is invalid" });
		}
	}
}
