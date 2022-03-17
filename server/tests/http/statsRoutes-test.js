const { strictEqual, deepStrictEqual } = require("assert");
const { insertOrganisme } = require("../utils/fakeData");
const { startServer, generateAuthHeader } = require("../utils/testUtils");

describe("statsRoutes", () => {
  it("Vérifie qu'on peut obtenir des stats", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({ uai: "0751234J" });

    let response = await httpClient.get("/api/v1/stats/couverture");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, { total: 2, valides: 1 });
  });

  it("Vérifie qu'on peut obtenir les stats des entrants sortants", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      qualiopi: true,
      nature: "responsable",
      adresse: {
        academie: { code: "01", nom: "Paris" },
      },
      _meta: { date_import: new Date() },
    });
    await insertOrganisme({
      qualiopi: true,
      nature: "responsable",
      etat_administratif: "fermé",
      adresse: {
        academie: { code: "01", nom: "Paris" },
      },
      _meta: { date_import: new Date(), date_sortie: new Date() },
    });

    let response = await httpClient.get("/api/v1/stats/entrants_sortants", {
      headers: {
        ...generateAuthHeader("academie", "01"),
      },
    });

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      entrants: [
        {
          annee: 2022,
          mois: 3,
          total: 2,
        },
      ],
      sortants: [
        {
          annee: 2022,
          mois: 3,
          total: 1,
        },
      ],
    });
  });
});
