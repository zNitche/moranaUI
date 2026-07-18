import { MoranaApp } from "@root/core";
import { Router, MoranaRoutesWrapper, Route } from "@root/routing";
import type { ReactNode } from "react";
import { Fragment } from "react/jsx-runtime";

export default function AppRoot(children?: ReactNode) {
    return (
        <MoranaApp>
            <Router>
                <MoranaRoutesWrapper>
                    <Route
                        url="/"
                        component={Fragment}
                    />
                    <Route
                        url="/home"
                        component={Fragment}
                    />
                    <Route
                        url="/params/:id/path/:id2"
                        component={Fragment}
                    />
                    <Route
                        url="*"
                        cacheable={false}
                        component={Fragment}
                    />
                    {children}
                </MoranaRoutesWrapper>
            </Router>
        </MoranaApp>
    );
}
