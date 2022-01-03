import { Col, GridRow } from "../../../common/dsfr/fondamentaux";
import SearchBar from "../../../common/dsfr/elements/SearchBar";
import styled from "styled-components";
import useForm from "../../../common/form/useForm";

const SearchGridRow = styled(GridRow)`
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: inset 0 1px 0 0 var(--border-default-grey), 0 1px 0 0 var(--border-default-grey);
`;

export default function SearchForm({ onSubmit }) {
  let { registerForm, registerField } = useForm({ initialValues: { text: "" } });

  return (
    <SearchGridRow>
      <Col>
        <form {...registerForm(onSubmit)}>
          <SearchBar
            name="text"
            modifiers={"lg"}
            label={"Rechercher"}
            placeholder={"Rechercher une raison sociale, une UAI, un SIRET."}
            className={"fr-ml-1v"}
            {...registerField("text")}
          />
        </form>
      </Col>
    </SearchGridRow>
  );
}
