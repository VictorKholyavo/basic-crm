import {JetView} from "webix-jet";
import {files} from "models/files";

export default class FileTable extends JetView{
	config(){
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();
		
		return {
			rows: [
				{
					view:"datatable",
					localId: "files",
					css:"webix_shadow_medium",
					select: true,
					columns: [
						{id:"name", header:"Name", sort:"string", fillspace: true},
						{id:"date", format: webix.Date.dateToStr("%d %M %Y"), sort:"date", header:"Change date", width:160 },
						{id:"size", header:"Size", sort:"int"},
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
											files.remove(id);
											return false;
										}
									}
								}
							);
						}
					}
				},
				{
					view:"uploader",
					localId:"uploader_1",
					value: _("Upload file"),
					upload:"models/files",
					autosend: false,
					on: {
						onAfterFileAdd: (file) => {
							let id = this.getParam("id", true);
							file.ContactID = id;
							files.add(file);
						}
					}
				}
			]
		};
	}
	init(){
		this.$$("files").sync(files);
	}
	urlChange(){
		files.waitData.then(() => {
			let id = this.getParam("id", true);
			if (!id)
				return files.filter();
			files.filter(
				function(obj){
					return obj.ContactID == id;
				}
			);
		});
	}
}
