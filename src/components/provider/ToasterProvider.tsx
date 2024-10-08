import React from "react";
import {Toaster} from "react-hot-toast";


export const ToasterProvider = ({children}: { children: React.ReactNode }) => {

    return <>
        {children}
        <Toaster/>
    </>
}