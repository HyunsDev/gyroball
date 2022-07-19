import React from "react";
import DataProvider from "./dataContext";
import ToastProvider from "./toastContext";
import WorkerProvider from "./workerContext";

export function ContextWrapper({children}: {children: React.ReactNode}) {

    return (
        <ToastProvider>
            <WorkerProvider>
                <DataProvider>
                    {children}
                </DataProvider>
            </WorkerProvider>
        </ToastProvider>
    )
}