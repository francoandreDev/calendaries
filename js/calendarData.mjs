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

    const positivistCalendar = new Calendar(
        "Positivist",
        positivist.description,
        positivist.months,
        positivist.festivals
    )

    const revolutionaryCalendar = new Calendar(
        "Revolutionary",
        revolutionary.description,
        revolutionary.months,
        revolutionary.festivals
    )

    const chineseCalendar = new Calendar(
        "Chinese",
        chinese.description,
        chinese.months,
        chinese.festivals
    )

    const gregorianYear = gregorianCalendar.buildCalendar();
    const internationalFixedYear = internationalFixedCalendar.buildCalendar();
    const positivistYear = positivistCalendar.buildCalendar();
    const revolutionaryYear = revolutionaryCalendar.buildCalendar();
    const chineseYear = chineseCalendar.buildCalendar();

    return {
        gregorianYear,
        gregorianCalendar,
        internationalFixedYear,
        internationalFixedCalendar,
        positivistYear,
        positivistCalendar,
        revolutionaryYear,
        revolutionaryCalendar,
        chineseYear,
        chineseCalendar
    };
}
