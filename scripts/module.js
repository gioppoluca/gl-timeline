import GraphDashboard from "./graph_dashboard.js"
import JournalTimelineDialog from "./journal_timeline_dialog.js"
import NoteTimelineDialog from "./note_timeline_dialog.js"

Hooks.once('init', async function () {

});



Hooks.once('ready', async function () {

});

Hooks.on("getJournalSheetHeaderButtons", (sheet, buttons) => {
	console.log('GIOPPO')
	buttons.unshift({
		label: "Timeline data",
		class: "timeline",
		icon: "fas fa-timeline",
		onclick: () => {
			console.log('invoking the dialog');
			console.log(sheet)
			var jtd = new NoteTimelineDialog({},sheet.object);
			console.log('----------- clicked button - created - now render')
			console.log(jtd)
			jtd.render(true);

			// Open Config window
			//new SheetExportconfig(sheet.actor, sheetType, sheet).render(true);

			// Bring window to top
			Object.values(ui.windows)
				.filter(window => window instanceof JournalTimelineDialog)[0]
				?.bringToTop();
		},
	});
});

// Add button to Actor Sheet for opening app
Hooks.on("getJournalPageSheetHeaderButtons", (sheet, buttons) => {
	console.log("check the sheet")
	console.log(sheet)
	console.log(this)
	if (true) {
		buttons.unshift({
			label: "Timeline data",
			class: "timeline",
			icon: "fas fa-timeline",
			onclick: () => {
				console.log('invoking the dialog');
				console.log(sheet)
				var jtd = new JournalTimelineDialog({},sheet.object);
				console.log('----------- clicked button - created - now render')
				console.log(jtd)
				jtd.render(true);
	
				// Open Config window
				//new SheetExportconfig(sheet.actor, sheetType, sheet).render(true);

				// Bring window to top
				Object.values(ui.windows)
					.filter(window => window instanceof JournalTimelineDialog)[0]
					?.bringToTop();
			},
		});
	}
});

// Hooks.on("renderJournalDirectory", (app, html, data) => {
// 	console.log("check the directory")
// 	console.log(app)
// 	console.log(html)
// 	html.find(".directory-item").each((i, item) => {
// 		let $item = $(item);
// 		let $button = $("<button class='timeline'>Timeline</button>");
// 		$item.append($button);
// 	});
// });


Hooks.on("getSceneControlButtons", (controls) => {
	console.log("check the controls")
	console.log(controls)
	controls.filter(control => control.name === "notes")[0].tools.push({
		name: "timeline",
		title: "Timeline",
		button: true,
		icon: "fas fa-timeline",
		onClick: () => {
			// Open Config window
			//new SheetExportconfig(sheet.actor, sheetType, sheet).render(true);
			console.log('invoking the dashboard');
			var gd = new GraphDashboard();
			console.log('----------- clicked button - created - now render')
			console.log(gd)
			gd.render(true);
			// Open Config window
			//new SheetExportconfig(sheet.actor, sheetType, sheet).render(true);

			// Bring window to top
			 Object.values(ui.windows)
			 	.filter(window => window instanceof GraphDashboard)[0]
			 	?.bringToTop();
		}
	});
	// controls.push({
	// 	name: "timeline",
	// 	title: "Timeline",
	// 	icon: "fas fa-timeline",
	// 	onclick: () => {
	// 		// Open Config window
	// 		//new SheetExportconfig(sheet.actor, sheetType, sheet).render(true);
	// 	}
	// });
});