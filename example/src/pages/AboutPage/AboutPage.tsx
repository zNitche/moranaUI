import {
    useRouter,
    useMoranaPageEnter,
    useMoranaPageExit,
} from "moranaui";
import Header from "../../components/Header/Header";
import Content from "../../components/Content/Content";

export default function AboutPage() {
    const { navigateTo } = useRouter();

    useMoranaPageEnter({ callback: () => console.log("about page enter") });
    useMoranaPageExit({ callback: () => console.log("about page exit") });

    return (
        <>
            <Header>
                <div>About Page</div>
            </Header>
            <Content>
                <div>
                    <div onClick={() => navigateTo({ path: "/" })}>
                        nav to home
                    </div>
                </div>
            </Content>
        </>
    );
}
