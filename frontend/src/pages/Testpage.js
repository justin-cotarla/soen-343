import React from "react";

import Catalog from "../components/Catalog";
import CatalogItemPreview from "../components/CatalogItemPreview";

export default class Testpage extends React.Component {
    render() {
        const stations = [
            {title:'station one',date:'12'},
            {title:'station two',date:'24'}
          ]
        return(
            <Catalog catalog={stations}/> 
        );
    }
};
