const { compose, transformData, filterData } = require("oleoduc");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "cci-france";

  return {
    name,
    async stream() {
      let input =
        custom.input || (await getOvhFileAsStream("cfas-reseaux/cfas-cci-france.csv", { storage: "mna-flux" }));

      return compose(
        input,
        parseCsv({
          delimiter: ";",
          trim: true,
          bom: true,
          columns: true,
        }),
        filterData((data) => data.uai),
        transformData((data) => {
          return {
            from: name,
            selector: { uai: data["uai"] },
            reseaux: ["cci-france"],
          };
        })
      );
    },
  };
};
