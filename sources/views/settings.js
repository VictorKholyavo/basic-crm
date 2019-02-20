import {JetView} from "webix-jet";
import {activitytypes} from "models/activitytypes";
import {statuses} from "models/statuses";
import {icons} from "models/icons";

export default class SettingsView extends JetView {
	config(){
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();

		return {
			cols: [
				{
					rows: [
						{
							view:"datatable",
							localId:"activitytypesTable",
							scrollX: false,
							columns: [
								{id:"id", header:"id", width: 50, css: "rank", sort:"int"},
								{id:"Value", header:"Value", editor: "text", fillspace:true, sort:"string"},
								{id:"Icon", template:"<span class='fas fa-#Icon#'></span>", editor: "select", options: icons, header:"Icon"},
								{id:"del", header:"", template:"{common.trashIcon()}"}
							],
							select: true,
							hover: "myhover",
							editable: true,
							onClick: {
								"wxi-trash":function(e, id){
									activitytypes.remove(id);
									return false;
								}
							}
						},
						{
							view:"button",
							localId:"addActivity",
							value: "Add activity type",
							click: () => {
								let value = {"Value": "Task", "Icon": "work"};
								activitytypes.add(value);
							},
							label: _("Add activity type")
						}
					]
				},
				{
					rows: [
						{
							view:"datatable",
							localId:"statusesTable",
							scrollX: false,
							columns: [
								{id:"id", header:"id", width: 50, css: "rank", sort:"int"},
								{id:"Value", header:"Value", editor: "text", fillspace:true, sort:"string"},
								{id:"Icon", header:"Icon"},
								{id:"del", header:"", template:"{common.trashIcon()}"}
							],
							select: true,
							hover: "myhover",
							editable: true,
							onClick: {
								"wxi-trash":function(e, id){
									statuses.remove(id);
									return false;
								}
							}
						},
						{
							view:"button",
							localId:"addStatus",
							value: "Add status",
							click: () => {
								let value = {"Value": "Done", "Icon": "done"};
								statuses.add(value);
							},
							label: _("Add status")
						}
					]
				},
				{
					view: "toolbar",
					css: "toolbar",
					cols: [
						{
							rows: [
								{
									view: "template",
									template: "Language",
									height: 40,
									css: "formTemplate",
									template: _("Language")
								},
								{
									view: "segmented",
									width: 200,
									name: "lang",
									options: [
										{id: "en", value: "English" },
										{id: "ru", value: "Русский" }
									],
									click:() => {
										const langs = this.app.getService("locale");
										const value = this.getRoot().queryView({ name:"lang" }).getValue();
										langs.setLang(value);
									},
									value: lang,
								},
								{}
							]
						}
					]
				}
		  ]
		};
	}

	init(){
		const activitytypesTable = this.$$("activitytypesTable");
		activitytypesTable.sync(activitytypes);
		const statusesTable = this.$$("statusesTable");
		statusesTable.sync(statuses);
	}
	urlChange(){
		// contacts.waitData.then(() => {
		// 	const list = this.$$("listForContacts");
		// 	let id = this.getParam("id");
		// 	if (!contacts.exists(id)) {
		// 		id = contacts.getFirstId();
		// 		this.setParam("id", id, true);
		// 	}
		// 	list.select(id);
		// });
	}
}
