import { Link } from "../../common/dsfr/elements/Link";
import { Box } from "../../common/Flexbox";
import styled from "styled-components";
import ClickableItem from "../../common/ClickableItem";
import { without } from "../../common/utils";
import Spinner from "../../common/Spinner";
import useValidationSearch from "../../common/hooks/useValidationSearch";

const StyledBox = styled(without(Box, ["type"]))`
  padding: 1.5rem;
  min-height: 240px;

  background-color: ${(props) => `var(--color-validation-background-${props.type})`};
  &:hover {
    background-color: ${(props) => `var(--color-validation-background-hover-${props.type})`};
  }
`;

const Counter = styled(({ data, loading, error, className }) => {
  if (loading || error) {
    return <Spinner loading={loading} error={error} />;
  }

  return <div className={className}>{data.pagination.total || 0}</div>;
})`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export default function TableauDeBordCard({ type, label, ...rest }) {
  let [{ data, loading, error }] = useValidationSearch(type, {
    page: 1,
    items_par_page: 1,
    champs: "siret",
  });

  return (
    <ClickableItem to={`/validation/${type}`}>
      <StyledBox direction={"column"} justify={"between"} type={type} {...rest}>
        <div>
          <Counter data={data} loading={loading} error={error} />
          <div className={"fr-text--bold"}>{label}</div>
        </div>
        <Link as="span" modifiers={"icon-right"} icons="arrow-right-line">
          Voir la liste
        </Link>
      </StyledBox>
    </ClickableItem>
  );
}