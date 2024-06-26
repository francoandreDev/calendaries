import { getCalendars } from "./calendarData.mjs";

export async function buildCalendars() {
    const {
        gregorianYear,
        gregorianCalendar,
        internationalFixedYear,
        internationalFixedCalendar,
        positivistYear,
        positivistCalendar,
        revolutionaryYear,
        revolutionaryCalendar,
        chineseYear,
        chineseCalendar,
    } = await getCalendars();

    printAll();

    function printAll() {
        const currentYearElement = document.querySelector("#year");
        currentYearElement.setAttribute("value", new Date().getFullYear());
        currentYearElement.addEventListener("input", (event) => {
            deleteAll();
            mainContent(event);
        });
        mainContent();

        function mainContent(event) {
            const year = event?.target?.value || new Date().getFullYear();
            const gregorian = new ShowCalendar(
                gregorianYear,
                gregorianCalendar,
                year
            );
            const internationalFixed = new ShowCalendar(
                internationalFixedYear,
                internationalFixedCalendar,
                year
            );
            const positivist = new ShowCalendar(
                positivistYear,
                positivistCalendar,
                year
            );
            const revolutionary = new ShowCalendar(
                revolutionaryYear,
                revolutionaryCalendar,
                year
            );
            const chinese = new ShowCalendar(
                chineseYear,
                chineseCalendar,
                year
            );
            const calendars = [
                gregorian,
                internationalFixed,
                positivist,
                revolutionary,
                chinese,
            ];
            calendars.forEach((calendar) => {
                const sectionShowCalendar = document.createElement("section");
                sectionShowCalendar.classList.add("show-calendar-section");
                document.body.appendChild(sectionShowCalendar);
                calendar.show(sectionShowCalendar);
            });
        }

        function deleteAll() {
            const sectionShowCalendar = document.querySelectorAll(
                ".show-calendar-section"
            );
            if (sectionShowCalendar.length > 0) {
                sectionShowCalendar.forEach((section) => {
                    section.remove();
                });
            }
        }
    }
}

class ShowCalendar {
    constructor(dataYear, infoYear, year) {
        this.nDay = 1;
        this.dataYear = dataYear;
        this.infoYear = infoYear;
        this.year = year;
        this.container = null;
    }

    show(sectionShowCalendar) {
        this.container = sectionShowCalendar;
        this.showName();
        this.showYear();
        this.showDescription();
        this.showYearContent();
    }

    showName() {
        const nameCalendar = document.createElement("h2");
        nameCalendar.innerHTML = this.infoYear.title + " Calendar";
        nameCalendar.classList.add("calendar-title");
        this.container.appendChild(nameCalendar);
    }

    showYear() {
        const currentYearElement = document.createElement("span");
        currentYearElement.textContent = this.year;
        currentYearElement.classList.add("current-year");
        this.container.appendChild(currentYearElement);
    }

    showDescription() {
        const descriptionCalendar = document.createElement("p");
        descriptionCalendar.innerHTML = this.infoYear.description;
        descriptionCalendar.classList.add("calendar-description");
        this.container.appendChild(descriptionCalendar);
    }

    showYearContent() {
        const sectionYear = document.createElement("section");
        sectionYear.classList.add("year");
        this.container.appendChild(sectionYear);
        this.showMonths(sectionYear, true);
    }

    showMonths(sectionYear) {
        for (let month in this.dataYear) {
            const monthElement = this.showDetailsMonth(sectionYear, month);
            monthElement.classList.add("month");
            this.showWeekDays(monthElement);
            this.showDays(monthElement, month);
            this.addExtraSpace(sectionYear);
        }
    }

    showDetailsMonth(sectionYear, month) {
        const sectionMonth = document.createElement("section");
        sectionMonth.classList.add("month-title");
        sectionYear.appendChild(sectionMonth);
        const monthTitle = document.createElement("h3");
        monthTitle.style.textAlign = "center";
        monthTitle.innerHTML = month;
        sectionMonth.appendChild(monthTitle);
        return sectionMonth;
    }

    showWeekDays(sectionElement) {
        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayHeader = document.createElement("header");
        dayHeader.classList.add("week-day");
        sectionElement.appendChild(dayHeader);
        for (let i = 0; i < weekDays.length; i++) {
            const day = document.createElement("span");
            day.innerHTML = weekDays[i];
            day.classList.add("day");
            dayHeader.appendChild(day);
        }
    }

    showDays(monthElement, month) {
        let isFirstDay = true;
        const days = this.dataYear[month];
        const daysElement = document.createElement("article");
        daysElement.classList.add("month-days");
        monthElement.appendChild(daysElement);
        const festivals = this.infoYear.festivals;
        const holidays = this.infoYear.holidays;
        for (let i = 1; i <= this.getMaxDays(month, days.length); i++) {
            const day = document.createElement("span");
            day.textContent = i;
            day.classList.add("day");
            if (this.haveFestivals(festivals, month, i)) {
                day.classList.add("festival");
            }
            if (this.haveHolidays(holidays, month, i)) {
                day.classList.add("holiday");
            }
            if (isFirstDay) {
                this.showFirstDay(day);
                isFirstDay = false;
            }
            daysElement.appendChild(day);
            this.nDay++;
        }
    }

    haveHolidays(objects, targetMonth, targetDay) {
        return objects.some(
            (object) => object.month === targetMonth && object.day === targetDay
        );
    }

    haveFestivals(objects, targetMonth, targetDay) {
        return objects.some(
            (object) => object.month === targetMonth && object.day === targetDay
        );
    }
    isLeapYear() {
        const leapEveryYear = 4;
        return (
            (this.year % leapEveryYear === 0 &&
                this.year % (leapEveryYear * 25) !== 0) ||
            this.year % (leapEveryYear * 100) === 0
        );
    }

    showFirstDay(day) {
        day.style.gridColumnStart = this.calculateDayWeek(this.nDay);
    }

    calculateDayWeek(currentDay) {
        const leapEveryYear = 4;
        const totalLeapDaysPassed =
            parseInt(this.year / leapEveryYear) -
            parseInt(this.year / (leapEveryYear * 25)) +
            parseInt(this.year / (leapEveryYear * 100));
        const totalDaysPassed = this.year * 365;
        return (totalDaysPassed + totalLeapDaysPassed + currentDay - 1) % 7;
    }

    findIndex(monthName) {
        return this.infoYear.months.findIndex(
            (month) => month.name === monthName
        );
    }

    getMaxDays(month, maxDays) {
        const monthInfo = this.infoYear.months[this.findIndex(month)];
        if (monthInfo.leap_day !== undefined) {
            if (!this.isLeapYear()) {
                maxDays--;
            }
        }
        return maxDays;
    }

    addExtraSpace(sectionYear) {
        const separateElement = document.createElement("br");
        separateElement.classList.add("separate");
        sectionYear.appendChild(separateElement);
    }
}
