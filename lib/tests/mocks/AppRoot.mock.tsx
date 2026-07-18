import { MoranaApp } from "@root/core";
import { Router, MoranaRoutesWrapper, Route } from "@root/routing";
import type React from "react";
import { Fragment } from "react/jsx-runtime";

interface AppRootMockProps {
    readonly targetRoute?: string;
    readonly Children?: React.ComponentType;
}

export default function AppRootMock({
    targetRoute,
    Children,
}: AppRootMockProps) {
    function insertChildren(route:string) {
        if (route === targetRoute) {{
            return Children ?? Fragment;
        }}

        return Fragment;
    }

    return (
        <MoranaApp>
            <Router>
                <MoranaRoutesWrapper>
                    <Route
                        url="/"
                        component={insertChildren("/")}
                    />
                    <Route
                        url="/home"
                        component={insertChildren("/home")}
                    />
                    <Route
                        url="/params/:id/path/:id2"
                        component={insertChildren("/params")}
                    />
                    <Route
                        url="*"
                        cacheable={false}
                        component={Fragment}
                    />
                    {!targetRoute && Children && <Children />}
                </MoranaRoutesWrapper>
            </Router>
        </MoranaApp>
    );
}
