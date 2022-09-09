/* eslint-disable */
// eslint-disable-next-line no-undef

// eslint-disable-next-line no-undef
const {CandyConstants} = require("../constants/candyConstants");
const {DbUtils} = require("./dbUtils");
const {LogUtils} = require("./logUtils");
const {CandyStatistics} = require("../db/candy");


const dbUtils = new DbUtils()


class UpgradeScripts {

    get className() {
        return this.constructor.name;
    }

    async updateStatistic(doc, userHistoryDictionary, usersNames) {

        let candiesToStatistics = []

        try {
            const candyStatisticsSheet = await dbUtils.getSheetByUserName(
                doc,
                CandyConstants.candyStatisticsName
            );

            usersNames.forEach(userName => {
                    this.setupItemToStatistic(userName, userHistoryDictionary, candiesToStatistics);
                }
            )

            // update statistic db
            for (const candy of candiesToStatistics) {
                await this.upgradeCandyMonthStatics(candyStatisticsSheet, candy)
            }
        } catch (e) {
            LogUtils.log(this.className, "statistic updating failed: " + e);
            return false
        }

        // log info about update
        LogUtils.log(this.className, "statistic updating successful");
        return true
    }

    setupItemToStatistic(userName, userHistoryDictionary, candiesToStatistics) {
        // LogUtils.log(this.className, "geting candies for user " + userName);

        // get candyWithHistory for user
        let candiesWithHistory = userHistoryDictionary.get(userName);

        if (candiesWithHistory === undefined) {
            return
        }

        // filter deposit items
        candiesWithHistory.forEach((candyWithHistory) => {
            if (candyWithHistory.type !== CandyConstants.candyType.deposit) {
                // prepare year, month, day
                let date = candyWithHistory.lastUpdateDate

                let dateSplitByDot = date.split(".")
                let dateSplitByDash = dateSplitByDot[2].split("-")

                let day = dateSplitByDot[0]
                let month = dateSplitByDot[1]
                let year = dateSplitByDash[0]

                // prepare price negative -> positive
                const price = candyWithHistory.price
                candyWithHistory.price = Math.abs(price)

                candiesToStatistics.push(new CandyStatistics(year, month, day, candyWithHistory.id, candyWithHistory.name, candyWithHistory.price, 1))
            }
        })
    }

    async upgradeCandyMonthStatics(sheet, candy) {

        console.log("STATISTIC UPDATE WITH CANDY " + candy.candyName)
        //sales statistics
        const statisticsYear = 1;
        const statisticsMonth = 2;
        const statisticsDay = 3;
        const statisticsCandyId = 4;
// const statisticsCandyName = 5;
        const statisticsCandyPrice = 6;
        const statisticsConsumed = 7;

        let isStatisticUpdated = false
        try {

            await sheet.loadCells();

            for (let i = 1; i < 1000; i++) {
                let year = await sheet.getCell(
                    i,
                    statisticsYear
                );

                let month = await sheet.getCell(
                    i,
                    statisticsMonth
                );

                let day = await sheet.getCell(
                    i,
                    statisticsDay
                );

                let candyId = await sheet.getCell(
                    i,
                    statisticsCandyId
                );


                if (year.value === null) {
                    break;
                }

                if (candy.year === year.value.toString() && candy.month === month.value.toString() && candy.day === day.value.toString() && candy.itemId === candyId.value) {
                    let consumed = await sheet.getCell(
                        i,
                        statisticsConsumed
                    );


                    let price = await sheet.getCell(
                        i,
                        statisticsCandyPrice
                    );

                    const actualConsumed = consumed.value
                    consumed.value = actualConsumed + 1;

                    const actualPrice = price.value
                    price.value = actualPrice + candy.price

                    await sheet.saveUpdatedCells();

                    isStatisticUpdated = true
                    break;
                }
            }

            if (!isStatisticUpdated) {
                await sheet.addRow({
                    id: await dbUtils.getNewRowId(sheet),
                    year: candy.year,
                    month: candy.month,
                    day: candy.day,
                    itemId: candy.itemId,
                    candyName: candy.candyName,
                    price: candy.price,
                    consumed: 1,
                });
                await sheet.saveUpdatedCells();
            }

        } catch (error) {
            LogUtils.log(this.className, "candy statistic update failed " + error);
        }
    }

}


module.exports = {
    UpgradeScripts: UpgradeScripts,
};