const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export default class JournalTimelineDialog extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}, data = {}) {
        super(options);
        this.page = data;
        console.log('constuctor of JournalTimelineDialog')
    }
    static DEFAULT_OPTIONS = {
        id: "gl-timetable-dialog",
        form: {
            handler: JournalTimelineDialog.myFormHandler,
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
            template: "modules/gl-timeline/scripts/templates/journal_timeline_dialog.html"
        }
    }
    get title() {
        console.log('getTitle')
        //return `My Module: ${game.i18n.localize(this.options.window.title)}`;
        return '${game.i18n.localize(this.options.window.title)}';
    }
    // _onClickAction(event, target) {
    //     const action = target.dataset["action"]
    // }

    _onRender(context, options) {
        // this.element.querySelector('#something')?.addEventListener('mouseover', (ev) => {

        // })
    }

    async _prepareContext(options) {
        console.log('preparecontext')
        console.log(options)
        console.log(this);
        console.log(this.page);
        var context = {}
        if (this.page.flags.timeline) {
            context = this.page.flags.timeline
        }
        return context;
    }
    // async _preparePartContext(partId, context, options) {
    //     return {
    //         ...context,
    //         key: 'value'
    //     }
    // }

    // async onSubmit(event, form, formData) {
    //     // if (form.reportValidity()) {
    //     //     const submitted = formData.object   
    //     // }
    // }
}