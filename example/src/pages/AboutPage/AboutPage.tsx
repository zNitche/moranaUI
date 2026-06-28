import { useRouter, MoranaPage } from "moranaui";
import Header from "../../components/Header/Header";
import Content from "../../components/Content/Content";
import { useEffect } from "react";

export default function AboutPage() {
    const { navigateTo } = useRouter();

    useEffect(() => {
        console.log("about mount");

        return () => {
            console.log("about unmount");
        };
    }, []);

    return (
        <MoranaPage>
            <Header>
                <div>About Page</div>
            </Header>
            <Content>
                <div>
                    <div onClick={() => navigateTo({path: "/"})}>
                        nav to home
                    </div>
                </div>
            </Content>
        </MoranaPage>
    );
}
