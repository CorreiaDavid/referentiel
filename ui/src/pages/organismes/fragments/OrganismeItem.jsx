import { Box } from "../../../common/Flexbox";
import styled from "styled-components";
import React from "react";
import Identite from "../../organisme/fragments/Identite";
import { Link } from "../../../common/dsfr/elements/Link";
import { Link as ReactRouterLink } from "react-router-dom";

const ClickableItem = styled(ReactRouterLink)`
  div:hover {
    background-color: var(--background-box-hover);
  }
`;

const Card = styled(Box)`
  background-color: var(--background-box);
  padding: 1rem 2rem;
  margin-bottom: 1rem;
`;

const RaisonSociale = styled("div")`
  font-size: 1.25rem;
  line-height: 2rem;
  padding-bottom: 0.25rem;
`;

const Adresse = styled("div")`
  font-size: 1rem;
  line-height: 1.5rem;
  padding-bottom: 0.5rem;
`;

const Identifiants = styled(Box)`
  font-size: 0.875rem;
  line-height: 1.5rem;
  span {
    width: 50%;
  }
`;

export default function OrganismeItem({ organisme }) {
  let adresse = !organisme.adresse
    ? "Adresse inconnue"
    : organisme.adresse.label || `${organisme.adresse.code_postal || ""} ${organisme.adresse.localite || ""}`;

  return (
    <ClickableItem to={organisme.siret}>
      <Card direction={"column"}>
        <Box justify={"between"}>
          <Identite organisme={organisme} />
        </Box>
        <RaisonSociale className={"fr-text--bold"}>
          {organisme.raison_sociale || "Raison sociale inconnue"}
        </RaisonSociale>
        <Adresse>{adresse}</Adresse>
        <Box justify={"between"} align={"center"}>
          <Identifiants>
            <span>UAI&nbsp;:&nbsp;{organisme.uai || "N.A"}</span>
            <span>SIRET&nbsp;:&nbsp;{organisme.siret}</span>
          </Identifiants>
          <Link as={"span"} modifiers={"lg icon-right"} icons="arrow-right-line" />
        </Box>
      </Card>
    </ClickableItem>
  );
}
