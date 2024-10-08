import React from "react";
import { useSelector } from "react-redux";
import Mapping from "../component/map/BusMapping.tsx"
import classes from "./BusPage.module.css"
import Header from "../component/header/Header.tsx"
import BusForm from "../component/bus-component/busform/BusForm.tsx"
import BusList from "../component/bus-component/buslist/BusList.tsx"
import { RootState } from "../store/index";

const BusPage = () => {
    const busmode = useSelector((state:RootState) => state.map.busmode)
    return (
        <div className={classes.buspage}>
            <Header />
            <BusForm />
            <Mapping />
            {busmode&&<BusList/>}
        </div>
    )
}

export default BusPage