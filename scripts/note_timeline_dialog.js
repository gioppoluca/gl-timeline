const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export default class NoteTimelineDialog extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}, data = {}) {
        super(options);
        this.page = data;
        console.log('constuctor of NoteTimelineDialog')
    }
    static DEFAULT_OPTIONS = {
        id: "gl-timetable-dialog",
        form: {
            handler: NoteTimelineDialog.myFormHandler,
            closeOnSubmit: true,
        },
        position: {
            width: 640,
            height: "auto",
        },
        tag: "form", // The default is "div"
        window: {
            icon: "fas fa-gear", // You can now add an icon to the header
            title: "GLTIMELINE.main.title"
        }

    }
    static async myFormHandler(event, form, formData) {
        // Do things with the returned FormData
        console.log('formhandler');
        console.log(form);
        console.log(formData)
        console.log(event)
        var new_flags = { flags: { timeline: formData.object } }
        await this.page.update(new_flags);
    }
    static PARTS = {
        form: {
            template: "modules/gl-timeline/scripts/templates/note_timeline_dialog.html"
        }
    }
    get title() {
        return game.i18n.localize(this.options.window.title);
    }

    async _prepareContext(options) {
        console.log('preparecontext')
        console.log(options)
        console.log(this);
        console.log(this.page);
        var context = {}
        if (this.page.flags.timeline) {
            console.log(this.page.flags.timeline)
            context = this.page.flags.timeline
        }
        console.log(context)
        return context;
    }
}