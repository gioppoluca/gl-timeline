Hooks.once('init', async function() {

});



Hooks.once('ready', async function() {

});


// Add button to Actor Sheet for opening app
Hooks.on("getJournalPageSheetHeaderButtons", (sheet, buttons) => {
	console.log("check the sheet")
	console.log(sheet)
	if (true) {
		buttons.unshift({
			label: "Timeline data",
			class: "export-pdf",
			icon: "fas fa-timeline",
			onclick: () => {
				// Open Config window
				//new SheetExportconfig(sheet.actor, sheetType, sheet).render(true);

				// Bring window to top
				// Object.values(ui.windows)
				// 	.filter(window => window instanceof SheetExportconfig)[0]
				// 	?.bringToTop();
			},
		});
	}
});