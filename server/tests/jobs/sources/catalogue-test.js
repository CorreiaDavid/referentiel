const assert = require("assert");
const { getCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const { importReferentiel } = require("../../utils/testUtils");
const { insertEtablissement } = require("../../utils/fakeData");
const collectSources = require("../../../src/jobs/tasks/collectSources");

describe(__filename, () => {
  it("Vérifie qu'on peut collecter des informations relatives aux établissements du catalogue", async () => {
    await importReferentiel();
    await insertEtablissement({
      uai: "0111111Y",
      siret: "11111111100006",
      entreprise_raison_sociale: "Centre de formation",
    });
    let source = createSource("catalogue");

    let stats = await collectSources(source);

    let found = await getCollection("annuaire").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["catalogue"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut filter par siret", async () => {
    await importReferentiel();
    await insertEtablissement({
      uai: "0111111Y",
      siret: "11111111100006",
      entreprise_raison_sociale: "Centre de formation",
    });
    let source = createSource("catalogue");

    let stats = await collectSources(source, {
      filters: { siret: "33333333300008" },
    });

    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 0,
        updated: 0,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
