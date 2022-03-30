import Histogram from "../../common/nivo/Histogram";
import React from "react";
import { openNewTab } from "../../common/utils";
import {
  getValidationColor,
  getValidationLabel,
  getValidationParams,
  getValidationTypes,
} from "../../common/enums/validation";

export function ValidationHistogram({ stats }) {
  return (
    <Histogram
      title="Répartition des natures des organisme par académie"
      xLegend={"Académie"}
      yLegend={"Nombre d'organisme"}
      data={stats.academies}
      series={getValidationTypes()}
      getSerieLabel={(id) => getValidationLabel(id)}
      getSerieColor={(id) => getValidationColor(id)}
      groupBy={({ academie }) => academie.nom}
      onClick={({ id, data }) => {
        openNewTab({ ...getValidationParams(id), academies: data.academie.code });
      }}
    />
  );
}
