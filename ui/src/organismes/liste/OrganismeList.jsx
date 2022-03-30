import React, { useContext } from "react";
import OrganismeItem from "./OrganismeItem";
import ApiPagination from "../../common/ApiPagination";
import { Box } from "../../common/Flexbox";
import Spinner from "../../common/Spinner";
import { Link } from "../../common/dsfr/elements/Link";
import { SearchContext } from "../../common/SearchProvider";
import { buildUrl } from "../../common/utils";

export default function OrganismeList({ response }) {
  let { data, loading, error } = response;
  let { search } = useContext(SearchContext);
  let exportUrl = buildUrl(`/api/v1/organismes.csv`, { ...search.params, page: 0, items_par_page: 100000 });
  let pagination = data.pagination;

  return (
    <>
      <Spinner error={error} loading={loading} />
      <Box align={"baseline"} justify={"between"}>
        <div className={"fr-mb-3v fr-mr-1w"}>{pagination.total} organismes</div>
        <Link as={"a"} modifiers={"icon-left md"} icons="file-download-line" href={exportUrl} target={"_blank"}>
          Export
        </Link>
      </Box>
      {data.organismes.map((organisme, index) => {
        return <OrganismeItem key={index} organisme={organisme} />;
      })}
      <Box justify={"center"}>
        <ApiPagination pagination={pagination} />
      </Box>
    </>
  );
}
