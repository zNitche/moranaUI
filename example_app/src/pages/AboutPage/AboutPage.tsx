import {
    useRouter,
    useMoranaPageEnter,
    useMoranaPageExit,
    MoranaPage,
    useIsPageActive,
    MoranaHeader,
    MoranaContent,
} from "moranaui";
import Header from "../../components/Header/Header";
import Content from "../../components/Content/Content";

export default function AboutPage() {
    const { navigateTo } = useRouter();

    const isPageActive = useIsPageActive();

    console.log(`is about active: ${isPageActive}`);

    useMoranaPageEnter({ callback: () => console.log("about page enter") });
    useMoranaPageExit({ callback: () => console.log("about page exit") });

    return (
        <MoranaPage>
            <MoranaHeader>
                <Header title="About" />
            </MoranaHeader>
            <MoranaContent>
                <Content>
                    <div>
                        <div onClick={() => navigateTo({ path: "/" })}>
                            nav to home
                        </div>
                    </div>
                </Content>
            </MoranaContent>
        </MoranaPage>
    );
}
