/* eslint-disable no-undef */

const cors = require("cors");
const { LogUtils } = require("./logUtils");
const { CandyConstants } = require("../constants/candyConstants");
const { CandyMessages } = require("../constants/candyMessages");

class ExpressSetup {
  constructor() {}

  get className() {
    return this.constructor.name;
  }

  setUpNodeJsServer(app, express) {
    app.use(express.json()); // Bez tohoto middleware bychom v req.body nic nenašli.
    app.use(cors());
    app.listen(CandyConstants.nodeJsServerPort, () =>
      LogUtils.log(
        this.className,
        CandyMessages.nodeJsServerListen(CandyConstants.nodeJsServerPort)
      )
    );
  }
}

module.exports = {
  ExpressSetup: ExpressSetup,
};
