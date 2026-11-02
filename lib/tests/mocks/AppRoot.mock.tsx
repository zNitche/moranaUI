import { MoranaApp } from "#root/core";
import { Router, MoranaRoutesWrapper, Route } from "#root/routing";
import React, { useMemo } from "react";
import InitPageMock from "./mockPages/InitPage.mock";
import HomePageMock from "./mockPages/HomePage.mock";
import ParamsPageMock from "./mockPages/ParamsPage.mock";
import NotFoundPageMock from "./mockPages/NotFoundPage.mock";

interface AppRootMockProps {
    readonly routesOverrides?: Record<string, React.ComponentType>;
    readonly plugins?: React.ComponentType[];
}

export default function AppRootMock({
    routesOverrides,
    plugins,
}: AppRootMockProps) {
    const routes = useMemo(() => {
        return {
            "/": InitPageMock,
            "/home": HomePageMock,
            "/params": ParamsPageMock,
        };
    }, []);

    const insertChildren = (url: string) => {
        if (routesOverrides !== undefined) {
            const routeOverride = routesOverrides[url];

            if (routeOverride) {
                return routeOverride;
            }
        }

        return routes[url as keyof typeof routes];
    };

    return (
        <MoranaApp>
            <Router>
                <MoranaRoutesWrapper>
                    <Route
                        url="/"
                        component={insertChildren("/")}
                        name="init"
                    />
                    <Route
                        url="/home"
                        component={insertChildren("/home")}
                        name="home"
                    />
                    <Route
                        url="/params/:id/path/:id2"
                        component={insertChildren("/params")}
                        name="params"
                    />
                    <Route
                        url="*"
                        cacheable={false}
                        component={NotFoundPageMock}
                    />
                </MoranaRoutesWrapper>
                {plugins?.map((i, key) => {
                    const Component = i;

                    return <Component key={key} />;
                })}
            </Router>
        </MoranaApp>
    );
}
