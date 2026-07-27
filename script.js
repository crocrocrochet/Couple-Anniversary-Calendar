"use strict";

const startDateInput = document.getElementById("startDate");
const yourBirthdayInput = document.getElementById("yourBirthday");

const partnerBirthdayContainer = document.getElementById(
    "partnerBirthdayContainer"
);

const addPartnerButton = document.getElementById(
    "addPartnerButton"
);

const generateButton = document.getElementById("generateButton");
const errorMessage = document.getElementById("errorMessage");

const summarySection = document.getElementById("summarySection");
const selectedDateText = document.getElementById("selectedDateText");
const endDateText = document.getElementById("endDateText");

const resultSection = document.getElementById("resultSection");

const MAX_DAY = 10000;
const MAX_PARTNERS = 4;

let currentLanguage = "zh";
let lastGeneratedStartDate = null;

function getEnglishOrdinalSuffix(number) {
    const remainder100 = number % 100;

    if (remainder100 >= 11 && remainder100 <= 13) {
        return "th";
    }

    switch (number % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

const translations = {
    zh: {
        documentTitle: "情侶紀念日記錄",
        appTitle: "情侶紀念日記錄",
        subtitle: "記下相遇的第一天，以及彼此的重要日期",
        yourBirthday: "你的生日",
        marriageDate: "結婚紀念日（選填）",
        partnerBirthday: "對方生日",
        partnerBirthdayNumber: number => `對方 ${number} 生日`,
        birthdayNote: "最多可輸入四位「對方生日」",
        generateButton: "生成紀念日",
        datePlaceholder: "YYYY/MM/DD",
        missingDayOne: "請先輸入 Day 1 的日期。",
        invalidDayOne:
            "Day 1 日期格式不正確，請輸入 YYYY/MM/DD，或使用日曆選擇。",
        noEvents: "沒有找到可以顯示的日期。",
        dayOneCalendar: "開啟 Day 1 日曆",
        yourBirthdayCalendar: "開啟你的生日月曆",
        marriageDateCalendar: "開啟結婚日期月曆",
        marriageDateInput: "輸入或選擇結婚日期",
        partnerBirthdayCalendar: number =>
            `開啟第 ${number} 位對方的生日月曆`,
        partnerBirthdayInput: number =>
            `輸入或選擇第 ${number} 位對方的生日`,
        removePartner: number =>
            `移除第 ${number} 位對方的生日欄位`,
        addPartner: "增加另一位對方的生日",
        openCalendar: "開啟日曆",
        yourBirthdayEvent: "你的生日",
        weddingAnniversary: years =>
            years === 0
                ? "結婚日"
                : `結婚 ${years} 週年紀念`,
        partnerBirthdayEvent: "對方生日",
        partnerBirthdayEventNumber: number =>
            `對方 ${number} 生日`,
        holidays: {
            newYear: "元旦",
            valentines: "情人節",
            whiteDay: "白色情人節",
            may20: "520",
            christmas: "聖誕節",
            lantern: "元宵節",
            qixi: "七夕",
            midAutumn: "中秋節"
        },
        anniversary100: day =>
            `Day ${day.toLocaleString("zh-TW")}・百日紀念日`,
        anniversary500: day =>
            `Day ${day.toLocaleString("zh-TW")}・五百日紀念日`,
        anniversary1000: day =>
            `Day ${day.toLocaleString("zh-TW")}・千日紀念日`,
        anniversary10000: "Day 10,000・萬日紀念日",
        weekdayNames: [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六"
        ],
        dateShort: (month, day, weekday) =>
            `${month}月${day}日（${weekday}）`,
        dateLong: (year, month, day, weekday) =>
            `${year}年${month}月${day}日（${weekday}）`
    },

    en: {
        documentTitle: "Couple Anniversary Calendar",
        appTitle: "Couple Anniversary Calendar",
        subtitle:
            "Save the first day of your story and every date that matters.",
        yourBirthday: "Your birthday",
        marriageDate: "Wedding anniversary (optional)",
        partnerBirthday: "Partner's birthday",
        partnerBirthdayNumber: number =>
            `Partner ${number}'s birthday`,
        birthdayNote: "You can add up to four partners.",
        generateButton: "Calculate dates",
        datePlaceholder: "YYYY/MM/DD",
        missingDayOne: "Please enter your Day 1 date.",
        invalidDayOne:
            "The Day 1 date is invalid. Enter YYYY/MM/DD or select it from the calendar.",
        noEvents: "No dates were found.",
        dayOneCalendar: "Open the Day 1 calendar",
        yourBirthdayCalendar: "Open your birthday calendar",
        marriageDateCalendar: "Open the wedding date calendar",
        marriageDateInput: "Enter or select the wedding date",
        partnerBirthdayCalendar: number =>
            `Open Partner ${number}'s birthday calendar`,
        partnerBirthdayInput: number =>
            `Enter or select Partner ${number}'s birthday`,
        removePartner: number =>
            `Remove Partner ${number}'s birthday field`,
        addPartner: "Add another partner's birthday",
        openCalendar: "Open calendar",
        yourBirthdayEvent: "Your birthday",
        weddingAnniversary: years =>
            years === 0
                ? "Wedding day"
                : `${years}${getEnglishOrdinalSuffix(years)} wedding anniversary`,
        partnerBirthdayEvent: "Partner's birthday",
        partnerBirthdayEventNumber: number =>
            `Partner ${number}'s birthday`,
        holidays: {
            newYear: "New Year's Day",
            valentines: "Valentine's Day",
            whiteDay: "White Day",
            may20: "520 Day",
            christmas: "Christmas Day",
            lantern: "Lantern Festival",
            qixi: "Qixi Festival",
            midAutumn: "Mid-Autumn Festival"
        },
        anniversary100: day =>
            `Day ${day.toLocaleString("en-US")}・100-day anniversary`,
        anniversary500: day =>
            `Day ${day.toLocaleString("en-US")}・500-day anniversary`,
        anniversary1000: day =>
            `Day ${day.toLocaleString("en-US")}・1,000-day anniversary`,
        anniversary10000: "Day 10,000・10,000-day anniversary",
        weekdayNames: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],
        dateShort: (month, day, weekday) =>
            `${month}/${day} (${weekday})`,
        dateLong: (year, month, day, weekday) =>
            `${year}/${month}/${day} (${weekday})`
    }
};

function t(key) {
    return translations[currentLanguage][key];
}

const WEEKDAY_NAMES = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
];

let partnerInputCount = 1;

function createUtcDate(year, month, day) {
    return new Date(
        Date.UTC(year, month - 1, day, 12)
    );
}

function parseDateInput(value){

    if(!value) return null;

    value = value.trim();

    // 支援 19900209
    if(/^\d{8}$/.test(value)){

        value =
            value.substring(0,4)+"/"+
            value.substring(4,6)+"/"+
            value.substring(6,8);

    }

    value = value
        .replace(/-/g,"/")
        .replace(/\./g,"/");

    const match =
        value.match(
            /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/
        );

    if(!match) return null;

    const year=+match[1];
    const month=+match[2];
    const day=+match[3];

    const date =
        new Date(
            Date.UTC(
                year,
                month-1,
                day
            )
        );

    if(
        date.getUTCFullYear()!=year ||
        date.getUTCMonth()!=month-1 ||
        date.getUTCDate()!=day
    ){
        return null;
    }

    return date;

}

function formatDateForTextInput(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
}

function formatDateForNativeInput(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function initializeDatePickerField(container = document) {
    const calendarButtons = container.querySelectorAll(
        ".calendar-button:not([data-ready])"
    );

    calendarButtons.forEach(button => {
        button.dataset.ready = "true";

        const textInputId = button.dataset.dateTarget;
        const textInput = document.getElementById(textInputId);
        const field = button.closest(".date-picker-field");
        const nativeInput = field.querySelector(
            ".native-date-input"
        );

        button.addEventListener("click", () => {
            const typedDate = parseDateInput(textInput.value);

            if (typedDate) {
                nativeInput.value =
                    formatDateForNativeInput(typedDate);
            }

            if (typeof nativeInput.showPicker === "function") {
                nativeInput.showPicker();
            } else {
                nativeInput.focus();
                nativeInput.click();
            }
        });

        nativeInput.addEventListener("change", () => {

    if (!nativeInput.value) return;

    const [year, month, day] =
        nativeInput.value.split("-");

    textInput.value =
        `${year}/${month}/${day}`;

    textInput.dispatchEvent(
        new Event("input")
    );

});

        textInput.addEventListener("input", () => {

    let value =
        textInput.value.replace(/\D/g, "");

    if (value.length > 8) {
        value = value.substring(0, 8);
    }

    if (value.length >= 5) {

        value =
            value.substring(0,4) +
            "/" +
            value.substring(4);

    }

    if (value.length >= 8) {

        value =
            value.substring(0,7) +
            "/" +
            value.substring(7);

    }

    textInput.value = value;

    textInput.classList.remove(
        "invalid-date"
    );

});

        textInput.addEventListener("input", () => {
            textInput.classList.remove("invalid-date");
        });
    });
}

function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setUTCDate(newDate.getUTCDate() + days);
    return newDate;
}

function getDateKey(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDisplayDate(date, includeYear = false) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const weekday =
        translations[currentLanguage].weekdayNames[
            date.getUTCDay()
        ];

    if (includeYear) {
        return translations[currentLanguage].dateLong(
            year,
            month,
            day,
            weekday
        );
    }

    return translations[currentLanguage].dateShort(
        month,
        day,
        weekday
    );
}

function isDateWithinRange(date, startDate, endDate) {
    return date >= startDate && date <= endDate;
}

function addEvent(eventMap, date, label, type = "normal") {
    const key = getDateKey(date);

    if (!eventMap.has(key)) {
        eventMap.set(key, {
            date: new Date(date),
            labels: []
        });
    }

    const event = eventMap.get(key);

    const alreadyExists = event.labels.some(
        item => item.label === label
    );

    if (!alreadyExists) {
        event.labels.push({
            label,
            type
        });
    }
}

function addFixedHoliday(
    eventMap,
    year,
    month,
    day,
    label,
    startDate,
    endDate
) {
    const holidayDate = createUtcDate(year, month, day);

    if (
        isDateWithinRange(
            holidayDate,
            startDate,
            endDate
        )
    ) {
        addEvent(
            eventMap,
            holidayDate,
            label,
            "holiday"
        );
    }
}

function getChineseLunarParts(date) {
    try {
        const formatter = new Intl.DateTimeFormat(
            "zh-TW-u-ca-chinese",
            {
                month: "long",
                day: "numeric",
                timeZone: "UTC"
            }
        );

        const parts = formatter.formatToParts(date);

        const monthPart = parts.find(
            part => part.type === "month"
        );

        const dayPart = parts.find(
            part => part.type === "day"
        );

        return {
            month: monthPart?.value ?? "",
            day: dayPart?.value ?? "",
            fullText: formatter.format(date)
        };
    } catch (error) {
        console.warn("瀏覽器不支援農曆日期格式：", error);

        return {
            month: "",
            day: "",
            fullText: ""
        };
    }
}

function normalizeChineseText(text) {
    return String(text)
        .replace(/\s/g, "")
        .replace("十一月", "11月")
        .replace("十二月", "12月")
        .replace("正月", "1月")
        .replace("冬月", "11月")
        .replace("臘月", "12月");
}

function getLunarMonthTexts(month) {
    const chineseMonths = {
        1: ["1月", "正月"],
        2: ["2月", "二月"],
        3: ["3月", "三月"],
        4: ["4月", "四月"],
        5: ["5月", "五月"],
        6: ["6月", "六月"],
        7: ["7月", "七月"],
        8: ["8月", "八月"],
        9: ["9月", "九月"],
        10: ["10月", "十月"],
        11: ["11月", "十一月", "冬月"],
        12: ["12月", "十二月", "臘月"]
    };

    return chineseMonths[month] ?? [`${month}月`];
}

function getLunarDayTexts(day) {
    const chineseDays = {
        1: ["1", "初一"],
        2: ["2", "初二"],
        3: ["3", "初三"],
        4: ["4", "初四"],
        5: ["5", "初五"],
        6: ["6", "初六"],
        7: ["7", "初七"],
        8: ["8", "初八"],
        9: ["9", "初九"],
        10: ["10", "初十"],
        11: ["11", "十一"],
        12: ["12", "十二"],
        13: ["13", "十三"],
        14: ["14", "十四"],
        15: ["15", "十五"],
        16: ["16", "十六"],
        17: ["17", "十七"],
        18: ["18", "十八"],
        19: ["19", "十九"],
        20: ["20", "二十"],
        21: ["21", "廿一"],
        22: ["22", "廿二"],
        23: ["23", "廿三"],
        24: ["24", "廿四"],
        25: ["25", "廿五"],
        26: ["26", "廿六"],
        27: ["27", "廿七"],
        28: ["28", "廿八"],
        29: ["29", "廿九"],
        30: ["30", "三十"]
    };

    return chineseDays[day] ?? [String(day)];
}

function isLunarDate(date, targetMonth, targetDay) {
    const lunar = getChineseLunarParts(date);

    const month = normalizeChineseText(lunar.month);
    const day = normalizeChineseText(lunar.day);
    const fullText = normalizeChineseText(lunar.fullText);

    const monthTexts = getLunarMonthTexts(targetMonth);
    const dayTexts = getLunarDayTexts(targetDay);

    const monthMatches = monthTexts.some(text =>
        month.includes(text) || fullText.includes(text)
    );

    const dayMatches = dayTexts.some(text =>
        day === text ||
        day.includes(text) ||
        fullText.includes(text)
    );

    return monthMatches && dayMatches;
}

function findLunarHolidayInGregorianYear(
    year,
    lunarMonth,
    lunarDay
) {
    const firstDate = createUtcDate(year, 1, 1);
    const lastDate = createUtcDate(year, 12, 31);

    for (
        let currentDate = firstDate;
        currentDate <= lastDate;
        currentDate = addDays(currentDate, 1)
    ) {
        if (
            isLunarDate(
                currentDate,
                lunarMonth,
                lunarDay
            )
        ) {
            return currentDate;
        }
    }

    return null;
}

function addLunarHoliday(
    eventMap,
    year,
    lunarMonth,
    lunarDay,
    label,
    startDate,
    endDate
) {
    const holidayDate = findLunarHolidayInGregorianYear(
        year,
        lunarMonth,
        lunarDay
    );

    if (
        holidayDate &&
        isDateWithinRange(
            holidayDate,
            startDate,
            endDate
        )
    ) {
        addEvent(
            eventMap,
            holidayDate,
            label,
            "holiday"
        );
    }
}

function addAnniversaryEvents(eventMap, startDate) {
    addEvent(
        eventMap,
        startDate,
        "Day 1",
        "day-one"
    );

    for (
        let dayNumber = 100;
        dayNumber <= MAX_DAY;
        dayNumber += 100
    ) {
        const anniversaryDate = addDays(
            startDate,
            dayNumber - 1
        );

        if (dayNumber === 10000) {
            addEvent(
                eventMap,
                anniversaryDate,
                translations[currentLanguage].anniversary10000,
                "major"
            );

            continue;
        }

        if (dayNumber % 1000 === 0) {
            addEvent(
                eventMap,
                anniversaryDate,
                translations[currentLanguage].anniversary1000(dayNumber),
                "major"
            );

            continue;
        }

        if (dayNumber % 500 === 0) {
            addEvent(
                eventMap,
                anniversaryDate,
                translations[currentLanguage].anniversary500(dayNumber),
                "major"
            );

            continue;
        }

        addEvent(
            eventMap,
            anniversaryDate,
            translations[currentLanguage].anniversary100(dayNumber),
            "anniversary"
        );
    }
}

function addHolidayEvents(
    eventMap,
    startDate,
    endDate
) {
    const startYear = startDate.getUTCFullYear();
    const endYear = endDate.getUTCFullYear();

    for (
        let year = startYear;
        year <= endYear;
        year++
    ) {
        addFixedHoliday(
            eventMap,
            year,
            1,
            1,
            translations[currentLanguage].holidays.newYear,
            startDate,
            endDate
        );

        addFixedHoliday(
            eventMap,
            year,
            2,
            14,
            translations[currentLanguage].holidays.valentines,
            startDate,
            endDate
        );

        addFixedHoliday(
            eventMap,
            year,
            3,
            14,
            translations[currentLanguage].holidays.whiteDay,
            startDate,
            endDate
        );

        addFixedHoliday(
            eventMap,
            year,
            5,
            20,
            translations[currentLanguage].holidays.may20,
            startDate,
            endDate
        );

        addFixedHoliday(
            eventMap,
            year,
            12,
            25,
            translations[currentLanguage].holidays.christmas,
            startDate,
            endDate
        );

        addLunarHoliday(
            eventMap,
            year,
            1,
            15,
            translations[currentLanguage].holidays.lantern,
            startDate,
            endDate
        );

        addLunarHoliday(
            eventMap,
            year,
            7,
            7,
            translations[currentLanguage].holidays.qixi,
            startDate,
            endDate
        );

        addLunarHoliday(
            eventMap,
            year,
            8,
            15,
            translations[currentLanguage].holidays.midAutumn,
            startDate,
            endDate
        );
    }
}

/*
    生日只需要使用出生日期的月、日。
    每一年都會建立一次生日事件。
*/
function addBirthdayForEveryYear(
    eventMap,
    birthdayDate,
    label,
    startDate,
    endDate
) {
    const birthdayMonth = birthdayDate.getUTCMonth() + 1;
    const birthdayDay = birthdayDate.getUTCDate();

    const startYear = startDate.getUTCFullYear();
    const endYear = endDate.getUTCFullYear();

    for (
        let year = startYear;
        year <= endYear;
        year++
    ) {
        /*
            2月29日只會在閏年成功成為2月29日。
            非閏年時 Date 會滾動到3月1日，因此要檢查。
        */
        const yearlyBirthday = createUtcDate(
            year,
            birthdayMonth,
            birthdayDay
        );

        const isSameMonthAndDay =
            yearlyBirthday.getUTCMonth() + 1 === birthdayMonth &&
            yearlyBirthday.getUTCDate() === birthdayDay;

        if (!isSameMonthAndDay) {
            continue;
        }

        if (
            isDateWithinRange(
                yearlyBirthday,
                startDate,
                endDate
            )
        ) {
            addEvent(
                eventMap,
                yearlyBirthday,
                label,
                "birthday"
            );
        }
    }
}

function getBirthdayPeople() {
    const people = [];

    const yourBirthday = parseDateInput(
        yourBirthdayInput.value
    );

    if (yourBirthday) {
        people.push({
            date: yourBirthday,
            label:
                translations[currentLanguage]
                    .yourBirthdayEvent
        });
    }

    const partnerInputs = document.querySelectorAll(
        ".partner-birthday-input"
    );

    partnerInputs.forEach((input, index) => {
        const birthday = parseDateInput(input.value);

        if (!birthday) {
            return;
        }

        const personNumber = index + 1;

        const label =
            partnerInputs.length === 1
                ? translations[currentLanguage]
                    .partnerBirthdayEvent
                : translations[currentLanguage]
                    .partnerBirthdayEventNumber(
                        personNumber
                    );

        people.push({
            date: birthday,
            label
        });
    });

    return people;
}

function addBirthdayEvents(
    eventMap,
    startDate,
    endDate
) {
    const people = getBirthdayPeople();

    people.forEach(person => {
        addBirthdayForEveryYear(
            eventMap,
            person.date,
            person.label,
            startDate,
            endDate
        );
    });
}

function sortEvents(eventMap) {
    return Array.from(eventMap.values()).sort(
        (eventA, eventB) =>
            eventA.date.getTime() -
            eventB.date.getTime()
    );
}

function groupEventsByYear(events) {
    const groupedEvents = new Map();

    events.forEach(event => {
        const year = event.date.getUTCFullYear();

        if (!groupedEvents.has(year)) {
            groupedEvents.set(year, []);
        }

        groupedEvents.get(year).push(event);
    });

    return groupedEvents;
}

function createEventTag(labelData) {
    const tag = document.createElement("span");

    tag.className = "event-tag";
    tag.textContent = labelData.label;

    if (labelData.type === "day-one") {
        tag.classList.add("day-one");
    }

    if (labelData.type === "major") {
        tag.classList.add("major");
    }

    if (labelData.type === "birthday") {
        tag.classList.add("birthday");
    }

    if (/Day|\d/.test(labelData.label)) {
        tag.classList.add("latin-text");
    }

    return tag;
}

function createEventItem(event) {
    const eventItem = document.createElement("article");
    eventItem.className = "event-item";

    const hasMajorEvent = event.labels.some(
        item =>
            item.type === "major" ||
            item.type === "day-one"
    );

    if (hasMajorEvent) {
        eventItem.classList.add("special-event");
    }

    const dateText = document.createElement("div");
    dateText.className = "event-date date-number";
    dateText.textContent = `【${formatDisplayDate(event.date)}】`;

    const labelContainer = document.createElement("div");
    labelContainer.className = "event-labels";

    event.labels.forEach(labelData => {
        labelContainer.appendChild(
            createEventTag(labelData)
        );
    });

    eventItem.append(
        dateText,
        labelContainer
    );

    return eventItem;
}

function renderEvents(events) {
    resultSection.innerHTML = "";

    if (events.length === 0) {
        resultSection.innerHTML = `
            <p class="empty-result">
                ${translations[currentLanguage].noEvents}
            </p>
        `;

        return;
    }

    const groupedEvents = groupEventsByYear(events);

    groupedEvents.forEach((yearEvents, year) => {
        const yearGroup = document.createElement("section");
        yearGroup.className = "year-group";

        const yearTitle = document.createElement("h2");
        yearTitle.className = "year-title";
        yearTitle.textContent = year;

        const eventList = document.createElement("div");
        eventList.className = "event-list";

        yearEvents.forEach(event => {
            eventList.appendChild(
                createEventItem(event)
            );
        });

        yearGroup.append(
            yearTitle,
            eventList
        );

        resultSection.appendChild(yearGroup);
    });
}

function updatePartnerButtons() {
    addPartnerButton.disabled =
        partnerInputCount >= MAX_PARTNERS;
}

function addPartnerBirthdayInput() {
    if (partnerInputCount >= MAX_PARTNERS) {
        return;
    }

    partnerInputCount++;

    const row = document.createElement("div");
    row.className = "form-row partner-birthday-row";
    row.dataset.partnerRow = String(partnerInputCount);

    const label = document.createElement("label");
    label.htmlFor = `partnerBirthday${partnerInputCount}`;
    label.textContent =
        translations[currentLanguage]
            .partnerBirthdayNumber(partnerInputCount);

    const dateField = document.createElement("div");
    dateField.className = "date-picker-field";

    const input = document.createElement("input");
    input.type = "text";
    input.id = `partnerBirthday${partnerInputCount}`;
    input.className =
        "date-text-input partner-birthday-input";
    input.dataset.personNumber = String(partnerInputCount);
    input.inputMode = "numeric";
    input.placeholder = "YYYY/MM/DD";
    input.autocomplete = "off";
    input.setAttribute(
        "aria-label",
        translations[currentLanguage]
            .partnerBirthdayInput(partnerInputCount)
    );

    const calendarButton = document.createElement("button");
    calendarButton.type = "button";
    calendarButton.className = "calendar-button";
    calendarButton.dataset.dateTarget = input.id;
    calendarButton.textContent = "♡";
    calendarButton.title = "開啟日曆";
    calendarButton.setAttribute(
        "aria-label",
        translations[currentLanguage]
            .partnerBirthdayCalendar(partnerInputCount)
    );

    const nativeInput = document.createElement("input");
    nativeInput.type = "date";
    nativeInput.className = "native-date-input";
    nativeInput.dataset.textTarget = input.id;
    nativeInput.tabIndex = -1;
    nativeInput.setAttribute("aria-hidden", "true");

    dateField.append(
        input,
        calendarButton,
        nativeInput
    );

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "icon-button remove-button";
    removeButton.textContent = "−";
    removeButton.title = "移除此生日欄位";
    removeButton.setAttribute(
        "aria-label",
        translations[currentLanguage]
            .removePartner(partnerInputCount)
    );

    removeButton.addEventListener("click", () => {
        row.remove();
        partnerInputCount--;
        renumberPartnerRows();
        initializeDatePickerField();
updateStaticLanguageText();
updatePartnerButtons();
    });

    row.append(
        label,
        dateField,
        removeButton
    );

    partnerBirthdayContainer.appendChild(row);

    renumberPartnerRows();
    initializeDatePickerField(row);
    updatePartnerButtons();
}

function renumberPartnerRows() {
    const rows = partnerBirthdayContainer.querySelectorAll(
        ".partner-birthday-row"
    );

    rows.forEach((row, index) => {
        const number = index + 1;
        const label = row.querySelector("label");
        const input = row.querySelector(
            ".partner-birthday-input"
        );
        const calendarButton = row.querySelector(
            ".calendar-button"
        );
        const nativeInput = row.querySelector(
            ".native-date-input"
        );

        input.id = `partnerBirthday${number}`;
        input.dataset.personNumber = String(number);

        calendarButton.dataset.dateTarget = input.id;
        nativeInput.dataset.textTarget = input.id;

        if (rows.length === 1) {
            label.textContent =
                translations[currentLanguage]
                    .partnerBirthday;
        } else {
            label.textContent =
                translations[currentLanguage]
                    .partnerBirthdayNumber(number);
        }

        input.setAttribute(
            "aria-label",
            translations[currentLanguage]
                .partnerBirthdayInput(number)
        );

        calendarButton.setAttribute(
            "aria-label",
            translations[currentLanguage]
                .partnerBirthdayCalendar(number)
        );

        const removeButton = row.querySelector(
            ".remove-button"
        );

        if (removeButton) {
            removeButton.setAttribute(
                "aria-label",
                translations[currentLanguage]
                    .removePartner(number)
            );
        }

        label.htmlFor = input.id;
    });

    partnerInputCount = rows.length;
}


function addWeddingAnniversaries(
    eventMap,
    marriageDate,
    startDate,
    endDate
) {
    if (!marriageDate) {
        return;
    }

    const marriageMonth =
        marriageDate.getUTCMonth();
    const marriageDay =
        marriageDate.getUTCDate();

    const firstYear = Math.max(
        marriageDate.getUTCFullYear(),
        startDate.getUTCFullYear()
    );

    const lastYear = endDate.getUTCFullYear();

    for (let year = firstYear; year <= lastYear; year++) {
        const anniversaryDate = createUtcDate(
            year,
            marriageMonth + 1,
            marriageDay
        );

        const isValidDate =
            anniversaryDate.getUTCMonth() ===
                marriageMonth &&
            anniversaryDate.getUTCDate() ===
                marriageDay;

        if (!isValidDate) {
            continue;
        }

        if (
            anniversaryDate < startDate ||
            anniversaryDate > endDate
        ) {
            continue;
        }

        const years =
            year - marriageDate.getUTCFullYear();

        addEvent(
            eventMap,
            anniversaryDate,
            translations[currentLanguage]
                .weddingAnniversary(years)
        );
    }
}

function generateTimeline(shouldScroll = true) {
    errorMessage.textContent = "";

    if (!startDateInput.value) {
        errorMessage.textContent = translations[currentLanguage].missingDayOne;
        summarySection.classList.add("hidden");
        resultSection.innerHTML = "";

        return;
    }

    const startDate = parseDateInput(
        startDateInput.value
    );

    if (
        !startDate ||
        Number.isNaN(startDate.getTime())
    ) {
        errorMessage.textContent =
            translations[currentLanguage].invalidDayOne;

        summarySection.classList.add("hidden");
        resultSection.innerHTML = "";

        return;
    }

    const marriageDateInput =
        document.getElementById("marriageDate");

    const marriageDateValue =
        marriageDateInput
            ? marriageDateInput.value.trim()
            : "";

    const marriageDate =
        marriageDateValue
            ? parseDateInput(marriageDateValue)
            : null;

    if (marriageDateValue && !marriageDate) {
        errorMessage.textContent =
            currentLanguage === "zh"
                ? "結婚紀念日格式不正確，請輸入 YYYY/MM/DD，或使用日曆選擇。"
                : "The wedding date is invalid. Enter YYYY/MM/DD or select it from the calendar.";

        marriageDateInput.classList.add(
            "invalid-date"
        );

        return;
    }

    if (marriageDateInput) {
        marriageDateInput.classList.remove(
            "invalid-date"
        );
    }

    lastGeneratedStartDate = startDate;

    const endDate = addDays(
        startDate,
        MAX_DAY - 1
    );

    const eventMap = new Map();

    addAnniversaryEvents(
        eventMap,
        startDate
    );

    addHolidayEvents(
        eventMap,
        startDate,
        endDate
    );

    addBirthdayEvents(
        eventMap,
        startDate,
        endDate
    );

    addWeddingAnniversaries(
        eventMap,
        marriageDate,
        startDate,
        endDate
    );

    const events = sortEvents(eventMap);

    selectedDateText.textContent =
        `Day 1｜${formatDisplayDate(startDate, true)}`;

    endDateText.textContent =
        `Day 10,000｜${formatDisplayDate(endDate, true)}`;

    summarySection.classList.remove("hidden");

    renderEvents(events);

    if (shouldScroll) {
        summarySection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

function updateStaticLanguageText() {
    document.documentElement.lang =
        currentLanguage === "zh" ? "zh-Hant" : "en";

    document.body.dataset.language = currentLanguage;
    document.title =
        translations[currentLanguage].documentTitle;

    document.querySelectorAll("[data-i18n]").forEach(
        element => {
            const key = element.dataset.i18n;
            const value =
                translations[currentLanguage][key];

            if (typeof value === "string") {
                element.textContent = value;
            }
        }
    );

    document.querySelectorAll(
        ".date-text-input"
    ).forEach(input => {
        input.placeholder =
            translations[currentLanguage]
                .datePlaceholder;
    });

    addPartnerButton.title =
        translations[currentLanguage].addPartner;

    addPartnerButton.setAttribute(
        "aria-label",
        translations[currentLanguage].addPartner
    );

    const startCalendarButton =
        document.querySelector(
            '[data-date-target="startDate"]'
        );

    if (startCalendarButton) {
        startCalendarButton.setAttribute(
            "aria-label",
            translations[currentLanguage]
                .dayOneCalendar
        );
    }

    const yourCalendarButton =
        document.querySelector(
            '[data-date-target="yourBirthday"]'
        );

    if (yourCalendarButton) {
        yourCalendarButton.setAttribute(
            "aria-label",
            translations[currentLanguage]
                .yourBirthdayCalendar
        );
    }

    const marriageInput =
        document.getElementById("marriageDate");

    const marriageCalendarButton =
        document.querySelector(
            '[data-date-target="marriageDate"]'
        );

    if (marriageInput) {
        marriageInput.setAttribute(
            "aria-label",
            translations[currentLanguage]
                .marriageDateInput
        );
    }

    if (marriageCalendarButton) {
        marriageCalendarButton.setAttribute(
            "aria-label",
            translations[currentLanguage]
                .marriageDateCalendar
        );
    }

    renumberPartnerRows();

    document.querySelectorAll(
        ".language-button"
    ).forEach(button => {
        const isActive =
            button.dataset.language === currentLanguage;

        button.classList.toggle(
            "active",
            isActive
        );

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );
    });
}

function setLanguage(language) {
    if (!translations[language]) {
        return;
    }

    currentLanguage = language;
    updateStaticLanguageText();

    if (lastGeneratedStartDate) {
        generateTimeline(false);
    }
}

document.querySelectorAll(
    ".language-button"
).forEach(button => {
    button.addEventListener("click", () => {
        setLanguage(button.dataset.language);
    });
});

addPartnerButton.addEventListener(
    "click",
    addPartnerBirthdayInput
);

generateButton.addEventListener(
    "click",
    () => generateTimeline(true)
);

startDateInput.addEventListener(
    "keydown",
    event => {
        if (event.key === "Enter") {
            generateTimeline(true);
        }
    }
);

updatePartnerButtons();
