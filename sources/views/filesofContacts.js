import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {files} from "models/files"

export default class FileTable extends JetView{
	config(){
		return {
			rows: [
					{
						view:"datatable",
						id: "files",
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
						value:"Upload file",
						upload:"models/files",
						autosend: false,
						on: {
							onAfterFileAdd: (file) => {
								let id = this.getParam("id", true);
								file.ContactID = id;
								files.add(file)
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
			const datatable = this.$$("files");
			let id = this.getParam("id", true);
			if (!id)
				return files.filter();
				files.filter(
					function(obj){
						return obj.ContactID == id;
					}
				);
			})
	}
}
