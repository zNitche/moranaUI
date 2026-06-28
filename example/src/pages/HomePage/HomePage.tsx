import { useRouter, MoranaPage, buildUrl } from "moranaui";
import classes from "./HomePage.module.css";
import Header from "../../components/Header/Header";
import Content from "../../components/Content/Content";
import { useEffect } from "react";

export default function HomePage() {
    const { navigateTo, clearRouterCache } = useRouter();

    useEffect(() => {
        console.log("home mount");

        return () => {
            console.log("home unmount");
        };
    }, []);

    return (
        <MoranaPage>
            <Header>
                <div>Home Page</div>
            </Header>
            <Content>
                <div className={classes.homePage}>
                    <div onClick={() => navigateTo({ path: "/about" })}>
                        nav to about
                    </div>
                    <div
                        onClick={() =>
                            navigateTo({
                                path: buildUrl(
                                    "/test/idhere/param/where/qhere/pass",
                                    {
                                        q1: "param",
                                        q2: ["test", "1"],
                                    },
                                ),
                            })
                        }
                    >
                        nav to params
                    </div>
                    <div onClick={clearRouterCache}>Clear router cache</div>
                </div>
            </Content>
        </MoranaPage>
    );
}
