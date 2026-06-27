import { useRouter, MoranaPage, buildUrl } from "moranaui";
import classes from "./HomePage.module.css";
import Header from "../../components/Header/Header";
import Content from "../../components/Content/Content";

export default function HomePage() {
    const { navigateTo } = useRouter();

    return (
        <MoranaPage>
            <Header>
                <div>Home Page</div>
            </Header>
            <Content>
                <div className={classes.homePage}>
                    <div onClick={() => navigateTo("/about", false)}>
                        nav to about
                    </div>
                    <div
                        onClick={() =>
                            navigateTo(
                                buildUrl(
                                    "/test/idhere/param/where/qhere/pass",
                                    {
                                        q1: "param",
                                        q2: ["test", "1"],
                                    },
                                ),
                                true,
                            )
                        }
                    >
                        nav to params
                    </div>
                </div>
            </Content>
        </MoranaPage>
    );
}
