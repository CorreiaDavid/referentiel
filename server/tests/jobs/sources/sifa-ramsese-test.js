const assert = require("assert");
const { getCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/tasks/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertAnnuaire } = require("../../utils/fakeData");

describe(__filename, () => {
  it("Vérifie qu'on peut collecter l'uai", async () => {
    await insertAnnuaire({
      siret: "11111111100006",
    });
    let source = createSource("sifa-ramsese", {
      input: createStream(`"numero_uai";"numero_siren_siret_uai"
"0111111Y";"11111111100006"`),
    });

    let stats = await collectSources(source);

    let found = await getCollection("annuaire").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["sifa-ramsese"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      ["sifa-ramsese"]: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
