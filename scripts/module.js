import TimelineDashboard from "./timeline_dashboard.js"
import JournalTimelineDialog from "./journal_timeline_dialog.js"
import NoteTimelineDialog from "./note_timeline_dialog.js"

Hooks.once('init', async function () {

});

Hooks.once('ready', async function () {

});

// Add button to Journal Sheet for opening config
Hooks.on("getJournalSheetHeaderButtons", (sheet, buttons) => {
	console.log('GIOPPO')
	buttons.unshift({
		label: "Timeline data",
		class: "timeline",
		icon: "fas fa-timeline",
		onclick: () => {
			var jtd = new NoteTimelineDialog({},sheet.object);
			jtd.render(true);

			// Bring window to top
			Object.values(ui.windows)
				.filter(window => window instanceof JournalTimelineDialog)[0]
				?.bringToTop();
		},
	});
});

// Add button to Journal Page Sheet for opening config; this is not needed now since at the moment the module just manage integration with SimpleCalendar, but just in case I decide to include also pages not from SC
// Hooks.on("getJournalPageSheetHeaderButtons", (sheet, buttons) => {
// 	console.log("check the sheet")
// 	console.log(sheet)
// 	console.log(this)
// 	if (true) {
// 		buttons.unshift({
// 			label: "Timeline data",
// 			class: "timeline",
// 			icon: "fas fa-timeline",
// 			onclick: () => {
// 				var jtd = new JournalTimelineDialog({},sheet.object);
// 				jtd.render(true);
	
// 				// Bring window to top
// 				Object.values(ui.windows)
// 					.filter(window => window instanceof JournalTimelineDialog)[0]
// 					?.bringToTop();
// 			},
// 		});
// 	}
// });


// Add button to Scene elements for opening timeline dashboard
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
			console.log('invoking the dashboard');
			var td = new TimelineDashboard();
			console.log('----------- clicked button - created - now render')
			console.log(td)
			td.render(true);

			// Bring window to top
			 Object.values(ui.windows)
			 	.filter(window => window instanceof TimelineDashboard)[0]
			 	?.bringToTop();
		}
	});
});