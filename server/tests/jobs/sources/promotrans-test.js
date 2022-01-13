const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertOrganisme } = require("../../utils/fakeData");

describe("promotrans", () => {
  it("Vérifie qu'on peut collecter des informations du fichier promotrans", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("promotrans", {
      input: createStream(
        `siret;uai
"11111111100006";"0111111Y"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["promotrans"]);
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["promotrans"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      promotrans: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });
});
