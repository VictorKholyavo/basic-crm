import {JetView} from "webix-jet";
import {activities} from "models/activities";
import WindowsView from "./form";
import {contacts} from "models/contacts";
import {activitytypes} from "models/activitytypes";

export default class DataView extends JetView{
	config(){
		return {
			rows: [
				{
					view: "toolbar",
					css: "webix_header webix_dark",
					cols:[
						{
							view:"button",
							type:"icon",
							icon:"wxi-user",
							width: 200,
							label:"Add activity",
							css: {"float": "right"},
							click:() => {
								let mode = "add";
								this.win4.showWindow(mode,"");
							}
						},
					]
				},
				{
					view:"datatable",
					localId: "datatable",
					css:"webix_shadow_medium",
					select: true,
					columns: [
						{id:"State", sort:"string",width: 40, header: "", checkValue:"Close", uncheckValue:"Open", template:"{common.checkbox()}"},
						{id:"TypeID", header:["Activity Type", {content:"selectFilter"}], collection: activitytypes,  sort:"string"},
						{id:"DueDate", format: webix.Date.dateToStr("%d %M %Y"), sort:"date", header:["Due Date", {content:"dateRangeFilter"}], width:160 },
						{id:"Details", header:["Details", {content:"textFilter", compare:likeCompare}], sort:"string", fillspace: true},
						{id:"ContactID", header:["Contact", {content:"selectFilter"}], collection: contacts, fillspace: true, sort:"string"},
						{id:"edit", header:"", template:"<i class='far fa-edit'></i>"},
						{id:"del", header:"", template:"{common.trashIcon()}"}
					],
					on:{
						onAfterSelect: (id) => {
							this.setParam("id", id, true);
						}
					},
					onClick: {
						"wxi-trash": (e, id) => {
							webix.confirm(
								{
									title:"Clear?",
									ok:"Yes",
									cancel:"No",
									text:"Deleting cannot be undone. Delete?",
									callback:function(result) {
										if (result) {
											activities.remove(id.row);
											return false;
										}
									}
								}
							);
							return false;
						},
						"fa-edit": () => {
							let mode = "edit";
							this.win4.showWindow(mode);
							this.app.callEvent("refresh");
						},
					},
				},
			]
		};
		function likeCompare(value, filter){
			value = value.toString().toLowerCase();
			filter = filter.toString().toLowerCase();
			return value.indexOf(filter) !== -1;
		}
	}
	init(){
		this.$$("datatable").sync(activities);
		this.win4 = this.ui(WindowsView);
		this.on(this.app, "refresh", () => {
			this.$$("datatable").refresh();
		});
	}
	urlChange(){
		const datatable = this.$$("datatable");
		let id = this.getParam("id");
		id = id || activities.getFirstId();
		activities.waitData.then(() => {
			if (id && datatable.exists(id)) {
				datatable.select(id);
				this.setParam("id", id, true);
			}
		});
	}
}
