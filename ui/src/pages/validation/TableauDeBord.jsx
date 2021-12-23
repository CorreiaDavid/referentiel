import { Col, Container, GridRow } from "../../common/dsfr/fondamentaux";
import React, { useContext } from "react";
import ValidationCard from "./fragments/ValidationCard";
import DepartementAuthSelector from "./fragments/DepartementAuthSelector";
import useNavigation from "../../common/navigation/useNavigation";
import { useFetch } from "../../common/hooks/useFetch";
import Spinner from "../../common/Spinner";
import MainTitle from "../../common/layout/MainTitle";
import { AuthContext } from "../../common/AuthRoutes";

export default function TableauDeBord() {
  let [auth] = useContext(AuthContext);
  let title = `${auth.type === "region" ? "Région" : "Académie"} : ${auth.nom}`;

  let { params, buildUrl, navigate } = useNavigation();
  let [{ data, loading, error }] = useFetch(buildUrl("/api/v1/validation", params), {
    validation: {},
  });

  return (
    <>
      <MainTitle
        title={title}
        selector={<DepartementAuthSelector onChange={(code) => navigate({ departements: code })} />}
      />
      <Container>
        <GridRow>
          <Spinner loading={loading} error={error} />
        </GridRow>
        <GridRow modifiers={"gutters"} className={"fr-pb-3w"}>
          <Col modifiers={"12 sm-4"}>
            <ValidationCard type={"A_VALIDER"} label={"UAI à valider"} nbElements={data.validation["A_VALIDER"]} />
          </Col>
          <Col modifiers={"12 sm-4"}>
            <ValidationCard
              type={"A_RENSEIGNER"}
              label={"UAI à renseigner"}
              nbElements={data.validation["A_RENSEIGNER"]}
            />
          </Col>
          <Col modifiers={"12 sm-4"}>
            <ValidationCard type={"VALIDE"} label={"UAI validées"} nbElements={data.validation["VALIDE"]} />
          </Col>
        </GridRow>
      </Container>
    </>
  );
}
