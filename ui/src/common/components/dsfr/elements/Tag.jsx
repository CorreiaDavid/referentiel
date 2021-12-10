import { buildComponent, buildListComponent } from "../common/utils";
import { Link } from "react-router-dom";

export const TagGroup = buildListComponent("ul", "fr-tags-group");
export const Tag = buildComponent("span", "fr-tag");
export const TagLink = buildComponent(Link, "fr-tag");