import {JetView} from "webix-jet";
import {activities} from "models/activities";
import WindowsView from "./form";
import {contacts} from "models/contacts";
import {activitytypes} from "models/activitytypes";

export default class DataView extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

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
							width: 300,
							label: _("Add activity"),
							css: {"float": "right"},
							click:() => {
								this.win4.showWindow("add");
							}
						},
					]
				},
				{
					view: "tabbar",
					localId: "mytabbar",
					options: [
						{id: 1, value: _("All")},
						{id: 2, value: _("Completed")},
						{id: 3, value: _("Overdue")},
						{id: 4, value: _("Today")},
						{id: 5, value: _("Tomorrow")},
						{id: 6, value: _("This week")},
						{id: 7, value: _("This mounth")},
					],
					on: {
						onChange:() => {
							this.$$("datatable").filterByAll();
						}
					}
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
						"fa-edit": (e, id) => {
							let values = this.$$("datatable").getItem(id);
							this.win4.showWindow(values);
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
		activities.filter();
		this.$$("datatable").sync(activities);
		this.win4 = this.ui(WindowsView);
		activities.waitData.then(() => {
			this.$$("datatable").registerFilter(
				this.$$("mytabbar"),
				{
					columnId: "State",
					compare: function(value, filter, item) {
						let today = new Date;
						today.setHours(23, 59, 59);

						let yesterday = new Date;
						yesterday.setDate(yesterday.getDate() - 1);
						yesterday.setHours(0, 0, 0, 0);

						let tommorow = new Date;
						tommorow.setDate(tommorow.getDate() + 1);
						tommorow.setHours(23, 59, 59);

						let thisWeek = new Date;
						thisWeek.setDate(thisWeek.getDate() + 7);
						thisWeek.setHours(23, 59, 59);

						let thisMonth = new Date;
						thisMonth.setMonth(thisMonth.getMonth() + 1);
						thisMonth.setHours(23, 59, 59);

						if (filter == 1) return value;
						else if (filter == 2) return value == "Close";
						else if (filter == 3) return item.DueDate < yesterday;
						else if (filter == 4) return item.DueDate >= yesterday && item.DueDate <= today;
						else if (filter == 5) return item.DueDate > today && item.DueDate < tommorow;
						else if (filter == 6) return item.DueDate >= today && item.DueDate < thisWeek;
						else if (filter == 7) return item.DueDate >= today && item.DueDate < thisMonth;
					}
				},
				{
					getValue:function(node){
						return node.getValue();
					},
					setValue:function(node, value){
						node.setValue(value);
					}
				}
			);
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
