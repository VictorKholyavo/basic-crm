import {JetView, plugins} from "webix-jet";



export default class TopView extends JetView{
	config(){
		const menu = {
			view:"menu", 
      id:"top:menu",
			localId:"menu",
			css:"app_menu",
			width:180, layout:"y", select:true,
			template:"<span class='webix_icon #icon#'></span> #value# ",
			data:[
				{ value: "Contacts", id:"contacts", icon:"wxi-columns" },
				{ value: "Activities",	id:"activities", icon:"wxi-pencil" },
				{ value: "Settings", id:"settings", icon:"webix_icon fas fa-cog"}
			],
			on: {
				onAfterSelect:function(id){
					const header = this.$scope.$$("header");
					header.define({template: this.getItem(id).value});
					header.refresh();
				}
			}
		};

		const ui = {
			type:"clean", paddingX:5, css:"app_layout",
			rows:[
				{ paddingX:5,
					paddingY:10,
					rows: [
						{
							type: "header",
							template: "#value#",
							localId: "header"
						},
						{
							css:"webix_shadow_medium",
							cols:[
								menu,
								{ $subview:true }
							]
						}
					]
				},
				{ type:"wide", paddingY:10, paddingX:5, rows:[

				]}
			]
		};

		return ui;
	}
	init(){
		this.use(plugins.Menu, "top:menu");
	}
}
