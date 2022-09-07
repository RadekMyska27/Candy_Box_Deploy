/* eslint-disable no-undef */

class Utils {
    getVariableSymbol() {
        let date = new Date();
        return (
            date.getDate().toString() +
            date.getMonth().toString() +
            date.getFullYear().toString()
        );
    }

    getActualDate() {
        let date = new Date();
        return (
            date.getDate().toString() +
            "." +
            this.getCurrentMonth() +
            "." +
            date.getFullYear().toString() +
            "-" +
            date.getHours().toString() +
            ":" +
            date.getMinutes().toString() +
            ":" +
            date.getSeconds().toString()
        );
    }

    getCurrentMonth() {
        let date = new Date();
        let month = date.getMonth() + 1;
        return month.toString();
    }

    getActualYearMonthDay() {
        let date = new Date();
        let month = date.getMonth() + 1;
        return {year: date.getFullYear().toString(), month: month.toString(), day: date.getDate().toString()}
    }

    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    async delay(ms) {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }
}

module.exports = {
    Utils: Utils,
};
