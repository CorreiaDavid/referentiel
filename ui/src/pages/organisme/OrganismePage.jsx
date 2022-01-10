import { Col, GridRow } from "../../common/dsfr/fondamentaux";
import { useParams } from "react-router-dom";
import Alert from "../../common/dsfr/elements/Alert";
import { Tab, TabPanel } from "../../common/dsfr/elements/Tabs";
import React, { createContext, useContext } from "react";
import { Immatriculation } from "./tabs/Immatriculation";
import LayoutTitle from "../../common/layout/LayoutTitle";
import Reseaux from "./fragments/Reseaux";
import WideTabs from "../../common/dsfr/custom/WideTabs";
import LayoutContent from "../../common/layout/LayoutContent";
import { useFetch } from "../../common/hooks/useFetch";

export const OrganismeContext = createContext(null);

export function OrganismeTitle() {
  let { organisme } = useContext(OrganismeContext);

  return <span>{organisme.raison_sociale}</span>;
}

export default function OrganismePage() {
  let { siret } = useParams();
  let [{ data: organisme, loading, error }, setData] = useFetch(`/api/v1/organismes/${siret}`);

  if (error) {
    return (
      <GridRow className={"fr-pb-3w"}>
        <Col>
          <Alert modifiers={"error"} title={"Une erreur survenue"}>
            Impossible de récupérer les informations liées à cet organisme
          </Alert>
        </Col>
      </GridRow>
    );
  }

  if (loading) {
    return (
      <GridRow className={"fr-pb-3w"}>
        <Col>En cours de chargement...</Col>
      </GridRow>
    );
  }

  return (
    <OrganismeContext.Provider value={{ organisme, setData }}>
      <LayoutTitle title={<OrganismeTitle />} back={"Retour à la liste"}>
        <Reseaux organisme={organisme} />
      </LayoutTitle>
      <LayoutContent>
        <WideTabs
          className={"fr-mb-3w"}
          tabs={[
            {
              tab: <Tab>Identité</Tab>,
              panel: (
                <TabPanel>
                  <Immatriculation organisme={organisme} />
                </TabPanel>
              ),
            },
            { tab: <Tab disabled>Lieux de formations</Tab>, panel: <TabPanel>-</TabPanel> },
            { tab: <Tab disabled>Relations de sous traitances</Tab>, panel: <TabPanel>-</TabPanel> },
            { tab: <Tab disabled>Relations administratives</Tab>, panel: <TabPanel>-</TabPanel> },
          ]}
        />
      </LayoutContent>
    </OrganismeContext.Provider>
  );
}
