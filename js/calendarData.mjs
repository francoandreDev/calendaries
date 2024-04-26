import { Calendar } from "./handleCalendarData.mjs";

async function fetchCalendars() {
    try {
        const response = await fetch("../calendars.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.calendars;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

export async function getCalendars() {
    const dataCalendars = await fetchCalendars();
    const {
        gregorian,
        internationalFixed,
        positivist,
        revolutionary,
        chinese,
    } = dataCalendars;

    const gregorianCalendar = new Calendar(
        "Gregorian",
        gregorian.description,
        gregorian.months,
        gregorian.festivals
    );
    const internationalFixedCalendar = new Calendar(
        "International Fixed",
        internationalFixed.description,
        internationalFixed.months,
        internationalFixed.festivals
    );

    const gregorianYear = gregorianCalendar.buildCalendar();
    const internationalFixedYear = internationalFixedCalendar.buildCalendar();

    return {
        gregorianYear,
        gregorianCalendar,
        internationalFixedYear,
        internationalFixedCalendar,
    };
}
