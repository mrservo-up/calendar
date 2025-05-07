 // app.js
 document.addEventListener('DOMContentLoaded', () => {
    const calendar = new tui.Calendar('#calendar', {
        defaultView: 'month',
        taskView: true,
        template: {
            monthGridHeader: function(model) {
                const date = new Date(model.date);
                return `<span class="tui-full-calendar-weekday-grid-date">${date.getDate()}</span>`;
            }
        }
    });
});