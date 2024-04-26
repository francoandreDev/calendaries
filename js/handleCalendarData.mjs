export class Calendar {
    constructor(name, description, months, festivals) {
        this.title = name;
        this.description = description;
        this.months = months;
        this.festivals = festivals;
    }

    // I need a method to build the calendar
    buildCalendar() {
        let daysInMonth = {};
        for (let month of this.months) {
            let days = [];
            if (month["leap_day"] !== undefined) {
                days = Calendar.buildMonth(month.days, month["leap_day"]);
            } else {
                days = Calendar.buildMonth(month.days);
            }
            daysInMonth[month.name] = days;
        }
        return daysInMonth;
    }

    static buildMonth(totalDays, leapDay = null) {
        const days = [];
        let isLeapPassed = false;

        if (leapDay !== null) {
            // This month have a leap day
            let i = 1;
            while (i <= totalDays) {
                if (leapDay == i) {
                    days.push(i);
                    isLeapPassed = true;
                } else {
                    if (isLeapPassed) {
                        days.push(i + 1);
                    } else {
                        days.push(i);
                    }
                    i++;
                }
            }
            if (!isLeapPassed) {
                // the leap day is out of the normal month
                days.push(leapDay);
            }
        } else {
            // This month don't have a leap day
            for (let i = 1; i <= totalDays; i++) {
                days.push(i);
            }
        }
        return days;
    }
}
