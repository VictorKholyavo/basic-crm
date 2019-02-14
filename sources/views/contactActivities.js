import {JetView} from "webix-jet";
import {activities} from "models/activities";
import WindowsView from "./form";
import {contacts} from "models/contacts";
import {activitytypes} from "models/activitytypes";

export default class ContactActivities extends JetView{
	config(){
		return {
			rows: [
				{
					view:"datatable",
					localId: "datatable",
					css:"webix_shadow_medium",
					select: true,
					columns: [
						{id:"State", sort:"string",width: 40, header: "", checkValue:"Close", uncheckValue:"Open", template:"{common.checkbox()}"},
						{id:"TypeID", header:{content:"selectFilter"}, collection: activitytypes,  sort:"string"},
						{id:"DueDate", format: webix.Date.dateToStr("%d %M %Y"), sort:"date", header:{content:"dateRangeFilter"}, width:160 },
						{id:"Details", header:{content:"textFilter"}, compare:likeCompare, sort:"string", fillspace: true},
						{id:"edit", header:"", template:"<i class='far fa-edit'></i>"},
						{id:"del", header:"", template:"{common.trashIcon()}"}
					],
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

						},
						"fa-edit": () => {
							this.win4.showWindow();
							const values = this.getParam("id");
							this.app.callEvent("Filter", [values]);
						},
					},
				},
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
									this.win4.showEmptyWindow();
								}
							},
						]
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
		activities.waitData.then(() => {
			const datatable = this.$$("datatable");
			var id = this.getParam("id");
			if (!id)
				return datatable.filter();
				datatable.filter(
					function(obj){
						return obj.ContactID == id;
					}
				);
		});

		this.on(this.app, "Filter", (data) => {
			activities.waitData.then(() => {
			const datatable = this.$$("datatable");
			var id = this.getParam("id");
				datatable.filter(
					function(obj){
						return obj.ContactID == id;
					}
				);
  		});
		})
	}
	urlChange(){
		activities.waitData.then(() => {
			const datatable = this.$$("datatable");
			var id = this.getParam("id");
			if (!id)
				return datatable.filter();
				datatable.filter(
					function(obj){
						console.log(id);
						return obj.ContactID == id;
					}
				);
		})

	}
}
